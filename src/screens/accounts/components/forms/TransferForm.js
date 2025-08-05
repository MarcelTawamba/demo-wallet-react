import React, { Component } from 'react';
import * as yup from 'yup';
import { Formik } from 'formik';
import Big from 'big.js';
import { get } from 'lodash';
import AmountInput from 'screens/accounts/components/AmountInput';
import {
  standardizeString,
  getCurrencyCode,
  displayFormatDivisibility,
} from 'util/general';
import Text from 'components/outputs/Text';
import { createTransfer } from 'util/rehive';
import { calculateRate, formatAmountString } from 'util/rates';
import AccountSelector from 'components/inputs/AccountSelector';
import * as Inputs from 'config/inputs';
import Input from 'components/inputs/Input';
import { View } from 'components/layout/View';

import PageTitle from 'components/layout/page/PageTitle';
import PageContent from 'components/layout/page/PageContent';
import PageButtons from 'components/layout/page/PageButtons';
import ConfirmPage from 'components/layout/page/ConfirmPageNew';
import SuccessPage from 'components/layout/page/SuccessPageNew';
import FailedPage from 'components/layout/page/FailedPageNew';
import moment from 'moment';
import { getCountryFormattedDate } from 'util/date';
import { getFees } from 'util/fees';
class TransferForm extends Component {
  constructor(props) {
    super(props);
    this.handleButtonPress = this.handleButtonPress.bind(this);
  }

  state = {
    index: 0,
    formState: '',
    result: null,
  };

  componentDidUpdate(prevProps) {
    if (this.transferForm && prevProps.currency !== this.props.currency) {
      this.transferForm.validateForm();
    }
  }

  async handleFormSubmit(props) {
    const { values, setSubmitting } = props; // FormikProps
    const { amount, toAccount, display } = values;
    const { currency, onSuccess, rates } = this.props;
    let amountValue = amount;
    if (display) {
      let convRate = 1;
      const { hasConversion } = rates;
      if (hasConversion) {
        convRate = calculateRate(
          currency?.currency?.code,
          rates.displayCurrency.code,
          rates.rates,
        );
      }
      amountValue = new Big(amount / convRate).round(
        rates.displayCurrency.divisibility,
      );
    }
    amountValue = new Big(amountValue).times(
      10 ** currency.currency.divisibility,
    );

    setSubmitting(true);
    let response = null;
    try {
      let data = {
        amount: amountValue,
        debit_account: currency.account,
        credit_account: toAccount,
        credit_metadata: {
          rehive_context: {
            debit_account: currency.account,
          },
        },
        debit_metadata: {
          rehive_context: {
            credit_account: toAccount,
          },
        },
        currency: currency?.currency?.code,
        credit_subtype: 'receive_transfer',
        debit_subtype: 'send_transfer',
      };
      response = await createTransfer(data);
      onSuccess();
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
    const { index } = this.props;

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
        if (type === 'success') {
          this.props.handleStateChange({ state: '' });
        }
        nextFormState = '';
        break;
      default:
        if (type === 'add') {
          nextFormState = 'add';
        } else {
          nextFormState = 'confirm';
        }
        break;
    }
    this.setState({ formState: nextFormState });
  }

  renderFromAccount(props) {
    const { currencies, currency, handleStateChange, rates, services } =
      this.props;
    const { values } = props;

    const formatValue = item =>
      standardizeString(item.account_name) +
      (' (' + item.account + '): ') +
      displayFormatDivisibility(
        item.available_balance,
        item.currency.divisibility,
      ) +
      ' ' +
      getCurrencyCode(item.currency);

    const items = currencies.items.filter(
      curr => curr.currency.code === values.currency,
    );

    const hasConversion =
      services?.conversion_service &&
      rates.rates &&
      rates.displayCurrency?.code &&
      rates.displayCurrency?.code !== currency?.currency?.code;

    let conversionRate = 1;
    if (hasConversion) {
      conversionRate = calculateRate(
        currency?.currency?.code,
        rates.displayCurrency?.code,
        rates.rates,
      );
    }

    return (
      <AccountSelector
        items={items}
        selectedCurrency={currency}
        rates={rates}
        conversionRate={conversionRate}
        label="from"
        renderValue={formatValue}
        onValueChange={account => handleStateChange({ account })}
      />
    );
  }

  renderToAccount(props) {
    const { currencies, rates, services } = this.props;
    const { values, setFieldValue } = props;
    const formatValue = item =>
      standardizeString(item.account_name) +
      (' (' + item.account + '): ') +
      displayFormatDivisibility(
        item.available_balance,
        item.currency.divisibility,
      ) +
      ' ' +
      getCurrencyCode(item.currency);

    let items = currencies.items.filter(
      curr =>
        curr.currency.code === values.currency &&
        curr.account !== values.fromAccount,
    );

    let selectedCurrency = currencies.items.find(
      curr =>
        curr.currency.code === values.currency &&
        curr.account === values.toAccount,
    );

    const hasConversion =
      services?.conversion_service &&
      rates.rates &&
      rates.displayCurrency?.code &&
      rates.displayCurrency?.code !== selectedCurrency?.currency?.code;

    let conversionRate = 1;
    if (hasConversion) {
      conversionRate = calculateRate(
        selectedCurrency?.currency?.code,
        rates.displayCurrency?.code,
        rates.rates,
      );
    }

    return (
      <AccountSelector
        items={items}
        selectedCurrency={selectedCurrency}
        conversionRate={conversionRate}
        rates={rates}
        label="to"
        renderValue={formatValue}
        onValueChange={value => setFieldValue('toAccount', value)}
      />
    );
  }

  renderTransfer(props) {
    const isRtl = document.dir === 'rtl';
    const { currency, tierFees, accountFees, groupFees } = this.props;
    const fees = getFees(tierFees, '', currency, accountFees, groupFees);

    return (
      <React.Fragment>
        <PageContent>
          <AmountInput
            {...{
              formikProps: props,
              currency,
              enableMax: true,
              enableConversion: true,
              fees,
            }}
          />
          {/* <Input field={Inputs.amount} key={'amount'} formikProps={props} /> */}
          <View fD="row">
            <View
              w="50%"
              style={{ [isRtl ? 'paddingLeft' : 'paddingRight']: '5%' }}>
              {this.renderFromAccount(props)}
            </View>
            <View
              w="50%"
              style={{ [isRtl ? 'paddingRight' : 'paddingLeft']: '5%' }}>
              {this.renderToAccount(props)}
            </View>
          </View>
        </PageContent>
        <PageButtons
          layout={'vertical'}
          items={[
            {
              id: 'transfer',
              capitalize: true,
              type: 'submit',
              size: 'large',
              disabled: !props.isValid,
              onPress: () => this.handleButtonPress(props),
            },
          ]}
        />
      </React.Fragment>
    );
  }

  renderConfirm(props) {
    const { values } = props;
    const { currency, currencies, rates, profile } = this.props;
    const { accounts } = currencies;

    const { amount, fromAccount, toAccount, display } = values;
    let amountValue = amount;

    // Calculate conversion rate
    let convRate = 0;
    const { hasConversion } = rates;
    if (hasConversion) {
      convRate = calculateRate(
        currency?.currency?.code,
        rates.displayCurrency.code,
        rates.rates,
      );
    }
    if (display) {
      amountValue = new Big(amount / convRate).round(
        rates.displayCurrency.divisibility,
      );
    }

    const toAccountString = standardizeString(
      get(accounts, [toAccount, 'name']),
    );
    const fromAccountString = standardizeString(
      get(accounts, [fromAccount, 'name']),
    );

    const amountString =
      amountValue + ' ' + getCurrencyCode(currency?.currency);
    let amountConvString = '';
    if (
      hasConversion &&
      convRate &&
      currency?.currency?.code !== rates?.displayCurrency?.code
    ) {
      amountConvString =
        '~' + formatAmountString(amountValue * convRate, rates.displayCurrency);
    }

    const items = [
      {
        id: 'amount',
        labelId: 'transfer',
        value: amountString,
        value2: amountConvString,
        horizontal: true,
      },
      {
        id: 'transfer_from',
        labelId: 'from',
        value: fromAccountString,
        value2: fromAccount,
        horizontal: true,
      },
      {
        id: 'transfer_to',
        labelId: 'to',
        value: toAccountString,
        value2: toAccount,
        horizontal: true,
      },
    ];

    const itemsExtra = [
      {
        id: 'date',
        labelId: 'date',
        value: getCountryFormattedDate(
          new Date(),
          profile?.items?.nationality,
          true,
        ),
        value2: '',
        horizontal: true,
      },
    ];

    return (
      <ConfirmPage
        pageStyle={{ marginTop: 32 }}
        handleButtonPress={this.handleButtonPress}
        formikProps={props}
        items={items}
        itemsExtra={itemsExtra}
      />
    );
  }

  renderResult(props) {
    const { result } = this.state;
    const { values } = props;
    const { amount, fromAccount, toAccount, display } = values;
    const { currency, currencies, rates, services } = this.props;
    const { accounts } = currencies;

    const success = result.id || result.status === 'success';
    const toAccountString = standardizeString(
      get(accounts, [toAccount, 'name']),
    );
    const fromAccountString = standardizeString(
      get(accounts, [fromAccount, 'name']),
    );
    let amountValue = amount;

    // Calculate conversion rate
    let convRate = 0;
    const { hasConversion } = rates;
    if (hasConversion) {
      convRate = calculateRate(
        currency?.currency?.code,
        rates.displayCurrency.code,
        rates.rates,
      );
    }

    if (display) {
      amountValue = new Big(amount / convRate).round(
        rates.displayCurrency.divisibility,
      );
    }

    const amountString =
      amountValue + ' ' + getCurrencyCode(currency?.currency);
    let amountConvString = '';
    if (
      hasConversion &&
      convRate &&
      currency?.currency?.code !== rates?.displayCurrency?.code
    ) {
      amountConvString =
        '~' + formatAmountString(amountValue * convRate, rates.displayCurrency);
    }

    const items = [
      {
        id: 'amount',
        labelId: 'transfer',
        value: amountString,
        value2: amountConvString,
        horizontal: true,
      },
      {
        id: 'transfer_from',
        labelId: 'from',
        value: fromAccountString,
        value2: fromAccount,
        horizontal: true,
      },
      {
        id: 'transfer_to',
        labelId: 'to',
        value: toAccountString,
        value2: toAccount,
        horizontal: true,
      },
    ];

    if (success) {
      return (
        <SuccessPage
          pageStyle={{ marginTop: 32 }}
          handleButtonPress={this.handleButtonPress}
          formikProps={props}
          items={items}
          performedDate={
            result?.created
              ? moment(result.created).format('h.mm A, D MMMM YYYY')
              : null
          }
          successMessageId={'transfer_success'}
        />
      );
    } else {
      return (
        <FailedPage
          pageStyle={{ marginTop: 32 }}
          failedMessageId="transfer_failed"
          result={result}
          handleButtonPress={this.handleButtonPress}
          formikProps={props}
          performedDate={moment().format('h.mm A, D MMMM YYYY')}
        />
      );
    }
  }

  handleAccountSave = type => {
    this.props.fetchData(!type ? 'bankAccounts' : 'cryptoAccounts');
    this.setState({ formState: '' });
  };

  validate(values, schema) {
    let result = {};
    try {
      result = schema.validateSync(values);
    } catch (e) {
      result = e;
      // console.log('e', e);
    }
    return result;
  }

  hidePin() {
    this.setState({ pinVisible: false });
  }

  validation(values, initial) {
    try {
      const { currencies, rates, services } = this.props;
      const currency = currencies.items.find(
        curr =>
          curr.account === values.fromAccount &&
          curr.currency.code === values.currency,
      );
      let maxAmount =
        currency.available_balance / 10 ** currency.currency.divisibility;
      if (values.display) {
        let convRate = 1;
        const hasConversion =
          services?.conversion_service &&
          rates.rates &&
          rates.displayCurrency.code;
        if (hasConversion) {
          convRate = calculateRate(
            currency?.currency?.code,
            rates.displayCurrency.code,
            rates.rates,
          );
        }
        maxAmount = new Big(maxAmount * convRate).round(
          rates.displayCurrency.divisibility,
        );
      }
      let schema = yup.object().shape({
        currency: yup.string().required(),
        toAccount: yup.string().required(),
        fromAccount: yup.string().required(),
        amount: yup
          .number()
          .typeError('Please enter a valid number')
          .moreThan(0, 'Amount must be more than 0')
          .max(
            maxAmount,
            'Available balance exceeded: ' +
              displayFormatDivisibility(
                currency.available_balance,
                currency.currency.divisibility,
              ) +
              ' ' +
              getCurrencyCode(currency?.currency),
          ) // this might need to be formatted / serialised
          .required('Amount is required'),
      });

      let errors = this.validate(values, schema);
      if (errors.path) {
        return {
          [errors.path]: errors.message,
        };
      }
      if (initial) {
        return true;
      }
      return {};
    } catch (e) {
      console.log('TCL: TransferForm -> validation -> e', e);
    }
  }

  render() {
    const { currency, currencies } = this.props;
    const { formState } = this.state;

    let items = currencies.items.filter(
      curr =>
        curr.currency.code === currency?.currency?.code &&
        curr.account !== currency.account,
    );

    const formInitialValues = {
      amount: '',

      fromAccount: currency.account,
      toAccount: get(items, [0, 'account']),
      currency: currency?.currency?.code,
    };

    return (
      <Formik
        ref={ref => (this.transferForm = ref)}
        initialValues={formInitialValues}
        enableReinitialize
        validate={values => {
          const valid = this.validation(values);
          return valid;
        }}>
        {props => (
          <React.Fragment>
            {formState === '' && <PageTitle titleId="transfer" />}
            {formState === 'result'
              ? this.renderResult(props)
              : formState === 'confirm'
              ? this.renderConfirm(props)
              : this.renderTransfer(props)}
          </React.Fragment>
        )}
      </Formik>
    );
  }
}

export default TransferForm;
