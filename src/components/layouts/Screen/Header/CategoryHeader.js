import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Hidden from '@material-ui/core/Hidden';
import Text from 'components/outputs/Text';
import { objectToArray } from 'util/general';
import Tabs from './Tabs';
import { Box } from '@material-ui/core';
import FilterBar from 'components/filter/FilterBar';
import IconLabelButton from 'components/inputs/IconLabelButton';
import HeaderAction from './HeaderAction';
import LanguageSwitcher from 'components/layout/LanguageSwitcher';

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1),

    [theme.breakpoints.down('xs')]: {
      paddingTop: 0,
    },
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tabs: {
    display: 'flex',
    height: 40,
    // paddingTop: theme.spacing(6.5),
    flexDirection: 'row',
    alignItems: 'center',
    // width: '100%',
    // marginBottom: theme.spacing(2),
  },
  actions: {
    display: 'flex',
    // height: 40,
    // width: '100%',
    // marginBottom: theme.spacing(0.5),
    // paddingRight: theme.spacing(1),
    // paddingLeft: theme.spacing(1),
    // alignItems: 'flex-end',
    // justifyContent: 'flex-start',
    flexDirection: 'row',
  },
  titleContainer: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingTop: theme.spacing(6),
  },
  extraContainer: {
    width: '100%',
    paddingRight: theme.spacing(1),
  },
  actions2: { paddingLeft: theme.spacing(1) },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    // align
    width: '100%',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
}));

export default function CategoriesHeader(props) {
  const {
    title,
    onChange,
    actions = [],
    itemId,
    defaultPage,
    pages,
    // tabs,
    id,
    pageId,
    filters,
    history,
    pageConfig,
    stateId,
  } = props;
  console.log('CategoriesHeader -> props', props);

  const { services = {} } = pageConfig;
  if (Boolean(services.createData) && !Boolean(stateId)) {
    actions.push('add');
  }
  if (Boolean(services.updateData) && stateId === 'view') {
    actions.push('edit');
  }

  const classes = useStyles(props);

  const tabs = objectToArray(pages, 'id', true);

  function handleBack() {
    history.push('/' + id + '/' + (pageId ? pageId + '/' : ''));
  }

  function handleAction(action) {
    history.push(action + '/');
  }

  return (
    <div className={classes.container}>
      <LanguageSwitcher />
      <div className={classes.tabs}>
        <Tabs
          history={history}
          tabId={pageId}
          onChange={onChange}
          tabs={tabs}
          defaultTab={defaultPage}
        />
      </div>
      <Box pt={0.5} pr={1} className={classes.actions}>
        {actions.map(item => (
          <HeaderAction
            history={props?.history}
            key={item?.id ?? item}
            actionItem={item}
            onPress={() => handleAction(item?.id ?? item)}
          />
        ))}
      </Box>
    </div>
  );
}
