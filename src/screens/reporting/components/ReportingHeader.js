import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
// import { Box } from '@material-ui/core';
import FilterBar from 'components/filter/FilterBar';
// import HeaderAction from '../../../components/layouts/Screen/Header/HeaderAction';
// import Info from 'components/outputs/Info';

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    paddingBottom: theme.spacing(2),
  },
  row: {
    display: 'flex',
    flexDirection: 'row',

    width: '100%',
    [theme.breakpoints.down(1150)]: {
      flexDirection: 'column',
      width: 'auto',
    },
  },
  title: {
    padding: theme.spacing(1),
  },
  info: {
    paddingLeft: theme.spacing(1),
    [theme.breakpoints.down(1150)]: {
      paddingTop: theme.spacing(2),
      paddingLeft: 0,
    },
  },
}));

export default function ReportingHeader(props) {
  const {
    title,
    screenId,
    actions = [],
    filters,
    history,
    onSuccess,
    isLoading,
    context,
  } = props;

  const classes = useStyles(props);

  function handleBack() {
    history.push('/' + screenId + '/');
  }

  return (
    <div className={classes.container}>
      <div className={classes.row}>
        <FilterBar row {...filters} fetchData={onSuccess} context={context} />
        {/* <div className={classes.info}>
          <Info dense>Data last updated midnight +00 GMT today.</Info>
        </div> */}
      </div>
    </div>
  );
}
