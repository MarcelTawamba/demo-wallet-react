import React, { useState } from 'react';

import { Route, Switch, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CustomSalePage from './CustomSalePage';
import SalePaymentMethodSelector from './SalePaymentMethodSelector';
import SaleQRPage from './SaleQRPage';
import ProductsSalePage from './ProductsSalePage';
import { conversionRatesSelector } from 'screens/accounts/redux/selectors';
import { currentCompanyServicesSelector } from 'redux/auth/selectors';
import OutOfAppScreen from 'components/layout/OutOfAppScreen';
import { useToast } from 'components/contexts/ToastContext';
import { useBusiness } from 'contexts';

export default function NewSalePage(props) {
  const { business } = useBusiness();
  const services = useSelector(currentCompanyServicesSelector);
  const rates = useSelector(conversionRatesSelector);

  const { currency } = business;

  const { showToast } = useToast();

  const [items, setItems] = useState({});
  const [item, setItem] = useState(null);

  const history = useHistory();

  if (!currency) {
    return null;
  }
  const location = window.location;
  const { pathname } = location;
  const paths = pathname.split('/');
  const isSaleDetail = Boolean(paths.length > 4);

  const context = { business, currency };

  const pageProps = {
    context,
    currency: { currency },
    items,
    setItems,
    business,
    services,
    rates,
    item,
    setItem,
    history,
    showToast,
  };

  return (
    <OutOfAppScreen
      onBack={isSaleDetail ? '/pos/sales/' : '/accounts/'}
      backLabel={isSaleDetail ? 'back_to_new_sale' : 'back_to_wallet'}>
      <Switch>
        <Route path="/pos/sales/qr/">
          <SaleQRPage {...pageProps} />
        </Route>
        <Route path="/pos/sales/products/">
          <ProductsSalePage {...pageProps} />
        </Route>
        <Route
          component={SalePaymentMethodSelector}
          path="/pos/sales/payment_method/"
        />
        <Route path="/pos/sales/">
          <CustomSalePage {...pageProps} />
        </Route>
        {/* <Route path="/sales/">
          <SaleTypeSelector {...pageProps} />
        </Route> */}
      </Switch>
    </OutOfAppScreen>
  );
}
