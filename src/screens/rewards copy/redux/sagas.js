import { all, call, put, takeEvery, select } from 'redux-saga/effects';
// import { uniq, get } from 'lodash';

import { FETCH_REWARDS_ASYNC, FETCH_CAMPAIGNS_ASYNC } from './actions';

import { LOGOUT_USER } from 'redux/auth/actions';
import { getCampaigns, getRewards, getNext } from 'util/rehive';
import { campaignsNextSelector, rewardsNextSelector } from './selectors';
// import moment from 'moment';

function* fetchCampaigns(action) {
  try {
    const { payload } = action;
    let response = null;
    if (payload === 'next') {
      const next = yield select(campaignsNextSelector);
      response = yield call(getNext, next);
    } else {
      // const now = moment().unix();
      const query = 'available=true'; //'page_size=15&active=true&end_date__gt=' + now.toString();
      response = yield call(getCampaigns, query);
    }

    if ((response && response.status === 'error') || !response.data) {
      yield put({
        type: FETCH_CAMPAIGNS_ASYNC.error,
        payload: response.message,
      });
    } else {
      yield put({
        type: FETCH_CAMPAIGNS_ASYNC.success,
        payload: response.data,
      });
    }
  } catch (error) {
    console.log('TCL: function*fetchCampaigns -> error', error);
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
      type: FETCH_CAMPAIGNS_ASYNC.error,
      payload: error.message,
    });
  }
}

function* fetchRewards(action) {
  try {
    const { payload } = action;
    let response = null;
    if (payload === 'next') {
      const next = yield select(rewardsNextSelector);
      response = yield call(getNext, next);
    } else {
      response = yield call(getRewards);
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
        type: FETCH_REWARDS_ASYNC.error,
        payload: response.message,
      });
    } else {
      yield put({
        type: FETCH_REWARDS_ASYNC.success,
        payload: response.data,
      });
    }
  } catch (error) {
    console.log('TCL: function*fetchRewards -> error', error);
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
      type: FETCH_REWARDS_ASYNC.error,
      payload: error.message,
    });
  }
}

const rewardSagas = all([
  takeEvery(FETCH_CAMPAIGNS_ASYNC.pending, fetchCampaigns),
  takeEvery(FETCH_REWARDS_ASYNC.pending, fetchRewards),
]);

export default rewardSagas;
