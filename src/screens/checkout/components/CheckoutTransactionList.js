import React, { useEffect, useState } from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import { useSelector } from 'react-redux';

import { formatAmountString } from 'util/general';
import Text from 'components/outputs/Text';

import Spinner from 'components/outputs/Spinner';
import OutputList from 'components/lists/OutputList';
import { generateTxHashLink } from 'util/crypto';
import { Box } from '@material-ui/core';
import { getPaymentRequestTransactions } from 'screens/checkout/util/rehive';
import { useQuery } from 'react-query';
import { orderBy } from 'lodash';
import { companyCurrenciesSelector } from 'screens/accounts/redux/selectors';

export default function CheckoutTransactionList(props) {
  const { align, context, hideSpinner } = props;
  const { invoice } = context;
  const { id } = invoice;
  const classes = useStyles(props);

  const { data, isLoading } = useQuery(
    ['payment-request-transactions', id],
  () => getPaymentRequestTransactions(id, '', true),
    {
      enabled: !!id,
      refetchInterval: 5000,
    },
  );

  const items = orderBy(data?.results, 'details.created', 'asc') ?? [];

  if (items.length === 0) {
    return null;
  }
  const isSimple = items.length === 1;
  if (isSimple) {
    return (
      <TransactionListItem
        align={align}
        item={items[0]}
        single
        hideSpinner={hideSpinner}
      />
    );
  }

  return (
    <div className={classes.transactions}>
      {items.map((item, index) => (
        <TransactionListItem
          key={item?.id ?? index}
          item={item}
          index={index}
          align={align}
          hideSpinner={hideSpinner}
        />
      ))}
    </div>
  );
}

function TransactionListItem(props) {
  const { item, index, single, align, hideSpinner } = props;
  const { details = {} } = item;
  const { currency, metadata = {}, amount, status, id } = details;
  const classes = useStyles(props);
  const companyCurrencies = useSelector(companyCurrenciesSelector);
  
  // Find the company currency that matches the transaction currency
  const companyCurrency = companyCurrencies.items?.find(
    item => item?.code === currency?.code
  );
  
  // Check for Solana in company currency metadata
  const isSolanaFromCompany = companyCurrency?.metadata?.native_context?.crypto?.blockchain === 'solana';
  
  // Check for different blockchain contexts
  const context =
    metadata?.service_bitcoin ??
    metadata?.native_context?.blockchain_details ??
    {};
    
  const { network = '', hash, tx_hash = hash, confirmations } = context;
  const amountString = formatAmountString(amount, currency, true);

  // Check for testnet in multiple places
  const testnet = Boolean(
    (network && network.match(/testnet/)) ||
    (metadata?.native_context?.crypto?.network === 'testnet') ||
    (companyCurrency?.metadata?.native_context?.crypto?.network === 'testnet')
  );
  
  // Check for Solana-specific addresses in display_details
  const hasSolanaAddressFormat = metadata?.native_context?.display_details && 
    Object.entries(metadata.native_context.display_details).some(
      ([key, detail]) => 
        key.includes('address') && 
        detail?.value && 
        /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(detail.value)
    );
  
  // Determine blockchain type
  let type = 'bitcoin'; // default
  
  // Check for Solana in various places in the metadata
  const isSolana = 
    metadata?.native_context?.crypto?.blockchain === 'solana' || 
    metadata?.native_context?.blockchain_details?.chain === 'solana' ||
    (metadata?.native_context?.bridge === true && metadata?.native_context?.crypto?.blockchain === 'solana') ||
    isSolanaFromCompany;
  
  if (isSolana) {
    type = 'solana';
  } else if (context?.chain) {
    type = context.chain;
  } else if (companyCurrency?.metadata?.native_context?.crypto?.blockchain) {
    type = companyCurrency.metadata.native_context.crypto.blockchain;
  }
  
  // Override type if we have strong indicators it's Solana
  if (hasSolanaAddressFormat) {
    type = 'solana';
  }
  
  // Check if we have a transaction hash in display_details
  let transactionHash = tx_hash;
  let directHashLink = null;
  
  // If we don't have a transaction hash in context, check display_details
  if (metadata?.native_context?.display_details) {
    const hashDetail = Object.entries(metadata.native_context.display_details).find(
      ([key, detail]) => key === 'hash' || key.includes('hash')
    );
    if (hashDetail) {
      transactionHash = hashDetail[1].value;
      // Check if href is directly provided in display_details (takes precedence)
      if (hashDetail[1].href) {
        directHashLink = hashDetail[1].href;
      }
    }
  }
  
  // Use direct href if available, otherwise fall back to generated link
  const linkTxHash = directHashLink || (transactionHash ? generateTxHashLink(transactionHash, type, testnet) : null);

  if (single) {
    return (
      <Box width="100%">
        {Boolean(transactionHash) ? (
          <OutputList
            pr={0}
            outputProps={{
              align: align ? align : single ? 'center' : 'left',
              // labelColor: true,
            }}
            items={[
              {
                label: 'Blockchain transaction',
                value: transactionHash,
                fullLink: linkTxHash,
                newTab: true,
              },
              {
                label: 'Blockchain #',
                value: transactionHash,
                copy: true,
              },
            ]}
          />
        ) : (
          <OutputList
            pr={0}
            outputProps={{
              align: align ? align : single ? 'center' : 'left',
            }}
            items={[
              {
                label: 'Transaction ID',
                value: id,
              },
            ]}
          />
        )}
        {status === 'Pending' && (
          <>
            {!hideSpinner && <Spinner pb={3} pt={3} />}
            {/* <Text color="primary" variant={'h5'} align={'center'}>
              {(confirmations ?? 0) + ' out of 6 confirmations...'}
            </Text> */}
          </>
        )}
      </Box>
    );
  }
  return (
    <div className={classes.transaction}>
      <Text bold>{'Transaction ' + (index + 1)}</Text>
      <OutputList
        pt={single ? 2 : 0}
        pb={single ? 2 : 0}
        outputProps={{
          align: align ? align : single ? 'center' : 'left',
          labelColor: true,
        }}
        items={
          transactionHash
            ? [
                {
                  label: 'Amount',
                  value: amountString,
                },
                {
                  label: 'Blockchain transaction',
                  value: transactionHash,
                  fullLink: linkTxHash,
                  newTab: true,
                },
                {
                  label: 'Blockchain #',
                  value: transactionHash,
                },
                {
                  label: 'Confirmations',
                  value: (confirmations ?? 0) + '/6',
                },
              ]
            : [
                {
                  label: 'Transaction ID',
                  value: id,
                },
              ]
        }
      />
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  transactions: {
    maxHeight: 250,
    overflowY: 'scroll',
    borderRadius: 15,
    border: '1px solid #EFEFEF',
    // padding: theme.spacing(2),
    width: '100%',
  },
  transaction: {
    paddingBottom: theme.spacing(3),
    padding: theme.spacing(2),
    width: '100%',
  },
}));
