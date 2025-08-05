/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from 'react';
import _, { get, has } from 'lodash';
import moment from 'moment';

import Text from 'components/outputs/Text';
// import ConfirmPage from 'components/layout/page/ConfirmPage';
import ConfirmPage from 'components/layout/page/ConfirmPageNew';

import { renderRate } from 'util/rates';
import { formatAmountString, toDivisibility } from 'util/general';
import Spinner from 'components/outputs/Spinner';
import { createConversion } from 'util/rehive';
import ErrorOutput from 'components/outputs/Error';
import PageButtons from 'components/layout/page/PageButtons';
import PageContent from 'components/layout/page/PageContent';
import { getCountryFormattedDate } from 'util/date';

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

const ExchangeConfirm = props => {
  const {
    fromCurrency,
    formikProps,
    handleButtonPress,
    toCurrency,
    tier,
    primaryAccount,
    profile,
    confirmMessageId,
  } = props;
  const { values, setFieldValue } = formikProps;
  const { buy, sell, display } = values;

  const [loading, setLoading] = useState(true);
  const [expired, setExpired] = useState(false);
  const [data, setData] = useState(null);
  const [remaining, setRemaining] = useState();
  const [items, setItems] = useState([]);
  const [itemsExtra, setItemsExtra] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const key = fromCurrency.currency.code + ':' + toCurrency.currency.code;
      let data = {};
      if (display) {
        data = {
          to_amount: toDivisibility(buy, toCurrency.currency.divisibility),
        };
      } else {
        data = {
          from_amount: toDivisibility(sell, fromCurrency.currency.divisibility),
        };
      }

      const resp = await createConversion({
        ...data,
        key,
        debit_account: fromCurrency.account,
        credit_account: toCurrency.account,
      });

      if (resp.status === 'success') {
        let conversionQuote = get(resp, ['data']);
        setData(conversionQuote);
        setFieldValue('id', get(resp, ['data', 'id']));
        const { from_amount, to_amount, rate } = conversionQuote;

        const fromAmount =
          from_amount / 10 ** fromCurrency.currency.divisibility;
        const toAmount = to_amount / 10 ** toCurrency.currency.divisibility;

        const fromString = formatAmountString(
          fromAmount,
          fromCurrency.currency,
        );
        const toString = formatAmountString(toAmount, toCurrency.currency);

        let _items = [
          {
            id: 'amount',
            labelId: 'buy',
            value: toString,
            horizontal: true,
          },
          {
            id: 'amount2',
            labelId: 'sell',
            value: fromString,
            horizontal: true,
          },
        ];
        let _itemsExtra = [];
        if (conversionQuote?.created) {
          _itemsExtra.push({
            id: 'created',
            labelId: 'date',
            // value: moment(conversionQuote.created).format('DD-MM-YYYY'),
            value: getCountryFormattedDate(
              conversionQuote.created,
              profile?.items?.nationality,
              true,
            ),
          });
        }
        if (conversionQuote?.rate) {
          _itemsExtra.push({
            id: 'rate',
            labelId: 'rate',
            value: renderRate({
              fromCurrency: fromCurrency.currency,
              toCurrency: toCurrency.currency,
              rate,
            }),
          });
        }
        if (conversionQuote?.to_amount) {
          _itemsExtra.push({
            id: 'to_amount',
            labelId: 'buying',
            value: formatAmountString(
              conversionQuote.to_amount,
              toCurrency.currency,
              true,
            ),
          });
        }
        if (has(conversionQuote, 'to_fee')) {
          _itemsExtra.push({
            id: 'to_fee',
            labelId: 'service_fee',
            value: formatAmountString(
              conversionQuote.to_fee,
              toCurrency.currency,
              true,
            ),
          });
        }
        if (conversionQuote?.from_amount) {
          _itemsExtra.push({
            id: 'from_amount',
            labelId: 'base_cost',
            value: formatAmountString(
              conversionQuote.from_amount,
              fromCurrency.currency,
              true,
            ),
          });
        }
        if (has(conversionQuote, 'from_fee')) {
          _itemsExtra.push({
            id: 'from_fee',
            labelId: 'service_fee',
            value: formatAmountString(
              conversionQuote.from_fee,
              fromCurrency.currency,
              true,
            ),
          });
        }
        if (conversionQuote?.from_total_amount) {
          _itemsExtra.push({
            id: 'from_total_amount',
            labelId: 'total_cost',
            value: formatAmountString(
              conversionQuote.from_total_amount,
              fromCurrency.currency,
              true,
            ),
          });
        }
        setItems(_items);
        setItemsExtra(_itemsExtra);
        props.setSuccessItems(_items);
        props.setSuccessExtraItems(_itemsExtra);
      } else {
        setData(resp);
      }
      setLoading(false);
    }
    fetchData();
  }, [buy, display, fromCurrency, sell, setFieldValue, toCurrency]);

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
    return <Spinner containerStyle={{ paddingBottom: 24, marginTop: 32 }} />;
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
              id: 'back',
              capitalize: true,
              onPress: () => handleButtonPress(formikProps),
              variant: 'text',
            },
          ]}
        />
      </React.Fragment>
    );
  }

  return (
    <ConfirmPage
      pageStyle={{ marginTop: 32 }}
      handleButtonPress={handleButtonPress}
      formikProps={formikProps}
      disabled={expired}
      timerItem={remaining}
      items={items}
      itemsExtra={itemsExtra}>
      {expired && <ErrorOutput id="expired_quote_message" />}
    </ConfirmPage>
  );
};

export default ExchangeConfirm;
