import { createAsyncTypes } from 'util/redux';

export const FETCH_PRODUCTS_ASYNC = createAsyncTypes('fetch_products');
export const fetchProducts = filters => {
  return {
    type: FETCH_PRODUCTS_ASYNC.pending,
    payload: { filters },
  };
};

export const fetchProductsNext = () => {
  return {
    type: FETCH_PRODUCTS_ASYNC.pending,
    payload: 'next',
  };
};

export const FETCH_ORDERS_ASYNC = createAsyncTypes('fetch_orders');
export const fetchOrders = filters => {
  return {
    type: FETCH_ORDERS_ASYNC.pending,
    payload: { filters },
  };
};

export const fetchOrdersNext = () => {
  return {
    type: FETCH_ORDERS_ASYNC.pending,
    payload: 'next',
  };
};

export const FETCH_VOUCHERS_ASYNC = createAsyncTypes('fetch_vouchers');
export const fetchVouchers = filters => {
  return {
    type: FETCH_VOUCHERS_ASYNC.pending,
    payload: { filters },
  };
};

export const fetchVouchersNext = () => {
  return {
    type: FETCH_VOUCHERS_ASYNC.pending,
    payload: 'next',
  };
};
