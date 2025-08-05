import React from 'react';

import Paper from '@material-ui/core/Paper';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Scrollbars } from 'react-custom-scrollbars-better';
import ErrorBoundary from 'components/error/ErrorBoundary';

const MARGIN_TOP = 80;
const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    display: 'flex',
    height: '100vh',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingTop: ({ noPadding }) => theme.spacing(noPadding ? 2 : 7),
    [theme.breakpoints.down(736)]: {
      paddingTop: theme.spacing(0),
    },
    [theme.breakpoints.down(550)]: {
      height: `calc(calc(var(--vh, 1vh) * 100) - 48px)`,
    },
    paddingBottom: theme.spacing(4),
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
    maxWidth: ({ maxWidth }) => (maxWidth ? maxWidth : 500),
    [theme.breakpoints.down(600)]: {
      width: '100%',
    },
    paddingTop: ({ logo }) => (logo ? theme.spacing(2) : 0),
  },
  contentContainer: {
    width: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: ({ center }) => (center ? 'center' : 'flex-start'),
    height: ({ center }) => (center ? '100%' : 'auto'),
    flexDirection: 'column',
    padding: theme.spacing(2),
    paddingBottom: 120,
    marginTop: ({ logo }) => (logo ? 70 : 0),
  },
  paper: {
    borderRadius: 20,
    width: '100%',
    maxWidth: ({ maxWidth }) => (maxWidth ? maxWidth : 500),
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
}));

const FormLayout = props => {
  const { children, logo } = props;
  const classes = useStyles(props);

  return (
    <ErrorBoundary>
      <div className={classes.container}>
        <Scrollbars autoHide rtl={document.dir === 'rtl'}>
          <div className={classes.contentContainer}>
            {Boolean(logo) && (
              <div className={classes.logo}>
                <img
                  style={{
                    maxHeight: 140,
                    maxWidth: 140,
                    // height: ,
                    width: '100%',
                    objectFit: 'contain',
                  }}
                  alt="rehive"
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
        </Scrollbars>
      </div>
    </ErrorBoundary>
  );
};

// Form.propTypes = {
//   classes: PropTypes.object.isRequired,
// };

export default FormLayout;
