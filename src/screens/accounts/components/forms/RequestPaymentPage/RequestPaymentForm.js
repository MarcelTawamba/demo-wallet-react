import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import { Button } from 'components/inputs/Button';
import { View } from 'components/layout/View';
import { isEmail, isMobile } from 'util/validation';
import { createPaymentRequest } from 'util/rehive';
import { formatAmountString, cleanMobile } from 'util/general';
import { calculateRate } from 'util/rates';
import Text from 'components/outputs/Text';
import PageContent from 'components/layout/page/PageContent';
import PageButtons from 'components/layout/page/PageButtons';
import moment from 'moment';
import * as yup from 'yup';
import AmountInput from '../../AmountInput';
import Input from 'components/inputs/Input';
import ConfirmModal from 'components/layout/ConfirmModal';
import Big from 'big.js';
import { toDivisibility } from 'util/general';

export default function PaymentRequestForm(props) {
  const {
    currency,
    services,
    rates,
    getRequests,
    setRequestResult,
    conversionRate,
    hasConversion,
  } = props;

  const [state, setState] = useState('');

  async function handleSubmit({ values, formikProps }) {
    let { amount, recipient, reason, display } = values;

    amount = new Big(amount);

    if (
      services?.conversion_service &&
      rates.rates &&
      rates.displayCurrency.code &&
      display
    ) {
      const convRate = calculateRate(
        currency.currency.code,
        rates.displayCurrency.code,
        rates.rates,
      );
      amount = amount.div(convRate);
    }
    
    amount = toDivisibility(amount, currency.currency.divisibility);

    let request = {
      status: 'initiated',
      account: currency.account,
      request_currency: currency.currency.code,
      request_amount: Math.floor(amount),
    };

    if (isEmail(recipient)) request.payer_email = recipient;
    else request.payer_mobile_number = cleanMobile(recipient);

    if (reason) request.description = reason;

    const response = await createPaymentRequest(request);

    let amountValue = new Big(values.amount);
    if (values.display) amountValue = amountValue.div(conversionRate);

    setRequestResult({
      ...response,
      data: {
        ...response.data,
        amount: response.data.request_amount,
        user: {
          // ...response.data.payer_user,
          email: isEmail(recipient) ? recipient : null,
          mobile: !isEmail(recipient) ? recipient : null,
        },
        amountValueString: formatAmountString(amountValue, currency.currency),
        amountValueConvString: hasConversion
          ? `(~${formatAmountString(
              amountValue * conversionRate,
              rates.displayCurrency,
            )}) `
          : '',
      },
    });

    getRequests({ getReceived: false, refresh: true });
  }

  function renderConfirm({ formikProps }) {
    const { values } = formikProps;

    let amountValue = values.amount ? new Big(values.amount) : Big(0);
    if (values.display) amountValue = amountValue.div(conversionRate);

    return (
      <ConfirmModal
        {...{
          visible: state === 'confirm',
          onConfirm: () => {
            formikProps.submitForm();
            setState('');
          },
          onCancel: () => setState(''),
          title: 'confirm_request',
          topSlot: () => (
            <View
              bC={'#DDD'}
              bR={100}
              h={80}
              w={80}
              aI={'center'}
              jC={'center'}>
              <Text
                bold
                myColor={'#9A9A9A'}
                width={'unset'}
                style={{ fontSize: 30 }}>
                {formikProps.values.recipient?.charAt(0)?.toUpperCase()}
              </Text>
            </View>
          ),
        }}>
        <Text style={{ textAlign: 'center' }}>
          <Text id="request_confirm_prefix" inline />{' '}
          <Text myColor={'primary'} fontWeight={'500'} inline>
            {formatAmountString(amountValue, currency.currency)}{' '}
            {hasConversion &&
              `(~${formatAmountString(
                amountValue.mul(conversionRate),
                rates.displayCurrency,
              )}) `}
          </Text>{' '}
          <Text id="from" lowercase inline />{' '}
          <Text myColor={'primary'} fontWeight={'500'} inline>
            {formikProps.values.recipient}
          </Text>{' '}
          {formikProps.values.reason && <Text id="for" lowercase inline />}{' '}
          {formikProps.values.reason}
        </Text>
      </ConfirmModal>
    );
  }

  const validationSchema = yup.object().shape({
    amount: yup
      .number()
      .typeError('Please enter a valid number')
      .moreThan(0, 'Amount must be more than 0')
      .required('Amount is required'),
    recipient: yup
      .string()
      .required('Please enter a recipient')
      .test(
        'validate-type',
        'Please enter a valid email or mobile number (incl. country code)',
        value => {
          return isEmail(value) || isMobile(value);
        },
      )
      .typeError(
        'Please enter a valid email address',
        // 'Please enter a valid email or mobile number (incl. country code)',
      ),
  });

  return (
    <Formik
      initialValues={{ amount: '', recipient: '', reason: '', display: false }}
      validationSchema={validationSchema}
      onSubmit={(values, formikBag) => handleSubmit({ values, ...formikBag })}>
      {formikProps => (
        <Form>
          <PageContent>
            <AmountInput
              {...{
                services,
                // rates,
                formikProps,
                currency,
              }}
            />
            <Input
              field={{
                name: 'recipient',
                label: 'recipient',
                placeholder: 'Email or mobile',
              }}
              formikProps={formikProps}
            />
            <Input
              field={{ name: 'reason', label: 'note' }}
              formikProps={formikProps}
            />
          </PageContent>
          <PageButtons
            layout={'vertical'}
            items={[
              {
                id: 'request',
                capitalize: true,
                loading: formikProps.isSubmitting,
                disabled: !formikProps.isValid || formikProps.isSubmitting,
                onPress: () => setState('confirm'),
              },
            ]}
          />
          {renderConfirm({ formikProps })}
        </Form>
      )}
    </Formik>
  );
}
