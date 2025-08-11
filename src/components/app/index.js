import React, { useState, useEffect } from 'react';
import { get } from 'lodash';
import { connect, useDispatch, useSelector } from 'react-redux';
import {
  MuiThemeProvider,
  createTheme,
  StylesProvider,
  jssPreset,
} from '@material-ui/core/styles';
import { useHistory, useLocation } from 'react-router-dom';
import { useConfiguration } from 'components/contexts/ConfigurationContext';
import ConfigurationError from '../rehive/ConfigurationError';
import { create } from 'jss';
import rtl from 'jss-rtl';
import i18n from 'util/i18n/i18n';

/* redux */
import {
  currentCompanySelector,
  authUserSelector,
  companiesSelector,
  appLoadedSelector,
  currentSessionsSelector,
} from 'redux/auth/selectors';
import {
  logoutUser,
  appLoad,
  setNewAuth,
  removeAuthSession,
  onAuthSuccess,
  setTempCompany,
  resetAuth,
} from 'redux/auth/actions';
import {
  configColorsSelector,
  configDesignSelector,
} from 'redux/rehive/selectors';
import { fetchData } from 'redux/rehive/actions';

/* components */
import Head from './Head';
import AppHeader from './AppHeader';
import {
  initWithoutToken,
  initWithToken,
  verifyToken,
  getPublicCompany,
  getCompanyAppConfig,
} from 'util/rehive';
import { parseUrl } from 'util/general';
import { ThemeProvider } from './context';
import ErrorBoundary from '../error/ErrorBoundary';
import { SplashScreen } from '../rehive/SplashScreen';
import AppRoutes from './AppRoutes';
import muiConfig from 'config/config/mui';
// const AppRoutes = React.lazy(() => import('./AppRoutes'));

function useAppInit() {
  const [loading, setLoading] = useState(true);
  const [temp, setTemp] = useState(false);
  const [init, setInit] = useState(true);

  const appLoaded = useSelector(appLoadedSelector);

  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  let { user: userUrl, company: companyUrl, page: currentPage } = parseUrl(location);

  let { loading: clientLoading, config: client } = useConfiguration();

  const companies = useSelector(companiesSelector);

  const { currentCompanyID, tempCompanyID, recent } = companies;

  let {
    items: currentSessions,
    token,
    user,
  } = useSelector(currentSessionsSelector);

  const companyID = client.company
    ? client.company
    : companyUrl === 'company'
    ? ''
    : companyUrl
    ? companyUrl
    : tempCompanyID
    ? tempCompanyID
    : currentCompanyID;

  useEffect(() => {
    if (loading || (userUrl && companyUrl) || (companyUrl && init)) {
      dispatch(resetAuth());
      setLoading(true);

      if (tempCompanyID !== companyUrl && recent && recent[companyUrl])
        dispatch(setTempCompany(recent[companyUrl]));
    }
    setInit(false);
  }, [userUrl, companyUrl]);

  useEffect(() => {
    if (!appLoaded) {
      initAuth();
      setTemp(true);
    }
  }, [appLoaded, companyID]);

  useEffect(() => {
    if (!loading || (appLoaded && temp)) {
      const { pathname } = location;
      const paths = pathname.split('/');

      if (
        (paths.length < 3 || companyUrl) &&
        appLoaded &&
        !paths?.includes('checkout') &&
        !paths?.includes('sep24')
      ) {
        history.push('/home/');
      }
      setLoading(false);
      setTemp(false);
    }
  }, [loading, appLoaded]);

  const userId = !userUrl && user ? get(user, 'id') : userUrl ? userUrl : '';

  function handleTokenFail() {
    initWithoutToken();

    if (token && !(companyUrl && !userUrl))
      dispatch(removeAuthSession(companyID, userId));

    setLoading(false);
  }

  async function initAuth() {
    initWithoutToken();

    if (companyID) {
      const company = companyID.toLowerCase();

      try {
        const response = await getPublicCompany(company);
        const config = await getCompanyAppConfig(company, false);

        if (response.status === 'success' && config?.status === 'success') {
          if (companyID && userId) {
            const currentSession = get(currentSessions, [companyID, userId], {
              token: '',
              user: null,
            });

            ({ token, user } = currentSession);
          }

          if (token && !(companyUrl && !userUrl)) {
            let resp = await verifyToken(token);
            if (resp.status === 'success') {
              initWithToken(token);
              dispatch(onAuthSuccess({ user: resp?.data, token }));
            } else {
              handleTokenFail();
              // We want to still load the sep24 page on session failure
              if (!currentPage === 'sep24') {
                if (!client.company) {
                  history.push('/company/');
                } else {
                  history.push('/error/');
                }
              }
            }
            // setLoading(false);
          } else {
            dispatch(
              setTempCompany({ ...response.data, ...(config?.data ?? {}) }),
            );
            handleTokenFail();
          }
        } else {
          handleTokenFail();
          // We want to still load the sep24 page on session failure
          if (!currentPage === 'sep24') {
            if (!client.company) {
              history.push('/company/');
            } else {
              history.push('/error/');
            }
          }
        }
      } catch (error) {
        handleTokenFail();
        console.log('TCL: verifyCompany -> error', error);
      }
    } else {
      setLoading(false);
    }
  }

  return { loading: loading || clientLoading, client };
}

const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

const AppContainer = props => {
  const { colors, design, user } = props;

  let { loading: clientLoading, config, isGreyLabel } = useConfiguration();

  const clientError = !clientLoading && !isGreyLabel && !config.name;

  const { loading, client } = useAppInit();
  const [isRtl, setIsRtl] = useState(null);

  useEffect(() => {
    const _isRtl = i18n.dir(user?.language) === 'rtl';
    document.dir = _isRtl ? 'rtl' : 'ltr';
    setIsRtl(_isRtl);
  }, [user?.language]);

  let theme = createTheme({
    // shadows: ['none'],
    ...muiConfig,
    palette: {
      primary: {
        main: colors.primary,
        contrastText: colors.primaryContrast,
      },
      secondary: {
        main: colors.secondary,
        contrastText: colors.secondaryContrast,
      },
      dummy: {
        main: colors.secondary,
        contrastText: colors.secondaryContrast,
      },
      font: {
        primary: '#585858',
        secondary: '#585858',
      },
      background: {
        main: '#ffffff', //colors.grey1,
        contrastText: '#585858',
      },
      positive: {
        main: colors.positive,
      },
      success: {
        main: colors.success,
      },
      negative: {
        main: colors.negative,
      },
      error: {
        main: colors.error,
      },
    },
    direction: isRtl ? 'rtl' : 'ltr',
  });

  let styleProps = {};
  if (isRtl) {
    styleProps['jss'] = jss;
  }

  return (
    <StylesProvider {...styleProps}>
      <MuiThemeProvider theme={theme}>
        <ThemeProvider value={{ colors, design }}>
          <ErrorBoundary>
            <Head />
            <AppHeader {...props} />
            {client?.status === 'error' || clientError ? (
              <ConfigurationError />
            ) : loading ? (
              <SplashScreen noLogo />
            ) : (
              <AppRoutes {...props} />
            )}
          </ErrorBoundary>
        </ThemeProvider>
      </MuiThemeProvider>
    </StylesProvider>
  );
};

const mapStateToProps = state => {
  return {
    colors: configColorsSelector(state),
    design: configDesignSelector(state),
    company: currentCompanySelector(state),
    user: authUserSelector(state),
  };
};

export default connect(mapStateToProps, {
  logoutUser,
  appLoad,
  fetchData,
  setNewAuth,
})(AppContainer);
