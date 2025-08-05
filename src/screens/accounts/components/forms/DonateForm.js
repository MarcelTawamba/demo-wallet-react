/* eslint-disable no-fallthrough */
import React, { Component } from 'react';
import * as yup from 'yup';

import { Formik, Form } from 'formik';
import Big from 'big.js';
import moment from 'moment';
import { get } from 'lodash';

// import { createCryptoTransfer, createTransfer } from '../../core/util/rehive';
import * as Inputs from 'config/inputs';

import { createCryptoTransfer, createTransfer } from 'util/rehive';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import { validateCrypto, validateMobile } from 'util/validation';

import Input from 'components/inputs/Input';

import stellarHelp from '../../config/stellarHelp';
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
import SearchSelector from 'components/inputs/SearchSelector';
import { getCurrencyCode } from 'util/general';

class DonateForm extends Component {
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
    const { onSuccess, currency, services, rates } = this.props;
    const { values, setSubmitting } = props; // FormikProps
    let { amount, recipient, note, memo, recipientType, display } = values;
    setSubmitting(true);
    let response = null;
    amount = new Big(amount);
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

    // if (recipientType === 'mobile') {
    //   if (recipient.indexOf('+') === -1) {
    //     recipient = '+' + recipient;
    //   }
    // }
    try {
      let data = {
        amount,
        to_reference: recipient,
        currency: currency?.currency?.code,
        crypto: currency.crypto?.code,
        credit_note: note,
        debit_note: note,
        debit_subtype: 'donate',
        credit_subtype: 'donate',
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
            response = await createCryptoTransfer(
              data,
              currency?.metadata?.native_context?.crypto,
            );
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
          this.props.handleStateChange({ state: '' });
        }
        break;
      default:
    }
    this.setState({ formState: nextFormState });
  };

  renderInput(props, item) {
    const { actionsConfig } = this.props;
    const items = get(actionsConfig, ['donate', 'config', 'users']).map(
      ({ email, name }) => {
        return { label: name, value: email };
      },
    );

    const { values } = props;

    const id = item === 'recipient' ? values.recipientType + 'Recipient' : item;

    const field = { ...Inputs?.[id] };

    switch (item) {
      case 'recipient':
        return (
          <SearchSelector
            label="recipient"
            value={items.find(item => item.value === props.values.recipient)}
            setValue={item =>
              props.setFieldValue('recipient', item ? item.value : '')
            }
            items={items}
            placeholder="select"
          />
        );
      default:
    }
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

  renderSend = props => {
    const { currency, services, rates, tier } = this.props;
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
      onSubmitEditing: this.onSubmitEditing,
    };
    return (
      <Form style={{ width: '100%' }}>
        <PageContent>
          <AmountInput {...amountInputProps} />

          {this.renderInput(props, 'recipient')}

          {this.renderInput(props, 'note')}
        </PageContent>
        <PageButtons
          layout={'vertical'}
          items={[
            {
              id: 'donate',
              capitalize: true,
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

  renderConfirm = props => {
    const { currency, rates, services, tierFees, accountFees, groupFees } =
      this.props;
    const { values } = props;
    const { amount, recipient, recipientType, memo, note, display } = values;

    // Calculate conversion rate
    let convRate = 1;
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
    let sentenceString = '';
    if (display) {
      amountValue = amount / convRate;
    } else {
      amountValue = amount;
    }
    amountString = formatAmountString(amountValue, currency.currency);
    if (hasConversion) {
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
      currency,
      'donate',
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
      note
        ? {
            id: 'note',
            label: 'Note',
            value: note,
            labelBold: true,
          }
        : null,
    ];
    if (hasConversion) {
      const rate = rates.rates['USD:' + currency?.currency?.code];
      if (rate) {
        itemsExtra.push({
          label: 'Rate',
          value: renderRate({
            fromCurrency: currency.currency,
            toCurrency: rates.displayCurrency,
            rate: convRate,
          }),
          labelBold: true,
          value2: 'Last updated ' + moment(rate.created).fromNow(),
        });
      }
    }

    const { actionsConfig } = this.props;
    let item = get(actionsConfig, ['donate', 'config', 'users']).find(
      ({ email }) => email === recipient,
    );

    const text = (
      <Text
        variant="body1"
        align={'center'}
        style={{
          wordBreak: 'break-word',
        }}>
        {'You are about to donate '}
        <b>{sentenceString}</b>
        {' to '}
        <b>{item.name}</b>
      </Text>
    );

    const RecipientComp = item ? (
      <div
        style={{
          width: '100%',
          borderRadius: 15,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          border: '1px solid #EFEFEF',
        }}>
        <img
          style={{
            maxHeight: 100,
            maxWidth: 100,
            objectFit: 'contain',
            padding: 24,
          }}
          alt="rehive"
          src={item.profile}
        />
        <View w={'100%'} p={0.5}>
          <Text variant="h5" bold>
            {item.name}
          </Text>
        </View>
      </div>
    ) : null;

    return (
      <ConfirmPage
        handleButtonPress={this.handleButtonPress}
        action={'donate'}
        text={text}
        textComp={RecipientComp}
        formikProps={props}
        // items={items}
        // itemsExtra={itemsExtra}
      />
    );
  };

  renderResult(props) {
    const { result } = this.state;
    let { amount, recipient, display } = props.values;
    const { currency, services, rates } = this.props;
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
      rates.displayCurrency.code
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
        ? 'You donated '
        : 'You failed donating ';

    return (
      <ResultPage
        text={text}
        amount={sentenceString}
        recipient={recipient}
        result={result}
        handleButtonPress={this.handleButtonPress}
        formikProps={props}
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
      const { currency, rates, tierFees, services, accountFees, groupFees } =
        this.props;
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
        rates.displayCurrency.code;
      if (hasConversion) {
        convRate = calculateRate(
          currency?.currency?.code,
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
        currency,
        accountFees,
        groupFees,
        'donate',
      );
      const availableAmount = currency.available_balance;
      if (totalAmount > availableAmount) {
        return {
          amount:
            'Available balance exceeded: ' +
            formatAmountString(availableAmount, currency.currency, true) +
            (feeAmount
              ? ' (fee: ' +
                formatAmountString(feeAmount, currency.currency, true) +
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
        let error = validateCrypto(recipient, currency.crypto?.code);
        if (error) {
          return { recipient: error };
        }
        if (currency.crypto?.code?.match(/XLM|TXLM/)) {
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
      console.log('TCL: SendForm -> validation -> e', e);
    }
  };

  hidePin() {
    this.setState({ pinVisible: false });
  }

  renderHelp() {
    const { helpNo } = this.state;
    return (
      <React.Fragment>
        <PageContent>
          <View pb={0.5}>
            <Text variant={'h6'}>{stellarHelp[helpNo].title}</Text>
          </View>
          <Text>{stellarHelp[helpNo].description}</Text>
        </PageContent>
        <PageButtons
          layout={'material'}
          items={[
            {
              id: 'close',
              capitalize: true,
              onPress: () => this.setState({ formState: 'send' }),
              variant: 'text',
              color: 'default',
            },
            {
              autoFocus: true,
              id: helpNo === 2 ? 'done' : 'next',
              capitalize: true,
              type: 'submit',
              variant: 'text',
              onPress: () =>
                this.setState(
                  this.state.helpNo === 2
                    ? { formState: 'send' }
                    : { helpNo: helpNo + 1 },
                ),
            },
          ]}
        />
      </React.Fragment>
    );
  }

  render() {
    const { initialValues = {} } = this.props;

    const { formState } = this.state;

    const formInitialValues = {
      amount: initialValues.amount ? initialValues.amount : '',
      recipient: initialValues.recipient,
      search: '',
      note: initialValues.note,
      memo: initialValues.memo,
      stellarTransactionType: 'public',
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
          const valid = this.validation(values); //formState !== 'help' &&
          return valid;
        }}>
        {props => (
          <React.Fragment>
            <PageTitle titleId="donate" />

            {formState === 'send'
              ? this.renderSend(props)
              : formState === 'confirm'
              ? this.renderConfirm(props)
              : formState === 'help'
              ? this.renderHelp(props)
              : this.renderResult(props)}
          </React.Fragment>
        )}
      </Formik>
    );
  }
}

export default DonateForm;
