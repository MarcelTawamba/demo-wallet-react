import React from 'react';
import { makeStyles } from '@material-ui/styles';
import List from '@material-ui/core/List';

import { View } from 'components/layout/View';
import ResponsiveFlexBox from 'components/layout/ResponsiveFlexBox';
import Output from 'components/outputs/Output';
import SettingsActions from 'screens/profile/components/ProfileActions';
import { Button } from 'components/inputs/Button';
import EmptyListPlaceholderImage from 'components/outputs/PlaceholderImage/empty/EmptyListPlaceholderImage';
import { standardizeString } from 'util/general';

const useStyles = makeStyles(theme => ({
  list: {
    width: '100%',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: 0,
    paddingBottom: 0,
  },
}));

const AddressesList = props => {
  const {
    data,
    actions,
    containerIndex,
    identifier,
    handleStateChange,
    type,
    confirmAction,
    indexLoading,
    emptyListMessage = '',
    state,
    multiline,
  } = props;

  const emptyList = data.items && data.items.length === 0;
  const classes = useStyles();

  return (
    <React.Fragment>
      <List className={classes.list}>
        {emptyList ? (
          <EmptyListPlaceholderImage
            name="address"
            text={standardizeString(emptyListMessage.toLowerCase(), true)}
          />
        ) : (
          data.items.map((item, index) => (
            <View pv={0.5} w={'100%'} key={item && item.id ? item.id : index}>
              <ResponsiveFlexBox
                left={
                  <Output
                    // valueBold
                    values={multiline && identifier(item, true)}
                    value={!multiline && identifier(item, true)}
                  />
                }
                right={
                  <View
                    // h={24}
                    // w={'100%'}
                    jC={'flex-end'}
                    aI={'center'}
                    fD={'row'}
                    pl={0.5}>
                    {index === containerIndex &&
                    state.match(/verify|delete/) ? (
                      <SettingsActions
                        state={state}
                        loading={indexLoading}
                        actions={[
                          {
                            id: 'confirm',
                            action: confirmAction,
                            type: state,
                          },
                          {
                            id: 'cancel',
                            action: () => handleStateChange(type, '', 0),
                          },
                        ]}
                      />
                    ) : (
                      <SettingsActions
                        state={state}
                        loading={indexLoading}
                        containerIndex={containerIndex}
                        listIndex={index}
                        actions={actions(item, index)}
                      />
                    )}
                  </View>
                }
              />
            </View>
          ))
        )}
      </List>

      <View w={'100%'} pt={0.5} p={1} aI={'flex-end'}>
        <Button
          size="small"
          color="primary"
          onClick={() => handleStateChange(type, 'edit', null)}
          id="add_new"
          capitalize
        />
      </View>
    </React.Fragment>
  );
};

export default AddressesList;
