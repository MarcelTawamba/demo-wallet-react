import React from 'react';
import FullScreenButtonSelector from 'components/inputs/FullScreenButtonSelector';

/* components */
export default function RedeemVoucherTypeSelector(props) {
  const buttons = [
    {
      id: 'scan',
      label: 'scan',
      icon: 'qr',
    },
    {
      id: 'input',
      icon: 'pin',
      label: 'input',
    },
  ];
  return (
    <FullScreenButtonSelector
      title="select_voucher_input_method"
      items={buttons}
      base="pos/redeem_voucher"
    />
  );
}
