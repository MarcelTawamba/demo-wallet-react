import React from 'react';
import BalanceCard from './BalanceCard';
import AmountDisplayCard from './AmountDisplayCard';

export function DynamicCard(props) {
  const { type = 'currency' } = props;

  switch (type) {
    case 'balance':
    default:
      return <BalanceCard {...props} />;
    case 'amountDisplay':
      return <AmountDisplayCard {...props} />;
  }
}

export { BalanceCard, AmountDisplayCard };
