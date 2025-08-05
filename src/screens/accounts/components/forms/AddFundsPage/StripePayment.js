import React, { useState, useRef, useEffect } from 'react';
import { get } from 'lodash';
import { Elements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import { setupStripeSession, getStripeCompany } from 'util/rehive';

import { useConfiguration } from 'components/contexts/ConfigurationContext';
import Spinner from 'components/outputs/Spinner';
import ErrorOutput from 'components/outputs/Error';
import PageButtons from 'components/layout/page/PageButtons';

const getCurrencyDetails = currency => {
  const accountRef = get(currency, ['account']);
  const accountName = get(currency, ['account_name']);
  const currencyCode = get(currency, ['currency', 'code']);
  return { accountRef, currencyCode, accountName };
};

const StripePayment = props => {
  const { currency } = props;
  const { accountName, currencyCode } = getCurrencyDetails(currency);
  let stripePromise = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  let { config: client } = useConfiguration();

  useEffect(() => {
    async function initStripe() {
      const resp = await getStripeCompany();
      const stripeId = get(resp, ['data', 'stripe_publishable_api_key']);
      if (stripeId) {
        stripePromise.current = loadStripe(stripeId);
      } else {
        setError('Unable to connect to Stripe, please try again later');
      }
      setLoading(false);
    }
    initStripe();
  }, []);

  const success_url =
    client.url +
    '/accounts/' +
    accountName +
    '/' +
    currencyCode +
    '/prepaid/success';
  const cancel_url =
    client.url +
    '/accounts/' +
    accountName +
    '/' +
    currencyCode +
    '/prepaid/fail';
  const redirectProps = { success_url, cancel_url };

  return loading ? (
    <Spinner />
  ) : error || !stripePromise.current ? (
    <ErrorOutput pb={2}>
      {!stripePromise.current
        ? 'Unable to connect to Stripe, please try again later'
        : error}
    </ErrorOutput>
  ) : (
    <Elements stripe={stripePromise.current}>
      <CardField redirectProps={redirectProps} />
    </Elements>
  );
};

export default StripePayment;

const CardField = props => {
  const stripe = useStripe();
  const { redirectProps } = props;
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleNewCard() {
    setLoading(true);
    const temp = await setupStripeSession(redirectProps);
    try {
      await stripe.redirectToCheckout({
        sessionId: get(temp, ['data', 'id']),
      });
    } catch (e) {
      setError('Unable to connect to Stripe, please try again later');
    }
    setLoading(false);
  }

  return (
    <div>
      {error ? (
        <ErrorOutput pb={2}>{error}</ErrorOutput>
      ) : (
        <PageButtons
          layout="material"
          items={[
            {
              label: 'Add new card',
              onPress: handleNewCard,
              variant: 'text',
              loading,
              disabled: loading,
            },
          ]}
        />
      )}
    </div>
  );
};
