import React from 'react';

import ProductItemListInput from './ProductItemList';
import PaymentMethodsInput from './PaymentMethods';
import CustomerSearchInput from './CustomerSearch';
import Input from 'components/inputs';
import * as inputs from '../../config/inputs';

export default function Inputs(props) {
  const { variant, ...restProps } = props;
  const config = inputs[variant];

  switch (variant) {
    case 'customerSearch':
      return <CustomerSearchInput {...props} />;
    case 'productList':
      return <ProductItemListInput {...props} />;
    case 'paymentMethods':
      return <PaymentMethodsInput {...restProps} />;
    case 'invoiceReference':
    default:
      return <Input {...restProps} config={config} />;
  }
}
