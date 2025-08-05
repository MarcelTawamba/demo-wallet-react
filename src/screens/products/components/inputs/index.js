import React from 'react';
import { get } from 'lodash';

import VoucherRecipient from './VoucherRecipient';

export function Input(props) {
  const { variant, id, field, props: fieldProps = {}, formikProps } = props;

  const { values } = formikProps;
  const value = get(values, id);

  switch (variant) {
    // case 'voucherAmount':
    //   return <VoucherAmount {...props} {...fieldProps} />;
    case 'voucherRecipient':
      return <VoucherRecipient {...props} {...fieldProps} />;
    // case 'voucherProviderSelector':
    //   return (
    //     <VoucherProviderSelector {...props} {...fieldProps} value={value} />
    //   );
    // case 'voucherProviderSelectorV':
    //   return (
    //     <VoucherProviderSelectorV {...props} {...fieldProps} value={value} />
    //   );

    // case 'currencySelector':
    //   return (
    //       <CurrencyCard onPressContentDisabled {...props} {...fieldProps} />
    //   );
    default:
      return null; // TODO default input
  }
}
