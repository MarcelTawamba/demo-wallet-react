import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Hidden } from '@material-ui/core';
import ErrorBoundary from 'components/error/ErrorBoundary';

const MARGIN_TOP = 80;
const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    // paddingLeft: theme.spacing(4),
    // paddingRight: theme.spacing(4),
    // maxWidth: (320 + 24) * 3,
    // marginLeft: 'auto',
    // marginRight: 'auto',

    // backgroundColor: 'white',
    height: '100%',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      marginLeft: 0,
      marginRight: 0,
      paddingLeft: 0,
      paddingRight: 0,
    },
    // overflowY: 'scroll',
    // height: '100%',
  },
  content: {
    [theme.breakpoints.up(1100)]: {
      maxWidth: '930px',
    },
    // overflowY: 'scroll',
  },
  main: {
    width: '100%',
    // overflowY: 'scroll',
    // height: '100%',
    // height: '100vh',
    // display: 'flex',
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    // paddingBottom: '180px',
    // [theme.breakpoints.down('md')]: {
    //   paddingBottom: 80,
    // },
  },
  header: {
    display: 'flex',
    alignItems: 'flex-end',
    [theme.breakpoints.down('xs')]: {
      minHeight: 0,
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
  },
}));

export default function Layout(props) {
  const { content, header } = props;
  const classes = useStyles(props);
  return (
    <ErrorBoundary>
      <div className={classes.container}>
        <ErrorBoundary>
          <div className={classes.header}>{header}</div>
        </ErrorBoundary>
        <div className={classes.main}>
          <ErrorBoundary>{content}</ErrorBoundary>
        </div>
      </div>
    </ErrorBoundary>
  );
}
