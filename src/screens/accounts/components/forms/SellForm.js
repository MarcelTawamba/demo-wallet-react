import React, { useState } from 'react';
import { View } from 'components/layout/View';
import { Button } from 'components/inputs/Button';
import { Formik } from 'formik';
import { BalanceCard } from 'components/cards';
import { createConversion } from 'util/rehive';
import { useConversion } from 'util/rates';
import { formatAmountString, toDivisibility } from 'util/general';
import AmountInput from 'screens/accounts/components/AmountInput';
import Text from 'components/outputs/Text';
import { getFees } from 'util/fees';

export default function SellForm(props) {
  const {
    buyingCurrency,
    currency,
    services,
    rates,
    onContinue,
    tierFees,
    accountFees,
    groupFees,
  } = props;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  function handleSubmit(formikProps) {
    setLoading(true);

    const {
      values: { baseAmount },
    } = formikProps;

    createConversion({
      from_amount: toDivisibility(baseAmount, currency?.currency?.divisibility),
      debit_account: currency.account,
      credit_account: buyingCurrency.account,
      key: `${currency?.currency?.code}:${buyingCurrency?.currency?.code}`,
    })
      .then(resp => {
        if (resp?.status === 'error') {
          setError(resp?.message ?? resp?.data?.non_field_errors?.[0]);
          setLoading(false);
        } else onContinue(resp?.data);
      })
      .catch(() => setLoading(false));
  }

  let { convRate: sellingCurrencyConversionRate } = useConversion(
    currency?.available_balance,
    rates,
    currency?.currency,
  );

  const availableBalance =
    (currency?.available_balance /
      10 ** (currency?.currency?.divisibility ?? 2)) *
    sellingCurrencyConversionRate;

  function validate(values) {
    const { displayAmount } = values;

    let errors = {};

    if (!displayAmount) errors.amount = 'Amount is required';
    else if (displayAmount <= 0) errors.amount = 'Amount must be more than 0';
    else if (displayAmount > availableBalance)
      errors.amount = `Available balance exceeded: ${formatAmountString(
        currency?.available_balance,
        currency.currency,
        true,
      )}`;

    return errors;
  }
  const fees = getFees(tierFees, '', currency, accountFees, groupFees);
  return (
    <Formik initialValues={{ amount: '', displayAmount: '', baseAmount: '' }} validate={validate} validateOnChange={true}>
      {formikProps => (
        <View grid gap={1.5} w={'100%'} ph={2}>
          <AmountInput
            {...{
              services,
              formikProps,
              currency,
              enableMax: true,
              fees,
            }}
          />
          <View grid gap={0.75}>
            <Text id="receiving" />
            <BalanceCard {...{ item: buyingCurrency, rates }} />
          </View>
          {error && (
            <Text tA={'center'} c={'red'}>
              {error}
            </Text>
          )}
          <Button
            id="continue"
            color={'primary'}
            onPress={() => handleSubmit(formikProps)}
            loading={loading}
            disabled={!formikProps.isValid}
            noPadding
            capitalize
            wide
          />
        </View>
      )}
    </Formik>
  );
}
