import React, { useState } from 'react';
import QR from 'components/outputs/QR';
import moment from 'moment';

import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import { formatDecimals, calculateRate, renderRate } from 'util/rates';
import { paramsToSearch, getCurrencyCode } from 'util/general';

const ReceivePaymentQR = props => {
  const {
    currency,
    rates = {},
    formikProps,
    size,
    showAmount,
    id,
    invoice,
    type,
    width,
    subtype,
    subtype_debit,
    business,
  } = props;

  const { values } = formikProps;

  const { display, amount, profile, account, request_id } = values;
  let params = {};

  let paymentQRString = 'pay:' + (profile?.id ?? request_id);

  if (currency?.currency?.code) {
    params.currency = currency?.currency?.code;
  }

  if (business) {
    params.name = business?.name ? encodeURIComponent(business?.name) : '';
    if (business?.icon) {
      params.image = encodeURIComponent(business?.icon);
    }
  } else if (profile) {
    params.name = encodeURIComponent(
      profile.first_name + (profile.last_name && ' ' + profile.last_name),
    );
    if (profile.profile) {
      params.image = encodeURIComponent(profile.profile);
    }
  }

  if (type) {
    params.type = type;
  }

  let receiveItems = [];

  let amountString = '';
  let sentenceString = '';
  let amountConvString = '';
  const { divisibility } = currency?.currency ?? {};
  const { hasConversion = false } = rates;
  if (amount && currency) {
    if (hasConversion) {
      const convRate = calculateRate(
        currency?.currency?.code,
        rates.displayCurrency.code,
        rates.rates,
      );

      receiveItems.push({
        label: 'Rate',
        value: renderRate({
          fromCurrency: currency.currency,
          toCurrency: rates.displayCurrency,
          rate: convRate,
        }),
        value2: rates.rates['USD:' + currency?.currency?.code]
          ? 'Last updated ' +
            moment(
              rates.rates['USD:' + currency?.currency?.code].created,
            ).fromNow()
          : '',
      });

      if (display) {
        amountString = formatDecimals(amount / convRate, divisibility);
        sentenceString =
          amountString + ' ' + getCurrencyCode(currency?.currency);

        amountConvString =
          formatDecimals(amount, rates.displayCurrency.divisibility) +
          ' ' +
          getCurrencyCode(rates.displayCurrency);
      } else {
        amountString = formatDecimals(amount, divisibility);
        sentenceString =
          amountString + ' ' + getCurrencyCode(currency?.currency);

        amountConvString =
          formatDecimals(
            amount * convRate,
            rates.displayCurrency.divisibility,
          ) +
          ' ' +
          getCurrencyCode(rates.displayCurrency);
      }
      if (amountConvString) {
        amountConvString = '~' + amountConvString;
        sentenceString =
          amountString +
          ' ' +
          getCurrencyCode(currency?.currency) +
          ' (' +
          amountConvString +
          ')';
      }
    } else {
      amountString = formatDecimals(amount, divisibility);
      sentenceString = amountString + ' ' + getCurrencyCode(currency?.currency);
    }
  } else {
    sentenceString = getCurrencyCode(currency?.currency);
  }

  if (amountString) {
    params.amount = amountString.replace(',', '');
  }
  if (id) {
    params.qr_id = id;
  }
  if (invoice) {
    params.invoice = invoice;
  }
  if (account) {
    params.account = account;
  }
  if (subtype) {
    params.subtype = subtype;
  }
  if (request_id) {
    params.request_id = request_id;
  }
  if (subtype_debit) {
    params.subtype_debit = subtype_debit;
  }
  paymentQRString = paymentQRString + paramsToSearch(params);

  const text = (
    <Text
      variant="body1"
      align={'center'}
      style={{
        wordBreak: 'break-word',
        paddingTop: 24,
      }}
      id="want_to_get_paid_title"
      context={{ sentenceString }}
    />
  );

  return (
    <View
      aI={'center'}
      w={width ? width : '100%'}
      h={'auto'}
      // pt={1}
    >
      {amount && showAmount ? text : null}
      <QR size={size}>{paymentQRString}</QR>
    </View>
  );
};

export default ReceivePaymentQR;
