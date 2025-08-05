import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Hidden } from '@material-ui/core';
import ErrorBoundary from '../../error/ErrorBoundary';

const MARGIN_TOP = 80;
const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    // maxWidth: (320 + 24) * 3,
    display: 'flex',
    flexDirection: 'column',
    marginLeft: 'auto',
    marginRight: 'auto',
    [theme.breakpoints.down(500)]: {
      width: '100%',
      // padding: theme.spacing(2),
      paddingTop: 0,
    },
    [theme.breakpoints.down(736)]: {
      // paddingTop: theme.spacing(1),
    },
    // width: '100%',
    // maxWidth: (320 + 24) * 3,
    // marginLeft: 'auto',
    // marginRight: 'auto',
    // paddingLeft: theme.spacing(4),
    // paddingRight: theme.spacing(4),
    // height: '100vh',
    // [theme.breakpoints.down('xs')]: {
    //   width: '100%',
    //   marginLeft: 0,
    //   marginRight: 0,
    //   paddingLeft: 0,
    //   paddingRight: 0,
    // },
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
  },
  main: {
    width: '100%',
    // height: '100%',
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // paddingBottom: '180px',
    // [theme.breakpoints.down('md')]: {
    // paddingBottom: 80,
    // },
  },
  mainExtra: {
    width: '100%',
    // height: '100vh',
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingBottom: '250px',
    [theme.breakpoints.down('md')]: {
      paddingBottom: 80,
    },
  },
  side: {
    width: 350,

    padding: theme.spacing(1),
  },
  header: {
    // minHeight: ({ extraHeader }) => MARGIN_TOP + (extraHeader ? 30 : 0),
    marginBottom: ({ noHeaderPadding }) =>
      theme.spacing(noHeaderPadding ? 0 : 2),
    display: 'flex',
    alignItems: 'flex-end',
    [theme.breakpoints.down('xs')]: {
      minHeight: 0,
      // paddingLeft: theme.spacing(1),
      // paddingRight: theme.spacing(1),
    },
  },
  sideContent: {
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #EFEFEF',
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(1),
  },
}));

const GridContainer = props => {
  const { content, footer, side, header, noHeader, extra } = props;
  const classes = useStyles(props);
  return (
    <ErrorBoundary>
      <div className={classes.container}>
        {header && !noHeader && (
          <ErrorBoundary>
            <div className={classes.header}>{header}</div>
          </ErrorBoundary>
        )}
        <div className={classes.main}>
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
};

export default GridContainer;
