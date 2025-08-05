import React, { Component } from 'react';
import * as yup from 'yup';
import { Formik } from 'formik';
import AmountInput from 'screens/accounts/components/AmountInput';
import { getCurrencyCode } from 'util/general';

import { updateConversion } from 'util/rehive';
import * as Inputs from 'config/inputs';
import Input from 'components/inputs/Input';

import PageTitle from 'components/layout/page/PageTitle';
import PageContent from 'components/layout/page/PageContent';
import PageButtons from 'components/layout/page/PageButtons';

import SuccessPage from 'components/layout/page/SuccessPageNew';
import FailedPage from 'components/layout/page/FailedPageNew';
import {
  formatDecimals,
  calculateRate,
  renderRate,
  formatAmountString,
  useConversion as _useConversion,
} from 'util/rates';

import ConversionRate from '../currency/ConversionRate';
import ExchangeConfirm from './ExchangeConfirm';
import Text from 'components/outputs/Text';
import { useFee as _useFee, getFees } from 'util/fees';
import EmptyListMessage from 'components/lists/EmptyListMessage';
import ExchangeToSelector from '../selectors/ExchangeToSelector';
import moment from 'moment';
import { View } from 'components/layout/View';
import { get } from 'lodash';
import { connect } from 'react-redux';
import { configColorsSelector } from 'redux/rehive/selectors';
import { withStyles } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';

class ExchangeForm extends Component {
  constructor(props) {
    super(props);
    this.handleButtonPress = this.handleButtonPress.bind(this);
  }

  state = {
    index: 0,
    formState: '',
    result: null,
    successItems: [],
    successExtraItems: [],
  };

  componentDidUpdate(prevProps) {
    if (
      prevProps.currency?.currency?.code !==
        this.props.currency?.currency?.code &&
      this.exchangeForm
    ) {
      const { formState } = this.state;
      if (formState === 'result') {
        this.setState({ formState: 'send' });
        this.exchangeForm.resetForm();
      } else {
        this.exchangeForm.validateForm();
      }
    }
  }

  setSuccessItems = items => {
    this.setState({ successItems: items });
  };

  setSuccessExtraItems = items => {
    this.setState({ successExtraItems: items });
  };

  async handleFormSubmit(props) {
    const { values, setSubmitting } = props; // FormikProps
    const { id } = values;
    const { onSuccess } = this.props;

    setSubmitting(true);
    let resp = null;

    try {
      resp = await updateConversion(id, 'complete');
      if (resp.status === 'success') {
        this.setState({ formState: 'result', result: resp, values });
        onSuccess();
      } else {
        let error = '';
        if (
          resp.message.includes('transaction') &&
          resp.message.includes('amount')
        ) {
          if (resp.message.includes(' 0')) {
            error = `You're unable to complete this exchange, required tier not met.`;
          } else {
            error = `You've reached your exchange limit, required tier not met.`;
          }
        } else {
          error =
            'Unable to complete exchange' +
            (resp.message ? ': ' + resp.message : '');
        }

        this.setState({
          formState: 'result',
          result: { ...resp, message: error },
          values,
        });
      }
    } catch (error) {
      console.log(error);
      let result =
        'Unable to complete exchange' +
        (error.message ? ': ' + error.message : '');

      this.setState({ formState: 'result', result });
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

  renderSell(props) {
    const { rates, currency, colors, classes } = this.props;

    const { toCurrency, display } = props.values;
    const rate = calculateRate(
      display ? rates.displayCurrency.code : currency?.currency?.code,
      toCurrency.currency.code,
      rates.rates,
    );

    let balanceString = '';
    if (display && currency.currency.code !== 'USD') {
      const { convAvailable } = _useConversion(
        currency.available_balance,
        rates,
        currency.currency,
        true,
      );
      balanceString = `Balance: ${convAvailable}`;
    } else {
      balanceString = `Balance: ${formatAmountString(
        currency.available_balance,
        currency.currency,
        true,
      )}`;
    }
    const { tierFees, groupFees, accountFees } = this.props;
    const fees = getFees(tierFees, '', currency, accountFees, groupFees);

    return (
      <View mt={1}>
        <Text id="from" s={14} style={{ fontWeight: 500, marginBottom: -4 }} />
        <Box className={classes.inputContainer}>
          <Box className={classes.currencyWrapper}>
            {this.renderSellCurrency(props)}
          </Box>
          <AmountInput
            {...{
              formikProps: props,
              currency,
              enableMax: true,
              helper: balanceString,
              showExternalHelper: true,
              FormHelperTextProps: {
                style: { textAlign: 'right', color: colors.primary },
              },
              onChange: value => {
                props.setFieldValue('sell', value);
                props.setFieldValue(
                  'buy',
                  value
                    ? formatDecimals(
                        parseFloat(value) * rate,
                        toCurrency.currency.divisibility,
                        true,
                      ).toString()
                    : '',
                );
                props.setFieldTouched('display', false);
              },
              fees,
            }}
          />
        </Box>
      </View>
    );
  }

  renderRate(props) {
    const { rates, currency } = this.props;

    const fromCode = currency?.currency?.code;
    const toCurrency = props.values.toCurrency;
    const toCode = toCurrency.currency.code;

    const rate = calculateRate(fromCode, toCode, rates.rates);
    const rateString = renderRate({ fromCurrency: currency, toCurrency, rate });

    return (
      <ConversionRate
        containerStyle={{
          width: '100%',
          textAlign: 'center',
        }}
        textStyle={{ fontSize: 15 }}>
        {rateString}
      </ConversionRate>
    );
  }

  renderSellCurrency(props) {
    const {
      currencies,
      currency,
      conversionPairs,
      handleStateChange,
      configAccounts,
      actionsConfig,
    } = this.props;

    const formatValue = item => item.key.split(':')[1];
    const toCodes = conversionPairs.fromCurrencies || [];
    const hideCurrencies = get(
      actionsConfig,
      ['exchange', 'condition', 'hideCurrency'],
      [],
    );

    const items = currencies.items.filter(
      item =>
        toCodes.findIndex(code => item.currency.code === code) !== -1 &&
        !item.disabled &&
        !hideCurrencies.includes(item.currency.code),
    );
    const { identifier } = configAccounts;

    return (
      <ExchangeToSelector
        title="select_sell_account"
        values={items}
        value={currency}
        renderValue={formatValue}
        dense
        onValueChange={value => {
          const item = items[value];
          const { account, account_name } = item;
          const code = get(item, ['currency', 'code']);
          handleStateChange({
            account: identifier === 'name' ? account_name : account,
            currency: code,
          });
        }}
      />
    );
  }

  renderBuyCurrency(props) {
    const { currencies, currency, conversionPairs, rates, actionsConfig } =
      this.props;

    const { values = {}, setFieldValue } = props;
    const { toCurrency, sell } = values;
    const formatValue = item => item.key.split(':')[1];

    const toCodes = conversionPairs.items
      .filter(
        pair =>
          pair.key.split(':')[0] === currency?.currency?.code &&
          currencies.items.findIndex(
            curr => curr.currency.code === pair.key.split(':')[1],
          ) !== -1,
      )
      .map(item => item.key.split(':')[1]);

    const hideCurrencies = get(
      actionsConfig,
      ['exchange', 'condition', 'hideCurrency'],
      [],
    );
    const items = currencies.items.filter(
      item =>
        toCodes.findIndex(code => item.currency.code === code) !== -1 &&
        !item.disabled &&
        !hideCurrencies.includes(item.currency.code),
    );

    return (
      <ExchangeToSelector
        values={items}
        value={toCurrency}
        renderValue={formatValue}
        dense
        onValueChange={value => {
          const toCurrency = items[value];
          setFieldValue('toCurrency', toCurrency);

          const rate = calculateRate(
            currency?.currency?.code,
            toCurrency.currency.code,
            rates.rates,
          );

          setFieldValue(
            'buy',
            sell
              ? formatDecimals(
                  parseFloat(sell) * rate,
                  toCurrency.currency.divisibility,
                  true,
                ).toString()
              : '',
          );
        }}
      />
    );
  }

  renderBuy(props) {
    const { rates, currency, classes } = this.props;

    const { toCurrency } = props.values;

    const rate = calculateRate(
      currency?.currency?.code,
      toCurrency.currency.code,
      rates.rates,
    );

    return (
      <View mt="1" mb="2">
        <Text
          id="to"
          s={14}
          style={{
            fontWeight: 500,
            marginBottom: -4,
            textTransform: 'capitalize',
          }}
        />
        <Box className={classes.inputContainer}>
          <Box className={classes.currencyWrapper}>
            {this.renderBuyCurrency(props)}
          </Box>
          <Input
            onChange={value => {
              try {
                const amount = value.target.value;
                props.setFieldValue('buy', amount);
                props.setFieldValue(
                  'sell',
                  amount
                    ? formatDecimals(
                        parseFloat(amount) / rate,
                        currency.currency.divisibility,
                        true,
                      )
                    : '',
                );
                props.setFieldTouched('sell', amount ? true : false);
                props.setFieldTouched('display', true);
              } catch (e) {
                console.log('TCL: renderSell -> e', e);
                props.setFieldValue('sell', '0');
              }
            }}
            field={{
              ...(Inputs?.buy ?? {}),
              disabled: true,
              label: '',
              placeholder: `0.00 ${getCurrencyCode(toCurrency.currency)}`,
              // helper:
              //   'Available balance: ' +
              //   formatDivisibility(
              //     toCurrency.available_balance,
              //     toCurrency.currency.divisibility,
              //   ) +
              //   ' ' +
              //   getCurrencyCode(toCurrency.currency),
            }}
            formikProps={props}
            containerStyle={{ marginBottom: 16 }}
          />
        </Box>
      </View>
    );
  }

  renderForm(props) {
    return (
      <React.Fragment>
        <PageContent>
          {this.renderSell(props)}
          {this.renderBuy(props)}
          {this.renderRate(props)}
        </PageContent>
        <PageButtons
          layout={'vertical'}
          items={[
            {
              id: 'exchange',
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
    const { currency, tier, currencies, profile } = this.props;
    const { toCurrency } = props.values;

    return (
      <ExchangeConfirm
        primaryAccount={currencies.primaryAccount}
        tier={tier}
        toCurrency={toCurrency}
        handleButtonPress={this.handleButtonPress}
        fromCurrency={currency}
        formikProps={props}
        setSuccessItems={this.setSuccessItems}
        setSuccessExtraItems={this.setSuccessExtraItems}
        profile={profile}
      />
    );
  }

  renderResult(props) {
    // debugger;
    const { result } = this.state;

    const success = result.id || result.status === 'success';

    if (success) {
      return (
        <SuccessPage
          pageStyle={{ marginTop: 32 }}
          handleButtonPress={this.handleButtonPress}
          formikProps={props}
          items={this.state.successItems}
          itemsExtra={this.state.successExtraItems}
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
          failedMessageId="exchange_failed"
          failedSecondaryMessage="unable_to_exchange"
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
      result = schema.validateSync(values, { abortEarly: false });
    } catch (e) {
      result = e;
      // console.log('e', e);
    }
    return result;
  }

  validation(values, initial) {
    try {
      const { currency, tierFees, services, rates, accountFees, groupFees } =
        this.props;
      const { sell, display } = values;
      let schema = yup.object().shape({
        toCurrency: yup.object().required(),
        sell: yup
          .number()
          .typeError('Please enter a valid number')
          .moreThan(0, 'Sell amount must be more than 0')
          .required('Sell amount is required'),
      });

      let errors = this.validate(values, schema);
      if (errors.inner && errors.inner.length > 0) {
        // Return all validation errors
        let validationErrors = {};
        errors.inner.forEach(error => {
          validationErrors[error.path] = error.message;
          // Also add to amount field for AmountInput compatibility
          if (error.path === 'sell') {
            validationErrors.amount = error.message;
          }
        });
        return validationErrors;
      }

      let amountValue = sell;
      if (display) {
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
        amountValue = sell / convRate;
      }

      const { totalAmount, feeAmount } = _useFee(
        amountValue,
        tierFees,
        currency,
        accountFees,
        groupFees,
        'sell',
      );
      const availableAmount = currency.available_balance;

      if (totalAmount > availableAmount) {
        const errorMessage = 'Available balance exceeded: ' +
          formatAmountString(availableAmount, currency.currency, true) +
          (feeAmount
            ? ' (fee: ' +
              formatAmountString(feeAmount, currency.currency, true) +
              ')'
            : '');
        return {
          sell: errorMessage,
          amount: errorMessage,
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
    const { currency, currencies, conversionPairs, actionsConfig } = this.props;
    const { formState } = this.state;

    const items = conversionPairs.items.filter(
      pair => pair.key.split(':')[0] === currency?.currency?.code,
    );
    const hideCurrencies = get(
      actionsConfig,
      ['exchange', 'condition', 'hideCurrency'],
      [],
    );
    const temp = items.find(
      item =>
        currencies.items.findIndex(
          curr =>
            !curr.disabled &&
            curr.currency.code === item.key.split(':')[1] &&
            !hideCurrencies.includes(curr.currency.code),
        ) !== -1,
    );

    if (temp) {
      const toCode = temp.key.split(':')[1];

      const toCurrency = currencies.items.find(
        curr => curr.currency.code === toCode,
      );

      const formInitialValues = {
        buy: '',
        sell: '',
        toCurrency,
        id: '',
        expired: false,
      };

      return (
        <Formik
          ref={ref => (this.exchangeForm = ref)}
          initialValues={formInitialValues}
          enableReinitialize
          validate={values => {
            const valid = this.validation(values);
            return valid;
          }}>
          {props => (
            <React.Fragment>
              {formState === '' && <PageTitle titleId="exchange" />}
              {formState === 'result'
                ? this.renderResult(props)
                : formState === 'confirm'
                ? this.renderConfirm(props)
                : this.renderForm(props)}
            </React.Fragment>
          )}
        </Formik>
      );
    } else {
      return (
        <React.Fragment>
          <PageTitle titleId="exchange" />
          <PageContent>
            <EmptyListMessage id="no_valid_exchange_pairs" />
          </PageContent>
        </React.Fragment>
      );
    }
  }
}

const mapStateToProps = state => {
  return {
    colors: configColorsSelector(state),
  };
};
const styles = theme => ({
  inputContainer: {
    width: '100%',
    display: 'flex',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
    },
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  },
  currencyWrapper: {
    width: '30%',
    marginTop: -16,
    [theme.breakpoints.down('md')]: {
      width: 'auto',
      marginTop: 12,
      marginLeft: -8,
    },
  },
});
export default withStyles(styles)(connect(mapStateToProps)(ExchangeForm));
