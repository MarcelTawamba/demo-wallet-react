import React from 'react';
import Paper from '@material-ui/core/Paper';
import Text from 'components/outputs/Text';
import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from '@material-ui/icons/Refresh';
import { Scrollbars } from 'react-custom-scrollbars-better';
import { makeStyles } from '@material-ui/styles';
import { currentCompanySelector } from 'redux/auth/selectors';
import { useSelector } from 'react-redux';
import ErrorBoundary from '../error/ErrorBoundary';
import CompanyStatusBanner from 'components/app/CompanyStatusBanner';
import Toast from 'components/outputs/Toast';

const MARGIN_TOP = 142;
const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    height: '100vh',
    position: 'relative',
    backgroundColor: '#FAFAFA',

    // overflowY: 'scroll',
    // maxHeight: 1200,
    // overflow: 'scroll',
    paddingBottom: theme.spacing(1),
    [theme.breakpoints.down(550)]: {
      height: `calc(var(--vh, 1vh) * 100)`,
    },
  },
  innerContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: theme.spacing(1),
    paddingTop: ({ banner }) => theme.spacing(1) + (banner ? 48 : 0),
    [theme.breakpoints.down(550)]: {
      paddingTop: ({ banner }) => theme.spacing(1) + (banner ? 72 : 0),
    },
  },
  header: {
    height: MARGIN_TOP - 24,
    minHeight: MARGIN_TOP - 24,
    // marginTop: theme.spacing(2),
    position: 'relative',
    paddingBottom: theme.spacing(1),
    display: 'flex',
    width: '100%',
    alignItems: 'flex-end',
    justifyContent: 'center',
    [theme.breakpoints.down(560)]: {
      height: MARGIN_TOP + 16,
      minHeight: MARGIN_TOP + 16,
    },
  },
  title: {
    paddingBottom: theme.spacing(1),
    display: 'flex',
    alignItems: 'flex-end',
    height: 40,
    minHeight: 40,
  },
  warning: {
    padding: theme.spacing(2),
    display: 'flex',
    alignItems: 'flex-end',
    marginTop: 5,
    marginBottom: 2,
    maxWidth: 413,
    borderRadius: 5,
    backgroundColor: '#FEF3EA',
    color: '#F47A00',
  },
  paper: {
    margin: theme.spacing(2),
    padding: theme.spacing(5),
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    // alignItems: 'center',
    maxWidth: ({ wide }) => (wide ? 500 : 440),
    [theme.breakpoints.down(440)]: {
      width: '100%',
      margin: 0,
      marginTop: theme.spacing(2),
    },
    border: '1px solid #EFEFEF',
    backgroundColor: 'white',
    // cornerRadius: theme.
  },
  content: {
    width: ({ wide }) => (wide ? 436 : 336),
    justifyContent: 'center',
    [theme.breakpoints.down(440)]: {
      width: '100%',
    },
  },
  noHeader: {
    height: 60,
    [theme.breakpoints.down(500)]: {
      height: 0,
    },
  },
  footer: {
    // height: MARGIN_TOP,
    // padding: theme.spacing(1),
  },
  refresh: {
    height: 16,
    maxWidth: 400,
    display: 'flex',
    minWidth: 336,
    width: '100%',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  pageFooter: {
    position: 'absolute',
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.47)',
  },
}));

const Form = props => {
  const {
    children,
    noTitle,
    noHeader,
    title,
    titleId,
    footer,
    header,
    refresh,
    pageFooter,
  } = props;
  const company = useSelector(currentCompanySelector);

  const { mode = '' } = company ?? {};
  const isTestCompany = Boolean(mode.match(/test/));
  const isSuspendedCompany = Boolean(mode.match(/suspended/));
  const showBanner = isTestCompany || isSuspendedCompany;
  const classes = useStyles({ ...props, banner: showBanner });

  return (
    <ErrorBoundary>
      <div className={classes.container}>
        <div style={{ position: 'absolute', width: '100%' }}>
          <CompanyStatusBanner company={company} />
        </div>

        <Scrollbars autoHide rtl={document.dir === 'rtl'}>
          <div className={classes.innerContainer}>
            <ErrorBoundary>
              {!noHeader ? (
                <div className={classes.header}>{header}</div>
              ) : (
                <div className={classes.noHeader} />
              )}
            </ErrorBoundary>
            <ErrorBoundary>
              {!noTitle && (
                <div className={classes.title}>
                  <Text
                    id={titleId}
                    align={'center'}
                    variant={'h5'}
                    style={{ fontWeight: 400 }}>
                    {title}
                  </Text>

                  {refresh && (
                    <div style={classes.refresh}>
                      <IconButton>
                        <RefreshIcon />
                      </IconButton>
                    </div>
                  )}
                </div>
              )}
              <div
                className={titleId === 'company_title' ? classes.warning : ''}>
                {titleId === 'company_title' && (
                  <Text
                    c={'#F47A00'}
                    s={13}
                    id="This is for testing Rehive projects and not to be used in production. Once you go into production everything will be updated with your branding and this step will be built into the app experience."
                  />
                )}
              </div>
            </ErrorBoundary>

            <Paper elevation={0} className={classes.paper}>
              <ErrorBoundary>
                <div
                  className={classes.content}
                  // style={{
                  //   width: stretch ? (noPadding ? 600 : 536) : noPadding ? 400 : 336,
                  // }}
                >
                  {children}
                </div>
              </ErrorBoundary>
            </Paper>
            <ErrorBoundary>
              <div className={classes.footer}>{footer}</div>
            </ErrorBoundary>
          </div>
        </Scrollbars>

        <Toast />
        {Boolean(pageFooter) && (
          <div className={classes.pageFooter}>{pageFooter}</div>
        )}
      </div>
    </ErrorBoundary>
  );
};

Form.propTypes = {
  // classes: PropTypes.object.isRequired,
};

export default Form;
