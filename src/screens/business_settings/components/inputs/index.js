import React from 'react';
import Input from 'components/inputs/Input';
// import * as inputs from 'config/inputs';
import PayoutDestinations from './PayoutDestinations';
import AccountCurrencyList from './AccountCurrencyList';
// import EnableSeller from './EnableSeller';

export default function Inputs(props) {
  const { field, type } = props;

  switch (field?.type) {
    case 'currencies':
      return <AccountCurrencyList {...props} />;
    case 'payout_destinations':
      return <PayoutDestinations {...props} />;
    // case 'enable_seller':
    //   return <EnableSeller {...props} />;
    default:
      return <Input {...props} />;
  }
}
