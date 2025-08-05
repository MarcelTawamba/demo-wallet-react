import React from 'react';
import makeStyles from '@material-ui/styles/makeStyles';

import CardBase from '@material-ui/core/Card';
import CardTitle from 'components/card/CardTitle';
import Text from 'components/outputs/Text';
import { standardizeString } from 'util/general';
import DropdownSelector from 'components/inputs/DropdownSelector';

const availableIcons = ['merchant', 'business', 'supplier', 'customer'];

const GroupSelector = props => {
  const { items, onSuccess, item, setItem } = props;
  const classes = useStyles();

  const dropdown = items.length > 4;

  if (!item) {
    return null;
  }

  if (dropdown) {
    return (
      <React.Fragment>
        <DropdownSelector
          data={items}
          item={item}
          onValueChange={setItem}
          renderItem={item => <GroupSelectorItem item={item} />}
          keyExtractor={item => item.name}
        />
        <div className={classes.descriptionDropdown}>
          <Text align="center" id={item.description} />
        </div>
      </React.Fragment>
    );
  }

  return (
    <div className={classes.container}>
      {items.map((item, index) => (
        <GroupCard
          key={item.name}
          last={index === items.length - 1}
          item={item}
          onClick={() => {
            setItem(item);
            onSuccess();
          }}
        />
      ))}
    </div>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    paddingBottom: theme.spacing(1),
  },
  card: {
    padding: theme.spacing(1),
    paddingTop: theme.spacing(2),
    marginBottom: ({ last }) => (last ? 0 : theme.spacing(4)),
    cursor: 'pointer',
    border: '1px solid #EFEFEF',
  },
  description: {
    padding: theme.spacing(1),
    fontSize: 14,
  },
  descriptionDropdown: {
    padding: theme.spacing(2),
    paddingBottom: theme.spacing(4),
  },
}));

const GroupCard = props => {
  const { item, last, ...restProps } = props;
  const { name, label, description, icon } = item;
  const classes = useStyles(props);
  const title = {
    title: label ? label : standardizeString(name),
    icon: icon ? icon : availableIcons.includes(name) ? name : 'user',
    subtitle: '',
    onPress: () => {},
    titleScale: 'h6',
    textStyleTitle: { fontWeight: '500' },
    iconSize: 16,
  };

  return (
    <CardBase className={classes.card} elevation={0} {...restProps}>
      <CardTitle {...title} />
      {description ? (
        <Text className={classes.description} id={description} />
      ) : (
        <div />
      )}
    </CardBase>
  );
};

const GroupSelectorItem = props => {
  const { item, ...restProps } = props;
  const { name, label } = item;
  const title = {
    title: label ? label : standardizeString(name),
    icon: availableIcons.includes(name) ? name : 'user',
    subtitle: '',
    onPress: () => {},
    titleScale: 'h6',
    textStyleTitle: { fontWeight: '500' },
    iconSize: 16,
  };

  return (
    <div
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: 16,
        paddingLeft: 8,
        width: '100%',
      }}
      {...restProps}>
      <CardTitle {...title} />
    </div>
  );
};

export default GroupSelector;
