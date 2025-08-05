import React from 'react';
// import './Layout.css';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Hidden from '@material-ui/core/Hidden';
import Slide from '@material-ui/core/Slide';
import { Scrollbars } from 'react-custom-scrollbars-better';
import MyHidden from './Hidden';
import ErrorBoundary from 'components/error/ErrorBoundary';

const MARGIN_TOP = 80;
const styles = theme => ({
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'unset !important',
    // maxWidth: (320 + 24) * 3,
    // marginLeft: 'auto',
    // marginRight: 'auto',
    [theme.breakpoints.down('xs')]: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
  },
  header: {
    display: 'flex',
    // minHeight: MARGIN_TOP,
    alignItems: 'flex-end',
    [theme.breakpoints.down('xs')]: {
      minHeight: 0,
      height: 'auto',
    },
  },
  innerContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 1,
    // height: '100vh',
    [theme.breakpoints.down(736)]: {
      // height: '100vh',
      width: '100%',
    },
  },
  indexContainer: {
    maxWidth: 300,
    minWidth: 200,
    width: '100%',
    // paddingBottom: MARGIN_TOP,
  },
  actions: {
    marginTop: MARGIN_TOP,
    width: 180,
  },
  index: {
    // paddingRight: theme.spacing(3),
    // marginBottom: theme.spacing(16),
    [theme.breakpoints.down(736)]: {
      paddingRight: theme.spacing(1),
    },
  },
  contentContainer: {
    width: '100%',
    // [theme.breakpoints.down(1000)]: {
    //   width: 550,
    // },
    // [theme.breakpoints.down(760)]: {
    //   width: 500,
    // },
    // [theme.breakpoints.down('xs')]: {
    //   width: '100%',
    //   paddingBottom: '0px',
    // },
    // paddingBottom: MARGIN_TOP,
  },
  content: {
    paddingTop: theme.spacing(1),
  },
  paper: {
    border: '1px solid #EFEFEF',
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(1),
    // marginBottom: theme.spacing(16),
    marginRight: theme.spacing(2),
    [theme.breakpoints.down(736)]: {
      marginRight: theme.spacing(1),
    },
  },
  fade: {
    position: 'absolute',
    width: '100%',
    height: theme.spacing(0.5),
    background: `linear-gradient(top, rgba(250,250,250, 1) , rgba(255,255,255, 0))`,
    zIndex: 1000,
  },
});

const IndexContainer = ({
  index,
  header = <div />,
  content,
  actions,
  noHeader,
  contentHeader = <div />,
  classes,
  align,
  flipContent,
}) => {
  return (
    <ErrorBoundary>
      <div
        className={classes.container}
        style={{
          alignItems: align === 'left' ? 'flex-start' : 'center',
        }}>
        <Hidden xsDown>
          <ErrorBoundary>
            {!noHeader && <div className={classes.header}>{header}</div>}
          </ErrorBoundary>
        </Hidden>
        <ErrorBoundary>
          <div className={classes.innerContainer}>
            {index && (
              <Hidden xsDown>
                <ErrorBoundary>
                  <div className={classes.indexContainer}>
                    <React.Fragment>
                      {/* <div className={classes.fade} /> */}
                      <Scrollbars autoHide rtl={document.dir === 'rtl'}>
                        <div className={classes.index}>{index}</div>
                      </Scrollbars>
                    </React.Fragment>
                  </div>
                </ErrorBoundary>
              </Hidden>
            )}

            <div className={classes.contentContainer} id="scrollableContainer">
              <React.Fragment>
                <MyHidden size="xs">
                  {!noHeader && (
                    <ErrorBoundary>
                      <div className={classes.header}>{header}</div>
                    </ErrorBoundary>
                  )}
                </MyHidden>
                {/* <div className={classes.fade} /> */}
                <ErrorBoundary>
                  <Scrollbars
                    className={classes.content}
                    autoHide
                    rtl={document.dir === 'rtl'}>
                    {!content ? null : flipContent ? (
                      <React.Fragment>
                        <MyHidden size="xs">
                          <div className={classes.index}>{index}</div>
                        </MyHidden>
                        <Hidden xsDown>
                          <Paper elevation={0} className={classes.paper}>
                            {content}
                          </Paper>
                        </Hidden>
                      </React.Fragment>
                    ) : (
                      <Paper elevation={0} className={classes.paper}>
                        {content}
                      </Paper>
                    )}
                  </Scrollbars>
                </ErrorBoundary>
              </React.Fragment>
            </div>

            {actions && (
              <Hidden mdDown>
                <Slide direction="left" in={true} mountOnEnter unmountOnExit>
                  {actions && <div className={classes.actions}>{actions}</div>}
                </Slide>
              </Hidden>
            )}
          </div>
        </ErrorBoundary>
      </div>
    </ErrorBoundary>
  );
};

IndexContainer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(IndexContainer);
