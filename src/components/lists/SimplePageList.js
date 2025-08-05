import React from 'react';
import { makeStyles, useTheme } from '@material-ui/styles';
import List from '@material-ui/core/List';
import { View } from 'components/layout/View';

import Output from 'components/outputs/Output';
import ResponsiveFlexBox from 'components/layout/ResponsiveFlexBox';
import EmptyListPlaceholderImage from 'components/outputs/PlaceholderImage/empty/EmptyListPlaceholderImage';
import SimplePageListActions from './SimplePageListActions';
import PageButtons from 'components/layout/page/PageButtons';
import Skeleton from '@material-ui/lab/Skeleton';
import Hover from 'components/layout/Hover';
import { useMediaQuery } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  list: {
    width: '100%',
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(3),
  },
}));

export default function SimplePageList(props) {
  const {
    data = {},
    actions,
    containerIndex,
    handleStateChange,
    indexLoading,
    emptyListMessage = '',
    stateId = '',
    multiline,
    identifier = () => '', // value method from /settings/config/pages
    label = () => '',
    pageId,
    canAdd,
    type,
    config,
    context,
    pageConfig,
  } = props;
  const { renderItem: Item } = config;

  const classes = useStyles();

  let { items, loading } = data;
  let emptyList = (items && items.length === 0) || !items;
  if (!emptyList && pageId.match(/bitcoin|stellar|ethereum/)) {
    items = items.filter(item => item.crypto_type === pageId);
    emptyList = (items && items.length === 0) || !items;
  }
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down(562));
  const isRtl = document.dir === 'rtl';

  return (
    <React.Fragment>
      <List className={classes.list}>
        {emptyList ? (
          loading ? (
            <View pv={0.65} fD="row" jC="space-between" w="100%">
              <Skeleton width={200} height={20} />
              <View fD="row">
                <View pr={1}>
                  <Skeleton width={20} height={20} variant="circle" />
                </View>
                <Skeleton width={20} height={20} variant="circle" />
              </View>
            </View>
          ) : (
            <EmptyListPlaceholderImage
              text={emptyListMessage}
              name={type ? type : pageId}
            />
          )
        ) : !!items?.length ? (
          items.map((item, index) => (
            <Hover
              render={hover =>
                typeof Item === 'function' ? (
                  <Item {...props} hover={hover} item={item} />
                ) : (
                  <View
                    pv={0.5}
                    w={'100%'}
                    key={item && item.id ? item.id : index}>
                    <ResponsiveFlexBox
                      left={
                        <Output
                          label={label(item, index, context)}
                          labelBold
                          placeholderId="no_details_provided"
                          values={multiline && identifier(item, true)}
                          value={
                            !multiline && identifier(item, true, index, context)
                          }
                        />
                      }
                      right={
                        <View
                          jC={'flex-end'}
                          fD={'row'}
                          pl={isRtl ? 0 : 0.5}
                          pr={isRtl ? 0.5 : 0}
                          pt={0.25}
                          style={{ maxHeight: 22 }}>
                          <SimplePageListActions
                            hover={hover || matches}
                            // hover={true}
                            state={stateId}
                            item={item}
                            loading={indexLoading}
                            containerIndex={containerIndex}
                            actions={
                              typeof actions === 'function'
                                ? actions(item, index)
                                : actions ?? []
                            }
                          />
                        </View>
                      }
                    />
                  </View>
                )
              }
            />
          ))
        ) : null}
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
