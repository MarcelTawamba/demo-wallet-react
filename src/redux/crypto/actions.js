import { createAsyncTypes } from 'util/redux';

export const FETCH_CRYPTO_ASYNC = createAsyncTypes('fetch_crypto');
export const fetchCrypto = type => {
  return { type: FETCH_CRYPTO_ASYNC.pending, payload: type };
};
