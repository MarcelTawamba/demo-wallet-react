import React, { Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { currentCompanySelector } from 'redux/auth/selectors';
import { SplashScreen } from 'components/rehive/SplashScreen';
import NewSalePage from './pages/NewSalePage';
import RedeemVoucherPage from './pages/RedeemVoucherPage';
import TopUpUserPage from './pages/TopUpUserPage';
import PrintQRPage from './pages/PrintQRPage';
import PointOfSalePage from './pages/PointOfSalePage';
import { useRehive } from 'hooks/rehive';
import { useBusiness } from 'contexts';

/* components */
export default function PointOfSaleScreen(props) {
  const company = useSelector(currentCompanySelector);
  const {
    context: { items: sellers },
    loading: loadingContext,
  } = useRehive('manager-sellers');
  const seller = sellers?.[0] ?? null;

  const { business } = useBusiness();

  const context = { seller, company, business };

  try {
    return (
      <Switch>
        <Suspense fallback={<SplashScreen />}>
          <Route component={PrintQRPage} path="/pos/qr/" />
          <Route component={NewSalePage} path="/pos/sales/" />
          {!!seller && (
            <Route
              render={routeProps => (
                <RedeemVoucherPage {...routeProps} context={context} />
              )}
              path="/pos/redeem_voucher/"
            />
          )}
          <Route component={TopUpUserPage} path="/pos/top_up/" />
          <Route
            render={routeProps => (
              <PointOfSalePage
                {...routeProps}
                context={context}
                loadingContext={loadingContext}
              />
            )}
            path="/pos/"
            exact
          />
        </Suspense>
      </Switch>
    );
  } catch (e) {
    document.location.reload();
    return null;
  }
}
