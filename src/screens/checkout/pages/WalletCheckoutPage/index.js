import React, { useState, useEffect } from 'react';
import Layout from 'screens/checkout/components/Layout';
import WalletCheckoutLogin from './WalletCheckoutLogin';
import WalletCheckoutScan from './WalletCheckoutScan';
import WalletCheckoutRequest from './WalletCheckoutRequest';
import CheckoutHeader from 'screens/checkout/components/CheckoutHeader';
import PaymentSuccess from 'screens/checkout/components/PaymentSuccess';
import ExpiredTimerQuote from 'screens/checkout/components/ExpiredTimerQuote';
import { currentSessionsSelector } from 'redux/auth/selectors';
import { useSelector } from 'react-redux';
import { initWithoutToken, initWithToken } from 'util/rehive';

export default function WalletCheckoutPage(props) {
  const { context, company } = props;
  const { wallet_method } = context;
  const [initiated, setInitiated] = useState(false);

  const { invoice } = context;
  const { request_currency, payment_processor_quotes } = invoice;

  const [quotes, setQuotes] = useState(payment_processor_quotes);
  const [currencyCode, setCurrencyCode] = useState(request_currency?.code);

  const quote =
    quotes.find(
      item =>
        item?.payment_processor?.unique_string_name ===
          (wallet_method === 'request' ? 'native_otp' : 'native') &&
        item?.status.match(/pending|processing/) &&
        item?.currency?.code === currencyCode,
    ) ?? null;

  const [expired, setExpired] = useState(quote?.status === 'expired');

  const sessions = useSelector(currentSessionsSelector);
  const userID = context?.invoice?.payer_user?.id;
  const initialAuth = sessions?.items?.[company?.id]?.[userID];
  const [user, setUser] = useState();

  async function init() {
    initWithoutToken();
    await initWithToken(initialAuth?.token);
    setUser(initialAuth?.user);
  }

  useEffect(() => {
    if (initialAuth?.token) {
      init();
    }
  }, [initialAuth]);

  const hooks = {
    currencyCode,
    setCurrencyCode,
    quotes,
    setQuotes,
    initiated,
    setInitiated,
    quote,
    expired,
    setExpired,
    user,
    setUser,
  };

  const isAuthed = Boolean(user?.id);

  const Content =
    wallet_method === 'scan' ? (
      <WalletCheckoutScan {...props} setInitiated={setInitiated} />
    ) : wallet_method === 'request' ? (
      <WalletCheckoutRequest {...props} {...hooks} />
    ) : (
      <WalletCheckoutLogin {...props} {...hooks} isAuthed={isAuthed} />
    );

  return (
    <Layout
      {...props}
      headerRight={isAuthed && <ExpiredTimerQuote {...props} {...hooks} />}>
      {initiated ? (
        <PaymentSuccess {...props} initiated />
      ) : (
        <>
          <CheckoutHeader {...props} quote={quote} pb={1} />
          {Content}
        </>
      )}
    </Layout>
  );
}
