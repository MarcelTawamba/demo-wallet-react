import React, { useState, useEffect } from 'react';
import { get } from 'lodash';
import { connect, useDispatch, useSelector } from 'react-redux';
import { MuiThemeProvider, createTheme } from '@material-ui/core/styles';
import { useHistory, useLocation } from 'react-router-dom';
import { useConfiguration } from 'components/contexts/ConfigurationContext';

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
} from 'redux/auth/actions';
import {
  configColorsSelector,
  configDesignSelector,
} from 'redux/rehive/selectors';
import { fetchData } from 'redux/rehive/actions';

/* components */
import Head from './Head';
import { initWithoutToken, initWithToken, verifyToken } from 'util/rehive';
import { parseUrl } from 'util/general';
import { ThemeProvider } from './context';
import ErrorBoundary from '../error/ErrorBoundary';
import { SplashScreen } from '../rehive/SplashScreen';
import ConfigurationError from '../rehive/ConfigurationError';
import AppRoutes from './AppRoutes';
import muiConfig from 'config/config/mui';

function useAppInit() {
  const [loading, setLoading] = useState(true);

  // const appLoaded = useSelector(appLoadedSelector);

  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  let { user: userUrl, company: companyUrl, paths } = parseUrl(location);

  let { loading: clientLoading, config: client } = useConfiguration();

  const companies = useSelector(companiesSelector);

  const { currentCompanyID, tempCompanyID, recent } = companies;

  let {
    items: currentSessions,
    token,
    user,
  } = useSelector(currentSessionsSelector);

  const companyID = client?.id ?? companyUrl;

  const userId = !userUrl && user ? get(user, 'id') : userUrl ? userUrl : '';

  useEffect(() => {
    if (!clientLoading) initAuth();
  }, [clientLoading]);

  useEffect(() => {
    if (!userUrl) return;

    setLoading(true);
    initAuth();
  }, [userUrl]);

  function handleAuthComplete(success) {
    if (!success) {
      initWithoutToken();

      if (token && !(companyUrl && !userUrl)) {
        dispatch(removeAuthSession(companyID, userId));
        history.push('/');
      }
    } else if (success && userUrl) history.push('/accounts/');

    setLoading(false);
  }

  async function initAuth() {
    initWithoutToken();
    let successfulAuth = false;
    console.log(
      '🚀 ~ file: index.js ~ line 94 ~ initAuth ~ companyID',
      companyID,
    );
    console.log('🚀 ~ file: index.js ~ line 94 ~ initAuth ~ userId', userId);
    if (companyID) {
      try {
        if (companyID && userId) {
          const currentSession = get(currentSessions, [companyID, userId], {});
          ({ token = '', user } = currentSession);
        }

        if (token && !(companyUrl && !userUrl)) {
          let resp = await verifyToken(token);

          if (resp.status === 'success') {
            await initWithToken(token);
            dispatch(onAuthSuccess({ user: resp?.data, token }));
            successfulAuth = true;
          }
        }
      } catch (error) {
        handleAuthComplete(false);
      }
    }

    handleAuthComplete(successfulAuth);
  }

  return { loading: loading || clientLoading, client };
}

const AppContainer = props => {
  const { colors, design } = props;

  const { loading, client } = useAppInit();

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
      negative: {
        main: colors.negative,
      },
    },
  });

  return (
    <MuiThemeProvider theme={theme}>
      <ThemeProvider value={{ colors, design }}>
        <ErrorBoundary>
          <Head />
          {loading ? (
            <SplashScreen />
          ) : client?.status === 'error' ? (
            <ConfigurationError />
          ) : (
            <AppRoutes {...props} />
          )}
        </ErrorBoundary>
      </ThemeProvider>
    </MuiThemeProvider>
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
