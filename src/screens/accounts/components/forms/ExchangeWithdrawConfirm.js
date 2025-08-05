/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from 'react';
import { get } from 'lodash';
import moment from 'moment';

import Text from 'components/outputs/Text';
import ConfirmPage from 'components/layout/page/ConfirmPage';

import { renderRate, formatAmountString } from 'util/rates';
import Spinner from 'components/outputs/Spinner';
import { createConversion } from 'util/rehive';
import ErrorOutput from 'components/outputs/Error';
import PageButtons from 'components/layout/page/PageButtons';
import PageContent from 'components/layout/page/PageContent';
import { useFee } from 'util/fees';
import { useWithdrawSubtypeConfig } from 'hooks/useAppConfig';

function pad(num) {
  return ('0' + num).slice(-2);
}
function formatTime(secs) {
  var minutes = Math.floor(secs / 60);
  secs = secs % 60;
  minutes = minutes % 60;
  // return `${pad(minutes)}:${pad(secs)}`;
  return pad(minutes) + ':' + pad(secs);
}

const ExchangeWithdrawConfirm = props => {
  const {
    fromCurrency,
    formikProps,
    handleButtonPress,
    toCurrency,
    accountString,
    services,
    rates,
    tierFees,
    accountFees,
    groupFees,
  } = props;
  const { values, setFieldValue } = formikProps;
  const { amount } = values;
  const withdrawSubtypeConfig = useWithdrawSubtypeConfig();

  const [loading, setLoading] = useState(true);
  const [expired, setExpired] = useState(false);
  const [data, setData] = useState(null);
  const [remaining, setRemaining] = useState('09:59');
  const toCode = toCurrency.currency.code;

  useEffect(() => {
    async function fetchData() {
      const { code, divisibility } = fromCurrency.currency;
      const key = code + ':' + toCode;
      const hasConversion =
        services?.conversion_service &&
        toCurrency.currency.code !== code &&
        values.display;
      let data = {};
      if (hasConversion) {
        data = {
          to_amount: parseInt(
            parseFloat(amount) * 10 ** toCurrency.currency.divisibility,
          ),
        };
      } else {
        data = {
          from_amount: parseInt(parseFloat(amount) * 10 ** divisibility),
        };
      }

      const resp = await createConversion({
        ...data,
        debit_account: fromCurrency.account,
        credit_account: toCurrency.account,
        key,
      });
      if (resp.status === 'success') {
        setData(get(resp, ['data']));
        setFieldValue('id', get(resp, ['data', 'id']));
      } else {
        setData(resp);
      }
      setLoading(false);
    }
    fetchData();
  }, [
    amount,
    fromCurrency.account,
    fromCurrency.currency,
    rates.rates,
    services,
    setFieldValue,
    toCode,
    toCurrency.account,
    toCurrency.currency.code,
    toCurrency.currency.divisibility,
    values.display,
  ]);

  useEffect(() => {
    let timer = null;
    async function startTimer() {
      timer = setTimeout(() => {
        if (data && data.created) {
          const CurrentDate = moment();
          const ExpiredDate = moment(data.expires);
          const diff = ExpiredDate.diff(CurrentDate, 'seconds');
          const formatted = formatTime(diff);
          setRemaining(formatted);
          if (diff <= 0) {
            setExpired(true);
            return () => clearTimeout(timer);
          }
        }
        startTimer();
      }, 1000);
    }
    startTimer();
    return () => clearTimeout(timer);
  }, [data]);

  if (!data || loading) {
    return <Spinner containerStyle={{ paddingBottom: 24 }} />;
  }
  if (data.status && data.status === 'error') {
    return (
      <React.Fragment>
        <PageContent>
          <ErrorOutput>{data.message}</ErrorOutput>
        </PageContent>
        <PageButtons
          layout={'vertical'}
          items={[
            {
              children: 'BACK',
              onPress: () => handleButtonPress(formikProps),
              variant: 'text',
            },
          ]}
        />
      </React.Fragment>
    );
  }

  const { from_amount, to_amount, rate } = data;

  const fromAmount = from_amount / 10 ** fromCurrency.currency.divisibility;
  const toAmount = to_amount / 10 ** toCurrency.currency.divisibility;

  const fromString = formatAmountString(fromAmount, fromCurrency.currency);
  const toString = formatAmountString(toAmount, toCurrency.currency, true);

  const items = [
    {
      id: 'from',
      label: 'Selling',
      value: fromString,
      horizontal: true,
    },
  ];

  const { totalString: fromTotalString, fees: sellFees } = useFee(
    fromAmount,
    tierFees,
    fromCurrency,
    accountFees,
    groupFees,
    'sell',
  );
  if (sellFees.length > 0) {
    sellFees.forEach(fee => {
      itemsExtra.push({
        id: 'sell_fee',
        labelId: fee.name ? fee.name : 'sell_fee',
        label: fee.name ? fee.name : 'sell_fee',
        value: fee.feeString,
        horizontal: true,
      });
    });

    items.push({
      id: 'sell_total',
      label: 'Total sell amount',
      value: fromTotalString,
      horizontal: true,
      bold: true,
    });
  }

  items.push({
    id: 'blank',
    label: ' ',
    value: ' ',
    horizontal: true,
  });
  items.push({
    id: 'to',
    label: 'Buying',
    value: toString,
    horizontal: true,
  });

  const {
    totalString: toTotalString,
    totalAmount: toTotalAmount,
    fees: buyFees,
  } = useFee(toAmount, tierFees, toCurrency, accountFees, groupFees, 'buy');
  if (buyFees.length > 0) {
    buyFees.forEach(fee => {
      itemsExtra.push({
        id: 'buy_fee',
        labelId: fee.name ? fee.name : 'buy_fee',
        label: fee.name ? fee.name : 'buy_fee',
        value: fee.feeString,
        horizontal: true,
      });
    });

    items.push({
      id: 'buy_total',
      label: 'Total buy amount',
      value: toTotalString,
      horizontal: true,
      bold: true,
    });
  }

  // Amount
  let amountValue = toTotalAmount ? toTotalAmount : toAmount;
  // console.log('TCL: toTotalAmount', toTotalAmount);
  let amountString = toTotalString ? toTotalString : toString;
  let amountConvString = '';
  const itemsExtra = [
    {
      id: 'amount',
      label: 'Withdrawal amount',
      value: amountString,
      value2: amountConvString,
      horizontal: true,
    },
  ];

  // Fee
  const isCrypto = Boolean(toCurrency.crypto);
  const { totalString, fees } = useFee(
    amountValue / 10 ** toCurrency.currency.divisibility,
    tierFees,
    toCurrency,
    accountFees,
    groupFees,
    isCrypto ? 'withdraw_crypto' : withdrawSubtypeConfig?.defaultSubtype || 'withdraw_manual',
    true,
  );

  if (fees.length > 0) {
    fees.forEach(fee => {
      itemsExtra.push({
        id: 'withdrawal_fee',
        labelId: fee.name ? fee.name : 'withdrawal_fee',
        label: fee.name ? fee.name : 'withdrawal_fee',
        value: fee.feeString,
        horizontal: true,
      });
    });
    itemsExtra.push({
      id: 'total_amount',
      label: 'Total transaction amount',
      value: totalString,
      horizontal: true,
      bold: true,
    });
  }

  const text = (
    <Text align={'center'}>
      {'You are about to withdraw\n'}
      <b>{fromString + ' (~' + totalString + ')'}</b>
      {' to '}
      <b>{accountString}</b>
    </Text>
  );

  let itemsExtra2 = [];
  if (rate) {
    const rateString = renderRate({
      fromCurrency,
      toCurrency,
      rate,
    });
    itemsExtra2 = [
      {
        id: 'rate',
        label: 'Rate',
        value: rateString,
        horizontal: true,
      },
      {
        id: 'expires',
        label: 'Quote expires in',
        value: remaining,
        horizontal: true,
        valueColor: true,
        valueBold: true,
      },
    ];
  }

  return (
    <ConfirmPage
      action={'withdraw'}
      handleButtonPress={handleButtonPress}
      text={text}
      disabled={expired}
      formikProps={formikProps}
      items={items}
      itemsExtra={itemsExtra}
      itemsExtra2={itemsExtra2}
      backButtonText={'CANCEL'}>
      {expired && <ErrorOutput>This quote has expired</ErrorOutput>}
    </ConfirmPage>
  );
};

export default ExchangeWithdrawConfirm;
