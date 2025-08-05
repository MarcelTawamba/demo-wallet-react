import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Scrollbars } from 'react-custom-scrollbars-better';
import ErrorBoundary from '../error/ErrorBoundary';

const MARGIN_TOP = 140;
const styles = theme => ({
  header: {
    display: 'flex',
    height: MARGIN_TOP,
    paddingRight: theme.spacing(2),
    [theme.breakpoints.down(736)]: {
      height: 'auto',
      paddingRight: 0,
    },
    alignItems: 'flex-end',
  },
  indexContainer: {
    maxWidth: 300,
    minWidth: 200,
    width: '100%',
    paddingBottom: MARGIN_TOP,
    [theme.breakpoints.down(736)]: {
      width: '100%',
      minWidth: 200,
      paddingBottom: 0,
      maxWidth: 720,
      paddingLeft: theme.spacing(1),
      // paddingLeft: theme.spacing(2),
    },
  },
  index: {
    // paddingRight: theme.spacing(1),
    marginBottom: theme.spacing(16),
    [theme.breakpoints.down(736)]: {
      paddingTop: theme.spacing(1),
      paddingRight: theme.spacing(2),
    },
  },
  // fade: {
  //   position: 'absolute',
  //   width: '100%',
  //   height: theme.spacing(0.5),
  //   background: `linear-gradient(top, rgba(250,250,250, 1) , rgba(255,255,255, 0))`,
  //   zIndex: 1000,
  // },
});

const IndexLayout = ({ index, indexHeader = <div />, noHeader, classes }) => {
  return (
    <div className={classes.indexContainer}>
      {!noHeader && (
        <ErrorBoundary>
          <div className={classes.header}>{indexHeader}</div>
        </ErrorBoundary>
      )}
      <React.Fragment>
        {indexHeader && (
          <ErrorBoundary>
            <div className={classes.fade} />
          </ErrorBoundary>
        )}
        <Scrollbars autoHide rtl={document.dir === 'rtl'}>
          <ErrorBoundary>
            <div className={classes.index}>{index}</div>
          </ErrorBoundary>
        </Scrollbars>
      </React.Fragment>
    </div>
  );
};

IndexLayout.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(IndexLayout);
