import React, { useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import RedeemVoucherTypeSelector from './RedeemVoucherTypeSelector';
import ReedemVoucherScanPage from './ReedemVoucherScanPage';
import ReedemVoucherResultPage from './ReedemVoucherResultPage';
import ReedemVoucherInputPage from './ReedemVoucherInputPage';
import OutOfAppScreen from 'components/layout/OutOfAppScreen';

/* components */
export default function RedeemVoucherPage(props) {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);

  const pageProps = {
    ...props,
    setCode,
    setError,
    code,
    error,
  };

  const location = window.location;
  const { pathname } = location;
  const paths = pathname.split('/');

  return (
    <OutOfAppScreen onBack="/pos/" center={paths.length < 5}>
      <Switch>
        <Route path="/pos/redeem_voucher/input/">
          <ReedemVoucherInputPage {...pageProps} />
        </Route>
        <Route path="/pos/redeem_voucher/scan/">
          <ReedemVoucherScanPage {...pageProps} />
        </Route>
        <Route path="/pos/redeem_voucher/result/">
          <ReedemVoucherResultPage {...pageProps} />
        </Route>
        <Route path="/pos/redeem_voucher/" exact>
          <RedeemVoucherTypeSelector />
        </Route>
      </Switch>
    </OutOfAppScreen>
  );
}
