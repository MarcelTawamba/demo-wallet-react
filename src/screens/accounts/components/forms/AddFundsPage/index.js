import React, { useState, useEffect } from 'react';
import { get } from 'lodash';
import * as yup from 'yup';

import { Formik } from 'formik';
import { View } from 'components/layout/View';

import PageTitle from 'components/layout/page/PageTitle';
import PageButtons from 'components/layout/page/PageButtons';
import PaymentMethodSelector from './PaymentMethodSelector';
import PageContent from 'components/layout/page/PageContent';
import { getStripePaymentMethods } from 'util/rehive';
import ErrorOutput from 'components/outputs/Error';
import ResultPage from 'components/layout/page/ResultPage';
import AddFundsActions from './AddFundsActions';
import BankConfirm from './BankConfirm';
import PrepaidVoucherList from './PrepaidVoucherList';
import { Button } from 'components/inputs/Button';
import StripeCardConfirm from './StripeCardConfirm';

export default function AddFundsPage(props) {
  const {
    currency,
    initialValues,
    actionsConfig,
    onSuccess,
    handleStateChange,
  } = props;
  const prepaidConfig = get(actionsConfig, [
    'prepaid',
    'config',
    get(currency, ['currency', 'code']),
  ]);
  const { defaultProvider, providers = [] } = prepaidConfig;

  const hasCard = providers.includes('stripe_card');
  const hasBank = providers.includes('bank');
  const singleProvider = providers.length === 1;
  const showPaymentMethodSelector =
    !singleProvider || providers[0] === 'stripe_card';

  const defaultPayment = defaultProvider
    ? defaultProvider
    : providers.length
    ? providers[0]
    : '';
  const isCardDefaultPayment =
    (hasCard && defaultPayment === 'stripe_card') ||
    (singleProvider && providers[0] === 'stripe_card');

  const [state, setState] = useState('');

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(isCardDefaultPayment);
  const [cardPaymentMethods, setCardPaymentMethods] = useState([]);
  const [voucherCompany, setVoucherCompany] = useState(null);

  useEffect(() => {
    async function handleGetPaymentMethods() {
      const resp = await getStripePaymentMethods();
      if (resp && resp.status === 'success' && resp.data) {
        let { data } = resp;
        setCardPaymentMethods(data);
      } else {
        // onSuccess();
      }
      setLoading(false);
    }
    if (hasCard) {
      handleGetPaymentMethods();
    }
  }, [hasBank, hasCard, isCardDefaultPayment]);

  if (!hasCard && !hasBank) {
    return <ErrorOutput>This app has not set up adding funds</ErrorOutput>;
  }

  if (!currency) {
    return null;
  }

  const validationSchema = yup.object().shape({
    amount: yup
      .string()
      .required('Voucher is required'),
    paymentMethod: yup.string().required('Payment method is required'),
  });
  const defaultVoucher = get(prepaidConfig, ['fixed', 'default'], '');

  const formInitialValues = {
    amount: defaultVoucher,
    paymentMethod: defaultPayment,
    code: '',
    stripeId: get(cardPaymentMethods, [0, 'id'], ''),
    ...initialValues,
  };

  const sharedProps = {
    currency,
    setState,
    config: prepaidConfig,
    setLoading,
    setResult,
    loading,
    cardPaymentMethods,
    voucherCompany,
    onSuccess,
  };

  return (
    <Formik
      initialValues={formInitialValues}
      validationSchema={validationSchema}
      enableReinitialize={isCardDefaultPayment}
      isInitialValid={cardPaymentMethods.length && defaultVoucher}>
      {formikProps => (
        <>
          <PageTitle
            title={'Add funds'}
            handleBack={() => {
              setState('');
              setResult(null);
            }}
            back={Boolean(state)}
            actions={<AddFundsActions formikProps={formikProps} />}
          />
          <PageContent>
            {result ? (
              <ResultPage
                {...sharedProps}
                formikProps={formikProps}
                handleButtonPress={
                  result.status === 'success' || result.status === 'succeeded'
                    ? () => handleStateChange({ state: '' })
                    : () => {
                        setState('');
                        setResult(null);
                      }
                }
                result={result}
                text={
                  result.status === 'success' || result.status === 'succeeded'
                    ? 'Adding funds successful'
                    : 'Something went wrong'
                }
              />
            ) : state === 'confirm' ? (
              <AddFundsConfirm {...sharedProps} formikProps={formikProps} />
            ) : (
              <>
                <AddFundsInput
                  {...sharedProps}
                  formikProps={formikProps}
                  >
                  {showPaymentMethodSelector && (
                    <PaymentMethodSelector
                      loading={loading}
                      providers={providers}
                      changeText={
                        cardPaymentMethods.length > 1 || hasBank
                          ? 'Change'
                          : 'Add card'
                      }
                      {...sharedProps}
                      formikProps={formikProps}
                    />
                  )}
                </AddFundsInput>
              </>
            )}
          </PageContent>
        </>
      )}
    </Formik>
  );
}

function AddFundsInput(props) {
  const { formikProps, setState } = props;
  const paymentMethod = get(formikProps, ['values', 'paymentMethod']);

  switch (paymentMethod) {
    default:
      return (
        <>
          <PrepaidVoucherList {...props} />
          <Button
            wrapperStyle={{ marginBottom: 16, marginTop: 24, padding: 0 }}
            {...{
              children: 'CONTINUE',
              type: 'submit',
              wide: true,
              color: 'primary',
              size: 'large',
              disabled: !formikProps.isValid || formikProps.isSubmitting,
              loading: formikProps.isSubmitting,
              onPress: () => setState('confirm'),
            }}
          />
        </>
      );
  }
}

function AddFundsConfirm(props) {
  const { formikProps } = props;
  const paymentMethod = get(formikProps, ['values', 'paymentMethod']);

  switch (paymentMethod) {
    case 'card':
    case 'stripe_card':
      return <StripeCardConfirm {...props} />;
    default:
      return <BankConfirm {...props} />;
  }
}
