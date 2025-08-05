import _ from 'lodash';

import {
  LOGOUT_USER,
  REMOVE_AUTH_SESSION,
  REMOVE_ALL_AUTH_SESSIONS,
} from '../auth/actions';
import { FETCH_DATA_ASYNC } from './actions';
import { createDefaultAsyncStore } from 'util/redux';

const dataTypes = [
  'profile',
  'publicCompanies',
  'addresses',
  'bankAccounts',
  'cryptoAccounts',
  'documents',
  'emails',
  'mobiles',
  'accounts',
  'products',
  'orders',
  'conversionRates',
  'businesses',
  'devices',
  'tiers',
];

const INITIAL_STATE = {
  ...Object.assign({}, ..._.map(dataTypes, type => createDefaultAsyncStore(type))),
  conversionCurrencies: [],
};

const fetchDataPending = (state, payload) => {
  return {
    ...state,
    [payload + 'Loading']: true,
    [payload + 'Error']: '',
  };
};

const fetchDataSuccess = (state, payload) => {
  // Ensure tiers data is always an array
  let data = payload.data;
  if (payload.prop === 'tiers') {    // Ensure we have an array, even if empty
    data = Array.isArray(data) ? data : [];
  }

  const newState = {
    ...state,
    [payload.prop]: data,
    [payload.prop + 'Loading']: false,
    [payload.prop + 'Error']: '',
  };
  return newState;
};

const fetchDataFail = (state, payload) => {
  return {
    ...state,
    [payload.prop + 'Loading']: false,
    [payload.prop + 'Error']: payload.message,
  };
};

// Action type
export const SET_CONVERSION_CURRENCIES = 'set_conversion_currencies';

const reducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action;
  switch (type) {
    case FETCH_DATA_ASYNC.pending:
      return fetchDataPending(state, payload);
    case FETCH_DATA_ASYNC.success:
      return fetchDataSuccess(state, payload);
    case FETCH_DATA_ASYNC.error:
      return fetchDataFail(state, payload);
    case SET_CONVERSION_CURRENCIES:
      return {
        ...state,
        conversionCurrencies: payload,
      };

    case REMOVE_ALL_AUTH_SESSIONS:
    case REMOVE_AUTH_SESSION:
    case LOGOUT_USER:
      return {
        ...INITIAL_STATE,
      };

    default:
      return state;
  }
};

export default reducer;
