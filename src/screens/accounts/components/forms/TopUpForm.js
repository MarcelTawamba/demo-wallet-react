/* eslint-disable no-fallthrough */
import React, { Component } from 'react';
import * as yup from 'yup';
import { Formik, Form } from 'formik';
import Big from 'big.js';
import moment from 'moment';
import { get } from 'lodash';
import * as Inputs from 'config/inputs';
import { createCryptoTransfer, createTransfer } from 'util/rehive';
import { standardizeString, getCurrencyCode } from 'util/general';
import Text from 'components/outputs/Text';
import { validateCrypto, cryptoName } from 'util/validation';
import Input from 'components/inputs/Input';
import RecipientButtons from '../RecipientButtons';
import PageButtons from 'components/layout/page/PageButtons';
import PageContent from 'components/layout/page/PageContent';
import PageTitle from 'components/layout/page/PageTitle';
import ConfirmPage from 'components/layout/page/ConfirmPage';
import ResultPage from 'components/layout/page/ResultPage';
import {
  calculateRate,
  formatDecimals,
  renderRate,
  formatAmountString,
} from 'util/rates';
import AmountInput from '../AmountInput';
import {
  useFee as _useFee,
  useFeeWithConversion as _useFeeWithConversion,
} from 'util/fees';
import { validateMobile } from 'screens/onboarding/config/utils';
class TopUpForm extends Component {
  constructor(props) {
    super(props);
    this.handleButtonPress = this.handleButtonPress.bind(this);
  }

  state = {
    formState: 'send',
    result: null,
    pinVisible: false,
    helpNo: 0,
  };

  componentDidUpdate(prevProps) {
    if (
      prevProps.currency?.currency?.code !==
        this.props.currency?.currency?.code &&
      this.sendForm
    ) {
      const { formState } = this.state;
      if (formState === 'result') {
        this.setState({ formState: 'send' });
        this.sendForm.resetForm();
      } else {
        this.sendForm.validateForm();
      }
    }
  }

  async handleFormSubmit(props) {
    // const { formState } = this.state;
    const { onSuccess, currencies, services, rates } = this.props;
    const { values, setSubmitting } = props; // FormikProps
    let {
      amount,
      recipient,
      note,
      memo,
      recipientType,
      display,
      currency: currencyCode,
    } = values;

    const currency = currencies?.[currencyCode];
    setSubmitting(true);
    let response = null;
    amount = new Big(amount);
    if (
      services?.conversion_service &&
      rates.rates &&
      rates.displayCurrency.code &&
      display &&
      currencyCode !== rates.displayCurrency.code
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

    if (recipientType === 'mobile') {
      if (recipient.indexOf('+') === -1) {
        recipient = '+' + recipient;
      }
    }
    try {
      let data = {
        amount,
        to_reference: recipient,
        currency: currency?.currency?.code,
        crypto: currency.crypto?.code,
        credit_note: note,
        debit_note: note,
        debit_subtype: 'withdraw_teller',
        credit_subtype: 'deposit_teller',
      };
      switch (currency.crypto?.code) {
        case 'XLM':
        case 'TXLM':
          data['memo'] = memo;
        case 'ETH':
        case 'XBT':
        case 'TETH':
        case 'TXBT':
          if (recipientType === 'crypto') {
            response = await createCryptoTransfer(data, currency.crypto?.code);
            break;
          }
        default:
          data['debit_account'] = currency.account;
          data['recipient'] = recipient;
          delete data.to_reference;
          response = await createTransfer(data);
          break;
      }
      onSuccess(currency);
      this.setState({ formState: 'result', result: response });
    } catch (error) {
      console.log(error);
      this.setState({ formState: 'result', result: error });
      // setStatus({ error: error.message });
    }
    setSubmitting(false);
  }

  handleButtonPress = (props, type) => {
    props && props.setStatus({ error: '' });

    const { formState } = this.state;
    const { index } = this.props;

    let nextFormState = formState;
    switch (formState) {
      case 'send':
        nextFormState = 'confirm';
        break;
      case 'confirm':
        if (type === 'confirm') {
          this.handleFormSubmit(props);
        } else {
          nextFormState = 'send';
        }
        break;
      case 'result':
        nextFormState = 'send';
        if (type === 'success') {
          props && props.resetForm();
          this.props.history.push('/pos/top_up/');
        }
        break;
      default:
    }
    this.setState({ formState: nextFormState });
  };

  renderInput(props, item) {
    const { currency, rates } = this.props;
    const { values } = props;

    const id = item === 'recipient' ? values.recipientType + 'Recipient' : item;

    const field = { ...Inputs[id] };

    return <Input field={field} key={item} formikProps={props} />;
  }

  format(type, value = '', currency) {
    switch (type) {
      default:
        return value.toString();
    }
  }

  parse(type, value = '', currency) {
    let newCharacter = value.slice(-1);
    value = value.slice(0, -1);
    // value = value + newCharacter;
    if (newCharacter === ',') {
      newCharacter = '.';
    }
    switch (type) {
      // case 'amount':
      //   return parseDivisibility(value, currency.divisibility, newCharacter);
      default:
        return value + newCharacter;
    }
  }

  renderForm = props => {
    const { currency, currencies, services, rates, tier } = this.props;
    const { values } = props;
    const { stellarTransactionType, recipientType } = values;

    const isStellar =
      recipientType === 'crypto' &&
      currency &&
      (currency.crypto?.code === 'XLM' || currency.crypto?.code === 'TXLM');

    const amountInputProps = {
      services,
      // rates,
      formikProps: props,
      currency,
      currencies,
      onSubmitEditing: this.onSubmitEditing,
      subtype: `deposit_${recipientType}`,
    };
    return (
      <Form style={{ width: '100%' }}>
        <PageContent>
          {this.renderRecipientButtons(props)}
          {this.renderInput(props, 'recipient')}
          <AmountInput {...amountInputProps} />
        </PageContent>
        <PageButtons
          layout={'vertical'}
          items={[
            {
              children: 'CONTINUE',
              type: 'submit',
              size: 'large',
              disabled: !props.isValid,
              onPress: () => this.handleButtonPress(props),
            },
          ]}
        />
      </Form>
    );
  };

  renderRecipientButtons = formikProps => {
    const { currency, actionsConfig } = this.props;
    return (
      <RecipientButtons
        hideCrypto
        actionsConfig={actionsConfig}
        formikProps={formikProps}
        action={'top_up'}
        currency={currency}
        handleRecipientButtonPress={this.handleRecipientButtonPress}
      />
    );
  };

  handleRecipientButtonPress(type, props) {
    const { values } = props;
    const { recipient } = values;
    let value = recipient ? recipient : '';
    props.setFieldValue('recipient', value);
    props.setFieldValue('recipientType', type);
  }

  renderConfirm = props => {
    const { currency, rates, tierFees = [], accountFees = [], groupFees = [] } = this.props;
    const { values } = props;
    const { amount, recipient, memo, note, display, currency: currencyCode } = values;
    const currencies = this.props.currencies;

    const selectedCurrency = currencies?.[currencyCode];

    // Calculate conversion rate
    let convRate = 0;
    const { hasConversion } = rates;
    const showConv = currencyCode !== rates.displayCurrency.code;

    if (hasConversion) {
      convRate = calculateRate(
        selectedCurrency?.currency?.code,
        rates.displayCurrency.code,
        rates.rates,
      );
    }

    // Amount
    let amountValue = 0.0;
    let amountString = '';
    let amountConvString = '';
    let sentenceString = '';
    if (display) {
      amountValue = amount / convRate;
    } else {
      amountValue = amount;
    }
    amountString = formatAmountString(amountValue, selectedCurrency.currency);
    if (hasConversion && showConv) {
      amountConvString =
        '~' + formatAmountString(amountValue * convRate, rates.displayCurrency);
    }
    sentenceString =
      amountString + (amountConvString ? ' (' + amountConvString + ')' : '');
    const items = [
      {
        id: 'amount',
        label: 'Amount',
        value: amountString,
        value2: amountConvString,
        horizontal: true,
      },
    ];

    const { totalString, fees, totalConvString } = _useFeeWithConversion(
      amountValue,
      tierFees,
      selectedCurrency,
      'top_up',
      convRate,
      rates.displayCurrency,
      accountFees,
      groupFees,
    );
    if (fees.length > 0) {
      fees.forEach(fee => {
        itemsExtra.push({
          id: 'fee',
          labelId: fee.name ? fee.name : 'service_fee',
          label: fee.name ? fee.name : 'service_fee',
          value: fee.feeString,
          value2: fee.feeConvString,
          horizontal: true,
        });
      });
      items.push({
        id: 'total_amount',
        label: 'Total amount',
        value: totalString,
        value2: totalConvString,
        horizontal: true,
        bold: true,
      });
    }

    const itemsExtra = [
      {
        id: 'recipient',
        label: standardizeString(
          'Recipient (' +
            (selectedCurrency.crypto?.code ? cryptoName(selectedCurrency.crypto?.code) + ' address' : selectedCurrency.type) +
            ')',
        ),
        value: recipient,
        labelBold: true,
      },
      memo
        ? {
            id: 'memo',
            label: 'Memo',
            value: memo,
            labelBold: true,
          }
        : null,
      note
        ? {
            id: 'note',
            label: 'Note',
            value: note,
            labelBold: true,
          }
        : null,
    ];
    if (hasConversion && showConv) {
      const rate = rates.rates['USD:' + selectedCurrency?.currency?.code];
      if (rate) {
        itemsExtra.push({
          label: 'Rate',
          value: renderRate({
            fromCurrency: selectedCurrency.currency,
            toCurrency: rates.displayCurrency,
            rate: convRate,
          }),
          labelBold: true,
          value2: 'Last updated ' + moment(rate.created).fromNow(),
        });
      }
    }

    const text = (
      <Text
        variant="body1"
        align={'center'}
        style={{
          wordBreak: 'break-word',
        }}>
        {'You are about to top up '}
        <b>{recipient}</b>
        {' with '}
        <b>{sentenceString}</b>
      </Text>
    );

    return (
      <ConfirmPage
        handleButtonPress={this.handleButtonPress}
        action={'top_up'}
        text={text}
        formikProps={props}
        items={items}
        itemsExtra={itemsExtra}
      />
    );
  };

  renderResult(props) {
    const { result } = this.state;
    let { amount, recipient, display, currency: currencyCode } = props.values;
    const { currencies, services, rates } = this.props;

    const currency = currencies[currencyCode];
    const { divisibility } = currency.currency;

    recipient = get(
      result,
      ['destination_transaction', 'user', 'email'],
      recipient,
    );

    let sentenceString = '';
    let amountString = '';
    let amountConvString = '';

    if (
      services?.conversion_service &&
      rates.rates &&
      rates.displayCurrency.code &&
      currencyCode !== rates.displayCurrency.code
    ) {
      const convRate = calculateRate(
        currency?.currency?.code,
        rates.displayCurrency.code,
        rates.rates,
      );

      if (display) {
        amountString =
          formatDecimals(amount / convRate, divisibility) +
          ' ' +
          getCurrencyCode(currency?.currency);
        sentenceString = amountString;

        amountConvString =
          formatDecimals(amount, rates.displayCurrency.divisibility) +
          ' ' +
          getCurrencyCode(rates.displayCurrency);
      } else {
        amountString =
          formatDecimals(amount, divisibility) +
          ' ' +
          getCurrencyCode(currency?.currency);
        sentenceString = amountString;

        amountConvString =
          formatDecimals(
            amount * convRate,
            rates.displayCurrency.divisibility,
          ) +
          ' ' +
          getCurrencyCode(rates.displayCurrency);
      }
      amountConvString = '~' + amountConvString;
      sentenceString = amountString + ' (' + amountConvString + ')';
    } else {
      amountString =
        formatDecimals(amount, divisibility) +
        ' ' +
        getCurrencyCode(currency?.currency);
      sentenceString = amountString;
    }

    let text =
      result.id || result.status === 'success'
        ? 'You topped up '
        : 'You failed topping up ';

    return (
      <ResultPage
        text={text}
        amount={sentenceString}
        recipient={recipient}
        result={result}
        handleButtonPress={this.handleButtonPress}
        formikProps={props}
        nextLabel="DONE"
      />
    );
  }

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

  validation = (values, initial) => {
    try {
      const { currency, rates, tierFees = [], services, accountFees = [], groupFees = [], currencies } = this.props;
      const { currency: currencyCode } = values;
      const selectedCurrency = currencies?.[currencyCode];

      let schema = null;
      const {
        recipientType,
        recipient,
        memo,
        memoSkip,
        stellarTransactionType,
        display,
        amount,
      } = values;

      schema = yup.object().shape({
        amount: yup
          .number()
          .typeError('Please enter a valid number')
          .moreThan(0, 'Amount must be more than 0')
          .required('Amount is required'),
      });

      let errors = this.validate(values, schema);
      if (errors.path) {
        return {
          [errors.path]: errors.message,
        };
      }

      let convRate = 1;
      const hasConversion =
        services?.conversion_service &&
        rates.rates &&
        rates.displayCurrency.code &&
        currencyCode !== rates.displayCurrency.code;
      if (hasConversion) {
        convRate = calculateRate(
          selectedCurrency?.currency?.code,
          rates.displayCurrency.code,
          rates.rates,
        );
      }

      let amountValue = amount;
      if (display) {
        amountValue = amount / convRate;
      }

      const { totalAmount, feeAmount } = _useFee(
        amountValue,
        tierFees,
        selectedCurrency,
        accountFees,
        groupFees,
        'top_up',
      );
      const availableAmount = selectedCurrency.available_balance;
      if (totalAmount > availableAmount) {
        return {
          amount:
            'Available balance exceeded: ' +
            formatAmountString(availableAmount, selectedCurrency.currency, true) +
            (feeAmount
              ? ' (fee: ' +
                formatAmountString(feeAmount, selectedCurrency.currency, true) +
                ')'
              : ''),
        };
      }

      if (!recipient) {
        return { recipient: 'Please include recipient' };
      }
      if (recipient && recipientType === 'mobile') {
        if (recipient.indexOf('+') === -1) {
          return { recipient: 'Please include a country code' };
        }
        let error = validateMobile(recipient);
        if (error) {
          return { recipient: error };
        }
      } else if (recipient && recipientType === 'crypto') {
        let error = validateCrypto(recipient, selectedCurrency.crypto?.code);
        if (error) {
          return { recipient: error };
        }
        if (selectedCurrency.crypto?.code?.match(/XLM|TXLM/)) {
          if (stellarTransactionType === 'federation') {
            if (recipient.indexOf('*') === -1)
              return { recipient: 'Not a valid federated stellar address' };
          } else if (!(memo || memoSkip)) {
            return { memo: 'Please include a memo' };
          }
        }
      } else if (recipient && recipientType === 'email') {
        schema = yup.object().shape({
          recipient: yup
            .string()
            .email('Recipient not a valid email')
            .required('Recipient is required'),
        });
        let errors = this.validate(values, schema);
        if (errors.path) {
          return {
            [errors.path]: errors.message,
          };
        }
      }
      if (initial) {
        return true;
      }

      return {};
    } catch (e) {
      console.log('TCL: TopUpForm -> validation -> e', e);
    }
  };

  hidePin() {
    this.setState({ pinVisible: false });
  }

  render() {
    const { initialValues = {}, currency, actionsConfig, history } = this.props;

    const { formState } = this.state;

    let recipientType = 'email';

    const recipientConfig = get(actionsConfig, [
      'top_up',
      'config',
      'recipient',
    ]);
    if (
      recipientConfig &&
      recipientConfig.length &&
      recipientConfig.length === 1
    ) {
      recipientType = recipientConfig[0];
    }

    const formInitialValues = {
      amount: initialValues.amount ? initialValues.amount : '',
      recipient: initialValues.recipient,
      recipientType:
        initialValues.type && initialValues.type !== 'rehive'
          ? 'crypto'
          : recipientType,
      search: '',
      note: initialValues.note,
      memo: initialValues.memo,
      stellarTransactionType: 'public',
      currency: get(currency, ['currency', 'code']),
      display: false,
    };
    const isInitialValid = this.validation(formInitialValues, true);
    return (
      <Formik
        ref={ref => (this.sendForm = ref)}
        initialValues={formInitialValues}
        isInitialValid={isInitialValid === true}
        enableReinitialize
        validate={values => {
          const valid = this.validation(values);
          return valid;
        }}>
        {props => (
          <React.Fragment>
            <PageTitle
              titleId="top_up_user_balance"
              align="center"
              handleBack={() => history.push('/pos/')}
              back
            />

            {formState === 'send'
              ? this.renderForm(props)
              : formState === 'confirm'
              ? this.renderConfirm(props)
              : this.renderResult(props)}
          </React.Fragment>
        )}
      </Formik>
    );
  }
}

export default TopUpForm;
