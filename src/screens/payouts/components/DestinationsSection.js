import React, { useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import {
  formatAmountString,
  concatCryptoAccount,
  concatBankAccount,
} from 'util/general';
import Text from 'components/outputs/Text';
import OutputList from 'components/lists/OutputList';
import { userBankAccountsSelector } from 'redux/rehive/selectors';
import { useSelector, useDispatch } from 'react-redux';
import { fetchData } from 'redux/rehive/actions';
import { View } from 'components/layout/View';
import DetailSectionLayout from 'components/layouts/Detail/DetailSectionLayout';

const useStyles = makeStyles(theme => ({
  destinationContainer: {
    padding: `${theme.spacing(1)}px !important`,
    backgroundColor: '#FAFAFA !important',
    marginBottom: `${theme.spacing(2)}px !important`,
  },
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
    padding: theme.spacing(1),
  },
}));

export default function DestinationsSection(props) {
  const { item, section, business } = props;
  const classes = useStyles();
  const bankAccounts = useSelector(userBankAccountsSelector);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchData('bankAccounts'));
  }, []);

  const { destinations } = item;
  return (
    <View className={classes.destinationContainer}>
      <DetailSectionLayout section={{ id: 'destinations' }}>
        {destinations.map(item => (
          <DestinationListItem item={item} bankAccounts={bankAccounts} />
        ))}
      </DetailSectionLayout>
    </View>
  );
}

function DestinationListItem(props) {
  const { item, bankAccounts } = props;
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
    { label: 'amount', value: formatAmountString(amount, currency, true) },
    { label: 'type', value: type },
    { label: 'percentage', value: percentage + ' %' },
  ];

  if (account && account !== `""`) {
    outputs.push({
      label: 'account',
      value: account,
    });
  }
  if (bank_account && bank_account !== `""`) {
    const acc = bankAccounts?.items?.find(
      item => item?.id.toString() === bank_account.toString(),
    );
    outputs.push({
      label: 'bank_account ' + (acc ? '' : 'id'),
      value: acc ? concatBankAccount(acc) : bank_account,
    });
  }
  if (bitcoin_account && bitcoin_account !== `""`) {
    outputs.push({
      label: 'bitcoin_account',
      value: concatCryptoAccount(bitcoin_account),
    });
  }

  return (
    <div className={classes.item}>
      <OutputList
        items={outputs}
        outputProps={{
          placeholder: 'Not yet provided',
          labelColor: true,
          labelBold: true,
          sectionVariant: true,
        }}
      />
    </div>
  );
}
