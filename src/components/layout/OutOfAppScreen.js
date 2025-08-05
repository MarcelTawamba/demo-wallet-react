import React from 'react';
import { makeStyles } from '@material-ui/styles';
import CompanyStatusBanner from 'components/app/CompanyStatusBanner';
import { Link } from 'react-router-dom';
import IconLabelButton from 'components/inputs/IconLabelButton';
import { useSelector } from 'react-redux';
import { currentCompanySelector } from 'redux/auth/selectors';
import { Scrollbars } from 'react-custom-scrollbars-better';
import ErrorBoundary from '../error/ErrorBoundary';
import BusinessSelector from 'components/layouts/Screen/Header/BusinessSelector';

/* components */
export default function OutOfAppScreen(props) {
  const {
    children,
    onBack,
    showIcon = true,
    backLabel = 'back',
    center,
    headerRight,
  } = props;
  const company = useSelector(currentCompanySelector);
  const { icon } = company;
  const hasBanner = (company?.mode ?? '').match(/test|suspended/);
  const classes = useStyles({ hasBanner });

  const showBack = Boolean(onBack);

  return (
    <div div className={classes.container}>
      <div style={{ position: 'absolute', width: '100%' }}>
        <CompanyStatusBanner company={company} />
      </div>
      <ErrorBoundary>
        <Scrollbars style={{ width: '100%' }} rtl={document.dir === 'rtl'}>
          {/* <div className={classes.contentCenter}> */}
          {showBack && (
            <div className={classes.backButton}>
              <Link to={onBack}>
                <IconLabelButton size={32} label={backLabel} color="primary" />
              </Link>
            </div>
          )}
          {showIcon && (
            <div className={classes.logo}>
              {headerRight}
              <BusinessSelector />
            </div>
          )}
          <div className={classes.contentCenter}>{children}</div>
          {/* </div> */}
        </Scrollbars>
      </ErrorBoundary>
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.down(550)]: {
      height: `calc(calc(var(--vh, 1vh) * 100) - 48px)`,
    },
  },
  content: {
    width: '100%',
    // marginTop: theme.spacing(6),
  },
  contentCenter: {
    // maxWidth: (320 + 24) * 3,
    // margin: 'auto',
    width: '100%',
    flexGrow: 1,
    padding: theme.spacing(4),
    paddingTop: theme.spacing(10),
    minHeight: '100vh',
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',

    [theme.breakpoints.down(562)]: {
      paddingTop: theme.spacing(16),
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      minHeight: `calc(calc(var(--vh, 1vh) * 100) - 48px)`,
    },
  },
  logo: {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    right: 0,
    top: 0,
    padding: theme.spacing(2),
    paddingRight: theme.spacing(4),
    marginTop: ({ hasBanner }) => (hasBanner ? 48 : 0),
    [theme.breakpoints.down(562)]: {
      marginTop: ({ hasBanner }) => (hasBanner ? 66 : 0),
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
    },
    zIndex: 500,
  },
  backButton: {
    position: 'absolute',
    top: 0,
    padding: theme.spacing(2),
    paddingLeft: theme.spacing(4),
    marginTop: ({ hasBanner }) => (hasBanner ? 48 : 0),
    [theme.breakpoints.down(562)]: {
      marginTop: ({ hasBanner }) => (hasBanner ? 66 : 0),
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
    },
    left: 0,
    zIndex: 2000,
  },
}));
