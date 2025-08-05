import React from 'react';
import _ from 'lodash';
import { SectionList } from 'react-native-web';
import SectionListHeader from 'components/lists/SectionListHeader';
import LimitsList from 'screens/accounts/components/LimitsList';
import { makeStyles } from '@material-ui/styles';
import EmptyListMessage from 'components/lists/EmptyListMessage';

const TierLimitsList = ({ items, currencies }) => {
  const classes = useStyles();
  let grouped = _(items)
    .groupBy(item => item.currency)
    .map((limits, code) => {
      const currency = currencies.items.find(
        currency => currency?.currency?.code === code,
      );
      if (currency) {
        const subtypes = _.uniq(limits.map(limit => limit.subtype));
        return {
          title: _.get(currency, ['currency', 'description']),
          data: [
            {
              tier: { limits },
              currency,
              subtypes,
            },
          ],
        };
      }
      return null;
    })
    .value()
    .filter(item => item);

  return (
    <SectionList
      renderItem={({ item }) => (
        <div className={classes.limits}>
          {item.subtypes.map(subtype => (
            <LimitsList
              key={subtype}
              subtype={subtype}
              {...item}
              limits={items}
            />
          ))}
        </div>
      )}
      renderSectionHeader={({ section: { title } }) => (
        <SectionListHeader>{title}</SectionListHeader>
      )}
      sections={grouped}
      keyExtractor={item => item.id}
      ListEmptyComponent={<EmptyListMessage id="no_applicable_limits" />}
    />
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  },
  limits: {
    width: '100%',
    paddingBottom: 2,
  },
}));

export default TierLimitsList;
