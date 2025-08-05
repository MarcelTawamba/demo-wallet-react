import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Hidden } from '@material-ui/core';
import ErrorBoundary from 'components/error/ErrorBoundary';

const MARGIN_TOP = 80;

export default function GridContainer(props) {
  const {
    content,
    footer,
    side,
    left,
    right = side,
    header,
    noHeader,
    extra,
  } = props;

  const classes = useStyles(props);

  return (
    <ErrorBoundary>
      <div className={classes.container}>
        {!noHeader && (
          <ErrorBoundary>
            <div className={classes.header}>{header}</div>
          </ErrorBoundary>
        )}
        <div className={classes.main}>
          {left && (
            <Hidden smDown implementation="css" className={classes.left}>
              <ErrorBoundary>
                <div className={classes.sideContent}>{left}</div>
              </ErrorBoundary>
            </Hidden>
          )}
          <ErrorBoundary>{content}</ErrorBoundary>
          {side && (
            <Hidden mdDown implementation="css" className={classes.side}>
              <ErrorBoundary>
                <div className={classes.sideContent}>{side}</div>
              </ErrorBoundary>
            </Hidden>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    gap: theme.spacing(4),
    // paddingLeft: theme.spacing(4),
    // paddingRight: theme.spacing(4),
    // maxWidth: (320 + 24) * 3,
    // marginLeft: 'auto',
    // marginRight: 'auto',

    // backgroundColor: 'white',
    // minHeight: '100vh',
    // [theme.breakpoints.down('xs')]: {
    //   width: '100%',
    //   marginLeft: 0,
    //   marginRight: 0,
    //   paddingLeft: 0,
    //   paddingRight: 0,
    // },
    // overflowY: 'scroll',
    // height: '100%',
  },
  actions: {
    [theme.breakpoints.down('md')]: {
      height: 'auto',
    },
    height: MARGIN_TOP,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    maxWidth: 'sm',
  },
  content: {
    [theme.breakpoints.up(1100)]: {
      maxWidth: '930px',
    },
    // overflowY: 'scroll',
  },
  main: {
    width: '100%',
    flexGrow: 1,
    // height: '100%',
    // height: '100vh',
    display: 'flex',
    gap: theme.spacing(8),
    flexDirection: 'row',
    // justifyContent: 'space-between',
    // paddingBottom: '180px',
    [theme.breakpoints.down(720)]: {
      paddingTop: 0,
      padding: theme.spacing(1),
    },
    [theme.breakpoints.down(480)]: {
      padding: 0,
    },
  },
  side: {
    width: 350,
    padding: theme.spacing(1),
  },
  left: {
    width: ({ leftWidth }) => leftWidth ?? 350,
    minWidth: ({ leftWidth }) => leftWidth ?? 350,
    // padding: theme.spacing(1),
    // marginRight: theme.spacing(8),
    // marginTop: theme.spacing(2),
    [theme.breakpoints.down(720)]: {
      margin: theme.spacing(2),
    },
    marginBottom: theme.spacing(4),
  },
  header: {
    display: 'flex',
    alignItems: 'flex-end',
    [theme.breakpoints.down('xs')]: {
      minHeight: 0,
      // paddingLeft: theme.spacing(1),
      // paddingRight: theme.spacing(1),
    },
  },
  sideContent: {
    backgroundColor: '#FAFBFC',
    // border: '1px solid #EFEFEF',
    borderRadius: 2, //theme.shape.borderRadius,
    padding: theme.spacing(1),
    height: '100%',
  },
}));
