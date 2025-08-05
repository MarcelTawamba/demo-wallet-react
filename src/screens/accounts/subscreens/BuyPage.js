import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { View } from 'components/layout/View';
import { configActionsSelector } from 'redux/rehive/selectors';
import {
  formatAmountString,
  paramsToObj,
  formatDecimals,
  getCurrencyCode,
} from 'util/general';
import { companyBankAccountsSelector } from 'screens/accounts/redux/selectors';
import ChevronBackIcon from '@material-ui/icons/ChevronLeft';
import IconButton from 'components/inputs/IconButton';
import Text from 'components/outputs/Text';
import BuyOptions from '../components/BuySellOptions';
import BuyForm from '../components/forms/BuyForm';
import BuyConfirm from '../components/BuySellConfirm';
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

export default function BuyPage(props) {
  const {
    currency,
    history,
    services,
    rates,
    conversionPairs,
    account,
    currencies,
    profile,
  } = props;
  const classes = useStyles(props);
  const [state, setState] = useState('list');
  const [selectedCurrency, setSelectedCurrency] = useState();
  const [conversionQuote, setConversionQuote] = useState();
  const [result, setResult] = useState();

  const actionsConfig = useSelector(configActionsSelector);
  const companyBankAccounts = useSelector(companyBankAccountsSelector);
  const searchParams = paramsToObj(history?.location?.search);

  function onList() {
    setState('list');
    history.push({ search: '' });
  }
  function onHistory() {
    history.push(`/accounts/${currency?.account}/${currency?.currency?.code}/`);
  }

  useEffect(() => {
    if (currency?.currency?.code !== searchParams?.currency) {
      history.replace({ search: '' });
      onList();
    } else if (searchParams?.result) {
      const success = searchParams?.result === 'success';

      setResult({
        result: { status: searchParams?.result },
        nextLabel: success ? 'CONTINUE' : 'TRY AGAIN',
        onNext: onHistory,
        onCancel: onList,
      });

      setState('result');
    }
  }, [currency, history?.location?.search]);

  const availablePairs = conversionPairs?.items
    ?.map(x => {
      const split = x?.key?.split(':');
      return {
        from: split?.[0],
        to: split?.[1],
      };
    })
    ?.filter(x => x.to === currency?.currency?.code);

  let options = [];

  options = options.concat(
    availablePairs
      ?.map(x => {
        return {
          currency: currencies?.items?.find(
            y => y.account === account && y.currency?.code === x.from,
          ),
          get disabled() {
            return this.currency?.available_balance <= 0;
          },
          get onPress() {
            return () => {
              setSelectedCurrency(this.currency);
              setState('form');
            };
          },
          get topup() {
            return (
              !this.currency?.crypto &&
              !actionsConfig?.deposit?.condition?.hide &&
              !actionsConfig?.deposit?.condition?.hideCurrency?.includes(
                x.from,
              ) &&
              companyBankAccounts?.items?.find(acc =>
                acc.currencies.find(
                  x => x.code === this.currency?.currency?.code,
                ),
              )
            );
          },
        };
      })
      ?.filter(x => x.currency) ?? [],
  );

  const config = {
    list: {
      id: 'how_do_you_want_to_buy_currency',
      languageContext: { currencyDescription: currency?.currency?.description },
      component: <BuyOptions {...{ options, history, account, rates }} />,
    },
    form: {
      id: 'buying_currency',
      languageContext: { currencyDescription: currency?.currency?.description },
      component: (
        <BuyForm
          {...{
            sellingCurrency: selectedCurrency,
            services,
            rates,
            currency,
            onContinue: resp => {
              if (resp?.status === 'success') {
                setConversionQuote(resp?.data);
                setState('confirm');
              } else {
                setResult({
                  result: resp,
                  onNext: () =>
                    history.push(
                      `/accounts/${account}/${currency?.currency?.code}`,
                    ),
                  onCancel: () => setState('form'),
                });
                setState('result');
              }
            },
            tier: props?.buy,
            accountFees: props?.accountFees,
            groupFees: props?.groupFees,
          }}
        />
      ),
      onBack: onList,
    },
    confirm: {
      id: 'confirm',
      component: (
        <BuyConfirm
          {...{
            buySellCurrency: selectedCurrency,
            conversionQuote,
            currency,
            selectedCurrency,
            rates,
            onConfirm: resp => {
              setResult({
                result: resp,
                text: `${
                  resp?.status === 'success'
                    ? 'Successfully bought'
                    : 'Failed to buy'
                } ${formatAmountString(
                  conversionQuote?.to_amount,
                  currency?.currency,
                  true,
                )}`,
                onNext: () =>
                  history.push(
                    `/accounts/${account}/${currency?.currency?.code}`,
                  ),
                onCancel: onList,
              });
              setState('result');
            },
            onCancel: onList,
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
          let items = [];
          let successMessage = '';
          const amountString = formatAmountString(
            conversionQuote?.to_amount,
            currency?.currency,
            true,
          );

          items = [
            {
              id: 'amount',
              labelId: 'buying',
              value: amountString,
            },
            {
              id: 'amount2',
              labelId: 'spending',
              value: amountString,
              value2: formatAmountString(
                conversionQuote?.['from_total_amount'],
                selectedCurrency?.currency,
                true,
              ),
            },
          ];

          let itemsExtra = [];

          if (conversionQuote?.created) {
            itemsExtra.push({
              id: 'created',
              labelId: 'date',
              // label: 'Date',
              // value: moment(conversionQuote.created).format('DD-MM-YYYY'),
              value: getCountryFormattedDate(
                conversionQuote.created,
                profile?.items?.nationality,
                true,
              ),
            });
          }
          if (conversionQuote?.rate) {
            itemsExtra.push({
              id: 'rate',
              labelId: 'rate',
              // label: 'Rate',
              value: `1 ${currency?.currency?.code} for ${formatDecimals(
                1 / conversionQuote.rate,
                selectedCurrency?.currency?.divisibility,
              )} ${getCurrencyCode(selectedCurrency?.currency)}`,
            });
          }
          if (conversionQuote?.to_amount) {
            itemsExtra.push({
              id: 'to_amount',
              labelId: 'buying',
              // label: 'You buy',
              value: formatAmountString(
                conversionQuote.to_amount,
                currency?.currency,
                true,
              ),
            });
          }
          if (conversionQuote?.to_fee) {
            itemsExtra.push({
              id: 'to_fee',
              labelId: 'service_fee',
              // label: 'Buy service fee',
              value: formatAmountString(
                conversionQuote.to_fee,
                currency?.currency,
                true,
              ),
            });
          }
          if (conversionQuote?.from_amount) {
            itemsExtra.push({
              id: 'from_amount',
              labelId: 'base_cost',
              // label: 'Base cost',
              value: formatAmountString(
                conversionQuote.from_amount,
                selectedCurrency?.currency,
                true,
              ),
            });
          }
          if (conversionQuote?.from_fee) {
            itemsExtra.push({
              id: 'from_fee',
              labelId: 'service_fee',
              // label: 'Sell Service Fee',
              value: formatAmountString(
                conversionQuote.from_fee,
                selectedCurrency?.currency,
                true,
              ),
            });
          }
          if (conversionQuote?.from_total_amount) {
            itemsExtra.push({
              id: 'from_total_amount',
              labelId: 'total_cost',
              // label: 'Total cost',
              value: formatAmountString(
                conversionQuote.from_total_amount,
                selectedCurrency?.currency,
                true,
              ),
            });
          }

          return (
            <SuccessPage
              successMessage={successMessage}
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
              failedMessageId="buy_failed"
              result={result.result || {}}
              onBack={result.onCancel}
              onContinue={result.onNext}
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
