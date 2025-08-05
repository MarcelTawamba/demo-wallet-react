import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { View } from 'components/layout/View';
import { fetchOrders } from 'screens/products/redux/actions';
import { makeStyles } from '@material-ui/styles';
import { useQueryClient, useQuery } from 'react-query';
import Cart from '../cart/CartNew';
import CheckoutRequired from './CheckoutRequired';
import IconLabelButton from 'components/inputs/IconLabelButtonNew';
import ScreenHeader from 'components/layout/ScreenHeader';
import { useCart } from 'screens/products/util/contexts/CartContext';
import { useDispatch } from 'react-redux';
import { fetchAccounts } from 'screens/accounts/redux/actions';
import Stepper from 'components/layout/Stepper';
import Layout from 'components/layout/LayoutNew';
import OrderSummary from './OrderSummary';
import CheckoutModal from './CheckoutModal';
import CheckoutResult from './CheckoutResult';
import CheckoutPending from './CheckoutPending';
import { walletsSelector } from 'screens/accounts/redux/selectors';
import { useHistory } from 'react-router-dom';
import { createOrderPayment, updateOrder } from 'util/rehive';
import { paramsToObj, objectToArray } from 'util/general';
import { getOrderPayment } from 'util/rehive';
import { fetchVouchers } from '../../redux/actions';

export default function CheckoutPage(props) {
  const [orderData, setOrderData] = useState({});
  const [step, setStep] = useState('cart');
  const [result, setResult] = useState();

  const wallets = useSelector(walletsSelector);

  const history = useHistory();
  const cartContext = useCart();
  const queryClient = useQueryClient();

  const classes = useStyles();
  const dispatch = useDispatch();
  const { cart, items, resetCart } = cartContext;

  const currencyCode = paramsToObj(history?.location?.search ?? '')?.currency;

  const {
    requires_billing_address,
    requires_contact_email,
    requires_contact_mobile,
    requires_shipping_address,
    currency,
    total_price,
  } = cart;

  const showRequired =
    requires_billing_address ||
    requires_contact_email ||
    requires_contact_mobile ||
    requires_shipping_address;

  const primaryAccount = objectToArray(wallets?.accounts ?? {})?.find(
    x => x.primary,
  );

  const insufficientFunds =
    total_price >
    (primaryAccount?.currencies?.[currency?.code]?.available_balance ?? 0);

  let steps = [{ id: 'cart' }];
  if (showRequired) steps.push({ id: 'details', disabled: insufficientFunds });
  steps.push({ id: 'checkout', disabled: insufficientFunds });

  const stepIndex = steps.findIndex(item => (item?.id ?? item) === step);
  const stepperProps = { steps, step, setStep };

  async function handleConfirm() {
    await updateOrder(cart?.id, orderData);

    let result = { currency, items };

    const response = await createOrderPayment(cart?.id);

    handleSuccess({ ...response?.data, ...result });
  }

  function handleSuccess(resp) {
    if (resp?.status === 'pending') {
      setPaymentId(resp?.id);
      setResult(resp);
      setStep('pending');
    } else if (resp?.status === 'complete') {
      setResult({ ...result, ...resp });
      queryClient.invalidateQueries('products');
      setStep('result');
      dispatch(fetchAccounts());
      if (result?.items?.findIndex(item => item?.voucher_schema) !== -1)
        dispatch(fetchVouchers());
      resetCart();
    }
  }

  function handleFailed({ path }) {
    setStep('result');
  }

  function handleNext() {
    const nextStep = steps[stepIndex + 1];
    setStep(nextStep?.id ?? nextStep);
  }

  function handleBack() {
    if (stepIndex === 0) handleDismiss();
    else {
      const previousStep = steps[stepIndex - 1];

      if (result?.status === 'complete') resetCart();
      setResult(null);
      setStep(previousStep?.id ?? previousStep ?? 'cart');
    }
  }

  function handleComplete({ path }) {
    if (path) history.push(path);
    resetCart();
  }

  const [paymentId, setPaymentId] = useState('');

  const { data } = useQuery(
    ['orderPayment', cart.id, paymentId],
    () => getOrderPayment(cart.id, paymentId),
    {
      enabled: step === 'pending' && !!paymentId,
      refetchInterval: 1000,
    },
  );

  function handleDismiss() {
    if (!result) setStep('cart');
    history.push('/products/');
  }

  useEffect(() => {
    if (data?.status === 'complete') handleSuccess(data);
    else if (data?.status === 'failed') handleFailed(data);
  }, [data]);

  return (
    <Layout
      content={
        <div className={classes.content}>
          <div className={classes.contentMain}>
            {step === 'details' ||
            (step === 'checkout' && steps.includes('details')) ? (
              <CheckoutRequired
                {...cartContext}
                orderData={orderData}
                setOrderData={setOrderData}
                onCancel={handleBack}
                onSuccess={() => setStep('checkout')}
              />
            ) : (
              <Cart {...cartContext} />
            )}
            <CheckoutModal
              open={step === 'checkout' && !result}
              cartContext={cartContext}
              onDismiss={handleBack}
              onConfirm={handleConfirm}
            />
            <CheckoutPending open={step === 'pending'} onDismiss={handleBack} />
            <CheckoutResult
              open={step === 'result' && !!result}
              result={result}
              onDismiss={handleDismiss}
              onSuccess={handleComplete}
              handleBack={handleBack}
            />
          </div>

          <div className={classes.contentSide}>
            <OrderSummary
              step={step}
              steps={steps}
              onSuccess={handleNext}
              orderData={orderData}
            />
          </div>
        </div>
      }
      header={
        <ScreenHeader
          onBack={handleBack}
          modalVisible
          title="cart"
          extra={
            <View fD={'row'} aI={'center'} w={'100%'} jC={'space-between'}>
              <IconLabelButton
                label="back"
                onPress={() =>
                  history?.push(
                    `/products/${
                      currencyCode ? `?currency=${currencyCode}` : ''
                    }`,
                  )
                }
              />
              <Stepper {...stepperProps} />
            </View>
          }
        />
      }
    />
  );
}

const useStyles = makeStyles(theme => ({
  content: {
    height: '100%',
    flexDirection: 'row',
    display: 'flex',
  },
  contentMain: {
    backgroundColor: '#FAFBFC',
    borderRadius: 4,
    width: '100%',
    height: 'fit-content',
    marginTop: theme.spacing(3),
  },
  contentSide: {
    marginLeft: theme.spacing(3),
    marginTop: theme.spacing(3),
    backgroundColor: '#FAFBFC',
    borderRadius: 4,
    minWidth: 274,
    maxWidth: 274,
    height: 'fit-content',
    width: '100%',
  },
}));
