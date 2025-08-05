import React from 'react';
import { get } from 'lodash';
import { useSelector } from 'react-redux';

import OutputList from 'components/lists/OutputList';
import { cryptoSelector } from 'redux/crypto/selectors';
import { generateRecipientLink, generateTxHashLink } from 'util/crypto';
import { companyCurrenciesSelector } from 'screens/accounts/redux/selectors';

// TransactionListDetails component to handle display of transaction metadata
const TransactionListDetails = props => {
  const { item } = props;
  const { metadata, tx_type, currency, subtype } = item;
  const crypto = useSelector(cryptoSelector);
  const companyCurrencies = useSelector(companyCurrenciesSelector);
  
  if (!metadata) return null;

  // Find the company currency that matches the transaction currency
  const companyCurrency = companyCurrencies.items?.find(
    item => item?.code === currency?.currency?.code
  );
  
  const { service_bitcoin, service_stellar, native_context } = metadata;

  // Check if we have display_details in native_context - this is the modern approach
  if (native_context?.display_details) {
    const { display_details = {} } = native_context;
    let items = [];
    
    // Determine if this is a crypto transaction (for fallback links)
    const isCrypto = subtype === 'send_crypto' || subtype === 'deposit_crypto';
    
    // Determine blockchain type for crypto fallback links
    const isSolanaFromCompany = companyCurrency?.metadata?.native_context?.crypto?.blockchain === 'solana';
    
    // Check for Solana-specific addresses in display_details
    const hasSolanaAddressFormat = Object.entries(display_details).some(
      ([key, detail]) => 
        (key.includes('address') || key === 'destination') && 
        detail?.value && 
        /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(detail.value)
    );
    
    // Check for Solana in various places in the metadata
    const isSolana = 
      native_context?.crypto?.blockchain === 'solana' || 
      native_context?.blockchain_details?.chain === 'solana' ||
      (native_context?.bridge === true && native_context?.crypto?.blockchain === 'solana') ||
      isSolanaFromCompany ||
      hasSolanaAddressFormat;
    
    // Determine blockchain type from various sources (for fallback links)
    let blockchainType = ''; 
    
    if (native_context?.display_details?.chain?.value) {
      blockchainType = native_context.display_details.chain.value.toLowerCase();
    } else if (native_context?.display_details?.destination_chain?.value) {
      blockchainType = native_context.display_details.destination_chain.value.toLowerCase();
    } else if (isSolana) {
      blockchainType = 'solana';
    } else if (service_stellar) {
      blockchainType = 'stellar';
    }
    
    // Determine testnet status for fallback links
    const testnet = Boolean(
      (native_context?.blockchain_details?.network && 
       native_context.blockchain_details.network.match(/testnet/)) ||
      (native_context?.crypto?.network === 'testnet') ||
      (companyCurrency?.metadata?.native_context?.crypto?.network === 'testnet')
    );
    
    // Process each detail in display_details
    Object.entries(display_details).forEach(([key, detail]) => {
      if (detail && detail.label && detail.value) {
        // Create the basic item with label and value
        const item = {
          label: detail.label,
          value: detail.value,
        };
        
        // If href is directly provided, use it (priority approach)
        if (detail.href) {
          item.fullLink = detail.href;
          item.newTab = true;
          item.copy = true;
        }
        // Fallback: Only apply crypto-specific link generation if no href provided
        else if (isCrypto || isSolana) {
          // Generate links for transaction hashes
          if (key === 'hash' || key.includes('hash')) {
            const link = generateTxHashLink(detail.value, blockchainType, testnet);
            if (link) {
              item.fullLink = link;
              item.newTab = true;
            }
            item.copy = true; // Make hash copyable
          }
          
          // Generate links for addresses
          if (key.includes('address') || key === 'destination') {
            const link = generateRecipientLink(detail.value, blockchainType, testnet);
            if (link) {
              item.fullLink = link;
              item.newTab = true;
            }
            item.copy = true; // Make addresses copyable
          }
        }
        
        // For all transaction types, make certain values copyable
        if (!item.copy && (
          key.includes('id') || 
          key.includes('reference') || 
          key.includes('number')
        )) {
          item.copy = true;
        }
        
        items.push(item);
      }
    });
    
    return <OutputList items={items} />;
  }
  
  // If no display_details, use legacy approach with blockchain context fields
  const isSolanaFromCompany = companyCurrency?.metadata?.native_context?.crypto?.blockchain === 'solana';
  let context = null;
  let type = '';
  
  // Check for Solana in various places in the metadata
  if (native_context?.crypto?.blockchain === 'solana' || 
      native_context?.blockchain_details?.chain === 'solana' ||
      (native_context?.bridge === true && native_context?.crypto?.blockchain === 'solana') ||
      isSolanaFromCompany) {
    type = 'solana';
    context = native_context?.blockchain_details || {};
  } else if (service_bitcoin) {
    type = 'bitcoin';
    context = service_bitcoin;
  } else if (service_stellar) {
    type = 'stellar';
    context = service_stellar;
  } else if (native_context?.blockchain_details) {
    context = native_context?.blockchain_details;
    type = context?.chain;
  } else if (companyCurrency?.metadata?.native_context?.crypto?.blockchain) {
    type = companyCurrency.metadata.native_context.crypto.blockchain;
    context = {};
  } else {
    return null;
  }
  
  const {
    network,
    confirmations,
    hash,
    tx_hash = hash,
    sender_public_address,
    recipient_public_address,
    to_address,
  } = context;

  let transactionHash = tx_hash;
  let recipientAddress = null;
  
  // For crypto send transactions, always show the recipient address
  if (tx_type === 'debit' && subtype === 'send_crypto') {
    recipientAddress = to_address ?? recipient_public_address;
  } else {
    recipientAddress = to_address ?? (tx_type === 'debit' ? recipient_public_address : sender_public_address);
  }

  const testnet = Boolean(
    (network && network.match(/testnet/)) ||
    (native_context?.crypto?.network === 'testnet') ||
    (companyCurrency?.metadata?.native_context?.crypto?.network === 'testnet')
  );
  
  const debit = Boolean(tx_type === 'debit');
  const linkRecipient = recipientAddress ? generateRecipientLink(recipientAddress, type, testnet) : null;
  const linkTxHash = transactionHash ? generateTxHashLink(transactionHash, type, testnet) : null;

  let items = [];

  if (debit && recipientAddress) {
    items.push({
      label: 'Recipient address',
      value: recipientAddress,
      fullLink: linkRecipient,
      newTab: true,
      copy: true,
    });
  }

  if (transactionHash)
    items.push({
      label: 'Transaction hash',
      value: transactionHash,
      fullLink: linkTxHash,
      newTab: true,
      copy: true,
    });
  
  return <OutputList items={items} />;
};

// Export with the new name, but keep file name the same for backward compatibility
export default TransactionListDetails;
