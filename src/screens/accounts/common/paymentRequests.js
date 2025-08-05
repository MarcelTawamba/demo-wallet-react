import React from 'react';
import ConfirmModal from 'components/layout/ConfirmModal';
import Text from 'components/outputs/Text';
import { View } from 'components/layout/View';

import { calculateRate } from 'util/rates';
import { get } from 'lodash';
import { copyToClipboard, formatAmountString, uuidv4 } from 'util/general';
import {
  updatePaymentRequest,
  notifyPaymentRequest,
  createTransactionCollection,
  cancelPaymentRequest,
} from 'util/rehive';

export function copyLink({ request, showToast }) {
  return copyToClipboard(request.redirect_url, showToast);
}

export async function remind({ request, showToast }) {
  await notifyPaymentRequest(request.id);

  showToast({
    text: 'request_reminder',
    languageContext: { value: request.payer_email || request.payer_mobile },
  });
}

export async function cancel({ request, user, onSuccess, showToast }) {
  const outgoing = request?.user?.id === user?.id;

  await cancelPaymentRequest(request.id, {
    incoming: !outgoing,
  });

  showToast({
    text: outgoing
      ? 'successfully_cancelled_request_to'
      : 'successfully_declined_request_from',
    languageContext: { value: request.payer_email || request.payer_mobile }, //TODO: this needs to change depending on who made the request
    variant: 'success',
  });

  onSuccess && onSuccess({});
}

export async function createPayment({
  request,
  currency,
  user,
  accountRef,
  onSuccess,
  onError,
  amountValueString,
  amountValueConvString,
}) {
  try {
    const updateResponse = await updatePaymentRequest(request.id, {
      primary_payment_processor: 'native',
      payment_processor_currency: request.request_currency.code,
    });
    const quote = get(
      updateResponse,
      ['data', 'payment_processor_quotes', '0'],
      {},
    );

    const {
      amount,
      reference,
      payment_processor,
      account: paymentProcessorAccount,
      id: paymentProcessorQuoteId,
    } = quote ?? {};

    const uuid = uuidv4();
    const transactionMetadata = {
      service_payment_requests: {
        quote: {
          id: paymentProcessorQuoteId,
        },
      },
    };
    let transactions = [
      {
        id: uuid,
        partner: reference,
        tx_type: 'debit',
        status: 'Complete',
        amount,
        currency: request.request_currency.code,
        account: accountRef,
        subtype: 'send_email',
        metadata: transactionMetadata,
      },
      {
        id: reference,
        partner: uuid,
        tx_type: 'credit',
        status: 'Complete',
        amount,
        currency: request.request_currency.code,
        account: paymentProcessorAccount,
        subtype: payment_processor.rehive_subtype ?? 'receive_email',
        metadata: transactionMetadata,
      },
    ];
    const response = await createTransactionCollection(transactions);

    onSuccess &&
      onSuccess({
        response,
        requestIdForTransaction: request.id, // for PaymentRequestPending
        amountValueString,
        amountValueConvString,
      });
  } catch (error) {
    onError && onError({ error });
  }
}

const userLabel = (request, outgoing, contactOnly = false) => {
  const user = outgoing ? 'payer_user' : 'user';
  const userObj = request[user];

  if (!userObj) return request?.payer_email ?? request.payer_mobile_number;

  return !contactOnly && (userObj?.first_name || userObj?.last_name)
    ? `${userObj?.first_name} ${userObj?.last_name}`
    : userObj?.email ?? userObj?.mobile_number;
};

export function RenderConfirm({
  request,
  currency,
  action,
  services,
  rates,
  user,
  accountRef,
  onConfirm,
  onSuccess,
  onCancel,
  onError,
  showToast,
}) {
  const outgoing = request?.user?.id === user?.id;
  let conversionRate = 1;

  const hasConversion =
    services?.conversion_service &&
    rates.rates &&
    rates.displayCurrency.code &&
    rates.displayCurrency.code !== currency.code;

  const amountValueString = formatAmountString(
    request.request_amount ?? 0,
    request.request_currency,
    true,
  );
  let amountValueConvString = '';
  if (hasConversion) {
    conversionRate = calculateRate(
      currency.code,
      rates.displayCurrency.code,
      rates.rates,
    );
    amountValueConvString = `~${formatAmountString(
      (request.request_amount ?? 0) * conversionRate,
      rates.displayCurrency,
      true,
      request.request_currency.divisibility,
    )}`;
  }

  const config = {
    pay: {
      title: 'confirm_pay',
      buttonText: 'confirm',
      cancelButton: 'cancel',
      description: 'you_are_about_to_pay',
      recipientDirection: 'to',
      onConfirm: () => {
        onConfirm && onConfirm();
        createPayment({
          request,
          user,
          accountRef,
          currency,
          onSuccess,
          onError,
          amountValueString,
          amountValueConvString,
        });
      },
    },
    cancel: {
      title: outgoing ? 'cancel_request' : 'decline_request',
      buttonText: 'cancel',
      cancelButton: 'back',
      buttonColor: '#CC2538',
      description: outgoing
        ? 'cancel_request_prefix'
        : 'decline_request_prefix',
      recipientDirection: 'from',
      onConfirm: () => {
        onConfirm && onConfirm();
        cancel({ request, user, onSuccess, showToast });
      },
    },
  };

  return (
    <ConfirmModal
      {...{
        visible: true,
        onConfirm: config[action].onConfirm,
        onCancel: () => onCancel && onCancel(),
        title: config[action].title,
        cancelButtonText: config[action].cancelButton,
        buttonText: config[action].buttonText,
        buttonColor: config[action].buttonColor,
        topSlot: () => (
          <View bC={'#DDD'} bR={100} h={80} w={80} aI={'center'} jC={'center'}>
            <Text
              bold
              myColor={'#9A9A9A'}
              width={'unset'}
              style={{ fontSize: 30 }}>
              {userLabel(request, outgoing)?.charAt(0)?.toUpperCase()}
            </Text>
          </View>
        ),
      }}>
      <Text style={{ textAlign: 'center' }}>
        <Text inline id={config[action].description} />{' '}
        <Text myColor={'primary'} fontWeight={'500'} inline>
          {amountValueString} {hasConversion && `(${amountValueConvString}) `}
        </Text>{' '}
        <Text id={config[action].recipientDirection} lowercase inline />{' '}
        <Text myColor={'primary'} fontWeight={'500'} inline>
          {userLabel(request, outgoing, true)}
        </Text>{' '}
        {request.description && <Text id="for" lowercase inline />}{' '}
        {request.description}
      </Text>
    </ConfirmModal>
  );
}
