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

export default function BuyForm(props) {
  const {
    sellingCurrency,
    currency,
    services,
    rates,
    onContinue,
    tier,
    tierFees,
    accountFees,
    groupFees,
  } = props;

  const [loading, setLoading] = useState(false);

  function handleSubmit(formikProps) {
    setLoading(true);

    const {
      values: { baseAmount },
    } = formikProps;

    createConversion({
      to_amount: toDivisibility(baseAmount, currency?.currency?.divisibility),
      debit_account: sellingCurrency.account,
      credit_account: currency.account,
      key: `${sellingCurrency?.currency?.code}:${currency?.currency?.code}`,
    })
      .then(resp => {
        onContinue(resp);
      })
      .catch(() => setLoading(false));
  }

  let { convRate: sellingCurrencyConversionRate } = useConversion(
    sellingCurrency?.available_balance,
    rates,
    sellingCurrency?.currency,
  );

  const availableBalance =
    (sellingCurrency?.available_balance /
      10 ** (sellingCurrency?.currency?.divisibility ?? 2)) *
    sellingCurrencyConversionRate;

  function validate(values) {
    const { displayAmount, baseAmount = 0 } = values;
    let errors = {};

    if (!displayAmount) errors.amount = 'Amount is required';
    else if (baseAmount <= 0) errors.amount = 'Amount must be more than 0';
    // using 'baseAmount' instead of 'displayAmount', reason: when the input amount is small then
    // the display amount might become so small which might become 0 after calculating format decimal with display currency divisibility
    else if (displayAmount > availableBalance)
      errors.amount = `Available balance exceeded: ${formatAmountString(
        sellingCurrency?.available_balance,
        sellingCurrency.currency,
        true,
      )}`;

    return errors;
  }

  const fees = getFees(tierFees, '', sellingCurrency, accountFees, groupFees);

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
              maxCurrency: sellingCurrency,
              convertMaxToCurrency: true,
              tier,
              subtype: 'buy',
              fees,
              accountFees,
              groupFees,
              // for buy flow -> sell currency max amount needs to convert into buy currency if the input not in display currency
            }}
          />
          <View grid gap={0.75}>
            <Text id="pay_with" />
            <BalanceCard {...{ item: sellingCurrency, rates }} />
          </View>
          <Button
            id="continue"
            color={'primary'}
            onPress={() => handleSubmit(formikProps)}
            loading={loading}
            disabled={!formikProps.isValid}
            noPadding
            wide
            capitalize
          />
        </View>
      )}
    </Formik>
  );
}
