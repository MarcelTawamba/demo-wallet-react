import React from 'react';
import makeStyles from '@material-ui/styles/makeStyles';

import { formatAmountString } from 'util/general';
import Text from 'components/outputs/Text';
import { renderRate } from 'util/rates';

export default function CryptoAmount(props) {
  const { context } = props;
  const { invoice = {}, quote } = context;
  const classes = useStyles(props);
  if (!quote) {
    return null;
  }
  const { request_amount, request_currency: toCurrency } = invoice;
  const { amount, conversion_quote = {}, currency: fromCurrency } = quote;
  const { rate } = conversion_quote ?? {};

  const requestAmountString = typeof toCurrency === 'string' 
    ? formatAmountString(request_amount, { code: toCurrency, divisibility: 2 }, true)
    : formatAmountString(request_amount, toCurrency, true);
  
  const quoteAmountString = typeof fromCurrency === 'string'
    ? formatAmountString(amount, { code: fromCurrency, divisibility: 2 }, true)
    : formatAmountString(amount, fromCurrency, true);
  
  const rateString = renderRate({ fromCurrency, toCurrency, rate });

  return (
    <>
      <Text
        className={classes.amount}
        variant="h3"
        color="primary"
        bold
        align="center">
        {Boolean(rate) ? quoteAmountString : requestAmountString}
      </Text>
      {Boolean(rate) && <Text align="center">{requestAmountString}</Text>}
      {Boolean(rate) && (
        <Text className={classes.rate} variant="subtitle2" align="center">
          {rateString}
        </Text>
      )}
    </>
  );
}

const useStyles = makeStyles(theme => ({
  amount: {
    paddingBottom: theme.spacing(3),
  },
  rate: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(3),
  },
}));
