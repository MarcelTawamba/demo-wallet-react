import React, { Component, useMemo, useState } from 'react';
import * as yup from 'yup';
import { get } from 'lodash';
import Big from 'big.js';
import { Formik } from 'formik';
import { Box, Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import AccountSelector from '../selectors/AccountSelector';
import AccountSelectingCard from '../selectors/AccountSelectingCard';
import { createDebit, deleteItem } from 'util/rehive';
import { getCurrencyCode } from 'util/general';
import Text from 'components/outputs/Text';
import PageTitle from 'components/layout/page/PageTitle';
import PageContent from 'components/layout/page/PageContent';
import PageButtons from 'components/layout/page/PageButtons';
import ConfirmPage from 'components/layout/page/ConfirmPageNew';
import SuccessPage from 'components/layout/page/SuccessPageNew';
import FailedPage from 'components/layout/page/FailedPageNew';
import { checkIfStellar } from 'util/crypto';
import { calculateRate, formatAmountString } from 'util/rates';
import ErrorOutput from 'components/outputs/Error';
import {
  useFee as _useFee,
  useLimitValidation as _useLimitValidation,
  useFeeWithConversion as _useFeeWithConversion,
  getFees,
} from 'util/fees';
import { useWithdrawSubtypeConfig } from 'hooks/useAppConfig';
import Info from 'components/outputs/Info';
import AmountInput from '../AmountInput';
import moment from 'moment';
import CurrencyBadge from '../currency/CurrencyBadge';
import { View } from 'components/layout/View';
import Icon from 'components/outputs/NewIcon';
import CardWithLabel from 'components/outputs/CardWithLabel';
import CardContent from 'components/outputs/CardContent';
import WalletCardContent from '../currency/WalletCardContent';
import Help from '@material-ui/icons/Help';
import { useTheme } from 'components/app/context';
import HelpCenterPage from 'screens/help_center';
import AddWithdrawAccount from './withdraw/AddWithdrawAccount';
import { Button } from 'components/inputs/Button';

const styles = theme => ({
  headerWrapper: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 48,
  },
  headerWrapperAddEditForm: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 26,
    padding: '0 40px',
  },
  headerBackIcon: { fontSize: 14, zIndex: 99, cursor: 'pointer' },
  withdrawFromWrapper: {
    border: '1px solid #DADADA',
    padding: '12px 14px',
    marginTop: 10,
    borderRadius: 8,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 90,
    [theme.breakpoints.down(1050)]: {
      height: 100,
    },
    [theme.breakpoints.down(980)]: {
      height: 90,
    },
  },
  withdrawFromInfoWrapper: {
    textTransform: 'uppercase',
    display: 'flex',
    flexDirection: 'column',
    // gap: 3,
  },
  currencyDescription: {
    fontSize: 10,
  },
  currencyAvailableBalance: {
    fontSize: 14,
    color: theme.palette.primary.main,
  },
  currencyConvBalance: {
    fontSize: 12,
    color: '#777777',
  },

  withdrawToWrapper: {
    border: '1px solid #DADADA',
    padding: '12px 14px',
    marginTop: 10,
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 90,
    [theme.breakpoints.down(1050)]: {
      height: 100,
    },
    [theme.breakpoints.down(980)]: {
      height: 90,
    },
  },
  feeWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'end',
  },
  feeAmountText: {
    color: theme.palette.primary.main,
    marginLeft: 8,
    fontSize: 14,
  },
});
class WithdrawForm extends Component {
  constructor(props) {
    super(props);
    this.handleButtonPress = this.handleButtonPress.bind(this);
  }

  state = {
    formState: '',
    result: null,
    withdrawCurrency: '',
    hasTrustline: true,
    showTrustlineError: false,
    enableWithdraw: true,
    selectedAccount: null,
    allowCryptoBankWithdraw: Boolean(
      this.props?.actionsConfig?.withdraw?.config?.cryptoBankSupport?.some(
        item => item === this.props?.currency?.currency?.code,
      ),
    ),
    cryptoBankWithdrawAdd: false,
    pollingInterval: null,
  };

  setShowTrustlineError = value => this.setState({ showTrustlineError: value });

  setEnableWithdraw = value => this.setState({ enableWithdraw: value });

  componentDidMount() {
    this.setState({ withdrawCurrency: this.props.currency.currency });
    // Check for pending accounts and start polling if needed
    this.checkForPendingAccounts();
  }

  componentWillUnmount() {
    // Clean up polling interval when component unmounts
    this.stopPolling();
  }

  // Start polling for bank accounts updates
  startPolling = () => {
    // Only start if not already polling
    if (!this.state.pollingInterval) {
      const interval = setInterval(() => {
        this.props.fetchData('bankAccounts');
      }, 1000); // Poll every second
      this.setState({ pollingInterval: interval });
    }
  }

  // Stop polling for bank accounts updates
  stopPolling = () => {
    if (this.state.pollingInterval) {
      clearInterval(this.state.pollingInterval);
      this.setState({ pollingInterval: null });
    }
  }

  // Check for pending accounts and manage polling accordingly
  checkForPendingAccounts = () => {
    const { withdrawCurrency } = this.state;
    const { userBankAccounts } = this.props;
    
    // Check if verification is required based on config
    const requireVerification = this.props.actionsConfig?.withdraw?.config?.requireVerifiedBankAccountForWithdraw ?? false;
    
    // Only proceed with polling if verification is required
    if (!requireVerification) {
      this.stopPolling();
      return;
    }
    
    if (!userBankAccounts || !userBankAccounts.items) return;
    
    // Check for pending bank accounts
    const pendingAccounts = userBankAccounts.items.filter(
      acc => 
        acc.action === 'withdraw' && 
        acc.status === 'pending' &&
        (!withdrawCurrency || acc.currencies.findIndex(
          curr => curr.code === withdrawCurrency.code
        ) !== -1)
    );
    
    const hasPendingAccounts = pendingAccounts.length > 0;
    
    // Start or stop polling based on whether there are pending accounts
    if (hasPendingAccounts) {
      this.startPolling();
    } else {
      this.stopPolling();
    }
  }

  // Add handleDeleteAccount method
  handleDeleteAccount = async (account) => {
    console.log('Delete account:', account);
    
    // Always use bankAccounts for withdrawal form since we're deleting bank accounts
    const accountType = 'bankAccounts';
    
    try {
      // Use the deleteItem function directly from util/rehive
      // Import is now at the top of the file
      
      console.log(`Deleting account type: ${accountType}, ID: ${account.id}`);
      
      // Delete the account - explicitly use 'bankAccounts'
      await deleteItem(accountType, account.id);
      
      // If the deleted account was selected, reset selection
      if (this.state.selectedAccount && this.state.selectedAccount.id === account.id) {
        this.setState({ selectedAccount: null });
      }
      
      // Refresh the accounts list after deletion
      this.props.fetchData('bankAccounts');
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  }

  componentDidUpdate(prevProps) {
    const currencyChanged =
      prevProps.currency?.currency?.code !==
      this.props.currency?.currency?.code;
    if (currencyChanged && this.withdrawForm) {
      this.setState({
        withdrawCurrency: this.props.currency.currency,
        cryptoBankWithdrawAdd: false,
        selectedAccount: null,
        allowCryptoBankWithdraw: Boolean(
          this.props?.actionsConfig?.withdraw?.config?.cryptoBankSupport?.some(
            item => item === this.props?.currency?.currency?.code,
          ),
        ),
      });
      const { formState } = this.state;
      if (formState === 'result') {
        this.setState({ formState: '' });
        this.withdrawForm.resetForm();
      } else {
        this.withdrawForm.validateForm();
      }
    }
    
    // Check if bank accounts have changed
    const bankAccountsChanged = 
      JSON.stringify(prevProps.userBankAccounts?.items) !== 
      JSON.stringify(this.props.userBankAccounts?.items);
    
    if (bankAccountsChanged) {
      // Check for pending accounts and update polling
      this.checkForPendingAccounts();
      
      // Validate form if needed
      if (this.withdrawForm) {
        this.withdrawForm.validateForm();
      }
    }
    
    try {
      if (
        get(prevProps, ['cryptoAccounts', 'items', 'length']) !==
          get(this.props, ['cryptoAccounts', 'items', 'length']) ||
        get(prevProps, ['userBankAccounts', 'items', 'length']) !==
          get(this.props, ['userBankAccounts', 'items', 'length'])
      ) {
        if (this.withdrawForm) {
          this.withdrawForm.validateForm();
        }
      }
    } catch (e) {}
  }

  async handleFormSubmit(props) {
    const { values, setSubmitting } = props; // FormikProps
    const { selectedAccount, withdrawCurrency, allowCryptoBankWithdraw } =
      this.state;
    const { currency, services, crypto, rates } = this.props;
    let { amount, display } = values;
    setSubmitting(true);
    let response = null;

    const isCrypto = Boolean(currency.crypto);
    // Check if this is a bank withdrawal for a crypto currency
    const isBankWithdraw = allowCryptoBankWithdraw && selectedAccount?.bank_name;

    amount = new Big(parseFloat(amount));
    if (
      services?.conversion_service &&
      rates.rates &&
      rates.displayCurrency.code &&
      display
    ) {
      const convRate = calculateRate(
        currency?.currency?.code,
        rates.displayCurrency.code,
        rates.rates,
      );
      amount = amount / convRate;
    }
    amount = amount * 10 ** currency.currency.divisibility;
    amount = parseInt(amount);

    try {
      const withdrawMetadata = {
        account: selectedAccount,
        // Use 'fiat' type for bank withdrawals even if currency is crypto
        type: isCrypto && !isBankWithdraw ? 'crypto' : 'fiat',
      };
      let payload = {
        amount,
        metadata: {
          native_context: withdrawMetadata,
          rehive_context: withdrawMetadata,
        },
        currency: currency?.currency?.code,
        account: currency.account,
        // Use configurable subtype for bank withdrawals, fallback to withdraw_manual
        subtype: isCrypto && !isBankWithdraw 
          ? 'withdraw_crypto' 
          : this.props.withdrawSubtypeConfig?.defaultSubtype || 'withdraw_manual',
      };
      response = await createDebit(payload);
      this.props.onSuccess();
      this.setState({ formState: 'result', result: response });
    } catch (error) {
      console.log(error);
      this.setState({ formState: 'result', result: error });
    }
    setSubmitting(false);
  }

  handleButtonPress(props, type) {
    props && props.setStatus({ error: '' });
    const { formState } = this.state;
    let nextFormState = formState;

    switch (formState) {
      case 'confirm':
        if (type === 'confirm') {
          this.handleFormSubmit(props);
        } else {
          nextFormState = '';
        }
        break;
      case 'result':
        nextFormState = '';
        if (type === 'success') {
          this.props.handleStateChange({ state: '' });
        }
        break;
      case 'accountSelection':
        nextFormState = type;
        break;
      default:
        if (type === 'add') {
          nextFormState = 'add';
        } else if (type === 'accountSelection' || type === 'help') {
          nextFormState = type;
        } else {
          nextFormState = 'confirm';
        }
        break;
    }
    
    this.setState({ formState: nextFormState }, () => {
      // Only check for pending accounts if verification is required
      const requireVerified = this.props.actionsConfig?.withdraw?.config?.requireVerifiedBankAccountForWithdraw ?? false;
      if (requireVerified) {
        this.checkForPendingAccounts();
      } else {
        this.stopPolling(); // Make sure polling is stopped if not required
      }
    });
  }

  getWithdrawAccounts = isCrypto => {
    const { allowCryptoBankWithdraw, withdrawCurrency } = this.state;
    const { userBankAccounts, cryptoAccounts, currency, actionsConfig } = this.props;
    const requireVerified = actionsConfig?.withdraw?.config?.requireVerifiedBankAccountForWithdraw ?? false;
    console.log(`[getWithdrawAccounts] requireVerified = ${requireVerified}`);
    let _withdrawAccounts = [];
    if (allowCryptoBankWithdraw || !isCrypto) {
      _withdrawAccounts = _withdrawAccounts.concat(
        userBankAccounts.items.filter(
          acc => {
            const isWithdrawAction = acc.action === 'withdraw';
            const isVerifiedIfNeeded = (!requireVerified || acc.status === 'verified');
            const matchesCurrency = acc.currencies.findIndex(
              curr => curr.code === withdrawCurrency.code,
            ) !== -1;

            if (acc.id === 40457) {
              console.log(`  [Filter Check ID: ${acc.id}] Status: ${acc.status}`);
              console.log(`    requireVerified: ${requireVerified}`);
              console.log(`    Condition: (!requireVerified || acc.status === 'verified')`);
              console.log(`    Evaluates to: (${!requireVerified} || ${acc.status === 'verified'}) => ${isVerifiedIfNeeded}`);
            }

            return isWithdrawAction && isVerifiedIfNeeded && matchesCurrency;
          }
        ),
      );
    }
    
    // Add crypto accounts when isCrypto is true and currency is not in hideCryptoAccounts
    const hideCryptoAccounts = actionsConfig?.withdraw?.config?.hideCryptoAccounts || [];
    const isCryptoHidden = hideCryptoAccounts.includes(currency.currency?.code);
    if (isCrypto && !isCryptoHidden) {
      _withdrawAccounts = _withdrawAccounts.concat(
        cryptoAccounts.items.filter(
          acc => acc.crypto_type === currency.crypto?.blockchain,
        ),
      );
    }
    
    console.log(`[getWithdrawAccounts] Returning:`, _withdrawAccounts.map(a => ({ id: a.id, status: a.status })));
    return _withdrawAccounts;
  };

  // Get all accounts including pending ones for display purposes
  getAllWithdrawAccounts = isCrypto => {
    const { allowCryptoBankWithdraw, withdrawCurrency } = this.state;
    const { userBankAccounts, cryptoAccounts, currency } = this.props;
    let _allAccounts = [];
    if (allowCryptoBankWithdraw || !isCrypto) {
      // Include all bank accounts (verified, pending, and declined)
      _allAccounts = _allAccounts.concat(
        userBankAccounts.items.filter(
          acc =>
            acc.action === 'withdraw' &&
            acc.currencies.findIndex(
              curr => curr.code === withdrawCurrency.code,
            ) !== -1,
        ),
      );
    }
    if (isCrypto) {
      _allAccounts = _allAccounts.concat(
        cryptoAccounts.items.filter(
          acc => acc.crypto_type === currency.crypto?.blockchain,
        ),
      );
    }
    return _allAccounts;
  };

  renderWithdraw(props, isCrypto) {
    const {
      selectedAccount,
      withdrawCurrency,
      hasTrustline,
      showTrustlineError,
      enableWithdraw,
      allowCryptoBankWithdraw,
    } = this.state;
    const {
      currency,
      actionsConfig,
      crypto,
      currencies,
      services,
      rates,
      tierFees,
      profile,
      colors,
      accountFees,
      groupFees,
      settingsConfig,
    } = this.props;
    const { withdraw: withdrawConfig } = actionsConfig;
    const { config } = withdrawConfig;
    const { infoMessage = 'withdraw_info' } = config;
    const withdrawAccounts = this.getWithdrawAccounts(isCrypto);
    const allAccounts = this.getAllWithdrawAccounts(isCrypto);
    
    // Check if there are pending accounts
    const pendingAccounts = allAccounts.filter(acc => acc.status === 'pending');
    const hasPendingAccounts = pendingAccounts.length > 0;
    
    // Check if there are declined accounts
    const declinedAccounts = allAccounts.filter(acc => acc.status === 'declined');
    const hasDeclinedAccounts = declinedAccounts.length > 0;

    // Only start polling if verification is required
    const requireVerified = this.props.actionsConfig?.withdraw?.config?.requireVerifiedBankAccountForWithdraw ?? false;
    if (requireVerified && hasPendingAccounts) {
      this.startPolling();
    } else {
      this.stopPolling();
    }

    if (withdrawAccounts.length && !selectedAccount) {
      this.setState({ selectedAccount: withdrawAccounts[0] });
      return;
    }
    const showWithdrawCurrency = Boolean(
      withdrawConfig?.config?.pairs?.length &&
        withdrawConfig?.config?.pairs?.filter(
          pair => pair.split(':')[0] === currency?.currency?.code,
        ).length > 0,
    );
    let withdrawCurrencies = [
      {
        label: getCurrencyCode(currency.currency),
        value: currency.currency,
        id: currency?.currency?.code,
      },
    ];
    try {
      if (showWithdrawCurrency) {
        const extraCurrencies = withdrawConfig.config.pairs
          .filter(pair => pair.split(':')[0] === currency?.currency?.code)
          .map(pair => {
            const code = pair.split(':')[1];
            const currency = currencies.items.find(
              currency => currency?.currency?.code === code,
            );
            if (currency) {
              return {
                id: code,
                label: code,
                value: currency.currency,
              };
            }
            return null;
          })
          .filter(item => item);
        withdrawCurrencies = withdrawCurrencies.concat(extraCurrencies);
      }
    } catch (e) {}
    
    // Check if this is a bank withdrawal for a crypto currency
    const isBankWithdraw = allowCryptoBankWithdraw && selectedAccount?.bank_name;
    
    // Use the correct withdrawal type based on the account type
    const withdrawType = isCrypto && !isBankWithdraw 
      ? 'withdraw_crypto' 
      : this.props.withdrawSubtypeConfig?.defaultSubtype || 'withdraw_manual';
    
    const fees = getFees(
      tierFees,
      withdrawType,
      currency,
      accountFees,
      groupFees,
    );
    const amountInputProps = {
      services,
      formikProps: props,
      currency,
      enableMax: true,
      subtype: withdrawType,
      fees,
    };

    const trustlineHook = [
      hasTrustline,
      hasTrustline => this.setState({ hasTrustline }),
    ];

    const classes = this.props.classes;

    let amountValue = props.values.amount;
    let amountString = '';
    let amountConvString = '';
    const { hasConversion } = rates;

    // Calculate conversion rate
    let convRate = 1;
    if (hasConversion) {
      convRate = calculateRate(
        currency?.currency?.code,
        rates.displayCurrency.code,
        rates.rates,
      );
    }
    amountString = formatAmountString(amountValue, currency.currency);
    if (
      hasConversion &&
      convRate &&
      currency?.currency?.code !== rates?.displayCurrency?.code
    ) {
      amountConvString =
        '~' + formatAmountString(amountValue * convRate, rates.displayCurrency);
    }

    const { feeString, feeConvString } = _useFeeWithConversion(
      amountValue,
      tierFees,
      currency,
      withdrawType,
      convRate,
      rates.displayCurrency,
      accountFees,
      groupFees,
    );

    let fee;
    if (feeString) {
      fee = feeString;
      if (feeConvString && props.values.display) {
        fee = feeConvString.replace('~', '');
      }
    }
    const isRtl = document.dir === 'rtl';

    const globalHideFields = settingsConfig?.bank?.hideFields || [];
    const actionHideFields = actionsConfig?.withdraw?.config?.hideBankFields || [];

    const hideFields = Array.from(new Set([...globalHideFields, ...actionHideFields]));

    const {
      name,
      number,
      type,
      bank_name,
      routing_number,
      bank_code,
      branch_code,
      swift,
      iban,
      bic,
    } = selectedAccount || {};

    let groupItemsExtra = [
      {
        id: 1,
        labelId: 'account_details',
        items: [],
      },
      {
        id: 2,
        labelId: 'bank_details',
        items: [],
      },
    ];

    if (isCrypto) {
      groupItemsExtra[0].items.push({
        id: 'account',
        labelId: 'address',
        value: selectedAccount?.address,
      });

      if (selectedAccount?.crypto_type === 'stellar') {
        groupItemsExtra[0].items.push({
          labelId: 'memo',
          value: selectedAccount?.metadata?.memo ?? 'Warning - no memo!',
          horizontal: true,
        });
      }
    } else {
      if (bank_name) {
        groupItemsExtra[1].items.push({
          id: 'bank_name',
          labelId: 'bank_name',
          value: bank_name,
          horizontal: true,
        });
      }
      if (name) {
        groupItemsExtra[0].items.push({
          id: 'bank_name',
          labelId: 'to_account',
          value: bank_name,
          value2: number,
          horizontal: true,
        });
        groupItemsExtra[1].items.push({
          id: 'bank_name',
          labelId: 'to_account',
          value: bank_name,
          horizontal: true,
        });
      }
      if (number) {
        groupItemsExtra[1].items.push({
          id: 'number',
          labelId: 'account_number',
          value: number,
          horizontal: true,
        });
      }
      if (type) {
        groupItemsExtra[1].items.push({
          id: 'type',
          labelId: 'type',
          value: type,
          horizontal: true,
        });
      }
      if (branch_code) {
        groupItemsExtra[1].items.push({
          id: 'branch_code',
          labelId: 'branch_code',
          value: branch_code,
          horizontal: true,
        });
      }
      if (bank_code) {
        groupItemsExtra[1].items.push({
          id: 'bank_code',
          labelId: 'bank_code',
          value: bank_code,
          horizontal: true,
        });
      }
      if (swift) {
        groupItemsExtra[1].items.push({
          id: 'swift',
          labelId: 'swift',
          value: swift,
          horizontal: true,
        });
      }
      if (iban) {
        groupItemsExtra[1].items.push({
          id: 'iban',
          labelId: 'iban',
          value: iban,
          horizontal: true,
        });
      }
      if (routing_number) {
        groupItemsExtra[1].items.push({
          id: 'routing_number',
          labelId: 'routing_number',
          value: routing_number,
          horizontal: true,
        });
      }
      if (bic) {
        groupItemsExtra[1].items.push({
          id: 'bic',
          labelId: 'bic',
          value: bic,
          horizontal: true,
        });
      }
    }

    let bankDetailsFields = [
      { id: 'name', labelId: 'account_name', value: name },
      { id: 'number', labelId: 'account_number', value: number },
      { id: 'type', labelId: 'type', value: type },
      { id: 'bank_name', labelId: 'bank_name', value: bank_name },
      { id: 'routing_number', labelId: 'routing_number', value: routing_number },
      { id: 'bank_code', labelId: 'bank_code', value: bank_code },
      { id: 'branch_code', labelId: 'branch_code', value: branch_code },
      { id: 'swift', labelId: 'swift', value: swift },
      { id: 'iban', labelId: 'iban', value: iban },
      { id: 'bic', labelId: 'bic', value: bic },
    ];

    bankDetailsFields = bankDetailsFields.filter(
      field => !hideFields.includes(field.id) && field.value,
    );

    bankDetailsFields.forEach(field => {
      groupItemsExtra[1].items.push({
        id: field.id,
        labelId: field.labelId,
        value: field.value,
        horizontal: true,
      });
    });

    return (
      <React.Fragment>
        <PageContent>
          <PageTitle
            titleId="withdraw_funds"
            titleVariant="h6"
            // back={showBackButton}
            // handleBack={handleBack}
            actions={
              <View
                fD="row"
                aI="center"
                style={{ cursor: 'pointer' }}
                onClick={() => this.handleButtonPress(props, 'help')}>
                {
                  <Text
                    color="primary"
                    style={{
                      textDecoration: 'underline',
                      fontSize: 14,
                    }}
                    id="need_help"
                  />
                }
                <Help
                  style={{
                    [isRtl ? 'marginRight' : 'marginLeft']: 8,
                    color: colors.primary,
                    fontSize: 20,
                  }}
                />
              </View>
            }
          />
          {infoMessage && <Info mb={4} mt={-1} id={infoMessage} />}
          
          {/* Combined notification for pending and declined accounts */}
          {/* Conditionally render based on flag AND existence of pending/declined */}
          {(hasPendingAccounts || hasDeclinedAccounts) &&
            (this.props.actionsConfig?.withdraw?.config?.requireVerifiedBankAccountForWithdraw ?? false) && (
            <Box 
              mb={4}
              style={{
                borderRadius: 15,
                backgroundColor: 'rgb(50, 121, 174, 0.1)',
                border: '1px solid rgb(50, 121, 174)',
                padding: '16px',
              }}
            >
              <View 
                fD={window.innerWidth < 600 ? 'column' : 'row'}
                aI={window.innerWidth < 600 ? 'flex-start' : 'center'}
                jC="space-between"
                w="100%"
              >
                <View 
                  fD="row" 
                  aI="center" 
                  style={{ 
                    marginBottom: window.innerWidth < 600 ? 12 : 0 
                  }}
                >
                  <Icon
                    circled={false}
                    icon="information"
                    size={20}
                    color="info"
                    style={{ 
                      marginRight: 12,
                      flexShrink: 0
                    }}
                  />
                  <Text
                    display="inline"
                    style={{ 
                      color: 'rgb(50, 121, 174)', 
                      fontSize: 14,
                    }}
                  >
                    <Text display="inline" bold myColor="info">
                      Info:{' '}
                    </Text>
                    <Text 
                      display="inline"
                      id="bank_accounts_status" 
                      fallback="You have bank accounts that require attention. View your accounts for details."
                      myColor="info"
                    />
                  </Text>
                </View>
                <Button
                  variant="text"
                  color="primary"
                  style={{ 
                    marginLeft: window.innerWidth < 600 ? 0 : 'auto', 
                    fontSize: 14, 
                    padding: '0 8px', 
                    fontWeight: 500,
                    whiteSpace: 'nowrap'
                  }}
                  onClick={() => this.handleButtonPress(props, 'accountSelection')}
                  id="view_bank_accounts"
                  fallback="View accounts"
                />
              </View>
            </Box>
          )}
          
          <Grid container spacing={3} style={{ marginBottom: 4 }}>
            <Grid item md={6} xs={12}>
              <CardWithLabel id="withdraw_from">
                <CardContent
                  image={
                    <CurrencyBadge
                      currency={currency.currency}
                      radius={12}
                      style={{ padding: 0 }}
                    />
                  }>
                  <Box className={classes.withdrawFromInfoWrapper}>
                    <WalletCardContent wallet={currency} rates={rates} />
                  </Box>
                </CardContent>
              </CardWithLabel>
            </Grid>
            <Grid item md={6} xs={12}>
              <CardWithLabel
                id="withdraw_to"
                onClick={() =>
                  this.handleButtonPress(props, 'accountSelection')
                }>
                <AccountSelectingCard
                  currency={withdrawCurrency}
                  trustlineHook={trustlineHook}
                  crypto={crypto}
                  data={withdrawAccounts}
                  type={isCrypto ? 'crypto' : 'fiat'}
                  selectedAccount={selectedAccount}
                  badgeRightAlign={true}
                  setShowTrustlineError={this.setShowTrustlineError}
                  services={services}
                  user={profile?.items}
                  disableHover={true}
                  requireVerifiedBankAccountForWithdraw={this.props.actionsConfig?.withdraw?.config?.requireVerifiedBankAccountForWithdraw ?? false}
                  showEditForVerified={true}
                />
              </CardWithLabel>
              {showTrustlineError && (
                <View fD="row" aI="center" mt={0.5}>
                  <Icon
                    icon="error"
                    color="#FF4C6F"
                    circled={false}
                    style={{ marginRight: 12 }}
                  />
                  <Text
                    id="stellar_trustline_required"
                    c="#FF4C6F"
                    variant="body2"
                  />
                </View>
              )}
              {!withdrawAccounts.length && hasPendingAccounts && !isCrypto && (
                <View fD="row" aI="center" mt={1}>
                  <Icon
                    icon="info"
                    color="#FAAD14"
                    circled={false}
                    style={{ marginRight: 12, fontSize: 16 }}
                  />
                  <Text
                    id="no_verified_accounts"
                    variant="body2"
                    style={{ color: '#262626', fontSize: 12 }}
                    fallback="Only verified bank accounts can be used for withdrawals. Add a new account or wait for verification to complete."
                  />
                </View>
              )}
            </Grid>
          </Grid>
          <AmountInput {...amountInputProps} />
          {fee && (
            <Box className={classes.feeWrapper}>
              <Text width="initial" s={14} id="fee" />
              <Text className={classes.feeAmountText} width="initial">
                - {fee}
              </Text>
            </Box>
          )}
          {/* <LimitsList
            tier={get(tier, ['items', 0], null)}
            subtype={isCrypto ? 'send' : 'withdraw'}
            currency={currency}
          /> */}
          <ErrorOutput>
            {props.touched.amount && props.errors && props.errors.account}
          </ErrorOutput>
        </PageContent>

        <PageButtons
          layout={'vertical'}
          items={[
            {
              id: 'withdraw',
              capitalize: true,
              type: 'submit',
              size: 'large',
              disabled: !props.isValid || !enableWithdraw,
              onPress: () => this.handleButtonPress(props),
            },
          ]}
        />
      </React.Fragment>
    );
  }

  onAddAccountClickHandle = () => {};

  renderAccountSelection(props, isCrypto) {
    const { currency, services, colors } = this.props;

    const { selectedAccount, allowCryptoBankWithdraw } = this.state;
    const withdrawAccounts = this.getWithdrawAccounts(isCrypto);
    const allAccounts = this.getAllWithdrawAccounts(isCrypto);
    const requireVerified = this.props.actionsConfig?.withdraw?.config?.requireVerifiedBankAccountForWithdraw ?? false;

    // Find pending accounts to show with status indicators
    const pendingAccounts = allAccounts.filter(acc => acc.status === 'pending');
    const hasVerifiedAccounts = withdrawAccounts.length > 0;
    const hasPendingAccounts = pendingAccounts.length > 0;

    // Find declined accounts to show with reasons
    const declinedAccounts = allAccounts.filter(acc => acc.status === 'declined');
    const hasDeclinedAccounts = declinedAccounts.length > 0;

    // --- DEBUG LOGGING START ---
    console.log('[WithdrawForm] renderAccountSelection:');
    console.log('  requireVerified:', requireVerified);
    if (requireVerified) {
      console.log('  -> Accounts (Verified Only):', withdrawAccounts.map(a => ({ id: a.id, status: a.status, name: a.name || a.bank_name })) );
      console.log('  -> Pending Accounts:', pendingAccounts.map(a => ({ id: a.id, status: a.status, name: a.name || a.bank_name })) );
    } else {
      console.log('  -> Accounts (All):', allAccounts.map(a => ({ id: a.id, status: a.status, name: a.name || a.bank_name })) );
    }
    // --- DEBUG LOGGING END ---

    // Ensure polling is active if there are pending accounts AND verification is required
    if (requireVerified && hasPendingAccounts) {
      this.startPolling();
    } else {
      this.stopPolling();
    }

    const accountSelectorProps = {
      onHelp: () => this.handleButtonPress(props, 'help'),
      isCrypto: isCrypto,
      onBack: () => this.handleButtonPress(props, ''),
      services: services,
      selectedAccount: selectedAccount,
      currency: currency?.currency,
      onAddClick: (cryptoBankWithdrawAdd = false) =>
        this.setState({ cryptoBankWithdrawAdd }, () =>
          this.handleButtonPress(props, 'add'),
        ),
      handleAccountSelection: selectedAccount => {
        this.setState({ selectedAccount, formState: '' });
      },
      onEditAccount: account => {
        const isBankAccount = Boolean(account?.bank_name);
        this.setState({
          selectedAccount: account,
          formState: 'edit',
          cryptoBankWithdrawAdd: isBankAccount
        });
      },
      onDeleteAccount: this.handleDeleteAccount,
      allowCryptoBankWithdraw: allowCryptoBankWithdraw,
      hideCryptoAccounts: this.props.actionsConfig?.withdraw?.config?.hideCryptoAccounts || [],
      colors: colors,
      requireVerifiedBankAccountForWithdraw: requireVerified,
      showEditForVerified: true,
    };

    if (requireVerified) {
      // Old layout: Pass separate lists when verification IS required
      accountSelectorProps.accounts = withdrawAccounts; // Verified only
      accountSelectorProps.pendingAccounts = pendingAccounts;
      accountSelectorProps.declinedAccounts = declinedAccounts;
    } else {
      // New layout: Pass all accounts to the 'accounts' prop when verification is NOT required
      accountSelectorProps.accounts = allAccounts;
      // Ensure pending/declined are not passed or are empty for the new layout
      accountSelectorProps.pendingAccounts = [];
      accountSelectorProps.declinedAccounts = [];
    }

    return (
      <>
        <AccountSelector {...accountSelectorProps} />
      </>
    );
  }

  getConfirmMessageId() {
    const { withdrawSubtypeConfig } = this.props;
    
    // Get the current subtype
    const defaultSubtype = withdrawSubtypeConfig?.defaultSubtype || 'withdraw_manual';
    
    // Find the subtype configuration
    const subtypeConfig = withdrawSubtypeConfig?.options?.find(
      subtype => subtype.id === defaultSubtype
    );
    
    // Return the configured confirmMessage or fallback to the default pattern
    return subtypeConfig?.confirmMessage || `${defaultSubtype}_confirmation`;
  }

  getSuccessMessageId() {
    const { withdrawSubtypeConfig } = this.props;
    
    // Get the current subtype
    const defaultSubtype = withdrawSubtypeConfig?.defaultSubtype || 'withdraw_manual';
    
    // Find the subtype configuration
    const subtypeConfig = withdrawSubtypeConfig?.options?.find(
      subtype => subtype.id === defaultSubtype
    );
    
    // Return the configured successMessage or fallback to the default pattern
    return subtypeConfig?.successMessage || `${defaultSubtype}_success`;
  }

  renderConfirm(props, isCrypto) {
    const { values } = props;
    const { rates, currency, tierFees, accountFees, groupFees, t } = this.props;
    const { amount, display } = values;
    const { selectedAccount, allowCryptoBankWithdraw } = this.state;
    const {
      name,
      number,
      type,
      bank_name,
      bank_code,
      branch_code,
      branch_address = {},
      routing_number,
      swift,
      iban,
      bic,
      clabe,
      beneficiary_type,
      owner = {},
    } = selectedAccount || {};

    // Check if this is a bank withdrawal for a crypto currency
    const isBankWithdraw = allowCryptoBankWithdraw && selectedAccount?.bank_name;
    
    // Use the correct withdrawal type based on the account type
    const withdrawType = isCrypto && !isBankWithdraw 
      ? 'withdraw_crypto' 
      : this.props.withdrawSubtypeConfig?.defaultSubtype || 'withdraw_manual';

    const groupItemsExtra = [
      {
        id: 'account',
        items: [],
      },
      {
        id: 'details',
        title: 'bank_details',
        items: [],
      },
    ];

    if (isCrypto) {
      groupItemsExtra[0].items.push({
        id: 'account',
        labelId: 'address',
        value: selectedAccount?.address,
      });

      if (selectedAccount?.crypto_type === 'stellar') {
        groupItemsExtra[0].items.push({
          labelId: 'memo',
          value: selectedAccount?.metadata?.memo ?? 'Warning - no memo!',
          horizontal: true,
        });
      }
    } else {
      // Basic account details
      if (bank_name) {
        groupItemsExtra[1].items.push({
          id: 'bank_name',
          labelId: 'bank_name',
          value: bank_name,
          horizontal: true,
        });
      }
      if (name) {
        groupItemsExtra[1].items.push({
          id: 'name',
          labelId: 'account_name',
          value: name,
          horizontal: true,
        });
      }
      if (number) {
        groupItemsExtra[1].items.push({
          id: 'number',
          labelId: 'account_number',
          value: number,
          horizontal: true,
        });
      }
      if (type) {
        groupItemsExtra[1].items.push({
          id: 'type',
          labelId: 'type',
          value: type,
          horizontal: true,
        });
      }
      if (routing_number) {
        groupItemsExtra[1].items.push({
          id: 'routing_number',
          labelId: 'routing_number',
          value: routing_number,
          horizontal: true,
        });
      }

      // Owner information - ADD NULL CHECK FOR OWNER
      if (owner) {
        if (owner.full_name) {
          groupItemsExtra[1].items.push({
            id: 'owner_full_name',
            labelId: 'owner_full_name',
            value: owner.full_name,
            horizontal: true,
          });
        } else if (owner.first_name || owner.middle_name || owner.last_name) {
          const ownerName = `${owner.first_name || ''} ${owner.middle_name ? owner.middle_name + ' ' : ''}${owner.last_name || ''}`.trim();
          if (ownerName) {
            groupItemsExtra[1].items.push({
              id: 'owner_name',
              labelId: 'owner_full_name',
              value: ownerName,
              horizontal: true,
            });
          }
        }
        if (owner.company_name) {
          groupItemsExtra[1].items.push({
            id: 'owner_company',
            labelId: 'owner_company_name',
            value: owner.company_name,
            horizontal: true,
          });
        }
        if (owner.email_address) {
          groupItemsExtra[1].items.push({
            id: 'owner_email',
            labelId: 'owner_email',
            value: owner.email_address,
            horizontal: true,
          });
        }
        if (owner.phone_number) {
          groupItemsExtra[1].items.push({
            id: 'owner_phone',
            labelId: 'owner_phone',
            value: owner.phone_number,
            horizontal: true,
          });
        }
        if (owner.ein_tin) {
          groupItemsExtra[1].items.push({
            id: 'owner_ein',
            labelId: 'owner_ein_tin',
            value: owner.ein_tin,
            horizontal: true,
          });
        }
        if (owner.cpf_cpnj) {
          groupItemsExtra[1].items.push({
            id: 'owner_cpf',
            labelId: 'owner_cpf_cpnj',
            value: owner.cpf_cpnj,
            horizontal: true,
          });
        }
        if (owner.address) {
          if (owner.address.address_text) {
            groupItemsExtra[1].items.push({
              id: 'owner_address',
              labelId: 'owner_address',
              value: owner.address.address_text,
              horizontal: true,
            });
          } else {
            // Add individual address fields if no address_text
            if (owner.address.line_1) {
              groupItemsExtra[1].items.push({
                id: 'owner_address_line_1',
                labelId: 'branch_address_line_1',
                value: owner.address.line_1,
                horizontal: true,
              });
            }
            if (owner.address.line_2) {
              groupItemsExtra[1].items.push({
                id: 'owner_address_line_2',
                labelId: 'branch_address_line_2',
                value: owner.address.line_2,
                horizontal: true,
              });
            }
            if (owner.address.city) {
              groupItemsExtra[1].items.push({
                id: 'owner_address_city',
                labelId: 'branch_address_city',
                value: owner.address.city,
                horizontal: true,
              });
            }
            if (owner.address.state_province) {
              groupItemsExtra[1].items.push({
                id: 'owner_address_state_province',
                labelId: 'branch_address_state_province',
                value: owner.address.state_province,
                horizontal: true,
              });
            }
            if (owner.address.country) {
              groupItemsExtra[1].items.push({
                id: 'owner_address_country',
                labelId: 'branch_address_country',
                value: owner.address.country,
                horizontal: true,
              });
            }
            if (owner.address.postal_code) {
              groupItemsExtra[1].items.push({
                id: 'owner_address_postal_code',
                labelId: 'branch_address_postal_code',
                value: owner.address.postal_code,
                horizontal: true,
              });
            }
            if (owner.address.state_code) {
              groupItemsExtra[1].items.push({
                id: 'owner_address_state_code',
                labelId: 'branch_address_state_code',
                value: owner.address.state_code,
                horizontal: true,
              });
            }
          }
        }
      } // End of owner null check

      // Bank details
      if (bank_code) {
        groupItemsExtra[1].items.push({
          id: 'bank_code',
          labelId: 'bank_code',
          value: bank_code,
          horizontal: true,
        });
      }
      if (branch_code) {
        groupItemsExtra[1].items.push({
          id: 'branch_code',
          labelId: 'branch_code',
          value: branch_code,
          horizontal: true,
        });
      }
      if (branch_address) {
        if (branch_address.address_text) {
          groupItemsExtra[1].items.push({
            id: 'branch_address',
            labelId: 'branch_address',
            value: branch_address.address_text,
            horizontal: true,
          });
        } else {
          // Add individual branch address fields if no address_text
          if (branch_address.line_1) {
            groupItemsExtra[1].items.push({
              id: 'branch_address_line_1',
              labelId: 'branch_address_line_1',
              value: branch_address.line_1,
              horizontal: true,
            });
          }
          if (branch_address.line_2) {
            groupItemsExtra[1].items.push({
              id: 'branch_address_line_2',
              labelId: 'branch_address_line_2',
              value: branch_address.line_2,
              horizontal: true,
            });
          }
          if (branch_address.city) {
            groupItemsExtra[1].items.push({
              id: 'branch_address_city',
              labelId: 'branch_address_city',
              value: branch_address.city,
              horizontal: true,
            });
          }
          if (branch_address.state_province) {
            groupItemsExtra[1].items.push({
              id: 'branch_address_state_province',
              labelId: 'branch_address_state_province',
              value: branch_address.state_province,
              horizontal: true,
            });
          }
          if (branch_address.country) {
            groupItemsExtra[1].items.push({
              id: 'branch_address_country',
              labelId: 'branch_address_country',
              value: branch_address.country,
              horizontal: true,
            });
          }
          if (branch_address.postal_code) {
            groupItemsExtra[1].items.push({
              id: 'branch_address_postal_code',
              labelId: 'branch_address_postal_code',
              value: branch_address.postal_code,
              horizontal: true,
            });
          }
          if (branch_address.state_code) {
            groupItemsExtra[1].items.push({
              id: 'branch_address_state_code',
              labelId: 'branch_address_state_code',
              value: branch_address.state_code,
              horizontal: true,
            });
          }
        }
      }
      if (swift) {
        groupItemsExtra[1].items.push({
          id: 'swift',
          labelId: 'swift',
          value: swift,
          horizontal: true,
        });
      }
      if (iban) {
        groupItemsExtra[1].items.push({
          id: 'iban',
          labelId: 'iban',
          value: iban,
          horizontal: true,
        });
      }
      if (bic) {
        groupItemsExtra[1].items.push({
          id: 'bic',
          labelId: 'bic',
          value: bic,
          horizontal: true,
        });
      }
      if (clabe) {
        groupItemsExtra[1].items.push({
          id: 'clabe',
          labelId: 'clabe',
          value: clabe,
          horizontal: true,
        });
      }
      if (beneficiary_type) {
        groupItemsExtra[1].items.push({
          id: 'beneficiary_type',
          labelId: 'beneficiary_type',
          value: beneficiary_type,
          horizontal: true,
        });
      }
    }

    // Calculate conversion rate
    let convRate = 1;
    const { hasConversion } = rates;

    // Amount
    let amountValue = 0.0;
    let amountString = '';
    let amountConvString = '';
    amountValue = amount;

    if (hasConversion && display) amountValue = amount / convRate;
    else amountValue = amount;

    amountString = formatAmountString(amountValue, currency.currency);
    if (
      hasConversion &&
      convRate &&
      currency?.currency?.code !== rates?.displayCurrency?.code
    ) {
      amountConvString =
        '~' + formatAmountString(amountValue * convRate, rates.displayCurrency);
    }

    let items = [
      {
        id: 'amount',
        labelId: 'withdraw',
        value: amountString,
        value2: amountConvString,
      },
      {
        id: 'recipient',
        label: 'to',
        value: selectedAccount?.bank_name ?? selectedAccount?.name,
        value2: selectedAccount?.number ?? selectedAccount?.address,
      },
    ];

    let itemsExtra = [
      {
        id: 'account',
        labelId: 'account',
        value: currency.account,
        horizontal: true,
        align: 'right',
      },
      {
        id: 'withdraw_amount',
        labelId: 'withdraw_amount',
        value: amountString,
        value2: amountConvString,
      },
    ];

    const { totalString, fees, totalConvString } = _useFeeWithConversion(
      amountValue,
      tierFees,
      currency,
      withdrawType,
      convRate,
      rates.displayCurrency,
      accountFees,
      groupFees,
    );

    if (fees.length > 0) {
      fees.forEach(fee => {
        itemsExtra.push({
          id: 'fee',
          labelId: fee.name ? fee.name : 'withdrawal_fee',
          value: fee.feeString,
          value2: fee.feeConvString,
          horizontal: true,
        });
      });
      itemsExtra.push({
        id: 'total_amount',
        labelId: 'total_transaction_amount',
        value: totalString,
        value2: totalConvString,
        horizontal: true,
        bold: true,
      });
    }

    return (
      <ConfirmPage
        pageStyle={{ marginTop: 32 }}
        fromAccount={currency.account_label || currency.account_name}
        handleButtonPress={this.handleButtonPress}
        formikProps={props}
        items={items}
        itemsExtra={itemsExtra}
        groupItemsExtra={groupItemsExtra}
      />
    );
  }

  renderResult(formikProps) {
    const { rates, currency, tierFees, accountFees, groupFees, settingsConfig } = this.props;
    const { result, selectedAccount, allowCryptoBankWithdraw } = this.state;
    const { display } = formikProps.values;
    let { amount } = result;

    if (!amount) {
      amount =
        parseFloat(get(formikProps, ['values', 'amount'])) *
        10 ** currency.currency.divisibility;
    } else {
      amount = amount / 10 ** currency.currency.divisibility;
    }

    const success = result.id || result.status === 'success';
    const account = get(result, ['metadata', 'rehive_context', 'account'], {});
    const resultType = get(result, ['metadata', 'rehive_context', 'type']);
    const isCrypto = resultType === 'crypto';
    const isBankWithdraw = resultType === 'fiat' && allowCryptoBankWithdraw && account?.bank_name;

    let convRate = 0;
    const { hasConversion } = rates;
    if (hasConversion) {
      convRate = calculateRate(
        currency?.currency?.code,
        rates.displayCurrency.code,
        rates.rates,
      );
    }

    // Amount
    let amountValue = 0.0;
    let amountString = '';
    let amountConvString = '';
    amountValue = Math.abs(amount);

    amountString = formatAmountString(amountValue, currency.currency);
    if (
      hasConversion &&
      convRate &&
      currency?.currency?.code !== rates?.displayCurrency?.code
    ) {
      amountConvString =
        '~' +
        formatAmountString(
          (amountValue / 10 ** currency.currency?.divisibility) * convRate,
          rates.displayCurrency,
        );
    }

    let items = [
      {
        id: 'amount',
        label:
          result?.data?.status === 'Pending'
            ? 'withdrawal_initiated'
            : 'withdraw',
        value: amountString,
        value2: amountConvString,
      },
      {
        id: 'recipient',
        label: 'to',
        value: account?.bank_name ?? account?.name,
        value2: account?.number ?? account?.address,
      },
    ];

    let itemsExtra = [
      {
        id: 'account',
        labelId: 'account',
        value: currency.account,
        align: 'right',
      },
      {
        id: 'withdraw_amount',
        labelId: 'withdraw_amount',
        value: amountString,
        value2: amountConvString,
      },
    ];

    const { totalString, fees, totalConvString } = _useFeeWithConversion(
      amountValue,
      tierFees,
      currency,
      isCrypto ? 'withdraw_crypto' : this.props.withdrawSubtypeConfig?.defaultSubtype || 'withdraw_manual',
      convRate,
      rates.displayCurrency,
      accountFees,
      groupFees,
    );
    if (fees.length > 0) {
      fees.forEach(fee => {
        itemsExtra.push({
          id: 'fee',
          labelId: fee.name ? fee.name : 'withdrawal_fee',
          value: fee.feeString,
          value2: fee.feeConvString,
          horizontal: true,
        });
      });
      itemsExtra.push({
        id: 'total_amount',
        labelId: 'total_transaction_amount',
        value: totalString,
        value2: totalConvString,
        horizontal: true,
        bold: true,
      });
    }

    let groupItemsExtra = [
      {
        id: 1,
        labelId: 'account_details',
        items: [
          {
            id: 'from_account',
            labelId: 'from_account',
            value: currency.account_label || currency.account_name,
          },
        ],
      },
      {
        id: 2,
        labelId: 'bank_details',
        items: [],
      },
    ];

    if (isCrypto) {
      groupItemsExtra[0].items.push({
        id: 'account',
        labelId: 'address',
        value: account?.address,
      });

      if (account?.crypto_type === 'stellar') {
        groupItemsExtra[0].items.push({
          labelId: 'memo',
          value: account?.metadata?.memo ?? 'Warning - no memo!',
          horizontal: true,
        });
      }
    } else {
      const {
        name,
        type,
        number,
        bank_name,
        bank_code,
        branch_code,
        swift,
        iban,
        routing_number,
        bic,
      } = account ?? {};
      if (bank_name) {
        groupItemsExtra[1].items.push({
          id: 'name',
          labelId: 'name',
          value: name,
          horizontal: true,
        });
      }
      if (name) {
        groupItemsExtra[0].items.push({
          id: 'bank_name',
          labelId: 'to_account',
          value: bank_name,
          value2: number,
          horizontal: true,
        });
        groupItemsExtra[1].items.push({
          id: 'bank_name',
          labelId: 'to_account',
          value: bank_name,
          horizontal: true,
        });
      }
      if (number) {
        groupItemsExtra[1].items.push({
          id: 'number',
          labelId: 'account_number',
          value: number,
          horizontal: true,
        });
      }
      if (type) {
        groupItemsExtra[1].items.push({
          id: 'type',
          labelId: 'type',
          value: type,
          horizontal: true,
        });
      }
      if (branch_code) {
        groupItemsExtra[1].items.push({
          id: 'branch_code',
          labelId: 'branch_code',
          value: branch_code,
          horizontal: true,
        });
      }
      if (bank_code) {
        groupItemsExtra[1].items.push({
          id: 'bank_code',
          labelId: 'bank_code',
          value: bank_code,
          horizontal: true,
        });
      }
      if (swift) {
        groupItemsExtra[1].items.push({
          id: 'swift',
          labelId: 'swift',
          value: swift,
          horizontal: true,
        });
      }
      if (iban) {
        groupItemsExtra[1].items.push({
          id: 'iban',
          labelId: 'iban',
          value: iban,
          horizontal: true,
        });
      }
      if (routing_number) {
        groupItemsExtra[1].items.push({
          id: 'routing_number',
          labelId: 'routing_number',
          value: routing_number,
          horizontal: true,
        });
      }
      if (bic) {
        groupItemsExtra[1].items.push({
          id: 'bic',
          labelId: 'bic',
          value: bic,
          horizontal: true,
        });
      }
    }

    if (success) {
      return (
        <SuccessPage
          pageStyle={{ marginTop: 32 }}
          fromAccount={currency.account_label || currency.account_name}
          handleButtonPress={this.handleButtonPress}
          formikProps={formikProps}
          items={items}
          itemsExtra={itemsExtra}
          groupItemsExtra={groupItemsExtra}
          performedDate={
            result?.created
              ? moment(result.created).format('h.mm A, D MMMM YYYY')
              : null
          }
        />
      );
    } else {
      return (
        <FailedPage
          pageStyle={{ marginTop: 32 }}
          failedMessageId="withdraw_failed"
          result={result}
          handleButtonPress={this.handleButtonPress}
          formikProps={formikProps}
          performedDate={moment().format('h.mm A, D MMMM YYYY')}
        />
      );
    }
  }

  onBackToAccountSelection = () => {
    this.setState({ formState: 'accountSelection' });
  };

  resetFormState = () => {
    this.setState({ formState: '' });
  };

  renderEdit = (isCrypto, editing) => {
    const { currency, services, currencies, fetchData } = this.props;
    const { selectedAccount, withdrawCurrency, cryptoBankWithdrawAdd } = this.state;
    
    // Get the withdraw action configuration
    const { withdraw: withdrawConfig } = this.props.actionsConfig || {};
    const { config } = withdrawConfig || {};
    
    console.log('WithdrawForm renderEdit - START');
    console.log('WithdrawForm renderEdit - Original settingsConfig:', JSON.stringify(this.props.settingsConfig, null, 2));
    console.log('WithdrawForm renderEdit - Bank fields from settings:', this.props.settingsConfig?.bank?.fields);
    console.log('WithdrawForm renderEdit - Action config:', JSON.stringify(config, null, 2));
    console.log('WithdrawForm renderEdit - Action bankFields:', config?.bankFields);
    console.log('WithdrawForm renderEdit - Selected account:', selectedAccount);
    console.log('WithdrawForm renderEdit - cryptoBankWithdrawAdd:', cryptoBankWithdrawAdd);
    
    // Determine if this is a bank account edit
    // If the account has a bank_name property, it's a bank account
    const isBankAccount = Boolean(selectedAccount?.bank_name);
    
    // If editing a bank account, ensure cryptoBankWithdrawAdd is true
    const updatedCryptoBankWithdrawAdd = editing && isBankAccount ? true : cryptoBankWithdrawAdd;
    
    // IMPORTANT: Do NOT modify the original settingsConfig at all
    // Just pass it through as is
    const componentProps = {
      currency,
      services,
      currencies,
      fetchData,
      isCrypto,
      editing,
      selectedAccount,
      withdrawCurrency,
      cryptoBankWithdrawAdd: updatedCryptoBankWithdrawAdd,
      onBackToAccountSelection: this.onBackToAccountSelection,
      resetFormState: this.resetFormState,
      // Pass the original settingsConfig without modification
      settingsConfig: this.props.settingsConfig,
      actionsConfig: this.props.actionsConfig,
    };
    
    console.log('WithdrawForm renderEdit - END');
    return <AddWithdrawAccount {...componentProps} />;
  };

  handleAccountSave = type => {
    this.props.fetchData(!type ? 'bankAccounts' : 'cryptoAccounts');
    this.setState({ formState: '' }, () => {
      // Check for pending accounts after state change
      this.checkForPendingAccounts();
    });
  };

  validate(values, schema) {
    let result = {};
    try {
      result = schema.validateSync(values);
    } catch (e) {
      result = e;
    }
    return result;
  }

  validation(values, initial, isCrypto) {
    try {
      const {
        rates,
        currency,
        tier,
        tierLimits,
        tierFees,
        accountLimits,
        accountFees,
        groupFees,
        settingsConfig,
        actionsConfig,
      } = this.props;

      const {
        withdrawCurrency,
        selectedAccount,
        hasTrustline,
        allowCryptoBankWithdraw,
      } = this.state;
      const { display, amount } = values;
      const requireVerified = actionsConfig?.withdraw?.config?.requireVerifiedBankAccountForWithdraw ?? false;
      
      // Check if this is a bank withdrawal for a crypto currency
      const isBankWithdraw = allowCryptoBankWithdraw && selectedAccount?.bank_name;
      
      // Skip trustline check for bank withdrawals
      if (
        currency.crypto?.blockchain === 'steller' &&
        currency?.currency?.code !== 'XLM' &&
        currency?.currency?.code !== 'TXLM' &&
        !hasTrustline &&
        !isBankWithdraw
      ) {
        return {
          account: 'Destination account does not have the required trustline',
        };
      }

      // Check if the selected account is verified, only if required by config
      if (requireVerified && selectedAccount?.bank_name && selectedAccount?.status !== 'verified') {
        return {
          account: 'Only verified bank accounts can be used for withdrawals',
        };
      }

      if (!amount) {
        return { amount: 'Amount is required' };
      }

      if (amount <= 0) {
        return { amount: 'Amount must be greater than 0' };
      }

      let amountValue = amount;
      const { hasConversion } = rates;
      if (hasConversion && display) {
        const convRate = calculateRate(
          currency?.currency?.code,
          rates.displayCurrency.code,
          rates.rates,
        );
        amountValue = amount / convRate;
      }

      // Use the correct withdrawal type based on the account type
      const withdrawType = isCrypto && !isBankWithdraw ? 'withdraw_crypto' : this.props.withdrawSubtypeConfig?.defaultSubtype || 'withdraw_manual';
      
      const valid = _useLimitValidation(
        amount,
        tierLimits,
        currency,
        withdrawType,
        accountLimits,
      );
      
      if (valid) {
        return valid;
      }

      // check fees -- This is only applicable if no covert!
      let feeAmount = 0.0;
      let totalAmount = amountValue;
      let feeCurrency = hasConversion ? currency.currency : withdrawCurrency;
      ({ feeAmount, totalAmount } = _useFee(
        amountValue,
        tierFees,
        currency,
        accountFees,
        groupFees,
        withdrawType,
      ));

      const availableAmount = currency.available_balance;
      if (totalAmount > availableAmount) {
        return {
          amount:
            'Available balance exceeded: ' +
            formatAmountString(availableAmount, currency.currency, true) +
            (feeAmount
              ? ' (fee: ' +
                formatAmountString(feeAmount, feeCurrency, true) +
                ')'
              : ''),
        };
      }

      if (initial) {
        return true;
      }
      return {};
    } catch (e) {}
  }

  render() {
    const { currency, crypto } = this.props;
    const { formState, withdrawCurrency, selectedAccount, allowCryptoBankWithdraw } = this.state;

    const formInitialValues = {
      amount: '',
      id: '',
      account: {},
      currency,
      display: false,
    };

    const isStellar = checkIfStellar(currency);
    const isCrypto = isStellar ? 'XLM' : currency.crypto?.code;
    
    // Check if this is a bank withdrawal for a crypto currency
    const isBankWithdraw = allowCryptoBankWithdraw && selectedAccount?.bank_name;

    return (
      <>
        <Formik
          ref={ref => (this.withdrawForm = ref)}
          initialValues={formInitialValues}
          enableReinitialize
          validate={values => {
            const valid = this.validation(values, formInitialValues, isCrypto);
            return valid;
          }}>
          {props => (
            <React.Fragment>
              {formState === 'result' ? (
                this.renderResult(props)
              ) : formState === 'accountSelection' ? (
                this.renderAccountSelection(props, isCrypto)
              ) : formState === 'confirm' ? (
                this.renderConfirm(props, isCrypto)
              ) : formState === 'edit' || formState === 'add' ? (
                this.renderEdit(isCrypto, formState === 'edit')
              ) : formState === 'help' ? (
                <WithdrawHelp onBack={() => this.setState({ formState: '' })} />
              ) : (
                this.renderWithdraw(props, isCrypto)
              )}
            </React.Fragment>
          )}
        </Formik>
      </>
    );
  }
}

function WithdrawHelp(props) {
  const [sectionId, setSectionId] = useState('');
  function handleBack() {
    if (sectionId) setSectionId('');
    else props.onBack();
  }
  return (
    <>
      <PageTitle
        titleId="having_trouble_"
        titleVariant="h6"
        back
        handleBack={handleBack}
      />
      <PageContent>
        <HelpCenterPage
          params={{ tab: 'withdrawing_money' }}
          sectionId={sectionId}
          setSectionId={setSectionId}
        />
      </PageContent>
      {/* <HelpTabView dataList={helpData} /> */}
    </>
  );
}

function WithdrawWrapper(props) {
  const { colors } = useTheme();
  const withdrawSubtypeConfig = useWithdrawSubtypeConfig();

  return <WithdrawForm {...props} colors={colors} withdrawSubtypeConfig={withdrawSubtypeConfig} />;
}

export default withStyles(styles)(WithdrawWrapper);
