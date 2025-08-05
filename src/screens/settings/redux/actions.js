import { createAsyncTypes } from 'util/redux';

export const FETCH_CRYPTO_ACCOUNTS_ASYNC = createAsyncTypes(
  'fetch_crypto_accounts',
);
export const fetchCryptoAccounts = filters => {
  return { type: FETCH_CRYPTO_ACCOUNTS_ASYNC.pending, payload: filters };
};

export const FETCH_BANK_ACCOUNTS_ASYNC = createAsyncTypes(
  'fetch_bank_accounts',
);
export const fetchData = filters => {
  return { type: FETCH_BANK_ACCOUNTS_ASYNC.pending, payload: filters };
};
