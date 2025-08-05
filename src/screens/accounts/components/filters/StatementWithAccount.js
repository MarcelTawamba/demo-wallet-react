import React from 'react';
import Statement from './Statement';

/**
 * Wrapper component for Statement that ensures the wallet prop is defined
 * by creating a wallet object from account, currency, and currencyObj if needed
 */
const StatementWithAccount = ({
  search,
  account,
  currency,
  wallet,
  currencyObj,
  clearAndApply,
  onClose
}) => {
  // Create an enhanced wallet with a clear priority for account reference sources
  // 1. Use existing wallet if it has an account reference
  // 2. Use account parameter directly (strongest signal of intent)
  // 3. Use currencyObj if it has account information
  
  // First check if we already have a valid wallet with account reference
  if (wallet && (wallet.account || wallet.reference)) {
    return (
      <Statement
        search={search}
        currency={wallet}
        clearAndApply={clearAndApply}
        onClose={onClose}
      />
    );
  }
  
  // Determine account reference (in priority order)
  const accountRef = account || currencyObj?.account || '';
  
  // Determine currency code
  const currencyCode = currency || 
                      (currencyObj?.currency?.code || 
                       currencyObj?.currency?.display_code || 
                       '');
  
  // Create a minimal wallet with the necessary properties
  const enhancedWallet = {
    account: accountRef,
    reference: accountRef,
    currency: currencyCode,
    ...(wallet || {}), // Keep any other properties from original wallet
    ...(currencyObj || {}) // Include currencyObj properties for good measure
  };
  
  return (
    <Statement
      search={search}
      currency={enhancedWallet}
      clearAndApply={clearAndApply}
      onClose={onClose}
    />
  );
};

export default StatementWithAccount; 