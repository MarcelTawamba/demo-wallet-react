import React from 'react';
// import './Layout.css';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Slide from '@material-ui/core/Slide';
import { Scrollbars } from 'react-custom-scrollbars-better';
import MyHidden from './Hidden';
import ErrorBoundary from 'components/error/ErrorBoundary';

const MARGIN_TOP = 70;
const styles = theme => ({
  container: {
    display: 'flex',
    flexGrow: 1,
    alignItems: 'unset !important',
    [theme.breakpoints.down(736)]: {
      paddingTop: theme.spacing(1),
      width: '100%',
    },
  },
  header: {
    display: 'flex',
    minHeight: MARGIN_TOP,
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(0.5),
    [theme.breakpoints.down(736)]: {
      height: 'auto',
      paddingRight: 0,
    },
    alignItems: 'flex-end',
  },
  innerContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 1,
    // height: '100vh',
    [theme.breakpoints.down(736)]: {
      // height: '100vh',
      padding: 0,
      width: '100%',
    },
  },
  indexContainer: {
    width: 300,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.down(736)]: {
      width: '100%',
      minWidth: 200,
      paddingBottom: 0,
    },
  },
  actions: {
    marginTop: 75,
    marginLeft: theme.spacing(1),
    // width: 180,
  },
  index: {
    [theme.breakpoints.down(736)]: {
      paddingTop: theme.spacing(1.5),
    },
  },
  contentContainer: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      paddingBottom: '0px',
    },
    [theme.breakpoints.down(736)]: {
      paddingBottom: '0px',
    },
  },
  content: {
    paddingTop: theme.spacing(1),
  },
  paper: {
    border: '1px solid #EFEFEF',
    // marginTop: theme.spacing(1),
    // marginBottom: theme.spacing(4),
  },
  // fade: {
  //   position: 'absolute',
  //   width: '100%',
  //   height: theme.spacing(0.5),
  //   background: `linear-gradient(top, rgba(255,255,255, 1) , transparent)`,
  //   zIndex: 1000,
  // },
});

const IndexContainer = ({
  index,
  indexHeader = <div />,
  content,
  actions,
  noHeader,
  contentHeader = <div />,
  classes,
  align,
  flipContent,
}) => {
  const IndexComp = (
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
  const ContentProp = (
    <div className={classes.contentContainer}>
      <MyHidden size="sm" up>
        {!noHeader && (
          <ErrorBoundary>
            <div className={classes.header}>{contentHeader}</div>
          </ErrorBoundary>
        )}
      </MyHidden>
      <React.Fragment>
        <Scrollbars
          className={classes.content}
          autoHide
          rtl={document.dir === 'rtl'}>
          <MyHidden size="xs">
            {!noHeader && (
              <ErrorBoundary>
                <div className={classes.header}>{contentHeader}</div>
              </ErrorBoundary>
            )}
          </MyHidden>
          <Paper elevation={0} className={classes.paper}>
            <ErrorBoundary>{content}</ErrorBoundary>
          </Paper>
        </Scrollbars>
      </React.Fragment>
    </div>
  );

  return (
    <ErrorBoundary>
      <div
        className={classes.container}
        style={{
          alignItems: align === 'left' ? 'flex-start' : 'center',
        }}>
        <div className={classes.innerContainer}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              flexGrow: 1,
              gap: '1rem',
            }}>
            <div>
              {index && (
                <Hidden xsDown>
                  <ErrorBoundary>{IndexComp}</ErrorBoundary>
                </Hidden>
              )}
            </div>
            <div style={{ flexGrow: 1 }}>
              <Hidden xsDown>
                <ErrorBoundary>{ContentProp}</ErrorBoundary>
              </Hidden>
              <MyHidden size={'xs'}>
                <ErrorBoundary>
                  {flipContent ? IndexComp : ContentProp}
                </ErrorBoundary>
              </MyHidden>
            </div>
            <div>
              {actions && (
                <Hidden mdDown>
                  <ErrorBoundary>
                    <Slide
                      direction="left"
                      in={true}
                      mountOnEnter
                      unmountOnExit>
                      {actions && (
                        <div className={classes.actions}>{actions}</div>
                      )}
                    </Slide>
                  </ErrorBoundary>
                </Hidden>
              )}
            </div>
          </div>

          {/* <Hidden xsDown>
            <ErrorBoundary>{ContentProp}</ErrorBoundary>
          </Hidden>
          <MyHidden size={'xs'}>
            <ErrorBoundary>
              {flipContent ? IndexComp : ContentProp}
            </ErrorBoundary>
          </MyHidden>

          {actions && (
            <Hidden mdDown>
              <ErrorBoundary>
                <Slide direction="left" in={true} mountOnEnter unmountOnExit>
                  {actions && <div className={classes.actions}>{actions}</div>}
                </Slide>
              </ErrorBoundary>
            </Hidden>
          )} */}
        </div>
      </div>
    </ErrorBoundary>
  );
};

IndexContainer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(IndexContainer);
