import React, { useState, useEffect, useMemo } from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import PageButtons from 'components/layout/page/PageButtons';
import DropdownSelector from 'components/inputs/DropdownSelector';
import {
  createTransactionCollection,
  choosePaymentRequestMethod,
  getConversionPairs,
  getAccounts,
} from 'screens/checkout/util/rehive';
import { initWithoutToken, getProfile } from 'util/rehive';
import {
  objectToArray,
  standardizeString,
  uuidv4,
  formatAmountString,
} from 'util/general';
import CardTitle from 'components/card/CardTitle';
import Text from 'components/outputs/Text';
import WalletCard from 'screens/accounts/components/currency/CurrencyCard';
import CurrencyCardSkeleton from 'screens/accounts/components/currency/CurrencyCardSkeleton';
import { walletsSelector } from 'screens/checkout/util/selectors';
import PageContent from 'components/layout/page/PageContent';
import ErrorOutput from 'components/common/outputs/Error';
import { renderRate } from 'util/rates';
import { useQuery } from 'react-query';
import { useRehive } from 'hooks/rehive';
import { View } from 'components/layout/View';

function calculateAllowedConversionCurrencies(pairs, currencyCode) {
  return pairs
    .filter(pair => pair.key.split(':')[1] === currencyCode)
    .map(item => item.key.split(':')[0]);
}

export default function WalletCheckoutAccountSelector(props) {
  const {
    setInitiated,
    context,
    company,
    setQuotes,
    quote,
    currencyCode,
    setCurrencyCode,
    expired,
    setExpired,
    user,
    isAuthed,
    setUser,
  } = props;
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [responseError, setResponseError] = useState('');

  const { invoice = {}, business } = context;
  const {
    user: invoice_user,
    request_currency,
    account: invoiceAccountRef,
  } = invoice;

  const hideCurrency = company?.config?.checkout?.hideCurrency ?? [];
  const hideCurrencies = company?.config?.accounts?.hideCurrencies ?? [];
  const enabled = isAuthed;

  const queryAccounts = useQuery(['accounts', user?.id], getAccounts, {
    enabled,
  });
  // console.log('walletCheckoutSelector > queryAccounts', queryAccounts);
  const loadingAccounts = queryAccounts?.isLoading;
  const wallets = useMemo(
    () => walletsSelector(queryAccounts?.data?.results ?? []),
    [queryAccounts?.data?.results],
  );

  const queryPairs = useQuery(['pairs', user?.id], getConversionPairs, {
    enabled,
  });
  const conversionPairs = queryPairs?.data?.results ?? [];

  const { context: tier } = useRehive('tier', enabled, { user });

  let conversionCodes = useMemo(
    () =>
      calculateAllowedConversionCurrencies(
        conversionPairs,
        request_currency?.code,
      ),
    [conversionPairs, request_currency?.code],
  );

  const allowedCodes = [request_currency?.code].concat(conversionCodes);
  let restrictedCurrencies = useMemo(
    () =>
      hideCurrencies.find(x =>
        tier?.items?.map(y => y?.level).includes(x?.tier),
      ),
    [hideCurrencies],
  );

  restrictedCurrencies = restrictedCurrencies?.currencies ?? [];

  /* Auth */
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    initWithoutToken();
    setUser(null);
  }

  const filteredAccounts = useMemo(
    () =>
      wallets?.items.filter(
        item =>
          !hideCurrency.includes(item?.currency?.code) &&
          !restrictedCurrencies.includes(item?.currency?.code) &&
          allowedCodes.includes(item?.currency?.code), // === quoteCurrencyCode,
      ),
    [wallets?.items, allowedCodes],
  );

  const accounts = useMemo(
    () =>
      filteredAccounts
        .map(item => item.account_name)
        .filter((value, index, self) => self.indexOf(value) === index),
    [filteredAccounts],
  );

  const hideAccounts = accounts.length === 1;
  const account0 = filteredAccounts?.[0]?.account ?? '';

  const [accountRef, setAccountRef] = useState(account0);
  useEffect(() => {
    if (account0 && account0 !== accountRef) setAccountRef(account0);
  }, [account0]);

  const accountItems = useMemo(
    () =>
      objectToArray(wallets?.accounts).filter(item =>
        accounts.includes(item.name),
      ),
    [accounts],
  );
  let accountItem =
    wallets?.accounts?.[accountRef] ??
    wallets?.accounts?.[wallets?.primaryAccount];

  const filteredWallets = useMemo(() =>
    objectToArray(accountItem?.currencies).filter(
      item =>
        !hideCurrency.includes(item?.currency?.code) &&
        !restrictedCurrencies.includes(item?.currency?.code) &&
        allowedCodes.includes(item?.currency?.code),
      [accountItem?.currencies, allowedCodes],
    ),
  );

  const wallet = accountItem?.currencies?.[currencyCode] ?? null;
  const noWallets = filteredWallets?.length === 0;

  const {
    amount,
    reference,
    payment_processor,
    account: paymentProcessorAccount,
    id: paymentProcessorQuoteId,
  } = quote ?? {};
  const showQuotes = conversionCodes.length > 0;
  useEffect(() => {
    const keys = filteredWallets.map(item => item?.currency?.code);

    setCurrencyCode(
      keys.includes(currencyCode)
        ? currencyCode
        : keys.includes(request_currency?.code)
        ? request_currency?.code
        : keys[0],
    );
  }, [filteredWallets]);

  async function handlePayment() {
    setLoading(true);
    setResponseError('');
    try {
      let errorMsgs = '';
      const uuid1 = uuidv4();
      const transactionMetadata = {
        service_payment_requests: {
          quote: {
            id: paymentProcessorQuoteId,
          },
        },
      };
      let transactions = [
        {
          id: uuid1,
          partner: reference,
          tx_type: 'debit',
          status: 'complete',
          amount,
          currency: currencyCode,
          account: accountRef,
          subtype: business ? 'purchase_online' : 'send_email',
          metadata: transactionMetadata,
        },
        {
          id: reference,
          partner: uuid1,
          tx_type: 'credit',
          status: 'complete',
          amount,
          currency: currencyCode,
          account: paymentProcessorAccount,
          subtype:
            payment_processor?.rehive_subtype ?? business
              ? 'sale_online'
              : 'receive_email',

          metadata: transactionMetadata,
        },
      ];
      try {
        await createTransactionCollection(transactions);
        setInitiated(true);
      } catch (e) {
        // eslint-disable-next-line no-unused-expressions
        e?.data?.transactions?.forEach(item => {
          const itemErrors = Object.values(item);
          // eslint-disable-next-line no-unused-expressions
          itemErrors?.forEach(itemError => (errorMsgs += itemError?.join(' ')));
        });
        if (!errorMsgs) errorMsgs = e?.message;
        setResponseError(errorMsgs);
      }
    } catch (error) {
      setResponseError('something_went_wrong');
    }
    setLoading(false);
  }
  async function createQuote() {
    setLoading(true);
    
    const data = {
      payment_processor_currency: wallet?.currency?.code,
      primary_payment_processor: 'native',
    };
    
    // If no payer info on invoice, fetch and use authenticated user's email/mobile
    if (!invoice?.payer_user && !invoice?.payer_email && !invoice?.payer_mobile_number) {
      try {
        const userProfile = await getProfile();
        if (userProfile?.email) {
          data.payer_email = userProfile.email;
        } else if (userProfile?.mobile) {
          data.payer_mobile_number = userProfile.mobile;
        }
      } catch (error) {
        console.error('Failed to fetch user profile for payer info:', error);
      }
    }
    
    const resp = await choosePaymentRequestMethod(invoice?.id, data);
    if (resp.status === 'success') {
      setQuotes(resp?.data?.payment_processor_quotes);
      setExpired(false);
    }
    setLoading(false);
  }
  let buttons = [];
  const insufficientFunds = wallet?.available_balance < amount;
  if (isAuthed && !loadingAccounts) {
    if (quote && !expired) {
      buttons.push({
        label: 'confirm_payment', //TODO: logic here for "CONFIRM QUOTE"
        type: 'submit',
        onClick: handlePayment,
        disabled: loading || insufficientFunds,
        loading,
        capitalize: true,
      });
    } else {
      buttons.push({
        label: 'submit_quote_button', //TODO: logic here for "CONFIRM QUOTE"
        type: 'submit',
        onClick: createQuote,
        disabled: loading,
        loading,
        languageContext: { quote_type: expired ? 'New' : '' },
        capitalize: true,
      });
    }
  }
  buttons.push({
    label: 'logout',
    variant: 'text',
    onClick: handleLogout,
    disabled: loggingOut || loading,
    loading: loggingOut,
  });

  return (
    <>
      <ConversionDetails quote={quote} request={invoice} />
      {/* <LoginSelector company={company} /> */}
      <PageContent>
        {loggingOut || loadingAccounts ? (
          <div className={classes.skeleton}>
            <CurrencyCardSkeleton />
          </div>
        ) : (
          <>
            {!hideAccounts && (
              <DropdownSelector
                className={classes.walletSelector}
                data={accountItems}
                item={accountItem}
                onValueChange={item => setAccountRef(item?.reference ?? item)}
                renderItem={item => <AccountSelectorItem item={item} />}
                keyExtractor={item => item.reference}
              />
            )}
            {noWallets ? (
              <ErrorOutput id="no_account_in_currency" />
            ) : !wallet ? (
              <CurrencyCardSkeleton />
            ) : showQuotes ? (
              <DropdownSelector
                noPadding
                mb={0.00001}
                className={classes.walletSelector}
                data={filteredWallets}
                item={wallet}
                onValueChange={item =>
                  setCurrencyCode(item?.currency?.code ?? item)
                }
                renderItem={item => (
                  <WalletCard
                    noPadding
                    noCard
                    disabled
                    align="left"
                    // rates={rates}
                    // showAccount
                    item={item}
                  />
                )}
                // keyExtractor={item => item.name}
              />
            ) : wallet ? (
              <WalletCard noPadding disabled align="left" item={wallet} />
            ) : (
              <ErrorOutput>No available found</ErrorOutput>
            )}
          </>
        )}
      </PageContent>
      {insufficientFunds && <ErrorOutput id="insufficient_funds" />}
      {responseError && <ErrorOutput id={responseError} />}
      <View ph={0.5} w="100%">
        <PageButtons layout="vertical" items={buttons} />
      </View>
    </>
  );
}

const useStyles = makeStyles(theme => ({
  text: { paddingBottom: theme.spacing(1) },
  accountCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: theme.spacing(2),
    paddingLeft: theme.spacing(1),
    // paddingTop: theme.spacing(2),
    // paddingBottom: theme.spacing(2),
    width: '100%',
  },
  walletSelector: {
    paddingTop: theme.spacing(1),
  },
  rate: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(3),
  },
}));

const AccountSelectorItem = props => {
  const { item, ...restProps } = props;
  const classes = useStyles();
  if (!item) {
    return null;
  }
  const { name, label } = item;
  const title = {
    title: label ? label : standardizeString(name),
    icon: name,
    subtitle: '',
    onPress: () => {},
    titleScale: 'h6',
    textStyleTitle: { fontWeight: '500' },
  };

  return (
    <div className={classes.accountCard}>
      <CardTitle {...title} />
    </div>
  );
};

function ConversionDetails(props) {
  const { quote, request } = props;
  const classes = useStyles();
  if (!quote || !quote?.conversion_quote) {
    return <div className={classes.accountSelector} />;
  }
  const { conversion_quote, amount, currency } = quote;
  const { request_currency, request_amount } = request;

  const requestAmountString = formatAmountString(
    request_amount,
    request_currency,
    true,
  );
  const rateString = renderRate({
    toCurrency: request_currency,
    fromCurrency: currency,
    rate: conversion_quote?.rate,
  });

  return (
    <>
      <Text align="center">{requestAmountString}</Text>
      <Text className={classes.rate} variant="subtitle2" align="center">
        {rateString}
      </Text>
    </>
  );
}
