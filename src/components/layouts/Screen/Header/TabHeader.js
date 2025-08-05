import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Text from 'components/outputs/Text';
import { objectToArray } from 'util/general';
import Tabs from './TabsNew';
import { Box } from '@material-ui/core';
import ChevronBackIcon from '@material-ui/icons/ChevronLeft';
import ChevronForwardIcon from '@material-ui/icons/ChevronRight';
import HeaderAction from './HeaderAction';
import HeaderSkeleton from './HeaderSkeleton';
import FilterBar from 'components/filter/FilterBar';
import FilterListIcon from '@material-ui/icons/FilterList';
import { isEmpty } from 'lodash';
import BusinessHeader from './BusinessHeader';
import { View } from 'components/layout/View';
import { Button } from 'components/inputs/Button';
import { useRehiveContext } from 'contexts';

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
    paddingTop: theme.spacing(0.5),
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
  description: {
    paddingBottom: theme.spacing(1.5),
    paddingTop: theme.spacing(0.5),
  },
  spacing: {
    paddingBottom: theme.spacing(1.5),
  },
  row2: {
    display: 'flex',
    // paddingBottom: theme.spacing(0.5),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
}));

export default function TabHeader(props) {
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
    description,
  } = component;
  const { user } = useRehiveContext();
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
  const { variant, pages, defaultPage, isBusiness } = screenConfig;

  const tabs = objectToArray(pages, 'id', true);

  function handleBack() {
    history.push('/' + screenId + '/' + (pageId ? pageId + '/' : ''));
  }

  function handleUpdateBusinessClick() {
    history.push({
      pathname: '/business',
      state: { activeBusiness: 'business_banking' },
    });
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

  const Actions = actions.map(item => {
    const primaryHandleAction = () => handleAction(item?.id ?? item);
    const alternateHandleAction = handleUpdateBusinessClick;
    const selectedHandleAction =
      item?.id === 'business' ? alternateHandleAction : primaryHandleAction;
    return (
      <HeaderAction
        {...props}
        key={item?.id ?? item}
        history={history}
        actionItem={item}
        handleAction={selectedHandleAction}
      />
    );
  });

  const showTabs = Boolean(tabs?.length > 1) && variant !== 'simple';
  const isRtl = document.dir === 'rtl';

  return (
    <div className={classes.container}>
      {(isBusiness || Boolean(user?.groups[0]?.name === 'business')) && (
        <BusinessHeader {...props} />
      )}
      <div className={classes.row2}>
        {itemId &&
          (isRtl ? (
            <ChevronForwardIcon
              color="action"
              onClick={handleBack}
              style={{
                fontSize: 26,
                cursor: 'pointer',
                margin: '-1px 2px 0px -6px',
                marginLeft: 8,
              }}
            />
          ) : (
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
          ))}
        {!showTabs && <Box pr={1}>{filterAction}</Box>}
        <View fD={'row'} jC={'space-between'} aI={'center'} w={'100%'}>
          <View>
            <Text
              s={20}
              c="fontDark"
              fontWeight={500}
              id={titleOverride || title}
              style={{ marginLeft: showTabs ? 0 : 4 }}
              context={titleOverride ? titleContextOverride : titleContext}
            />
          </View>
          <View>
            {/* <Button
              id="update_my_payout_bank_account"
              color={'primary'}
              style={{
                height: 30,
              }}
              onClick={handleClick}
            /> */}
          </View>
        </View>

        {!showTabs && Actions}
      </div>
      {description ? (
        <div className={classes.description}>
          <Text id={description} />
        </div>
      ) : (
        <div className={classes.spacing} />
      )}
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
    </div>
  );
}
