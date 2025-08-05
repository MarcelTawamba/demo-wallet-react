import React from 'react';
import makeStyles from '@material-ui/styles/makeStyles';

import { formatAmountString } from 'util/general';
import Text from 'components/outputs/Text';

export default function CheckoutAmount(props) {
  const { context, quote } = props;
  const { invoice = {} } = context;
  const classes = useStyles(props);

  const business = invoice?.metadata?.service_business?.business;

  let {
    request_currency: currency,
    request_amount: amount,
    user,
    description,
  } = invoice;
  if (quote) {
    ({ currency, amount } = quote);
  }

  const amountString = formatAmountString(amount, currency, true);

  const requesterString = [user?.first_name, user?.last_name].filter(
    x => x?.length,
  );

  return (
    <div className={classes.amount}>
      {!business && (
        <Text style={{ fontSize: 18 }} align="center" className={classes.text}>
          {requesterString.length ? requesterString.join(' ') : user.email} has
          requested a payment {description ? `for ${description}` : ''}
        </Text>
      )}
      <Text variant="h3" color="primary" bold align="center">
        {amountString}
      </Text>
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  amount: {
    paddingBottom: ({ pb }) => theme.spacing(pb ? pb : 3),
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
  text: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(2),
  },
}));
