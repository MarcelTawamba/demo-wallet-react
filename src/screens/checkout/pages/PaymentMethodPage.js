import React, { useState, useEffect } from 'react';

import { get } from 'lodash';
import { choosePaymentRequestMethod } from 'screens/checkout/util/rehive';
import { getProfile } from 'util/rehive';
import Form from 'components/form';
import Inputs from '../components/inputs';
import { useForm } from 'react-hook-form';
import Layout from '../components/Layout';
import CheckoutHeader from '../components/CheckoutHeader';
import { configCheckoutSelector } from 'redux/rehive/selectors';
import { useSelector } from 'react-redux';

const defaultValues = {
  payment_method: 'native',
  wallet_method: 'scan',
};

const formConfig = (values, availableProcessors = [], invoiceHasPayerInfo = false) => {
  // Helper function to check if processor needs currency selection
  const processorNeedsCurrencySelection = (paymentMethod) => {
    const processor = availableProcessors.find(p => p?.unique_string_name === paymentMethod);
    return processor && processor.currencies.length > 1;
  };

  // Helper function to check if processor is crypto type
  const processorIsCrypto = (paymentMethod) => {
    const processor = availableProcessors.find(p => p?.unique_string_name === paymentMethod);
    return processor && processor.type === 'crypto';
  };

  // Helper function to check if we need payer info for non-login flows
  const needsPayerInfo = (paymentMethod, wallet_method) => {
    // For native login flows, don't show fields (collected automatically)
    if (paymentMethod === 'native' && wallet_method === 'login') {
      return false;
    }
    // For crypto payments without invoice payer info, show fields
    if (processorIsCrypto(paymentMethod) && !invoiceHasPayerInfo) {
      return true;
    }
    // For native OTP, always show mobile
    if (paymentMethod === 'native' && wallet_method === 'request') {
      return true;
    }
    return false;
  };

  let fields = [
    {
      id: 'payment_method',
    },
    {
      id: 'payment_processor_currency',
      condition: ({ payment_method }) => processorNeedsCurrencySelection(payment_method)
    },
    {
      id: 'wallet_method',
      condition: ({ payment_method }) => payment_method === 'native',
    },
    {
      id: 'contact_method',
      condition: ({ payment_method, wallet_method }) =>
        needsPayerInfo(payment_method, wallet_method) && processorIsCrypto(payment_method),
    },
    {
      id: 'mobile',
      condition: ({ payment_method, wallet_method }) =>
        payment_method === 'native' && wallet_method === 'request',
    },
  ];

  return {
    title: '',
    inputComponents: Inputs,
    defaultValues: { ...defaultValues, ...values },
    submitLabel: 'NEXT',
    fields,
  };
};

function mapInitialPaymentMethod(invoice, configCheckout) {
  const {
    available_payment_processors = [],
    primary_payment_processor,
  } = invoice;
  const { defaultPaymentMethod = 'native' } = configCheckout;
  return {
    payment_method:
      (primary_payment_processor?.unique_string_name === 'native_otp'
        ? 'native'
        : primary_payment_processor?.unique_string_name) ??
      (available_payment_processors?.findIndex(
        item => item.unique_string_name === defaultPaymentMethod,
      ) !== -1
        ? defaultPaymentMethod
        : available_payment_processors?.[
            available_payment_processors?.length - 1
          ]?.unique_string_name ?? 'native_bitcoin'),
    wallet_method: 'scan',
  };
}

// const

export default function PaymentMethodPage(props) {
  const { send, context, company } = props;
  const { invoice, items } = context;
  const [isSubmitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const configCheckout = useSelector(configCheckoutSelector);

  const {
    payment_processor_quotes: quotes,
    metadata,
    request_currency: currency,
    payer_email: email = '',
    payer_mobile_number: mobile = '',
    id,
    available_payment_processors = []
  } = invoice;
  const invoiceEmail = email;
  const invoiceMobile = mobile;

  // State to hold user profile data
  const [userEmail, setUserEmail] = useState('');
  const [userMobile, setUserMobile] = useState('');

  // Check if invoice has payer info
  const invoiceHasPayerInfo = !!(invoice?.payer_user || invoice?.payer_email || invoice?.payer_mobile_number);
  
  const formConfigObj = formConfig({ email, mobile }, available_payment_processors, invoiceHasPayerInfo);
  let { defaultValues } = formConfigObj;
  defaultValues.email = email;
  defaultValues = {
    ...defaultValues,
    ...mapInitialPaymentMethod(invoice, configCheckout),
  };

  const formMethods = useForm({
    defaultValues,
    mode: 'onChange',
    // reValidateMode: 'onChange',
  });
  const { handleSubmit, watch, setError, clearErrors, setValue } = formMethods;
  const values = watch();
  const inputPropsControl = { ...formMethods, values }; // ...inputPropsfor
  const { payment_method: paymentMethod } = values;
  
  // Fetch user profile when invoice has no payer info (only for background use, not pre-filling forms)
  useEffect(() => {
    async function fetchUserProfile() {
      // Only fetch if invoice has no payer info (store for submission, don't pre-fill form)
      if (!invoiceHasPayerInfo) {
        try {
          const userProfile = await getProfile();
          if (userProfile?.email) {
            setUserEmail(userProfile.email);
          } else if (userProfile?.mobile) {
            setUserMobile(userProfile.mobile);
          }
        } catch (error) {
          console.error('Failed to fetch user profile for payer info:', error);
        }
      }
    }
    
    fetchUserProfile();
  }, [invoiceHasPayerInfo]);

  useEffect(() => {
    clearErrors();
    setFormError('');
    // Clear payment_processor_currency when switching to payment methods that don't use it
    const processor = available_payment_processors.find(p => p?.unique_string_name === paymentMethod);
    if (paymentMethod && processor && processor.currencies.length <= 1) {
      setValue('payment_processor_currency', '');
    }
  }, [paymentMethod, setValue, available_payment_processors]);

  const business = get(metadata, ['service_business', 'business'], {});
  const { name, icon } = business;

  // let paymentMethods = getPaymentMethods(invoice); // TODO:

  async function onSubmit(props) {
    setSubmitting(true);
    const { payment_method: paymentMethod, wallet_method, email, mobile, contact_method, payment_processor_currency } = values;
    let primary_payment_processor = 'native';

    let data = {
      // payer_email: email ? email : invoice?.payer_email,
      payment_processor_currency: currency.code,
    };

    // Handle contact_method from the new unified field
    const contactValue = contact_method || email || mobile;
    const isEmailContact = contactValue && contactValue.includes('@');
    
    if (email || invoiceEmail || userEmail || (contactValue && isEmailContact)) {
      data.payer_email = email || invoiceEmail || userEmail || contactValue;
    } else {
      data.payer_mobile_number = mobile || invoiceMobile || userMobile || contactValue;
    }

    // Find matching processor from API data
    const matching_processor = available_payment_processors.find(
      item => item?.unique_string_name === paymentMethod
    );

    if (matching_processor) {
      // Use processor from API data
      primary_payment_processor = paymentMethod;
      
      // Set currency based on processor configuration
      if (matching_processor.currencies.length === 1) {
        // Single currency processor - use that currency
        data.payment_processor_currency = matching_processor.currencies[0];
      } else if (payment_processor_currency && matching_processor.currencies.includes(payment_processor_currency)) {
        // Multi-currency processor with user selection - use selected currency
        data.payment_processor_currency = payment_processor_currency;
      } else {
        // Fallback to request currency
        data.payment_processor_currency = currency.code;
      }
    } else if (wallet_method === 'request') {
      primary_payment_processor = 'native_otp';
      data.payer_mobile_number = mobile?.[0] !== '+' ? '+' + mobile : mobile;
      delete data.payer_email;
    } else if (wallet_method === 'scan' || wallet_method === 'login') {
      primary_payment_processor = 'native';
    }
    data.primary_payment_processor = primary_payment_processor;


    const existingQuotes = quotes.filter(
      item =>
        item?.payment_processor?.unique_string_name ===
          primary_payment_processor && item?.status.match(/pending/),
    );

    if (primary_payment_processor === 'native_otp' && !mobile) {
      setFormError('Please include a mobile number for pay with pin');
    } else if (
      existingQuotes.length > 0 &&
      paymentMethod.match(/bitcoin|stellar/)
    ) {
      send({
        type: 'NEXT',
        payload: { paymentMethod, wallet_method, invoice },
      });
    } else if ((wallet_method === 'login' || wallet_method === 'scan') && primary_payment_processor === 'native') {
      // Skip API call for native login/scan to pay - go directly to respective flows
      console.log('Native login/scan flow:', { paymentMethod, wallet_method, primary_payment_processor });
      console.log('Sending NEXT with payload:', { paymentMethod: 'native', wallet_method, invoice: invoice?.id });
      send({
        type: 'NEXT',
        payload: { paymentMethod: 'native', wallet_method, invoice },
      });
    } else {
      const resp = await choosePaymentRequestMethod(id, data);
      if (resp.status === 'success') {
        send({
          type: 'NEXT',
          payload: { invoice: resp.data, paymentMethod, wallet_method },
        });
      } else {
        if (primary_payment_processor === 'native_otp') {
          setError('mobile', {
            type: 'manual',
            message: resp?.message,
          });
        } else {
          setFormError(resp?.message);
        }
      }
    }
    setSubmitting(false);
  }

  const logo = icon ? icon : '/images/icon.png';
  return (
    <Layout {...props} hideBack={!items.length}>
      <Form
        formError={formError}
        reduxContext={{ company, invoice }}
        noLayout
        layoutProps={{ logo }}
        header={<CheckoutHeader {...props} />}
        formConfig={{ ...formConfigObj, onSubmit }}
        isSubmitting={isSubmitting}
        handleSubmit={handleSubmit}
        inputPropsControl={inputPropsControl}
      />
    </Layout>
  );
}
