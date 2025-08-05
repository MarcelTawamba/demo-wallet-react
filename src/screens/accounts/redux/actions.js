import { createAsyncTypes } from 'util/redux';
import { FETCH_DATA_ASYNC } from 'redux/rehive/actions';

export const FETCH_ACCOUNTS_ASYNC = createAsyncTypes('fetch_accounts');
export const fetchAccounts = filters => {
  return { type: FETCH_DATA_ASYNC.pending, payload: 'accounts' };
};

export const SET_DISPLAY_CURRENCY = 'set_display_currency';
export const setDisplayCurrency = currency => {
  return { type: SET_DISPLAY_CURRENCY, payload: currency };
};
