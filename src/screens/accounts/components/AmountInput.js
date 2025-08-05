/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect } from 'react';
import moment from 'moment';
import { useSelector } from 'react-redux';
import InputAdornment from '@material-ui/core/InputAdornment';
import { View } from 'components/layout/View';
import Button from '@material-ui/core/Button';
import IconButton from 'components/inputs/IconButton';
import Icon from 'components/outputs/Icon';
import Input from 'components/inputs/Input';
import { amount } from 'config/inputs';
import { formatConvAmount, formatDecimals, convertAmount } from 'util/rates';
import Selector from 'components/inputs/Selector';
import { get, omitBy, isNil } from 'lodash';
import {
  objectToArray,
  getCurrencyCode,
  formatDivisibility,
} from 'util/general';
import { conversionRatesSelector } from 'screens/accounts/redux/selectors';
import chroma from 'chroma-js';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { useFee } from 'util/fees';

export default function AmountInput(props) {
  let {
    formikProps = {},
    currency,
    currencies,
    maxCurrency = currency,
    endAdornments = [],
    enableMax,
    enableConversion = true,
    enableCurrency = true,
    onChange,
    label = 'amount',
    helper,
    disabled,
    FormHelperTextProps,
    showExternalHelper,
    convertMaxToCurrency, // for buy flow -> sell currency max amount needs to convert into buy currency if the input not in display currency
    fees,
  } = props;

  const { values, setFieldValue, setValues, isSubmitting, setTouched } = formikProps;

  const rates = useSelector(conversionRatesSelector);
  const classes = useStyles();
  const { t } = useTranslation(['common']);

  const field = { ...amount, ...omitBy({ label, helper }, isNil), disabled };
  const { hasConversion } = rates;

  let rate = null;

  useEffect(() => {
    if (values?.amount) setFieldValue('amount', null);
  }, [currency?.currency?.code]);

  // Check if there's a validation error for the amount field
  const hasAmountError = formikProps.errors?.amount && formikProps.touched?.amount;

  let context = {};
  if (
    enableConversion &&
    hasConversion &&
    currency?.currency?.code !== rates.displayCurrency.code
    // && !currencies
  ) {
    rate = rates.rates['USD:' + currency?.currency?.code];
    if (rate) {
      if (!showExternalHelper) {
        let string =
          formatConvAmount({ currency, values, rates }) +
          (rate ? ' as of ' + moment(rate.created).fromNow() : '');
        field.helper = string;
      }
      label = 'amount_in';
      context = {
        currencyCode: values.display
          ? getCurrencyCode(rates.displayCurrency)
          : getCurrencyCode(currency.currency),
      };
    }
  }
  field.label = t(label, context);
  field.placeholder = '0.00';

  const currencyOptions = objectToArray(currencies, 'id').map(item => {
    const value = get(item, ['currency', 'code']);
    return { value, label: value, id: value };
  });

  const calculateMaximumAmount = (amount, fees, divisibility) => {
    let feeValue = 0;
    let feePercentage = 0;
    for (let index = 0; index < fees.length; index++) {
      const fee = fees[index];
      if (fee?.value) {
        feeValue += parseFloat((fee.value / 10 ** divisibility).toFixed(divisibility));
      } else if (fee?.percentage) {
        feePercentage += parseFloat((fee.percentage / 100).toFixed(4));
      }
    }

    const result = (amount - feeValue) / (feePercentage !== 0 ? 1 + feePercentage : 1);
    return result.toFixed(divisibility);
  };

  const setMaxAvailableBalance = () => {
    let formattedMax = formatDivisibility(
      maxCurrency?.available_balance,
      maxCurrency.currency.divisibility,
    );
    const amount = parseFloat(formattedMax);
    const divisibility = currency?.currency?.divisibility;
    formattedMax = calculateMaximumAmount(amount, fees, divisibility);

    if (values.display) {
      formattedMax = formatDecimals(
        convertAmount({
          currency: { currency: rates.displayCurrency },
          values: { ...values, amount: formattedMax },
          rates,
          displayCurrency: maxCurrency?.currency,
        }),
        rates.displayCurrency.divisibility,
        true,
        true,
      );
    } else if (convertMaxToCurrency) {
      formattedMax = formatDecimals(
        convertAmount({
          currency: { currency: maxCurrency?.currency },
          values: { ...values, amount: formattedMax },
          rates,
          displayCurrency: currency?.currency,
        }),
        currency?.currency?.divisibility,
        true,
        true,
      );
    }
    setTouched({ amount: true });
    onAmountChange(formattedMax, true);
  };

  const onAmountChange = value => {
    // Get divisibility values with fallbacks
    const currencyDivisibility = currency?.currency?.divisibility ?? 2;
    const displayDivisibility = rates?.displayCurrency?.divisibility ?? 2;
    
    const newAmount = formatDecimals(
      convertAmount({
        currency,
        values: value ? { ...values, amount: value } : values,
        rates,
      }),
      values.display ? currencyDivisibility : displayDivisibility,
      true,
    );

    const newDisplayAmount = values?.display ? value ?? values?.amount : newAmount;
    const newBaseAmount = !values?.display ? value ?? values?.amount : newAmount;
    const finalAmount = value ?? newAmount;
    
    // Convert to number for forms that expect numeric validation
    const numericAmount = finalAmount ? Number(finalAmount) : finalAmount;

    // Use setValues if available (for buy/sell forms), fall back to individual setFieldValue calls
    if (setValues && typeof setValues === 'function') {
      setValues({
        ...values,
        displayAmount: newDisplayAmount,
        baseAmount: newBaseAmount,
        amount: numericAmount,
      });
    } else {
      // Original behavior for forms that don't support setValues
      setFieldValue('displayAmount', newDisplayAmount);
      setFieldValue('baseAmount', newBaseAmount);
      setFieldValue('amount', numericAmount);
    }
    
    onChange && onChange(finalAmount);
  };

  const extraAdornments = [];

  if (enableMax)
    extraAdornments.push(
      <Button
        size="small"
        variant="contained"
        key="button"
        className={classes.max}
        onClick={setMaxAvailableBalance}>
        MAX
      </Button>,
    );

  if (currencies)
    extraAdornments.push(
      <Selector
        key="selector"
        dense
        disabled={!enableCurrency}
        width="auto"
        value={formikProps.values.currency}
        items={currencyOptions}
        onValueChange={value => formikProps.setFieldValue('currency', value)}
      />,
    );

  if (enableConversion && hasConversion && rate)
    extraAdornments.push(
      <View
        bC={'primary'}
        h={'40px'}
        className={classes.conversion}
        key="iconButton">
        <IconButton
          onClick={() => {
            if (!values.amount)
              return setFieldValue('display', !values.display);

            onAmountChange();
            setFieldValue('display', !values.display);
          }}
          noPadding>
          <Icon icon={'swap_vert'} color={'primary'} size={20} />
        </IconButton>
      </View>,
    );

  endAdornments = [...extraAdornments, ...endAdornments];

  if (endAdornments.length)
    field.endAdornment = (
      <InputAdornment position="end" disablePointerEvents={isSubmitting}>
        <View fD={'row'} aI={'center'}>
          {endAdornments.map(x => x)}
        </View>
      </InputAdornment>
    );

  return (
    <View fD={'row'} w={'100%'}>
      <Input
        field={field}
        formikProps={formikProps}
        endAdornment={field.endAdornment}
        FormHelperTextProps={hasAmountError ? { style: { textAlign: 'left' } } : FormHelperTextProps}
        onChange={({ target }) => onAmountChange(target.value)}
      />
    </View>
  );
}

const useStyles = makeStyles(theme => ({
  max: {
    backgroundColor: chroma(theme.palette.primary.main).alpha(0.1).hex(),
    margin: theme.spacing(1),
    color: theme.palette.primary.main,
    fontSize: 11,
    borderRadius: '5px',
    padding: '2px',
    minWidth: 40,
  },
  conversion: {
    borderTopRightRadius: '10px !important',
    borderBottomRightRadius: '10px !important',
    margin: '0 -15px 0 0 !important',
    zIndex: 1,
  },
}));
