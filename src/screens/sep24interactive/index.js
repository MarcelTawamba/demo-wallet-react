import React, { useEffect, useState, useReducer } from 'react';
import { useQuery } from 'react-query';
import { connect } from 'react-redux';
import { get, keyBy } from 'lodash';
import { Providers, useRehiveContext } from 'contexts';
import { useHistory } from 'react-router-dom';
import { safeParams } from 'util/general';
import { currentSessionsSelector } from 'redux/auth/selectors';
import { onAuthSuccess } from 'redux/auth/actions';
import { userTierSelector } from 'screens/accounts/redux/selectors';
import { isAdmin } from 'util/general';
import { useSelector, useDispatch } from 'react-redux';
import { configAuthSelector } from 'redux/rehive/selectors';
import { setCompany, setTempCompany } from 'redux/auth/actions';

import LoginForm from './pages/loginValidation/LoginForm';
import TransactionForm from './pages/transactionFlow/TransactionForm';
import TransactionInfo from './pages/transactionFlow/TransactionInfo';
import defaultColors from 'config/config/defaults/colors.json';
import { createTheme } from '@material-ui/core/styles';
import PageContent from 'components/layout/page/PageContent';
import Layout from './components/Layout';
import { Button } from 'components/inputs/Button';
import { SplashScreen } from 'components/rehive/SplashScreen';
import Text from 'components/outputs/Text';
import RegisterPage from './pages/register';

import { useBusinessSettings } from 'hooks/businessAPI';
import Onboarding from 'screens/onboarding';

import {
  validateSep24SessionToken,
  getPublicCompany,
  initWithoutToken,
  initWithToken,
  getProfile,
  validateInternalSep24Session,
  getCompanyAppConfig,
  getStellarCompany,
} from 'util/rehive';

// Core state object
const state_init = {};
function createInitialState() {
  return {
    loading: false,
    company: null,
    testnet: false,
    tier_requirement: 0,
    sep10session: {
      token: null,
      session_id: null,
      validated: false,
    },
    sep24transaction: {
      identifier: null,
      type: null, // withdraw or deposit
    },
    isAuthed: false,
    error: null,
  };
}

// Functions to modify the state
function reducer(state, action) {
  if (action.type === 'set_loading') {
    return {
      ...state,
      loading: action.loading,
    };
  } else if (action.type === 'set_company') {
    return {
      ...state,
      company: action.company,
    };
  } else if (action.type === 'set_testnet') {
    return {
      ...state,
      testnet: action.testnet,
    };
  } else if (action.type === 'set_error') {
    return {
      ...state,
      error: action.error,
    };
  } else if (action.type === 'set_tier_requirement') {
    return {
      ...state,
      tier_requirement: action.data,
    };
  } else if (action.type === 'set_sep10session') {
    return {
      ...state,
      sep10session: action.data,
    };
  } else if (action.type === 'set_sep24transaction') {
    return {
      ...state,
      sep24transaction: action.data,
    };
  } else if (action.type === 'validate_session') {
    return {
      ...state,
      sep10session: { ...state.sep10session, validated: action.validated },
    };
  }
  throw Error('Unknown action.');
}

// Themeing
const colors = {
  ...defaultColors,
  // ...company?.config?.colors,
};

const theme = createTheme({
  palette: {
    primary: {
      main: colors.primary,
      contrastText: colors.primary_contrast,
    },
    secondary: {
      main: colors.secondary,
      contrastText: colors.secondary_contrast,
    },
    dummy: {
      main: colors.secondary,
      contrastText: colors.secondary_contrast,
    },
    font: {
      primary: '#434343',
      secondary: '#434343',
    },
    background: {
      main: '#ffffff', //colors.grey1,
      contrastText: '#434343',
    },
    positive: {
      main: '#4A5',
    },
    negative: {
      main: '#E43',
    },
  },
  typography: {
    h6: { lineHeight: 1.2, fontSize: 18, color: '#434343' },
    body1: { lineHeight: 1.4, color: '#434343' },
    body2: { lineHeight: 1.4, color: '#434343' },
    h5: { fontWeight: 500, color: '#434343', lineHeight: 1 },
    h3: {
      fontWeight: 500,
      color: '#434343',
      fontSize: '2.2rem',
    },
    h4: {
      color: '#434343',
      fontSize: '1.6rem',
      lineHeight: 1,
    },
    overline: {
      color: '#434343',
    },
    caption: {
      color: '#434343',
    },
    subtitle2: {
      opacity: 0.7,
      fontSize: '0.75rem',
      fontWeight: 300,
    },
  },
  shape: { borderRadius: 10 },
  breakpoints: {
    values: {
      xs: 480,
      sm: 736,
      md: 980,
      lg: 1280,
      xl: 1600,
    },
  },
  overrides: {
    MuiIconButton: {
      root: {
        padding: 8,
      },
    },
    MuiListItem: {
      root: {
        '&$selected': {
          backgroundColor: '#EEE',
        },
      },
    },
  },
  props: {
    MuiButton: {
      disableElevation: true,
    },
  },
});

export default function Sep24InteractiveContainer(props) {
  // Handle the URL params and pathing
  const history = useHistory();
  const { location } = history;
  let { search, pathname } = location;
  const params = new URLSearchParams(search);
  const paths = pathname.split('/');
  const sub_path = paths[3];
  let sep10_token = safeParams(params, 'token', '');
  let sep24_transaction_id = safeParams(params, 'transaction_id', '');
  const sep24Args = {
    token: sep10_token,
    transaction_id: sep24_transaction_id,
  };

  // Setup this components state and dispatchers
  const [state, dispatch] = useReducer(reducer, state_init, createInitialState);
  const globalDispatch = useDispatch();
  const [user, setUser] = useState();
  const [session, setSession] = useState();
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [tierLoading, setTierLoading] = useState(false);
  const [requiredTier, setRequiredTier] = useState(0);
  const tiers = useSelector(userTierSelector);
  const [tempAuth, setTempAuth] = useState({ user, token: '', mfa: '' });
  const { fetchData } = props;

  // Setup company state
  const isAuthed = state.isAuthed;
  const company = state.company;
  // Get company config to pass down
  const authConfig = useSelector(configAuthSelector);

  // Onboarding state and logic
  let isVerified = false;

  const { data: businessServiceSettings } = useBusinessSettings(company?.id);
  const isBusinessGroup = false;
  const isWidget = true;
  const successFunction = () => {
    window.location.reload();
  };
  const onboardingProps = {
    company,
    fetchData,
    isBusinessGroup,
    isWidget,
    successFunction,
  };

  // Component functions
  async function onRegisterSuccess(user, token) {
    initWithToken(token);
    setSession(token);
    globalDispatch(onAuthSuccess({ user: user, token }));
    await setUser(user);
    history.push(
      '/sep24/' +
        paths[2] +
        '/?token=' +
        sep10_token +
        '&transaction_id=' +
        sep24_transaction_id,
    );
  }

  // Component props
  const pageProps = {
    history,
    state,
    isAuthed,
    setUser,
    setSession,
    tempAuth,
    authConfig,
    setTempAuth,
    onRegisterSuccess,
    user,
    company,
    dispatch,
    sep24Args,
  };

  // Initial component load
  useEffect(() => {
    dispatch({
      type: 'set_loading',
      loading: true,
    });
    initWithoutToken();
    let testnet_check = false;
    // API calls
    async function fetchCompany() {
      const resp = await getPublicCompany(paths[2]);
      if (resp?.status === 'success') {
        await dispatch({
          type: 'set_company',
          company: resp?.data,
        });
        // Set testnet or not
        const services = keyBy(resp?.data?.services, 'slug');
        if (services.hasOwnProperty('stellar_testnet_service')) {
          testnet_check = true;
          await dispatch({
            type: 'set_testnet',
            testnet: true,
          });
        }
      }

      // Validate the initial session/SEP-10 token
      const stellar_company_resp = await getStellarCompany(testnet_check);
      if (stellar_company_resp?.data)
        await setRequiredTier(
          stellar_company_resp?.data?.anchor_tier_requirement,
        );

      const stellarResp = await validateSep24SessionToken(
        paths[2],
        sep10_token,
        testnet_check,
      );
      if (stellarResp?.status === 'success') {
        const sep10sessiondata = {
          session_id: stellarResp?.data?.session_id,
          validated: !stellarResp?.data?.requires_validation,
          onchain_identifier: stellarResp?.data?.onchain_identifier,
        };
        const sep24transaction = {
          identifier: stellarResp?.data?.transaction_id,
          type: stellarResp?.data?.tx_type,
        };
        dispatch({
          type: 'set_sep10session',
          data: sep10sessiondata,
        });
        dispatch({
          type: 'set_sep24transaction',
          data: sep24transaction,
        });
      } else {
        dispatch({
          type: 'set_error',
          error: 'sep10_session_invalid_error',
        });
      }
    }

    fetchCompany();

    const session_token = sessionStorage.getItem('sep24session');
    if (session_token !== null) {
      setSession(session_token);
      initWithToken(session_token);
    }

    dispatch({
      type: 'set_loading',
      loading: false,
    });
    // If there is a user object in session storage populate with it
    const session_user = sessionStorage.getItem('sep24user');
    if (session_user !== null) {
      setUser(session_user);
    }
  }, []);

  // Load user profile when logging in
  useEffect(() => {
    if (user && requiredTier !== null) {
      // When the user is updated store in session storage
      sessionStorage.setItem('sep24user', user);
      // Now get the required tier config
      // let ignore = false;
      setTierLoading(true);
      dispatch({
        type: 'set_loading',
        loading: true,
      });

      const userTier = get(tiers, ['items', 0, 'level']) || 0;
      isVerified = userTier >= requiredTier;
      setIsOnboarded(isVerified);

      setTierLoading(false);
      dispatch({
        type: 'set_loading',
        loading: false,
      });
      // return () => {
      //   ignore = true;
      // };
    }
  }, [user, requiredTier]);

  useEffect(() => {
    if (session) {
      // When the user is updated store in session storage
      sessionStorage.setItem('sep24session', session);
    }
  }, [session]);

  // API calls
  async function validateSession() {
    const resp = await validateInternalSep24Session(
      state.sep10session?.session_id,
      state.testnet,
    );
    if (resp?.status === 'success') {
      dispatch({
        type: 'validate_session',
        validated: true,
      });
    }
  }

  // Form button handlers
  async function confirmSession(event) {
    await validateSession();
    setUser(user);
    // window.location.reload();
  }

  function truncateAddress(address) {
    let truncated_text =
      address.substr(0, 12) + '.....' + address.substr(-12, 12);
    return truncated_text;
  }

  function renderError() {
    if (state.error === 'sep10_session_invalid_error') {
      return (
        <Text align={'center'}>
          Your session has expired. Please try again.
        </Text>
      );
    } else {
      return (
        <Text align={'center'}>An error has occured. Please try again</Text>
      );
    }
  }

  // Core content logic for component
  function renderContent() {
    if (sub_path === 'transaction') {
      if (user) {
        return <TransactionInfo {...pageProps} />;
      } else {
        return <LoginForm {...pageProps} setUser={setUser} />;
      }
    } else if (state.error) {
      return (
        <PageContent>
          {/* // TODO: seperate into standalone component*/}
          {renderError()}
          <p></p>
          <Button
            onClick={() => {
              window.close();
            }}
            color="primary"
            label="Return"
            wide>
            Return
          </Button>
        </PageContent>
      );
    } else if (sub_path === 'register' && state.company && authConfig) {
      return <RegisterPage {...pageProps} />;
    } else if (
      state.sep10session?.session_id &&
      !state.sep10session?.validated
    ) {
      if (!user) return <LoginForm {...pageProps} setUser={setUser} />;
      else {
        return (
          <>
            <PageContent>
              <Text align={'center'}>
                Please confirm that your Stellar Address is
                <h4>
                  {truncateAddress(state.sep10session?.onchain_identifier)}
                </h4>
              </Text>
              <Button
                onClick={confirmSession}
                color="primary"
                label="Confirm"
                wide>
                Confirm
              </Button>
            </PageContent>
          </>
        );
      }
    } else if (
      state.sep10session?.session_id &&
      state.sep10session?.validated
    ) {
      if (user) {
        // Check if the user needs to do onboarding else show the transaction flow
        if (isOnboarded && state.sep24transaction?.identifier) {
          return <TransactionForm {...pageProps} setUser={setUser} />;
        } else {
          return (
            <Onboarding
              style={{ width: '100%' }}
              {...{ ...onboardingProps, businessServiceSettings }}
            />
          );
        }
      } else {
        return <LoginForm {...pageProps} setUser={setUser} />;
      }
    }
  }

  function renderLayout() {
    if (state.loading || !state.company || tierLoading) {
      return <SplashScreen />;
    } else {
      return (
        <Layout style={{ width: '100%' }} {...pageProps}>
          <Providers style={{ width: '100%' }}>{renderContent()}</Providers>
        </Layout>
      );
    }
  }

  return <>{renderLayout()}</>;
}
