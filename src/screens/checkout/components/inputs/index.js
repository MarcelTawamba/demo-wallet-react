import React from 'react';

import PaymentMethodSelector from './PaymentMethodSelector';
import WalletPaymentMethodSelector from './WalletPaymentMethodSelector';
import PaymentProcessorCurrencySelector from './PaymentProcessorCurrencySelector';
import ContactMethodSelector from './ContactMethodSelector';
import Input from 'components/inputs';
import * as inputs from 'config/inputs';

export default function Inputs(props) {
  const { variant, ...restProps } = props;
  const config = inputs[variant];

  switch (variant) {
    case 'wallet_method':
      return <WalletPaymentMethodSelector {...props} />;
    case 'payment_method':
      return <PaymentMethodSelector {...props} />;
    case 'payment_processor_currency':
      return <PaymentProcessorCurrencySelector {...props} />;
    case 'contact_method':
      return <ContactMethodSelector {...props} />;
    default:
      return <Input {...restProps} config={config} />;
  }
}
