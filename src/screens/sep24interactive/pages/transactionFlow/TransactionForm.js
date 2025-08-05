import React, { useState, useEffect } from 'react';

import { useSelector } from 'react-redux';
import { currentSessionsSelector } from 'redux/auth/selectors';
import { configAuthSelector } from 'redux/rehive/selectors';
import PageTitle from 'components/layout/page/PageTitle';
import AmountInput from 'screens/accounts/components/AmountInput';
import { Formik } from 'formik';
import { View } from 'components/layout/View';
import { Button } from 'components/inputs/Button';
import { useForm } from 'react-hook-form';
import { useToast } from 'components/contexts/ToastContext';
import { useHistory } from 'react-router-dom';
import { formatDivisibility, multiplyDivisibility } from 'util/general';

import CurrencySelect from './CurrencySelect';
import DropdownSelector from 'components/inputs/DropdownSelector';
import CardTitle from 'components/card/CardTitle';
import PageContent from 'components/layout/page/PageContent';
import WithdrawForm from './WithdrawForm';

import { SplashScreen } from 'components/rehive/SplashScreen';

import {
  updateSEP24Transaction,
  getCompanyCurrencies,
  getStellarAssets,
  getSEP24Transaction,
  getBankAccounts,
  getStellarCompany,
} from 'util/rehive';
import Text from 'components/outputs/Text';

const defaultValues = {
  amount: '',
};

const formConfig = values => {
  // let fields = {
  //   {'id': 'currencySelector', 'label': 'currency', 'variant': 'select', 'options': ['USDC', 'TEST'] },
  //   'amount',
  //   currency: {
  //     variant: 'currencySelector',
  //     props: { item: currency },
  //   },
  // }
  let fields = ['amount'];

  return {
    defaultValues: { ...defaultValues, ...values },
    submitLabel: 'confirm',
    submitLabelCapitalize: true,
    fields,
  };
};

export default function TransactionForm(props) {
  const { company, setUser, state, dispatch } = props;

  const authConfig = useSelector(configAuthSelector);

  const { showToast } = useToast();
  let { userID, companyID, token } = useSelector(currentSessionsSelector);

  const formConfigObj = formConfig();
  const { defaultValues, mapDefaultValues } = formConfigObj;

  // TODO: Review as this feels like too much loose state
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [response, setResponse] = useState(null);
  const [sep24_currencies, setSep24Currencies] = useState([]);
  const [sep24_withdrawal_currencies, setSep24WithdrawalCurrencies] = useState(
    [],
  );
  const [sep24transaction, setSep24Transaction] = useState();
  const [sep24transactionType, setSep24transactionType] = useState();
  const [selected_tx_type, setSelectedTxType] = useState('deposit');
  const [withdrawalAccount, setWithdrawalAccount] = useState();
  const [selected_currency, setSelectedCurrency] = useState();
  const [selectedwithdrawal_currency, setSelectedWithdrawalCurrency] =
    useState();
  const [user_bank_accounts, setUserBankAccounts] = useState([]);
  const [currencies_loaded, setCurrenciesLoaded] = useState(false);
  const [withdrawal_currencies_loaded, setWithdrawalCurrenciesLoaded] =
    useState(false);

  const history = useHistory();

  const formMethods = useForm({
    defaultValues,
    mode: 'onChange',
    // reValidateMode: 'onChange',
    onSubmit: handleTransactionSubmit,
  });
  const { handleSubmit, getValues, setValue, setError } = formMethods;

  const values = getValues();

  // Get initial transaction state
  async function getTransaction() {
    await setInitialLoad(true);
    const resp = await getSEP24Transaction(
      state.sep24transaction?.identifier,
      state.testnet,
    );
    await setSep24Transaction(resp?.data);
    await setSep24transactionType(resp?.data?.tx_type);
    await setInitialLoad(false);
  }

  // Currency setup API calls
  async function setupCurrencyList() {
    const stellar_currency_response = await getStellarAssets(state.testnet);
    const rehive_currencies = await getCompanyCurrencies();

    // Creates a new currency list of just sep24 enabled
    const sep24_enabled_currency_list = [];

    for (let i = 0; i < stellar_currency_response?.data.length; i++) {
      if (stellar_currency_response?.data[i].sep24_enabled) {
        for (let x = 0; x < rehive_currencies?.results.length; x++) {
          if (
            rehive_currencies?.results[x].code ===
            stellar_currency_response?.data[i].currency_code
          ) {
            sep24_enabled_currency_list.push(rehive_currencies?.results[x]);
          }
        }
      }
    }
    await setSelectedCurrency(sep24_enabled_currency_list[0]);
    await setSep24Currencies(sep24_enabled_currency_list);
    await setCurrenciesLoaded(true);
  }

  async function setupWithdrawalCurrencyList() {
    const stellar_company = await getStellarCompany(state.testnet);
    const rehive_currencies = await getCompanyCurrencies();

    // Creates a new currency list of just sep24 enabled
    const sep24_withdrawal_currency_list = [];

    for (
      let i = 0;
      i < stellar_company?.data?.sep24_withdrawable_currencies.length;
      i++
    ) {
      for (let x = 0; x < rehive_currencies?.results.length; x++) {
        if (
          rehive_currencies?.results[x].code ===
          stellar_company?.data?.sep24_withdrawable_currencies[i]
        ) {
          sep24_withdrawal_currency_list.push(rehive_currencies?.results[x]);
        }
      }
    }

    await setSelectedWithdrawalCurrency(sep24_withdrawal_currency_list[0]);
    await setSep24WithdrawalCurrencies(sep24_withdrawal_currency_list);
    await setWithdrawalCurrenciesLoaded(true);
  }

  async function getUserBankAccounts() {
    const bank_accounts_response = await getBankAccounts();
    setUserBankAccounts(bank_accounts_response);
  }

  // Hydrate with currency data
  useEffect(() => {
    getTransaction();
    getUserBankAccounts();
    setupCurrencyList();
    setupWithdrawalCurrencyList();
  }, []);

  // Handle currency form interactions
  async function handleSuccess(redirect_url) {
    history.push(`/checkout/?request=${redirect_url}`);
  }

  function handleCurrencyChange(currency) {
    setSelectedCurrency(currency);
  }

  function handleWithdrawalCurrencyChange(currency) {
    setSelectedWithdrawalCurrency(currency);
  }

  function handleSelectedTxType(tx_type) {
    setSelectedTxType(tx_type);
  }

  async function handleSelectedTxTypeUpdate() {
    await setSep24transactionType(selected_tx_type);
  }

  async function handleTransactionSubmit(formikProps) {
    if (sep24transaction?.status === 'prs_requested') {
      handleSuccess(sep24transaction?.prs_request_id);
      return;
    }
    setLoading(true);
    const curCurrency =
      sep24_currencies.find(
        currency => currency?.code === sep24transaction?.currency,
      ) ||
      sep24_currencies.find(
        currency => currency?.code === selected_currency?.code,
      );
    const data = {
      currency: curCurrency?.code,
      status: 'initiated_invoicing',
      tx_type: selected_tx_type,
    };

    if (sep24transaction?.amount <= 0 || !sep24transaction?.amount) {
      data.amount = multiplyDivisibility(
        formikProps.values.amount,
        curCurrency?.divisibility,
      );
    }
    const resp = await updateSEP24Transaction(
      state.sep24transaction?.identifier,
      data,
      state.testnet,
    );

    if (resp?.status === 'success') {
      setLoading(false);
      handleSuccess(resp?.data?.prs_request_id);
    } else {
      console.log('ERROR ERROR ERROR');
    }
  }

  const isAuthed = userID && companyID && token;

  useEffect(() => {
    if (!isAuthed) {
      setLoading(false);
    }
  }, [isAuthed]);

  // function renderAddBankAccount() {
  //   const selectedAccount = withdrawalAccount;
  //   const withdrawCurrency = selected_currency;
  //   const cryptoBankWithdrawAdd = false;
  //   const isCrypto = false;
  //   const editing = false;
  //   const componentProps = {
  //     isCrypto,
  //     editing,
  //     selectedAccount,
  //     withdrawCurrency,
  //     cryptoBankWithdrawAdd
  //   };
  //   return <AddWithdrawAccount {...componentProps} />;
  // };

  // WithdrawForm props

  function fetchAccounts() {
    console.log('fetching accounts');
  }
  // const temp_selected_currency = {
  //   'code': 'USD',
  //   'divisibility': 2
  // }

  const withdrawalFormProps = {
    onSuccess: fetchAccounts,
    currencies: sep24_withdrawal_currencies,
    accountLimits: [],
    account: withdrawalAccount,
    currency: selectedwithdrawal_currency,
    currencyCode: selectedwithdrawal_currency?.code,
    withdrawCurrency: selectedwithdrawal_currency,
    handleStateChange: () => {
      console.log('testing_end');
    },
    userBankAccounts: { items: user_bank_accounts },
    cryptoAccounts: { items: [] },
    sep24transaction: sep24transaction,
    history: history,
  };

  function renderContent() {
    if (initialLoad) {
      return (
        <PageContent pb={0}>
          <PageTitle titleVariant="h5" title={'Loading transaction details'} />
        </PageContent>
      );
    } else if (sep24transactionType === 'deposit') {
      return (
        <>
          {currencies_loaded ? (
            <div style={{ width: '100%' }}>
              {/* <PageTitle title={'Select a currency and amount'} /> */}
              {/* <CurrencySelect
                currencies={sep24_currencies}
                state={state}
                isAuthed={true}
                handleCurrencyChange={handleCurrencyChange}
                currency={selected_currency}
              /> */}
              {sep24transaction?.amount > 0 && sep24transaction?.currency ? (
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    marginLeft: 20,
                    paddingLeft: 12,
                    marginBottom: 16,
                    color: '#333333',
                  }}>
                  You are purchasing{' '}
                  {formatDivisibility(
                    sep24transaction?.amount,
                    sep24_currencies.find(
                      currency => currency.code === sep24transaction.currency,
                    )?.divisibility,
                  )}{' '}
                  {sep24transaction?.currency}. Please confirm to continue to
                  checkout.
                </h3>
              ) : (
                <>
                  <h3
                    style={{
                      fontSize: 16,
                      fontWeight: 'bold',
                      marginLeft: 20,
                      paddingLeft: 12,
                      marginBottom: 16,
                      color: '#333333',
                    }}>
                    {sep24transaction?.currency
                      ? `You are purchasing ${sep24transaction?.currency}. Please enter an amount to purchase to continue.`
                      : 'Please select a currency to purchase.'}
                  </h3>
                  {!sep24transaction?.currency && (
                    <CurrencySelect
                      currencies={sep24_currencies}
                      state={state}
                      isAuthed={true}
                      handleCurrencyChange={handleCurrencyChange}
                      currency={selected_currency}
                    />
                  )}
                </>
              )}

              <Formik initialValues={{ amount: '' }}>
                {formikProps => (
                  <View grid gap={1.5} w={'100%'} ph={2}>
                    {sep24transaction?.amount < 1 && (
                      <AmountInput
                        formikProps={formikProps}
                        currency={{ currency: selected_currency }}
                      />
                    )}
                    <Button
                      id="Confirm"
                      color={'primary'}
                      onPress={() => handleTransactionSubmit(formikProps)}
                      loading={loading}
                      disabled={
                        sep24transaction?.amount <= 0
                          ? !formikProps.isValid
                          : false
                      }
                      noPadding
                      wide
                      capitalize
                    />
                    <p></p>
                  </View>
                )}
              </Formik>
            </div>
          ) : (
            <div style={{ width: '100%' }}>
              <PageTitle title={'Loading currency list'} />
              <CurrencySelect
                currencies={sep24_currencies}
                state={state}
                isAuthed={false}
                handleCurrencyChange={handleCurrencyChange}
                currency={selected_currency}
              />
            </div>
          )}
        </>
      );
    } else if (sep24transactionType === 'withdraw') {
      return (
        <>
          <PageTitle title={'Select a currency to withdraw too'} />
          <CurrencySelect
            currencies={sep24_withdrawal_currencies}
            state={state}
            isAuthed={true}
            handleCurrencyChange={handleWithdrawalCurrencyChange}
            currency={selectedwithdrawal_currency}
          />
          {selectedwithdrawal_currency ? (
            <WithdrawForm {...withdrawalFormProps} />
          ) : (
            <div></div>
          )}
          {/* <AccountSelector
          onHelp={() => console.log('help')}
          isCrypto={false}
          onBack={() => console.log('back')}
          accounts={[{'test': 'testing'}]}
          selectedAccount={{'test': 'testing'}}
          currency={selected_currency}
          onAddClick={() => renderAddBankAccount()}
          handleAccountSelection={selectedAccount => {
            setWithdrawalAccount(selectedAccount)
          }}
          allowCryptoBankWithdraw={false}
        /> */}
        </>
      );
    } else {
      return (
        <PageContent pb={0}>
          <PageTitle
            titleVariant="h6"
            title={'Are you making a deposit or withdrawal?'}
          />
          <DropdownSelector
            noPadding
            mb={0}
            data={[
              { label: 'Deposit', value: 'deposit' },
              { label: 'Withdrawal', value: 'withdraw' },
            ]}
            item={selected_tx_type}
            onValueChange={item => handleSelectedTxType(item)}
            renderItem={item => <TxTypeSelectorItem item={item} />}
            keyExtractor={item => item.value}
          />
          <Button
            id="Confirm"
            color={'primary'}
            onPress={() => handleSelectedTxTypeUpdate()}
            noPadding
            wide
            capitalize
          />
        </PageContent>
      );
    }
  }

  return <>{renderContent()}</>;
}

const TxTypeSelectorItem = props => {
  const { item, ...restProps } = props;
  const { label } = item;
  const title = {
    title: label,
    subtitle: '',
    textStyleTitle: { fontWeight: '400' },
    iconSize: 16,
  };

  return (
    <div
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: 16,
        paddingLeft: 8,
        paddingTop: 15,
        paddingBottom: 15,
        width: '100%',
      }}
      {...restProps}>
      <CardTitle {...title} />
    </div>
  );
};
