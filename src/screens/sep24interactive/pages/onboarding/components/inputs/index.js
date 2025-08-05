import React from 'react';

import Input from 'components/inputs/Input';
import AccountCurrencyList from './AccountCurrencyList';
import EnableSeller from './EnableSeller';
import PayoutDestinations from './PayoutDestinations';
import BusinessCategories from './BusinessCategories';
import Businesses from './Businesses';

export default function Inputs(props) {
  const { field, type } = props;

  switch (field?.type) {
    case 'currencies':
      return <AccountCurrencyList {...props} />;
    case 'enable_seller':
      return <EnableSeller {...props} />;
    case 'payout_destinations':
      return <PayoutDestinations {...props} />;
    case 'business_categories':
      return <BusinessCategories {...props} />;
    case 'businesses':
      return <Businesses {...props} />;
    default:
      return <Input {...props} />;
  }
}
