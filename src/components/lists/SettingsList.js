import React from 'react';
import { makeStyles } from '@material-ui/styles';
import List from '@material-ui/core/List';
import CircularProgress from '@material-ui/core/CircularProgress';
import { View } from 'components/layout/View';

import Text from 'components/outputs/Text';
import TextField from '@material-ui/core/TextField';
import Output from 'components/outputs/Output';
import ResponsiveFlexBox from 'components/layout/ResponsiveFlexBox';
import EmptyListPlaceholderImage from 'components/outputs/PlaceholderImage/empty/EmptyListPlaceholderImage';
import SettingsActions from '../../screens/profile/components/ProfileActions';
import PageButtons from 'components/layout/page/PageButtons';
import Skeleton from '@material-ui/lab/Skeleton';

const useStyles = makeStyles(theme => ({
  list: {
    width: '100%',
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(3),
    // paddingTop: 0,
    // paddingBottom: 0,
  },
}));

export default function SettingsList(props) {
  const {
    data = {},
    actions,
    containerIndex,
    handleStateChange,
    type,
    onChangeOTP,
    code,
    indexLoading,
    emptyListMessage = '',
    stateId = '',
    multiline,
    identifier = () => '',
    label = () => '',
    isSubmitting,
    itemId,
    pageId,
    canAdd,
  } = props;
  console.log('SettingsList -> props', props);

  function confirmAction() {
    const { deleteData } = props?.pageConfig?.services ?? {};
    if (typeof deleteData === 'function') deleteData(props);
  }
  const classes = useStyles();

  let { items, loading } = data;
  const emptyList = (items && items.length === 0) || !items;
  if (!emptyList && pageId.match(/bitcoin|stellar|ethereum/)) {
    items = items.filter(item => item.crypto_type === pageId);
  }

  return (
    <React.Fragment>
      <List className={classes.list}>
        {emptyList ? (
          loading ? (
            <View pv={1} fD="row" jC="space-between" w="100%">
              <Skeleton width={200} height={20} />
              <View fD="row">
                <View pr={1}>
                  <Skeleton width={20} height={20} variant="circle" />
                </View>
                <Skeleton width={20} height={20} variant="circle" />
              </View>
            </View>
          ) : (
            <EmptyListPlaceholderImage name={type} text={emptyListMessage} />
          )
        ) : (
          items.map((item, index) => (
            <View pv={0.5} w={'100%'} key={item && item.id ? item.id : index}>
              <ResponsiveFlexBox
                left={
                  <Output
                    label={label(item)}
                    labelBold
                    placeholderId="no_details_provided"
                    values={multiline && identifier(item, true)}
                    value={!multiline && identifier(item, true)}
                  />
                }
                right={
                  <View jC={'flex-end'} aI={'center'} fD={'row'} pl={0.5}>
                    {item?.id.toString() === itemId &&
                    stateId.match(/verify|delete/) ? (
                      stateId === 'verify' ? (
                        <React.Fragment>
                          <Text align={'right'}>Please enter OTP</Text>
                          <div>
                            <TextField
                              value={code}
                              onChange={onChangeOTP}
                              style={{ paddingLeft: 16, paddingRight: 8 }}
                            />
                            {indexLoading && (
                              <CircularProgress
                                size={24}
                                style={{
                                  // color: green[500],
                                  position: 'absolute',
                                  // top: '50%',
                                  // left: '50%',
                                  top: 12,
                                  right: 100,
                                }}
                              />
                            )}
                          </div>

                          <SettingsActions
                            loading={indexLoading}
                            actions={[
                              {
                                id: 'cancel',
                                action: () => handleStateChange(type, '', 0),
                              },
                            ]}
                          />
                        </React.Fragment>
                      ) : (
                        <SettingsActions
                          state={stateId}
                          loading={isSubmitting}
                          actions={[
                            {
                              id: 'confirm',
                              action: confirmAction,
                              type: stateId,
                            },
                            {
                              id: 'cancel',
                              action: () => handleStateChange(type, '', 0),
                            },
                          ]}
                        />
                      )
                    ) : (
                      <SettingsActions
                        state={stateId}
                        item={item}
                        loading={indexLoading}
                        containerIndex={containerIndex}
                        // listIndex={index}
                        actions={
                          typeof actions === 'function'
                            ? actions(item, index)
                            : actions ?? []
                        }
                      />
                    )}
                  </View>
                }
              />
            </View>
          ))
        )}
      </List>

      {canAdd && (
        <PageButtons
          layout="material"
          items={[
            {
              thin: true,
              color: 'primary',
              id: 'add_new',
              capitalize: true,
              onClick: () => handleStateChange(null, 'new'),
            },
          ]}
        />
      )}
    </React.Fragment>
  );
}
