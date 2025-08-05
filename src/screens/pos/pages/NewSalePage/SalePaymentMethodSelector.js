import React from 'react';
import FullScreenButtonSelector from 'components/inputs/FullScreenButtonSelector';

/* components */
const SalePaymentMethodSelector = props => {
  const buttons = [
    {
      id: 'qr',
      label: 'create_qr',
      to: '/sales/create_qr/',
    },
    {
      id: 'pin',
      to: '/sales/pin/',
    },
  ];
  return (
    <FullScreenButtonSelector title="select_payment_method" items={buttons} />
  );
};

export default SalePaymentMethodSelector;
