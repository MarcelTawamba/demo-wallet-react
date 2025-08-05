import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Hidden from '@material-ui/core/Hidden';
import { Box } from '@material-ui/core';
import Text from 'components/outputs/Text';
import IconLabelButton from 'components/inputs/IconLabelButton';
import FilterBar from 'components/filter/FilterBar';
import HeaderAction from './HeaderAction';
import { objectToArray } from 'util/general';
import Tabs from './Tabs';

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(2),

    [theme.breakpoints.down('xs')]: {
      paddingTop: 0,
    },
    display: 'flex',
    flexDirection: 'column',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  title: {
    // paddingBottom: theme.spacing(0),
    padding: theme.spacing(1),

    [theme.breakpoints.down('xs')]: {
      paddingLeft: 0,
    },
  },
}));

export default function ManagementHeader(props) {
  let {
    screenId,
    actions = [],
    filters,
    history,
    filterConfig,
    onSuccess,
    screenConfig,
    pageConfig,
    pageId = '',
    itemId,
    stateId,
    isLoading,
  } = props;

  const { services = {} } = pageConfig;
  if (Boolean(services.createData) && !Boolean(stateId)) {
    actions.push('add');
  }
  if (Boolean(services.updateData) && stateId === 'view') {
    actions.push('edit');
  }

  const { variant, pages, defaultPage, title = screenId } = screenConfig;
  const classes = useStyles(props);

  const tabs = objectToArray(pages, 'id');

  function handleBack() {
    history.push('/' + screenId + '/' + (pageId ? pageId + '/' : ''));
  }

  function handleTab(item) {
    history.push('/' + screenId + '/');
  }

  const flipTitle = false; //!Boolean(filterConfig) && !(pageId || itemId);

  return (
    <div className={classes.container}>
      {/* {!stateId && variant !== 'tabs' && (
        <div className={classes.row}>
          {!flipTitle ? (
            <Hidden xsDown>
              <Text
                variant="h4"
                className={classes.title}
                id={
                  variant === 'tabs'
                    ? screenId
                    : !(pageId || itemId)
                    ? title
                    : ''
                }
              />
            </Hidden>
          ) : (
            <div />
          )}
        </div>
      )} */}
      {/* <IconLabelButton label={'Back'} onPress={handleBack} /> */}
      <div className={classes.row}>
        <Box flex={1} width="100%">
          <React.Fragment>
            {stateId && itemId ? null : Boolean(filterConfig) ? (
              <FilterBar {...filters} fetchData={onSuccess} />
            ) : (
              <Text
                variant="h4"
                className={classes.title}
                id={!((pageId && variant !== 'simple') || itemId) ? title : ''}
              />
            )}
          </React.Fragment>

          {variant === 'tabs' && ( //!(stateId || itemId) &&
            <div className={classes.tabs}>
              <Tabs
                {...props}
                tabId={pageId}
                onChange={handleTab}
                variant="link"
                tabs={tabs}
                defaultTab={defaultPage}
              />
            </div>
          )}
        </Box>
        {!isLoading && (
          <Box pt={0.5} pr={1} flexDirection="row" display="flex">
            {Array.isArray(actions) &&
              actions.map(item => (
                <HeaderAction
                  {...props}
                  key={item?.id ?? item}
                  actionItem={item}
                />
              ))}
          </Box>
        )}
      </div>
    </div>
  );
}
