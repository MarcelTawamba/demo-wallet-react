import React from 'react';
import './Layout.css';
import { makeStyles } from '@material-ui/core/styles';
import Hidden from '@material-ui/core/Hidden';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import MyHidden from 'components/layout/Hidden';
import Tabs from 'components/layouts/Screen/Header/Tabs';
import { useHistory } from 'react-router-dom';
import FilterBar from 'components/filter/FilterBar';
import BreadCrumbs from 'components/layout/BreadCrumbs';
import IconButton from 'components/inputs/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import FilterListIcon from '@material-ui/icons/FilterList';
import { InputBase, Paper } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import BusinessHeader from 'components/layouts/Screen/Header/BusinessHeader';

const breakpoint = 720;

const ScreenHeader = props => {
  const {
    title,
    fetchData,
    id,
    extra,
    state,
    tabs,
    hideTabs,
    onChange,
    actions,
    actions2,
    filterConfig,
    showFilterListIcon,
    FilterList = <div />,
    // classes,
    showSearchBox,
    open,
    setOpen,
    modalVisible,
    setModalVisible,
    context,
    onBack = () => setModalVisible(false),
    filterOverride,
    breadCrumbs,
    toggleMenu,
    setSearchQuery,
    handleSearchSubmit,
    isBusiness,
  } = props;
  const classes = useStyles(props);

  const history = useHistory();
  const { location = {} } = history;
  const { search } = location;

  const isFilterSearch =
    filterConfig && search
      ? Object.keys(filterConfig)?.reduce(
          (isFilterSearch, key) => isFilterSearch | search.includes(key),
          false,
        )
      : true;
  const filterActive =
    (Boolean(search) && isFilterSearch) || open === 'filters';

  // add filter bar and link to config

  return (
    <View
      grid
      gap={0}
      w={'100%'}
      style={{ borderBottom: '1.5px solid #e1e1e1', paddingBottom: 8 }}>
      {isBusiness && <BusinessHeader {...props} />}
      <View fD={'row'} jC={'space-between'} w={'100%'}>
        <Text id={title} s={20} fontWeight={500} c="#393939" />
      </View>
      {props?.descriptionMessage && (
        <View style={{ maxWidth: 805 }}>
          <Text
            id={props?.descriptionMessage}
            s={14}
            style={{
              borderRadius: 4,
              padding: '5px 0',
            }}
            c="#393939"
          />
        </View>
      )}
      <View fD={'row'} jC={'space-between'} w={'100%'} aI={'center'}>
        {!hideTabs && (
          <div className={classes.tabs}>
            <Tabs
              tabId={state}
              screenId={id}
              onChange={onChange}
              tabs={tabs}
              history={history}
            />
          </div>
        )}
        {extra && (
          <Hidden xsDown>
            <div className={classes.column2}>{extra}</div>
          </Hidden>
        )}
        <View>
          {showSearchBox && !hideTabs && (
            <Paper
              component="form"
              className={classes.searchRoot}
              onSubmit={handleSearchSubmit}>
              <InputBase
                className={classes.input}
                placeholder="Search..."
                inputProps={{ 'aria-label': 'search campaign' }}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <IconButton
                type="submit"
                className={classes.iconButton}
                aria-label="search">
                <SearchIcon />
              </IconButton>
            </Paper>
          )}
        </View>
      </View>
      <div className={classes.filterBar}>
        <View fD={'row'} jC={'space-between'} w={'100%'} aI={'center'}>
          {toggleMenu && (
            <div mr={hideTabs ? 1 : 0} className={classes.menu}>
              <IconButton onPress={toggleMenu} noPadding>
                <MenuIcon />
              </IconButton>
            </div>
          )}
          {breadCrumbs?.length > 1 ? (
            <View style={{ marginTop: 16, paddingBottom: 6 }}>
              <BreadCrumbs routes={breadCrumbs} />
            </View>
          ) : (
            <div></div>
          )}
          {filterActive && !showFilterListIcon && (
            <FilterBar
              filterOverride={filterOverride}
              filterConfig={filterConfig}
              fetchData={fetchData}
              context={context}
            />
          )}
          {showFilterListIcon && filterConfig && (
            <View fD={'row'} jC={'flex-end'}>
              {filterActive && (
                <FilterBar
                  filterOverride={filterOverride}
                  filterConfig={filterConfig}
                  fetchData={fetchData}
                  context={context}
                />
              )}
              <FilterListIcon
                onClick={() => setOpen(!open ? 'filters' : null)}
                color={filterActive ? 'primary' : '#777'}
                style={{
                  fontSize: 28,
                  color: filterActive ? '' : '#777',
                  cursor: 'pointer',
                  border: '1px solid',
                  borderRadius: '50%',
                  padding: 4,
                  marginLeft: 10,
                }}
              />
            </View>
          )}
        </View>
      </div>
      <div className={classes.actions}>
        {/* {state === '' && (
          <>
            <ActionList
              maxHeight={500}
              actions={actions}
              open={open}
              setOpen={setOpen}
            />
            {actions2 && (
              <Hidden lgUp implementation="css">
                <div className={classes.actions2}>
                  <ActionList
                    actions={actions2}
                    open={open}
                    setOpen={setOpen}
                  />
                </div>
              </Hidden>
            )}
            <Hidden smDown>{FilterList}</Hidden>
          </>
        )} */}
        {extra && (
          <MyHidden size="xs">
            <div className={classes.extraContainer}>
              <div className={classes.column2}>{extra}</div>
            </div>
          </MyHidden>
        )}
      </div>
    </View>
  );

  //   return (
  //     <div className={classes.root}>
  //       <div className={classes.container}>
  //         <div className={classes.column}>
  //           <Text style={{ fontSize: 25 }}>{title}</Text>
  //           <div className={classes.actionTabs}>
  //             {modalVisible ? (
  //               <div className={classes.back}>
  //                 <IconLabelButton label="Back" onPress={onBack} />
  //               </div>
  //             ) : (
  //               <div className={classes.tabs}>
  //                 <Tabs
  //                   tabId={state}
  //                   screenId={id}
  //                   onChange={onChange}
  //                   tabs={tabs}
  //                   history={history}
  //                 />
  //               </div>
  //             )}
  //             <div className={classes.actions}>
  //               {state === '' && (
  //                 <React.Fragment>
  //                   <ActionList
  //                     maxHeight={500}
  //                     actions={actions}
  //                     open={open}
  //                     setOpen={setOpen}
  //                   />
  //                   {actions2 && (
  //                     <Hidden lgUp implementation="css">
  //                       <div className={classes.actions2}>
  //                         <ActionList
  //                           actions={actions2}
  //                           open={open}
  //                           setOpen={setOpen}
  //                         />
  //                       </div>
  //                     </Hidden>
  //                   )}
  //                   <Hidden smDown>{FilterList}</Hidden>
  //                 </React.Fragment>
  //               )}
  //               {extra && (
  //                 <MyHidden size="xs">
  //                   <div className={classes.extraContainer}>
  //                     <div className={classes.column2}>
  //                       {extra}
  //                       {filterActive && (
  //                         <FilterBar
  //                           filterConfig={filterConfig}
  //                           fetchData={fetchData}
  //                           context={context}
  //                         />
  //                       )}
  //                     </div>
  //                   </div>
  //                 </MyHidden>
  //               )}
  //             </div>
  //           </div>
  //         </div>

  //         {extra && (
  //           <Hidden xsDown>
  //             <div className={classes.column2}>
  //               {extra}
  //               {filterActive && (
  //                 <FilterBar
  //                   filterConfig={filterConfig}
  //                   fetchData={fetchData}
  //                   context={context}
  //                 />
  //               )}
  //             </div>
  //           </Hidden>
  //         )}
  //       </div>
  //       {/* {filterActive && (
  //         <FilterBar
  //           filterConfig={filterConfig}
  //           fetchData={fetchData}
  //           context={context}
  //         />
  //       )} */}
  //     </div>
  //   );
};

const useStyles = makeStyles(theme => ({
  searchRoot: {
    display: 'flex',
    alignItems: 'center',
    width: 350,
    backgroundColor: '#F8F8F8',
    borderRadius: 40,
    boxShadow: 'none',
    height: 40,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
    color: '#C3C3C3',
    height: '100%',
    padding: '6px 8px',
  },
  iconButton: {
    padding: 8,
  },
  divider: {
    height: 28,
    margin: 4,
  },
  container: {
    width: '100%',
    // paddingTop: theme.spacing(1),
    // minHeight: 72,
    display: 'flex',
    alignItems: 'flex-end',
    [theme.breakpoints.down(breakpoint)]: {
      minHeight: 0,
    },
  },
  tabs: {
    display: 'flex',
    marginLeft: -theme.spacing(1),
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    [theme.breakpoints.down(breakpoint)]: {
      alignItems: 'flex-start',
      height: 'auto',
    },
  },
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  actionTabs: {
    display: 'flex',
    // height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    [theme.breakpoints.down(breakpoint)]: {
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
    // marginBottom: theme.spacing(1),
  },
  actions: {
    display: 'flex',
    // height: 40,
    width: '100%',
    // marginTop: theme.spacing(0.5),
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    [theme.breakpoints.down(breakpoint)]: {
      paddingLeft: theme.spacing(0.5),
    },
  },
  titleContainer: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingTop: theme.spacing(6),
  },
  extraContainer: {
    width: '100%',
    paddingRight: theme.spacing(1),
    [theme.breakpoints.down(breakpoint)]: {
      paddingRight: 0,
    },
  },
  actions2: {
    paddingLeft: theme.spacing(1),
    [theme.breakpoints.down(breakpoint)]: {
      paddingLeft: 0,
    },
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: '100%',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  column2: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    alignItems: 'flex-end',
  },
  back: {
    paddingBottom: 8,
    paddingTop: 8,
    [theme.breakpoints.down(breakpoint)]: {
      paddingBottom: 0,
      paddingTop: 0,
    },
  },
  menu: {
    [theme.breakpoints.up(980)]: {
      display: 'none',
    },
    marginRight: theme.spacing(1),
  },
  filterBar: {
    width: '100%',
    [theme.breakpoints.down(980)]: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  },
}));

export default ScreenHeader;
