import { all, put, take, takeLatest, call } from 'redux-saga/effects';
import { get } from 'lodash';

import {
  LOGIN_SUCCESS,
  AUTH_SUCCESS,
  APP_LOAD_SUCCESS,
  LOGOUT_USER,
} from '../auth/actions';
import { FETCH_DATA_ASYNC } from '../rehive/actions';
import { logout } from 'util/rehive';

function* appLoad(login = true) {
  try {
    yield all([
      put({ type: FETCH_DATA_ASYNC.pending, payload: 'accounts' }),
      put({ type: FETCH_DATA_ASYNC.pending, payload: 'company' }),
      put({ type: FETCH_DATA_ASYNC.pending, payload: 'profile' }),
      put({ type: FETCH_DATA_ASYNC.pending, payload: 'tiers' }),
      put({ type: FETCH_DATA_ASYNC.pending, payload: 'companyCurrencies' }),
    ]);

    // if (login) {
    //   yield all([
    //     // put({ type: FETCH_DATA_ASYNC.pending, payload: 'mobiles' }),
    //     // put({ type: FETCH_DATA_ASYNC.pending, payload: 'emails' }),
    //     // put({ type: FETCH_DATA_ASYNC.pending, payload: 'bankAccounts' }),
    //     // put({ type: FETCH_DATA_ASYNC.pending, payload: 'addresses' }),
    //     // put({ type: FETCH_DATA_ASYNC.pending, payload: 'documents' }),
    //   ]);
    // }
    let accountsLoaded = false;
    let index = 0;

    while (index < 6 && !accountsLoaded) {
      const resp = yield take([FETCH_DATA_ASYNC.success]);
      const type = get(resp, ['payload', 'prop'], '');
      
      if (type === 'accounts') {
        if (!accountsLoaded) {
          accountsLoaded = true;
          index++;
        }
      } else {
        // if (type === 'profile') {
        //   yield put({ type: FETCH_DATA_ASYNC.pending, payload: 'tier' });
        // }
        index++;
      }
    }

    yield put({ type: APP_LOAD_SUCCESS });
  } catch (error) {
    console.log(error);
  }
}

function* logoutSaga() {
  try {
    yield call(logout);
  } catch (error) {
    console.log(error);
  }
}

export default all([
  takeLatest(LOGIN_SUCCESS, appLoad),
  takeLatest(AUTH_SUCCESS, appLoad),
  takeLatest(LOGOUT_USER, logoutSaga),
]);
