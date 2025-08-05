import React from 'react';
import { Box } from '@material-ui/core';
import { Controller } from 'react-hook-form';
import CurrencySelector from './CurrencySelector';

export default function PrimaryCurrencyInput(props) {
  const { control, context, name = 'primaryCurrency' } = props;
  const { primaryCurrency } = context;
  const { primary, items } = primaryCurrency;

  const data = items.map(item => item?.currency);

  return (
    <Box pt={0.5} w={'100%'} pb={0.75}>
      <Controller
        name={name}
        control={control}
        defaultValue={primary?.currency}
        render={({ field: { onChange, value } }) => (
          <CurrencySelector
            item={value ?? primary?.currency}
            label=""
            title="primaryCurrency"
            data={data ?? []}
            onChange={onChange}
          />
        )}
      />
    </Box>
  );
}
