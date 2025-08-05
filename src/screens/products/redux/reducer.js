import _ from 'lodash';

import {
  FETCH_PRODUCTS_ASYNC,
  FETCH_ORDERS_ASYNC,
  FETCH_VOUCHERS_ASYNC,
} from './actions';
import {
  LOGOUT_USER,
  REMOVE_ALL_AUTH_SESSIONS,
  REMOVE_AUTH_SESSION,
} from 'redux/auth/actions';
import {
  fetchPaginatedDataPending,
  fetchPaginatedDataSuccess,
  fetchPaginatedDataFail,
  createDefaultPaginatedStore,
} from 'util/redux';

const dataTypes = ['products', 'orders', 'vouchers'];

const INITIAL_STATE = Object.assign(
  {},
  ..._.map(dataTypes, type => createDefaultPaginatedStore(type)),
);

const reducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action;
  switch (type) {
    case FETCH_ORDERS_ASYNC.pending:
      return fetchPaginatedDataPending(state, payload, 'orders');
    case FETCH_ORDERS_ASYNC.success:
      return fetchPaginatedDataSuccess(state, payload, 'orders');
    case FETCH_ORDERS_ASYNC.error:
      return fetchPaginatedDataFail(state, payload, 'orders');

    case FETCH_PRODUCTS_ASYNC.pending:
      return fetchPaginatedDataPending(state, payload, 'products');
    case FETCH_PRODUCTS_ASYNC.success:
      return fetchPaginatedDataSuccess(state, payload, 'products');
    case FETCH_PRODUCTS_ASYNC.error:
      return fetchPaginatedDataFail(state, payload, 'products');

    case FETCH_VOUCHERS_ASYNC.pending:
      return fetchPaginatedDataPending(state, payload, 'vouchers');
    case FETCH_VOUCHERS_ASYNC.success:
      return fetchPaginatedDataSuccess(state, payload, 'vouchers');
    case FETCH_VOUCHERS_ASYNC.error:
      return fetchPaginatedDataFail(state, payload, 'vouchers');

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
