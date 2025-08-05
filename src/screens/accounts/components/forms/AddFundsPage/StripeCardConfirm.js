import React, { useState, useEffect } from 'react';
import makeStyles from '@material-ui/styles/makeStyles';

import Text from 'components/outputs/Text';
import ConfirmPage from 'components/layout/page/ConfirmPage';
import { formatAmountString } from 'util/general';
import { makeStripePayment, getStripePayment } from 'util/rehive';

import { useConfiguration } from 'components/contexts/ConfigurationContext';
import { get } from 'lodash';
import { PaymentMethodSelectorCard } from './PaymentMethodSelector';
import Spinner from 'components/outputs/Spinner';

export default function StripeCardConfirm(props) {
  const {
    formikProps,
    config,
    currency,
    setResult,
    cardPaymentMethods,
  } = props;
  const [payment, setPayment] = useState(null);
  const { values, setSubmitting } = formikProps;
  const { amount, stripeId } = values;
  const currencyCode = get(currency, ['currency', 'code']);
  let { config: client } = useConfiguration();

  const amountValue = get(config, ['fixed', 'options', amount, 'amount'], 0);

  const amountString = formatAmountString(
    amountValue,
    get(currency, ['currency']),
    true,
  );

  async function handleConfirm() {
    setSubmitting(true);
    const data = {
      currency: currencyCode,
      amount: amountValue,
      payment_method: stripeId,
      return_url: client.url + '/publicLoadingPage/',
    };
    const resp = await makeStripePayment(data);
    if (resp.status === 'success') {
      setPayment(get(resp, ['data']));
    } else {
      setResult({ status: 'failed' });
    }

    setSubmitting(false);
  }

  if (payment) {
    return <StripeCardConfirmProcessing payment={payment} {...props} />;
  }

  return (
    <ConfirmPage
      hideBack
      onConfirm={handleConfirm}
      formikProps={formikProps}
      textComp={
        <Text align={'center'}>
          {'You are about to fund '}
          <Text color="primary" bold component="span" display="inline">
            {amountString}
          </Text>
          {' with the following card '}
        </Text>
      }>
      <>
        <div style={{ paddingBottom: 16, paddingTop: 16 }}>
          <PaymentMethodSelectorCard
            item={cardPaymentMethods.find(item => item.id === stripeId)}
          />
        </div>
      </>
    </ConfirmPage>
  );
}

const StripeCardConfirmProcessing = props => {
  const { setResult, payment, onSuccess } = props;
  const [attempts, setAttempts] = useState(1);
  const [loadCount, setLoadCount] = useState(0);
  const [loadStartCount, setLoadStartCount] = useState(0);
  // const [resetTimer, setLoadCount] = useState(0);

  const classes = useStyles(props);

  useEffect(() => {
    let timer = null;
    async function fetchData() {
      const resp = await getStripePayment(payment.id);

      if (resp.data.status === 'processing') {
        timer = setTimeout(() => {
          setAttempts(attempts + 1);
        }, 1000);
      } else if (resp.data.status === 'succeeded') {
        onSuccess();
        setResult({ status: 'success' });
      } else {
        let message = get(resp, ['data', 'error'], '');
        if (message) {
          if (message.includes('failed authentication')) {
            message = '3D Secure authentication failed';
          }
        }
        setResult({ status: 'failed', message });
      }
    }
    if (payment && payment.id && attempts < 60) {
      fetchData();
    } else {
      setResult({ status: 'failed', message: 'Timed out...' });
    }

    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payment, attempts]);

  const redirectUrl = get(payment, ['next_action', 'redirect_to_url', 'url']);

  return (
    <>
      {(loadCount !== 1 || loadStartCount === 2) && (
        <div className={classes.processing}>
          <Spinner />
          <div h={16} />
          <Text p={2} align="center">
            {'Processing payment... (0:' + (60 - attempts).toString() + ')'}
          </Text>
        </div>
      )}
      {Boolean(redirectUrl) && loadCount < 2 && (
        <div style={{ height: loadCount === 0 ? 0 : 400, width: '100%' }}>
          {loadCount === 1 && loadStartCount < 2 && (
            <Text p={1} align="center">
              {'Please complete 3D secure... (0:' +
                (60 - attempts).toString() +
                ')'}
            </Text>
          )}
          <div style={{ height: 16 }} />
          <iframe
            onLoad={() => {
              // if (loadCount === 0) setReset(true);
              setLoadCount(loadCount + 1);
            }}
            onLoadStart={event => setLoadStartCount(loadStartCount + 1)}
            id="stripe-3d-secure-iframe"
            frameBorder="0"
            width="100%"
            height={'100%'}
            src={redirectUrl}
            sandbox="allow-scripts allow-forms allow-same-origin allow-popups"
            title="Stripe 3D secure"
          />
        </div>
      )}
    </>
  );
};

const useStyles = makeStyles(theme => ({
  processing: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(2),
    width: '100%',
  },
  stripe3dSecure: {
    // display: 'flex',
    // flexDirection: 'column',
    // alignItems: 'center',
    height: 500,
    padding: theme.spacing(2),
    width: '100%',
  },
  pendingList: {
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(1.5),
    width: '100%',
  },
  pendingListItem: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(0.5),
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pendingListItemName: {
    paddingTop: theme.spacing(1),
    width: '100%',
  },
  pendingListItemDate: {
    paddingTop: theme.spacing(0.25),
    opacity: 0.67,
  },
}));
