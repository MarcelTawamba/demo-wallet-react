import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { useMachine } from '@xstate/react';
import { get } from 'lodash';
import { useHistory } from 'react-router-dom';
import {
  companiesSelector,
  currentSessionsSelector,
} from 'redux/auth/selectors';
import { configAuthSelector } from 'redux/rehive/selectors';

import Landing from './components/Landing';

import MfaVerifyPage from './components/MfaVerifyPage';
import VerifyEmail from './components/VerifyEmail';

import { useConfiguration } from 'components/contexts/ConfigurationContext';
import { useToast } from 'components/contexts/ToastContext';
import AuthForm from 'components/layout/AuthForm';
import Spinner from 'components/outputs/Spinner';
import VerifyMobile from './components/VerifyMobile';
import AuthHeader from './components/AuthHeader';
import CompanyPage from './components/CompanyPage';

import authMachine, {
  LANDING,
  LOGIN,
  REGISTER,
  FORGOT,
  COMPANY,
  EMAIL_VERIFY,
  MFA_SET,
  MFA_VERIFY,
  BACK,
  ABOUT,
  SUCCESS,
  MOBILE_VERIFY,
  DISCLAIMER,
  AUTH_SUCCESS,
  PRE_AUTH_SLIDES,
  POST_AUTH_SLIDES,
  GROUP,
  BUSINESS,
  SELLER,
} from './config/authMachine';
import AboutPage from './components/AboutPage';
import DisclaimerPage from './components/DisclaimerPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import BusinessCreatePage from './components/BusinessCreatePage';
import SellerEnablePage from './components/SellerEnablePage';
import AuthSuccess from './components/AuthSuccess';
import PreAuthSlidesPage from './components/PreAuthSlidesPage';
import PostAuthSlidesPage from './components/PostAuthSlidesPage';
import { paramsToObj, parseUrl } from 'util/general';
import GroupPage from './components/GroupPage';
import { removeAuthSession } from 'redux/auth/actions';
import { getPublicCompanyGroup, initWithoutToken } from 'util/rehive';
import AuthFooter from './components/AuthFooter';
import Disclaimer from './components/Disclaimer';
import MfaSetPage from './components/MfaSetPage';
import Toast from 'components/outputs/Toast';

const AuthPageConfig = {
  [COMPANY]: { title: 'Start with an App ID', id: 'company_title' },
  [LOGIN]: { title: 'Login', id: 'login_title' },
  [REGISTER]: { title: 'Register', id: 'register_title' },
  [GROUP]: { title: 'Select your account type', id: 'group_title' },
  [FORGOT]: { title: 'Reset password', id: 'forgot_password_title' },
  [MFA_VERIFY]: {
    title: 'Multi-factor authentication',
    id: 'mfa',
  },
  [MFA_SET]: { title: 'Multi-factor authentication', id: 'mfa' },
  [MOBILE_VERIFY]: { title: 'Verify mobile', id: 'mobile_verify_title' },
  [EMAIL_VERIFY]: { title: 'Verify email', id: 'verifying_email' },
  [LANDING]: { title: 'Welcome', id: 'landing_title' },
  [DISCLAIMER]: { title: 'Disclaimer', id: 'disclaimer_title' },
  [ABOUT]: { title: 'About', id: 'about' },
  [BUSINESS]: { title: 'Register business', id: 'register_business' },
  [SELLER]: { title: 'Apply to be a seller?', id: 'seller_title' },
};

const AuthContainer = props => {
  const [current, send] = useMachine(authMachine);
  const formState = get(current, 'value');

  const { location, user } = props;
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  let { config: client } = useConfiguration();

  const dispatch = useDispatch();

  let { user: userUrl, email, company: companyUrl, page } = parseUrl(location);
  let query = paramsToObj(location?.search);
  const history = useHistory();

  const authConfig = useSelector(configAuthSelector);
  const companies = useSelector(companiesSelector);

  const { currentCompanyID, tempCompanyID, tempCompany, recent } = companies;
  let {
    items: currentSessions,
    token,
    user: sessionUser,
  } = useSelector(currentSessionsSelector);

  const [tempAuth, setTempAuth] = useState({ user, token, mfa: '' });
  const companyID = client.company
    ? client.company
    : companyUrl === 'company'
    ? ''
    : companyUrl
    ? companyUrl
    : tempCompanyID
    ? tempCompanyID
    : currentCompanyID;

  const userId =
    !userUrl && sessionUser
      ? get(sessionUser, 'id')
      : userUrl
      ? userUrl
      : user && !companyUrl
      ? user.id
      : '';

  let company = client.company
    ? client
    : tempCompany && tempCompanyID === companyID
    ? tempCompany
    : companyUrl && recent[companyUrl]
    ? recent[companyUrl]
    : recent[companyID]
    ? recent[companyID]
    : null;

  function handleState() {
    if (companyID && get(company, 'id', '') === companyID) {
      switch (page) {
        case 'login':
          send(LOGIN);
          break;
        case 'register':
          send(REGISTER);
          break;
        case 'forgot':
          send(FORGOT);
          break;
        case 'company':
          send(COMPANY);
          break;
        default:
          send(LANDING);
          break;
      }
    } else {
      if (companyID) {
        send(LANDING);
      } else {
        send(COMPANY);
      }
    }
    setLoading(false);
  }

  function handleTokenFail() {
    initWithoutToken();
    if (token) {
      dispatch(removeAuthSession(companyID, userId));
      if (token) {
        // showToast({
        //   text: 'Existing login no longer valid. Please log in again.',
        //   variant: 'warning',
        // });
      }
    }
    setLoading(false);
    // resetAuth();
    handleState();
  }

  useEffect(() => {
    handleState();
    // initAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyUrl, userUrl]);

  function onSuccess() {
    send(SUCCESS);
    setLoading(true);
  }

  function onBack() {
    send(BACK);
  }

  function onAbout() {
    send(ABOUT);
  }

  function onGroup() {
    send(GROUP);
  }

  const pageProps = {
    authConfig,
    companyID,
    loading,
    companies,
    current,
    send,
    setTempAuth,
    companyUrl,
    tempAuth,
    formState,
    onSuccess,
    onBack,
    showToast,
    onAbout,
    onGroup,
    initialUser: get(tempAuth, 'user'),
    company,
    setLoading,
    email,
    ...props,
  };
  async function handleGetGroups() {
    if (company.id) {
      const response = await getPublicCompanyGroup(company.id, query?.group);
      if (response && response.status === 'success') {
        send(REGISTER);
        renderRouter();
      } else {
        history.replace(location.pathname);
      }
    }
  }
  if (query?.group) {
    handleGetGroups();
  }
  function renderRouter() {
    return (
      <Switch>
        {!client.company && (
          <Route path="/company/">
            <CompanyPage {...pageProps} />
          </Route>
        )}
        <Route path="/">
          <AuthRoutes {...pageProps} />
        </Route>
      </Switch>
    );
  }

  const formProps = { formState, loading, companies, company };

  return (
    <React.Fragment>
      {formState.match(PRE_AUTH_SLIDES || POST_AUTH_SLIDES) ? (
        renderRouter()
      ) : (
        <AuthForm
          banner={(company?.mode ?? '')?.match(/test|suspended/)}
          header={<AuthHeader {...pageProps} {...formProps} />}
          footer={<AuthFooter {...pageProps} {...formProps} />}
          pageFooter={
            !formState.match(COMPANY) && <Disclaimer company={company} />
          }
          titleId={loading ? '' : get(AuthPageConfig, [formState, 'id'])}>
          <React.Fragment>
            {loading && (
              <div
                style={{
                  width: '100%',
                  alignItems: 'center',
                  display: 'flex',
                }}>
                <Spinner />
              </div>
            )}
            {renderRouter()}
          </React.Fragment>
        </AuthForm>
      )}
    </React.Fragment>
  );
};

export default AuthContainer;

function AuthRoutes(props) {
  const { formState, send, authConfig, companies } = props;

  switch (formState) {
    case ABOUT:
      return <AboutPage {...props} />;
    case DISCLAIMER:
      return <DisclaimerPage {...props} />;
    case COMPANY:
      return <CompanyPage {...props} />;
    case LOGIN:
      return (
        <LoginPage
          {...props}
          onForgot={() => send(FORGOT)}
          onRegister={() => send(REGISTER)}
        />
      );
    case GROUP:
      return <GroupPage {...props} onSuccess={() => send(SUCCESS)} />;
    case REGISTER:
      return (
        <RegisterPage
          {...props}
          {...AuthPageConfig}
          onForgot={() => send(FORGOT)}
          onLogin={() => send(LOGIN)}
        />
      );
    case FORGOT:
      return <ForgotPasswordPage {...props} />;
    case MFA_VERIFY:
      return <MfaVerifyPage {...props} />;
    case MFA_SET:
      return <MfaSetPage {...props} />;
    case EMAIL_VERIFY:
      return <VerifyEmail {...props} />;
    case AUTH_SUCCESS:
      return <AuthSuccess {...props} />;
    case MOBILE_VERIFY:
      return <VerifyMobile {...props} />;
    case PRE_AUTH_SLIDES:
      return <PreAuthSlidesPage {...props} />;
    case BUSINESS:
      return (
        <BusinessCreatePage
          {...props}
          onSuccess={() => send(SUCCESS)}
          onBack={() => send(BACK)}
        />
      );
    case SELLER:
      return (
        <SellerEnablePage
          {...props}
          onSuccess={() => send(SUCCESS)}
          onBack={() => send(BACK)}
        />
      );
    case POST_AUTH_SLIDES:
      return <PostAuthSlidesPage {...props} />;

    case LANDING:
    default:
      return (
        <Landing
          {...props}
          onLogin={() => send(LOGIN)}
          onRegister={() => send(REGISTER)}
          authConfig={authConfig}
          currentCompany={companies.currentCompany}
        />
      );
  }
}
