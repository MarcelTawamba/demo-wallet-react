import { all, call, put, takeEvery, select } from 'redux-saga/effects';
// import { uniq, get } from 'lodash';

import {
  FETCH_PRODUCTS_ASYNC,
  FETCH_ORDERS_ASYNC,
  FETCH_VOUCHERS_ASYNC,
} from './actions';

import { LOGOUT_USER } from 'redux/auth/actions';
import { getProducts, getOrders, getNext, getVouchers } from 'util/rehive';
import {
  productsNextSelector,
  ordersNextSelector,
  vouchersNextSelector,
} from './selectors';
import { queryMap } from 'util/general';
import filterMap from 'util/filterMap';

function* fetchProducts(action) {
  try {
    const { payload } = action;
    let response = null;
    if (payload === 'next') {
      const next = yield select(productsNextSelector);
      response = yield call(getNext, next);
    } else {
      const { filters = {} } = payload;
      const mapped = queryMap(filterMap(filters));
      response = yield call(getProducts, mapped);
    }

    if ((response && response.status === 'error') || !response.data) {
      yield put({
        type: FETCH_PRODUCTS_ASYNC.error,
        payload: response.message,
      });
    } else {
      yield put({
        type: FETCH_PRODUCTS_ASYNC.success,
        payload: response.data,
      });
    }
  } catch (error) {
    console.log('TCL: function*fetchProducts -> error', error);
    if (
      error &&
      error.status &&
      (error.status === 403 || error.status === 401)
    ) {
      yield put({
        type: LOGOUT_USER,
      });
    }
    yield put({
      type: FETCH_PRODUCTS_ASYNC.error,
      payload: error.message,
    });
  }
}

// function* fetchOrders(action) {
//   try {
//     const { payload } = action;
//     let response = null;
//     if (payload === 'next') {
//       const next = yield select(ordersNextSelector);
//       response = yield call(getNext, next);
//     } else {
//       const { filters = {} } = payload;
//       const mapped = queryMap(filterMap(filters));
//       response = yield call(getOrders, mapped);
//     }

//     if ((response && response.status === 'error') || !response.data) {
//       if (
//         response &&
//         response.status &&
//         (response.status === 403 ||
//           response.status === 401 ||
//           response.message === 'Invalid token.')
//       ) {
//         yield put({
//           type: LOGOUT_USER,
//         });
//       }
//       yield put({
//         type: FETCH_ORDERS_ASYNC.error,
//         payload: response.message,
//       });
//     } else {
//       yield put({
//         type: FETCH_ORDERS_ASYNC.success,
//         payload: response.data,
//       });
//     }
//   } catch (error) {
//     console.log('TCL: function*fetchOrders -> error', error);
//     if (
//       error &&
//       error.status &&
//       (error.status === 403 || error.status === 401)
//     ) {
//       yield put({
//         type: LOGOUT_USER,
//       });
//     }
//     yield put({
//       type: FETCH_ORDERS_ASYNC.error,
//       payload: error.message,
//     });
//   }
// }

function* fetchVouchers(action) {
  try {
    const { payload } = action;
    let response = null;
    if (payload === 'next') {
      const next = yield select(vouchersNextSelector);
      response = yield call(getNext, next);
    } else {
      response = yield call(getVouchers);
    }

    if ((response && response.status === 'error') || !response.data) {
      if (
        response &&
        response.status &&
        (response.status === 403 ||
          response.status === 401 ||
          response.message === 'Invalid token.')
      ) {
        yield put({
          type: LOGOUT_USER,
        });
      }
      yield put({
        type: FETCH_VOUCHERS_ASYNC.error,
        payload: response.message,
      });
    } else {
      yield put({
        type: FETCH_VOUCHERS_ASYNC.success,
        payload: response.data,
      });
    }
  } catch (error) {
    console.log('TCL: function*fetchVouchers -> error', error);
    if (
      error &&
      error.status &&
      (error.status === 403 || error.status === 401)
    ) {
      yield put({
        type: LOGOUT_USER,
      });
    }
    yield put({
      type: FETCH_VOUCHERS_ASYNC.error,
      payload: error.message,
    });
  }
}

const productSagas = all([
  takeEvery(FETCH_PRODUCTS_ASYNC.pending, fetchProducts),
  // takeEvery(FETCH_ORDERS_ASYNC.pending, fetchOrders),
  takeEvery(FETCH_VOUCHERS_ASYNC.pending, fetchVouchers),
]);

export default productSagas;
