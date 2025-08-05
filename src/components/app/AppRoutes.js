import React, { Suspense } from 'react';
import { isEmpty } from 'lodash';
import { Route, Switch, useLocation } from 'react-router-dom';

import ErrorBoundary from 'components/error/ErrorBoundary';
import { parseUrl } from 'util/general';
import { SplashScreen } from 'components/rehive/SplashScreen';
import Spinner from 'components/outputs/Spinner';
import { useConfiguration } from 'components/contexts/ConfigurationContext';
// import config from '/screens/invoices/config/screen';
// import PublicStripeRedirectPage from './PublicStripeRedirectPage';

const PrivateRouter = React.lazy(() => import('./PrivateRouter'));
const PublicRouter = React.lazy(() => import('./PublicRouter'));

// const PublicReceivePage = React.lazy(() =>
//   import('screens/auth/public/PublicReceivePage'),
// );
const CheckoutContainer = React.lazy(() => import('screens/checkout'));
const SEP24InteractiveContainer = React.lazy(() =>
  import('screens/sep24interactive'),
);
const DocumentationContainer = React.lazy(() =>
  import('screens/documentation'),
);
const PublicResetPasswordPage = React.lazy(() =>
  import('screens/auth/public/ResetPasswordForm'),
);
const PublicVerifyEmailPage = React.lazy(() =>
  import('screens/auth/public/VerifyEmail'),
);
const DownloadLanguagePage = React.lazy(() =>
  import('screens/download_language'),
);

const DeleteAccountVerifyPage = React.lazy(() =>
  import('screens/delete_account/DeleteAccountVerify'),
);
const DeleteAccountPage = React.lazy(() =>
  import('screens/delete_account/DeleteAccount'),
);
const DeactivateAccountVerify = React.lazy(() =>
  import('screens/deactivate_account/DeactivateVerify.js'),
);

export default function AppRoutes(props) {
  const { company, user } = props;
  const location = useLocation();
  let { company: companyID } = parseUrl(location);
  const { loading: configLoading, companyDataLoading } = useConfiguration();

  const routerProps = {
    location,
    ...props,
  };
  const isPublic = Boolean(companyID || isEmpty(company) || !user);
  
  // Wait for company data to load before showing auth pages
  const shouldWaitForCompany = companyID && (configLoading || companyDataLoading);
  
  if (shouldWaitForCompany) {
    return <SplashScreen noLogo />;
  }
  

  return (
    <ErrorBoundary>
      <Suspense fallback={<SplashScreen noLogo />}>
        <Switch>
          <Route path="/documentation/">
            <DocumentationContainer />
          </Route>

          {/* <Route path="/receive/">
            <PublicReceivePage />
          </Route> */}

          <Route path="/email/">
            <PublicVerifyEmailPage />
          </Route>
          <Route path="/deactivate">
            <DeactivateAccountVerify />
          </Route>
          <Route path="/request-delete" exact>
            <DeleteAccountPage />
          </Route>
          <Route path="/request-delete/verify">
            <DeleteAccountVerifyPage />
          </Route>

          <Route path="/password/">
            <PublicResetPasswordPage />
          </Route>
          <Route path="/checkout/">
            <CheckoutContainer />
          </Route>
          <Route path="/sep24/">
            <SEP24InteractiveContainer {...routerProps} />
          </Route>
          <Route path="/publicLoadingPage/">
            <Spinner />
          </Route>
          <Route path="/download-en-json/">
            <DownloadLanguagePage />
          </Route>
          {/* <Route path="/publicStripeRedirectPage/">
            <PublicStripeRedirectPage />
          </Route> */}
          <Route path="/">
            {isPublic ? (
              <PublicRouter {...routerProps} />
            ) : (
              <PrivateRouter {...routerProps} />
            )}
          </Route>
        </Switch>
      </Suspense>
    </ErrorBoundary>
  );
}
