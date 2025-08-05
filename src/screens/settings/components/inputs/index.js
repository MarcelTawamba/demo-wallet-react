import React from 'react';

import Input from 'components/inputs';
import * as inputs from 'config/inputs';
import AccountCurrencyList from './AccountCurrencyList';
import DisplayCurrencyInput from './DisplayCurrency';
import PrimaryCurrencyInput from './PrimaryCurrency';

export default function Inputs(props) {
  const { variant, type, form, ...restProps } = props;
  const config = inputs[variant?.name ?? variant];

  // Extract control from form object if available
  const control = form?.control;

  switch (config?.type) {
    case 'currencies':
      return <AccountCurrencyList {...props} />;
    case 'displayCurrency':
      return <DisplayCurrencyInput {...props} control={control} />;
    case 'primaryCurrency':
      return <PrimaryCurrencyInput {...props} control={control} />;
    default:
      return <Input {...restProps} config={config} form={form} />;
  }
}
