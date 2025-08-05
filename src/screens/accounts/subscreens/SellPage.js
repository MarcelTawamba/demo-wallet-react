import React, { useState, useEffect } from 'react';
import { View } from 'components/layout/View';
import {
  formatAmountString,
  paramsToObj,
  formatDecimals,
  getCurrencyCode,
} from 'util/general';
import ChevronBackIcon from '@material-ui/icons/ChevronLeft';
import IconButton from 'components/inputs/IconButton';
import Text from 'components/outputs/Text';
import SellOptions from '../components/BuySellOptions';
import SellForm from '../components/forms/SellForm';
import SellConfirm from '../components/BuySellConfirm';
import SuccessPage from 'components/layout/page/SuccessPageNew';
import FailedPage from 'components/layout/page/FailedPageNew';
import moment from 'moment';
import { makeStyles } from '@material-ui/styles';
import { getCountryFormattedDate } from 'util/date';

const useStyles = makeStyles(theme => ({
  headerWrapper: {
    padding: '26px !important',
    paddingTop: '32px !important',
    [theme.breakpoints.down('md')]: {
      padding: '26px 4px !important',
      paddingTop: '32px !important',
    },
  },
}));

export default function SellPage(props) {
  const {
    currency,
    history,
    services,
    rates,
    conversionPairs,
    account,
    currencies,
    profile,
    tier,
    accountFees,
    groupFees,
  } = props;

  const classes = useStyles(props);
  const [state, setState] = useState('list');
  const [selectedCurrency, setSelectedCurrency] = useState();
  const [conversionQuote, setConversionQuote] = useState();
  const [result, setResult] = useState();

  useEffect(() => {
    const searchParams = paramsToObj(history?.location?.search);

    if (currency?.currency?.code !== searchParams?.currency) {
      history.replace({ search: '' });
      setState('list');
    } else if (searchParams?.result) {
      const success = searchParams?.result === 'success';

      if (!success || searchParams?.orderId) {
        setResult({
          result: { status: searchParams?.result },
          textComp: (
            <Text tA={'center'}>
              {success
                ? 'Your payment is being processed and will reflect in your transactions list once complete.'
                : 'An error occurred with your transaction.'}
            </Text>
          ),
          nextLabel: success ? 'CONTINUE' : 'TRY AGAIN',
          onNext: () => setState('list'),
        });

        setState('result');
      }
    }
  }, [currency]);

  const availablePairs = conversionPairs?.items
    ?.map(x => {
      const split = x?.key?.split(':');
      return {
        from: split?.[0],
        to: split?.[1],
      };
    })
    ?.filter(x => x.from === currency?.currency?.code);

  const options =
    availablePairs
      ?.map(x => {
        return {
          currency: currencies?.items?.find(
            y => y.account === account && y.currency?.code === x.to,
          ),
          get onPress() {
            return () => {
              setSelectedCurrency(this.currency);
              setState('form');
            };
          },
        };
      })
      ?.filter(x => x.currency) ?? [];

  const config = {
    list: {
      id: 'select_currency_sell_for',
      languageContext: { currencyDescription: currency?.currency?.description },
      component: <SellOptions {...{ options, history, account, rates }} />,
    },
    form: {
      id: 'selling_currency',
      languageContext: { currencyDescription: currency?.currency?.description },
      component: (
        <SellForm
          {...{
            buyingCurrency: selectedCurrency,
            services,
            rates,
            currency,
            onContinue: resp => {
              setConversionQuote(resp);
              setState('confirm');
            },
            tier,
            accountFees,
            groupFees,
          }}
        />
      ),
      onBack: () => setState('list'),
    },
    confirm: {
      id: 'confirm',
      component: (
        <SellConfirm
          {...{
            selling: true,
            buySellCurrency: selectedCurrency,
            conversionQuote,
            currency,
            selectedCurrency,
            rates,
            profile,
            onConfirm: resp => {
              setResult({
                result: resp,
                text: `${
                  resp?.status === 'success'
                    ? 'Successfully sold'
                    : 'Failed to sell'
                } ${formatAmountString(
                  conversionQuote?.from_amount,
                  currency?.currency,
                  true,
                )}`,
                onNext: () =>
                  history.push(
                    `/accounts/${account}/${currency?.currency?.code}`,
                  ),
                onCancel: () => setState('list'),
              });
              setState('result');
            },
            onCancel: () => setState('list'),
          }}
        />
      ),
      onBack: () => {
        setConversionQuote(null);
        setState('form');
      },
    },
    result: {
      component: () => {
        const success =
          result?.result?.id || result?.result?.status === 'success';
        if (success) {
          const amountString = formatAmountString(
            conversionQuote?.from_amount,
            currency?.currency,
            true,
          );
          const items = [
            {
              id: 'amount',
              labelId: 'selling',
              value: amountString,
            },
            {
              id: 'amount2',
              labelId: 'receiving',
              value: amountString,
              value2: formatAmountString(
                conversionQuote['to_total_amount'],
                selectedCurrency?.currency,
                true,
              ),
            },
          ];
          let itemsExtra = [];

          if (conversionQuote.created) {
            itemsExtra.push({
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
          if (conversionQuote.rate) {
            itemsExtra.push({
              id: 'rate',
              labelId: 'rate',
              value: `1 ${currency?.currency?.code} for ${formatDecimals(
                conversionQuote.rate,
                selectedCurrency?.currency?.divisibility,
              )} ${getCurrencyCode(selectedCurrency?.currency)}`,
            });
          }
          if (conversionQuote.from_amount) {
            itemsExtra.push({
              id: 'from_amount',
              labelId: 'selling',
              value: formatAmountString(
                conversionQuote.from_amount,
                currency?.currency,
                true,
              ),
            });
          }
          if (conversionQuote.from_fee) {
            itemsExtra.push({
              id: 'from_fee',
              labelId: 'service_fee',
              value: formatAmountString(
                conversionQuote.from_fee,
                currency?.currency,
                true,
              ),
            });
          }
          if (conversionQuote.to_amount) {
            itemsExtra.push({
              id: 'to_amount',
              labelId: 'base_cost',
              value: formatAmountString(
                conversionQuote.to_amount,
                selectedCurrency?.currency,
                true,
              ),
            });
          }
          if (conversionQuote.to_fee) {
            itemsExtra.push({
              id: 'to_fee',
              labelId: 'service_fee',
              value: formatAmountString(
                conversionQuote.to_fee,
                selectedCurrency?.currency,
                true,
              ),
            });
          }
          if (conversionQuote.to_total_amount) {
            itemsExtra.push({
              id: 'to_total_amount',
              labelId: 'total_cost',
              value: formatAmountString(
                conversionQuote.to_total_amount,
                selectedCurrency?.currency,
                true,
              ),
            });
          }

          return (
            <SuccessPage
              formikProps={props}
              items={items}
              itemsExtra={itemsExtra}
              leftButtonAction={result.onNext}
              onNext={result.onCancel}
              performedDate={
                result.result.data?.created
                  ? moment(result.result.data.created).format(
                      'h.mm A, D MMMM YYYY',
                    )
                  : null
              }
            />
          );
        } else {
          return (
            <FailedPage
              failedMessageId="sell_failed"
              result={result.result || {}}
              onBack={result.onCancel}
              onContinue={result.onCancel}
              formikProps={props}
              performedDate={moment().format('h.mm A, D MMMM YYYY')}
            />
          );
        }
      },
    },
  };

  return (
    <View w={'100%'} pb={1}>
      <View grid gap={2} w={'100%'} className={classes.headerWrapper}>
        {config[state]?.onBack && (
          <View style={{ position: 'absolute' }} ml={0.5}>
            <IconButton
              inverted
              icon={'back'}
              simple
              onPress={config[state]?.onBack}>
              <ChevronBackIcon style={{ fontSize: 24 }} />
            </IconButton>
          </View>
        )}
        {config[state]?.id &&
          (state === 'confirm' ? (
            <Text id="confirm" align="center" variant="h6" />
          ) : (
            <Text
              id={config[state]?.id}
              context={config[state]?.languageContext}
              tA={'center'}
              s={20}
            />
          ))}
      </View>
      {state === 'result'
        ? config['result'].component()
        : config[state]?.component}
    </View>
  );
}
