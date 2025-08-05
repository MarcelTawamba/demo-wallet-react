import React from 'react';
import { formatAmountString, fromDivisibility } from 'util/general';
import Text from 'components/outputs/Text';
import { calculateRate } from 'util/rates';

export default function WalletCardContent(props) {
  const { wallet, rates } = props;

  let amountValue = fromDivisibility(
    wallet.available_balance,
    wallet.currency?.divisibility,
  );
  let amountString = '';
  let amountConvString = '';
  const { hasConversion } = rates;

  // Calculate conversion rate
  let convRate = 1;
  if (hasConversion) {
    convRate = calculateRate(
      wallet?.currency?.code,
      rates.displayCurrency.code,
      rates.rates,
    );
  }
  amountString = formatAmountString(amountValue, wallet.currency);
  if (
    hasConversion &&
    convRate &&
    wallet?.currency?.code !== rates?.displayCurrency?.code
  ) {
    amountConvString =
      '~' + formatAmountString(amountValue.times(convRate), rates.displayCurrency);
  }

  return (
    <React.Fragment>
      <Text s={12} c="fontDark">
        {wallet.currency?.description || wallet.currency?.code}
      </Text>
      <Text s={16} c="primary" fontWeight="500" style={{ lineHeight: 1.2 }}>
        {amountString}
      </Text>
      <Text s={14} c="#A3A3A3">
        {amountConvString}
      </Text>
    </React.Fragment>
  );
}
