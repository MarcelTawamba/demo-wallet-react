import { all, put, takeEvery, take } from 'redux-saga/effects';

import { REFRESH_PROFILE_ASYNC } from './actions';
import { FETCH_DATA_ASYNC } from 'redux/rehive/actions';

function* refreshProfile() {
  try {
    yield all([
      put({ type: FETCH_DATA_ASYNC.pending, payload: 'profile' }),
      put({ type: FETCH_DATA_ASYNC.pending, payload: 'mobiles' }),
      put({ type: FETCH_DATA_ASYNC.pending, payload: 'emails' }),
      put({ type: FETCH_DATA_ASYNC.pending, payload: 'addresses' }),
      put({ type: FETCH_DATA_ASYNC.pending, payload: 'documents' }),
      put({ type: FETCH_DATA_ASYNC.pending, payload: 'tier' }),
      put({ type: FETCH_DATA_ASYNC.pending, payload: 'tiers' }),
    ]);
    for (let i = 0; i < 5; i++) {
      const resp = yield take(FETCH_DATA_ASYNC.success);
    }
    yield put({ type: REFRESH_PROFILE_ASYNC.success });
  } catch (error) {
    yield put({ type: REFRESH_PROFILE_ASYNC.error, payload: error.message });
  }
}

export default all([takeEvery(REFRESH_PROFILE_ASYNC.pending, refreshProfile)]);
