import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Text from 'components/outputs/Text';
import { objectToArray } from 'util/general';
import Tabs from './TabsNew';
import { Box } from '@material-ui/core';
import ChevronBackIcon from '@material-ui/icons/ChevronLeft';
import HeaderAction from './HeaderAction';
import HeaderSkeleton from './HeaderSkeleton';
import FilterBar from 'components/filter/FilterBar';
import FilterListIcon from '@material-ui/icons/FilterList';
import { isEmpty } from 'lodash';

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
  },
  tabs: {
    paddingLeft: -theme.spacing(1),
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingBottom: theme.spacing(1),
  },
  row3: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    width: '100%',
    paddingBottom: theme.spacing(2),
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  row2: {
    display: 'flex',
    paddingBottom: theme.spacing(1),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
}));

export default function TabHeaderNew(props) {
  const {
    onChange,
    screenId,
    pageId,
    pageConfig,
    screenConfig,
    history,
    itemId,
    formConfig,
    isLoading,
    refreshData,
    item,
    data,
    actions = [],
    stateId,
    component,
    inputPropsControl,
  } = props;
  const {
    filterConfig,
    hideScreenHeader,
    title: titleOverride,
    titleContext: titleContextOverride = {},
  } = component;

  const classes = useStyles(props);
  const [filtersOpen, setFiltersOpen] = useState(
    Boolean(history?.location?.search),
  );

  if (
    ((stateId === 'new' || stateId === 'edit') &&
      formConfig?.variant === 'tabs') ||
    hideScreenHeader
  ) {
    if (isLoading && !hideScreenHeader && stateId !== 'new') {
      return <HeaderSkeleton />;
    }
    return null;
  } else if (isLoading && (!item || data.length === 0) && stateId) {
    return <HeaderSkeleton />;
  }
  const { title, titleContext = {} } = pageConfig;
  const { variant, pages, defaultPage } = screenConfig;

  const tabs = objectToArray(pages, 'id');

  function handleBack() {
    history.push('/' + screenId + '/' + (pageId ? pageId + '/' : ''));
  }

  function handleAction(action) {
    let newPath =
      '/' +
      screenId +
      '/' +
      (pageId ? pageId + '/' : '') +
      (action !== 'new' && itemId ? itemId + '/' : '') +
      action +
      '/';
    history.push(newPath);
  }

  // const showFilterAndActions = !isEmpty(filterConfig) && actions?.length > 0;

  const filterAction = filterConfig ? (
    <FilterListIcon
      onClick={() => setFiltersOpen(!filtersOpen)}
      color={filtersOpen ? 'primary' : '#777'}
      style={{
        fontSize: 28,
        color: filtersOpen ? '' : '#777',
        cursor: 'pointer',
        border: '1px solid',
        borderRadius: '50%',
        padding: 4,
        // marginRight: 8,
      }}
    />
  ) : null;

  const Actions = actions.map(item => (
    <HeaderAction
      {...props}
      key={item?.id ?? item}
      history={history}
      actionItem={item}
      handleAction={() => handleAction(item?.id ?? item)}
    />
  ));

  const showTabs = Boolean(tabs?.length > 1) && variant !== 'simple';

  return (
    <div className={classes.container}>
      {/* <div className={classes.row}> */}
      <div className={classes.row2}>
        {itemId && (
          <ChevronBackIcon
            color="action"
            onClick={handleBack}
            style={{
              fontSize: 26,
              cursor: 'pointer',
              margin: '-1px 2px 0px -6px',
              marginRight: 8,
            }}
          />
        )}
        {!showTabs && <Box pr={1}>{filterAction}</Box>}
        <Text
          s={20}
          c="fontDark"
          fontWeight={500}
          id={titleOverride ?? title}
          context={titleOverride ? titleContextOverride : titleContext}
          style={{ marginLeft: showTabs ? 0 : 4 }}
        />
        {!showTabs && Actions}
      </div>
      {showTabs && (
        <div className={classes.row}>
          <Box pt={0.5} pr={1} display="flex" flexDirection="row" w="100%">
            <div className={classes.tabs}>
              <Tabs
                history={history}
                tabId={pageId}
                screenId={screenId}
                onChange={onChange}
                tabs={tabs}
                defaultTab={defaultPage}
              />
            </div>
          </Box>
          <Box pr={1} pb={1} display="flex" flexDirection="row">
            {filterAction}
            {Actions}
          </Box>
        </div>
      )}

      {filterConfig && filtersOpen && (
        <div className={classes.row3}>
          <FilterBar filterConfig={filterConfig} fetchData={refreshData} />
        </div>
      )}
      {/* </div> */}
    </div>
  );
}
