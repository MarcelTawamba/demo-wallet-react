import React, { Component, useState } from 'react';
import { fetchData } from 'redux/rehive/actions';
import * as yup from 'yup';
import { get } from 'lodash';
import Big from 'big.js';
import { Formik } from 'formik';
import { Box, Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import AccountSelector from 'screens/accounts/components/selectors/AccountSelector';
import AccountSelectingCard from 'screens/accounts/components/selectors/AccountSelectingCard';
import { createDebit, updateSEP24Transaction } from 'util/rehive';
import { getCurrencyCode } from 'util/general';
import Text from 'components/outputs/Text';
import PageTitle from 'components/layout/page/PageTitle';
import PageContent from 'components/layout/page/PageContent';
import PageButtons from 'components/layout/page/PageButtons';
import { useHistory } from 'react-router-dom';
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
import Info from 'components/outputs/Info';
import AmountInput from 'screens/accounts/components/AmountInput';
import moment from 'moment';
import CurrencyBadge from 'screens/accounts/components/currency/CurrencyBadge';
import { View } from 'components/layout/View';
import Icon from 'components/outputs/NewIcon';
import CardWithLabel from 'components/outputs/CardWithLabel';
import CardContent from 'components/outputs/CardContent';
import WalletCardContent from 'screens/accounts/components/currency/WalletCardContent';
import Help from '@material-ui/icons/Help';
import { useTheme } from 'components/app/context';
import HelpCenterPage from 'screens/help_center';
import AddWithdrawAccount from './AddWithdrawAccount';

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
    allowCryptoBankWithdraw: true,
    cryptoBankWithdrawAdd: false, // flag for showing bank form instead of crypto form when the crypto-currency `allowCryptoBankWithdraw` is true and selected Add bank account.
  };

  setShowTrustlineError = value => this.setState({ showTrustlineError: value });

  setEnableWithdraw = value => this.setState({ enableWithdraw: value });

  componentDidMount() {
    this.setState({ withdrawCurrency: this.props.currency });
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
        allowCryptoBankWithdraw: true,
      });
      const { formState } = this.state;
      if (formState === 'result') {
        this.setState({ formState: '' });
        this.withdrawForm.resetForm();
      } else {
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
    const { selectedAccount, allowCryptoBankWithdraw } = this.state;

    const {
      currency,
      services,
      crypto,
      rates,
      sep24transaction,
      history,
      withdrawCurrency,
    } = this.props;
    let { amount, display } = values;
    setSubmitting(true);
    let response = null;

    const isCrypto = false;

    amount = new Big(parseFloat(amount));
    if (
      services?.conversion_service &&
      rates.rates &&
      rates.displayCurrency.code &&
      display
    ) {
      const convRate = calculateRate(
        withdrawCurrency?.code,
        rates.displayCurrency.code,
        rates.rates,
      );
      amount = amount / convRate;
    }
    amount = amount * 10 ** withdrawCurrency.divisibility;
    amount = parseInt(amount);

    try {
      // CALL THE STELLAR SERVICE
      const payload = {
        amount,
        currency: withdrawCurrency?.code,
        tx_type: 'withdraw',
        status: 'initiated_invoicing',
        rehive_withdrawal_account_reference: selectedAccount.id,
      };
      const response = await updateSEP24Transaction(
        sep24transaction?.identifier,
        payload,
        true,
      );
      console.log(response);
      this.props.onSuccess();

      //TODO : SOMETHING BETTER AND CLEANUP
      history.push('/checkout/?request=' + response?.data?.prs_request_id);
      // this.setState({ formState: 'result', result: response });
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
          this.handleFormSubmit(props);
        }
        break;
    }
    this.setState({ formState: nextFormState });
  }

  getWithdrawAccounts = isCrypto => {
    const { allowCryptoBankWithdraw } = this.state;
    const { userBankAccounts, cryptoAccounts, currency, withdrawCurrency } =
      this.props;
    let _withdrawAccounts = [];
    if (allowCryptoBankWithdraw || !isCrypto) {
      _withdrawAccounts = _withdrawAccounts.concat(
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
      _withdrawAccounts = _withdrawAccounts.concat(
        cryptoAccounts.items.filter(
          acc => acc.crypto_type === currency.crypto?.blockchain,
        ),
      );
    }
    return _withdrawAccounts;
  };

  renderWithdraw(props, isCrypto) {
    let { withdrawCurrency } = this.props;
    const {
      selectedAccount,
      hasTrustline,
      showTrustlineError,
      enableWithdraw,
    } = this.state;
    const {
      currency,
      crypto,
      currencies,
      services,
      rates,
      tierFees,
      profile,
      colors,
      accountFees,
      groupFees,
    } = this.props;
    // const { infoMessage = 'withdraw_info' } = config;
    const withdrawAccounts = this.getWithdrawAccounts(isCrypto);

    if (withdrawAccounts.length && !selectedAccount) {
      this.setState({ selectedAccount: withdrawAccounts[0] });
      return;
    }
    let withdrawCurrencies = [
      {
        label: getCurrencyCode(currency),
        value: currency,
        id: currency?.code,
      },
    ];

    const fees = getFees(
      tierFees,
      `withdraw_${isCrypto ? 'crypto' : 'manual'}`,
      currency,
      accountFees,
      groupFees,
    );
    const amountInputProps = {
      services,
      formikProps: props,
      currency: { currency },
      enableMax: true,
      subtype: `withdraw_${isCrypto ? 'crypto' : 'manual'}`,
      fees,
    };

    const trustlineHook = [
      hasTrustline,
      hasTrustline => this.setState({ hasTrustline }),
    ];

    const classes = this.props.classes;

    const isRtl = document.dir === 'rtl';

    return (
      <React.Fragment>
        <PageContent>
          <PageTitle
            titleId="withdraw_funds"
            titleVariant="h6"
            // back={showBackButton}
            // handleBack={handleBack}
          />
          {/* {infoMessage && <Info mb={4} mt={-1} id={infoMessage} />} */}
          <Grid container spacing={3} style={{ marginBottom: 4 }}>
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
                />
              </CardWithLabel>
            </Grid>
          </Grid>
          <AmountInput {...amountInputProps} />
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
              onPress: () => this.handleButtonPress(props, 'confirm'),
            },
          ]}
        />
      </React.Fragment>
    );
  }

  onAddAccountClickHandle = () => {};

  renderAccountSelection(props, isCrypto) {
    const { currency, services } = this.props;

    const { selectedAccount, allowCryptoBankWithdraw } = this.state;
    const withdrawAccounts = this.getWithdrawAccounts(isCrypto);

    return (
      <AccountSelector
        onHelp={() => this.handleButtonPress(props, 'help')}
        isCrypto={false}
        onBack={() => this.handleButtonPress(props, '')}
        accounts={withdrawAccounts}
        services={services}
        selectedAccount={selectedAccount}
        currency={currency?.currency}
        onAddClick={(cryptoBankWithdrawAdd = false) =>
          this.setState({ cryptoBankWithdrawAdd }, () =>
            this.handleButtonPress(props, 'add'),
          )
        }
        handleAccountSelection={selectedAccount => {
          this.setState({ selectedAccount, formState: '' });
        }}
        allowCryptoBankWithdraw={false}
      />
    );
  }

  onBackToAccountSelection = () => {
    this.setState({ formState: 'accountSelection' });
  };

  resetFormState = () => {
    this.setState({ formState: '' });
  };

  renderEdit = (isCrypto, editing) => {
    const { selectedAccount, cryptoBankWithdrawAdd } = this.state;
    let { withdrawCurrency } = this.props;
    const componentProps = {
      ...this.props,
      isCrypto,
      editing,
      selectedAccount,
      withdrawCurrency,
      cryptoBankWithdrawAdd,
      onBackToAccountSelection: this.onBackToAccountSelection,
      resetFormState: this.resetFormState,
    };
    return <AddWithdrawAccount {...componentProps} />;
  };

  handleAccountSave = type => {
    fetchData(!type ? 'bankAccounts' : 'cryptoAccounts');
    this.setState({ formState: '' });
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
        tierLimits,
        tierFees,
        accountLimits,
        accountFees,
        groupFees,
        profile,
      } = this.props;
      const {
        withdrawCurrency,
        selectedAccount,
        hasTrustline,
        allowCryptoBankWithdraw,
      } = this.state;
      const { display, amount } = values;
      
      // Replace useMemo with regular variable assignments
      const groupName = get(profile, ['items', 'groups', 0, 'name'], '');
      const company = profile?.items?.company;

      // account validation
      try {
        if (!selectedAccount) return { account: 'No withdraw account' };
      } catch (e) {
        return { account: 'No withdraw account' };
      }

      let schema = yup.object().shape({
        amount: yup
          .number()
          .typeError('Please enter a valid number')
          // .moreThan(0, 'Amount must be more than 0')
          .required('Amount is required'),
      });
      let errors = this.validate(values, schema);
      if (errors.path) {
        return {
          [errors.path]: errors.message,
        };
      }
      if (parseFloat(amount) <= 0) {
        return {
          amount: 'Amount must be more than 0',
        };
      }

      let convRate = 1;
      const { hasConversion } = rates;

      // const hasConvert =
      //   services?.conversion_service &&
      //   rates &&
      //   rates.rates &&
      //   rates.displayCurrency &&
      //   currency?.currency?.code !== withdrawCurrency.code;

      if (hasConversion)
        convRate = calculateRate(
          currency?.currency?.code,
          rates.displayCurrency.code,
          rates.rates,
        );

      let amountValue = amount;
      if (hasConversion && display) amountValue = amount / convRate;

      // let valid = null;
      // if (hasConversion) {
      //   valid = _useLimitValidation(
      //     amount,
      //     tier,
      //     currency.currency,
      //     'sell',
      //     withdrawCurrency,
      //   );
      // } else {
      //   valid = _useLimitValidation(
      //     amount,
      //     tier,
      //     withdrawCurrency,
      //     isCrypto ? 'withdraw_crypto' : 'withdraw_manual',
      //     withdrawCurrency,
      //   );
      // }
      const valid = _useLimitValidation(
        amount,
        tierLimits,
        currency,
        isCrypto ? 'withdraw_crypto' : 'withdraw_manual',
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
        isCrypto ? 'withdraw_crypto' : 'withdraw_manual',
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
    const { formState, withdrawCurrency } = this.state;

    const formInitialValues = {
      amount: '',
      id: '',
      account: {},
      currency,
      display: false,
    };

    const isStellar = checkIfStellar(currency);
    const isCrypto = false;

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
              {formState === 'accountSelection' ? (
                this.renderAccountSelection(props, isCrypto)
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

  return <WithdrawForm {...props} colors={colors} />;
}

export default withStyles(styles)(WithdrawWrapper);
