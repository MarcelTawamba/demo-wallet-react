import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Scrollbars } from 'react-custom-scrollbars-better';
import ErrorBoundary from 'components/error/ErrorBoundary';

const MARGIN_TOP = 80;
const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    display: 'flex',
    // height: '100vh',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingTop: ({ noPadding, paddingTop }) =>
      theme.spacing(noPadding ? 0 : paddingTop ? paddingTop : 7),
    [theme.breakpoints.down(736)]: {
      paddingTop: theme.spacing(0),
    },
    // paddingBottom: theme.spacing(8),
  },
  title: {
    padding: theme.spacing(2),
    display: 'flex',
    alignItems: 'flex-end',
    height: 40,
  },
  content: {
    justifyContent: 'center',
    // width: ({ maxWidth }) => (maxWidth ? maxWidth : 600),
    maxWidth: ({ maxWidth, center }) =>
      maxWidth ? maxWidth : center ? 515 : 600,
    [theme.breakpoints.down(600)]: {
      width: '100%',
    },
    paddingTop: ({ logo }) => (logo ? theme.spacing(2) : 0),
  },
  contentContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: ({ center }) => (center ? 'center' : 'flex-start'),
    height: ({ center }) => (center ? '100%' : 'auto'),
    flexDirection: 'column',
    // padding: theme.spacing(2),
    // paddingBottom: 120,
    marginTop: ({ logo }) => (logo ? 70 : 0),
  },
  paper: {
    borderRadius: 20,
    width: '100%',
    maxWidth: ({ maxWidth, center }) =>
      maxWidth ? maxWidth : center ? 515 : 600,
    border: '1px solid #EFEFEF',
    paddingTop: ({ logo }) => (logo ? 70 : 0),
  },
  logo: {
    borderRadius: 140,
    overflow: 'hidden',
    height: 140,
    // padding: 10,
    backgroundColor: theme.palette.primary.contrastText,
    width: 140,
    minHeight: 140,
    minWidth: 140,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 0 + theme.spacing(2),
  },
  header: {
    maxWidth: ({ maxWidth }) => (maxWidth ? maxWidth : 600),
  },
}));

const Form = props => {
  const { children, header, logo } = props;
  const classes = useStyles(props);

  return (
    <ErrorBoundary>
      <div className={classes.container}>
        {/* <Scrollbars autoHide> */}
        <div className={classes.contentContainer}>
          {Boolean(header) && <div className={classes.header}> {header}</div>}
          {Boolean(logo) && (
            <div className={classes.logo}>
              <img
                style={{
                  maxHeight: 140,
                  maxWidth: 140,
                  width: '100%',
                  objectFit: 'cover',
                }}
                alt="Business logo"
                src={logo}
              />
            </div>
          )}
          <Paper className={classes.paper} elevation={0}>
            <ErrorBoundary>
              <div className={classes.content}>{children}</div>
            </ErrorBoundary>
          </Paper>
        </div>
        {/* </Scrollbars> */}
      </div>
    </ErrorBoundary>
  );
};

export default Form;
export { Form };
