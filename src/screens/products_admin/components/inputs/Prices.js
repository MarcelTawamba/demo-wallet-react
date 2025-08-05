import React from 'react';
import PricesInput from './PricesInput';
import { mapOptions, formatDivisibility } from 'util/general';
import { walletsSelector } from 'screens/accounts/redux/selectors';
import { useSelector } from 'react-redux';

export default function Prices(props) {
  const { control, register, watch, getValues } = props;

  const currencies = useSelector(walletsSelector);
  const { companyCurrencies } = currencies;
  const currencyOptions = mapOptions(companyCurrencies, 'display_code', 'code');

  const values = watch();

  let defaultPrices = [];
  if (values?.id) {
    async function addPrice(item) {
      const price = {
        currency: item?.currency?.code ?? item?.currency,
        amount: formatDivisibility(item?.amount, item?.currency?.divisibility),
      };
      defaultPrices.push(price);
    }
    values.prices.forEach(addPrice);
  }

  return (
    <PricesInput
      register={register}
      control={control}
      currencyOptions={currencyOptions}
      defaultValues={defaultPrices ?? []}
    />
  );
}
