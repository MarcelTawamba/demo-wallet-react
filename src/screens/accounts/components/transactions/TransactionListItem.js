import React from 'react';
import {
  formatAmountString,
  useConversionRates,
  useConversionTransactionList,
} from 'util/rates';
import TransactionListItemDetail from './TransactionListItemDetail';
import TransactionListItemSummary from './TransactionListItemSummary';
import {
  getMainTransaction,
  filterTransactions,
  useSubtypeCopy,
} from 'screens/accounts/util/transactions';
import ExpansionPanel from 'components/layout/ExpansionPanel';

const TransactionListItem = props => {
  const {
    item,
    expanded,
    services,
    conversionRates,
    rates,
    crypto,
    profile,
    index,
    setSelected,
    setMenuAnchor,
    loadingQuickAction,
    refresh,
    alternatingRowColors,
  } = props;
  const mainTransaction = item;
  const {
    id,
    total_amount: totalAmount,
    created,
    currency,
    tx_type,
    subtype,
    status,
  } = mainTransaction;
  const open = expanded === id;

  const {
    loading = false,
    convAmountString = '',
    tempConvRate = 1,
  } = useConversionRates({
    amount: totalAmount,
    fromCurrency: currency?.code,
    toCurrency: rates?.displayCurrency?.code,
    conversionRates,
    date: created,
    rates,
    currency,
  });

  const subtypeConfig = useSubtypeCopy(mainTransaction, Boolean(crypto)); // TODO: the second argument here is crypto type
  const { text, color, iconName, iconColor, image } = subtypeConfig;
  // ** TODO LANGUAGE: need to update useSubtypeCopy, currently 'Received from Samiul Alim' text coming from useSubtypeCopy hook
  const amountString =
    (tx_type.includes('debit') ? '-' : '') +
    formatAmountString(totalAmount, currency, true);

  const backgroundColor = alternatingRowColors
    ? index % 2 === 0
      ? ''
      : '#F8F8F8'
    : 'white';

  const summaryProps = {
    iconName,
    image,
    iconColor,
    color,
    text,
    date: created,
    amountString,
    convAmountString,
    profile,
    loading,
    subtype,
    status,
    setMenuAnchor,
    onMenuClicked: () => setSelected(id),
    loadingQuickAction,
    isOpen: open,
  };

  const detailProps = {
    currency,
    open,
    color,
    rates,
    item: mainTransaction,
    convRate: tempConvRate,
    services,
    profile,
    refresh,
  };

  return (
    <>
      <ExpansionPanel
        backgroundColor={backgroundColor}
        expanded={expanded === id}
        onChange={props.handleChange(id)}
        summary={<TransactionListItemSummary {...summaryProps} />}
        detail={<TransactionListItemDetail {...detailProps} />}
        noBorder
      />
    </>
  );
};

export default TransactionListItem;
