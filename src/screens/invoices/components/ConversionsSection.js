import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import {
  formatAmountString,
  concatCryptoAccount,
  concatBankAccount,
} from 'util/general';
import Text from 'components/outputs/Text';
import OutputList from 'components/lists/OutputList';

const useStyles = makeStyles(theme => ({
  section: {
    width: '100%',
    padding: theme.spacing(2),
    border: '1px solid #EFEFEF',
    borderRadius: 10,
    marginBottom: theme.spacing(2),
  },
  columns: {
    display: 'flex',
    flexDirection: 'row',
    padding: theme.spacing(1),
  },
  item: {
    padding: theme.spacing(2),
    margin: theme.spacing(1),
    border: '1px solid #EFEFEF',
    borderRadius: 10,
    // marginBottom: theme.spacing(2),
  },
}));

export default function DestinationsSection(props) {
  const { item, section, business } = props;
  // console.log('DestinationsSection -> item', item);
  const classes = useStyles();

  const { payment_processor_quotes } = item;
  const quote = payment_processor_quotes.find(item => item.status === 'paid');
  // console.log('DestinationsSection -> quote', quote);
  const { conversion_quote } = quote ?? {};

  if (!conversion_quote) {
    return null;
  }

  return (
    <div className={classes.section}>
      <div className={classes.columns}>
        <Text variant="h5" className={classes.title} id="conversions" />
      </div>

      {/* {destinations.map(item => (
        <DestinationListItem item={item} />
      ))} */}
    </div>
  );
}

function DestinationListItem(props) {
  const { item } = props;
  const classes = useStyles();
  const {
    account,
    allocation,
    amount,
    currency,
    bank_account,
    bitcoin_account,
    percentage,
    type,
  } = item;

  let outputs = [
    { label: 'amount', value: formatAmountString(amount, currency) },
    { label: 'type', value: type },
    { label: 'percentage', value: percentage + ' %' },
  ];

  if (account) {
    outputs.push({
      label: 'account',
      value: account,
    });
  }
  if (bank_account) {
    outputs.push({
      label: 'bank_account',
      value: concatBankAccount(bank_account),
    });
  }
  if (bitcoin_account) {
    outputs.push({
      label: 'bitcoin_account',
      value: concatCryptoAccount(bitcoin_account),
    });
  }

  return (
    <div className={classes.item}>
      <OutputList items={outputs} />
    </div>
  );
}
