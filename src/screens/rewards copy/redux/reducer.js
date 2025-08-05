import _ from 'lodash';

import { FETCH_CAMPAIGNS_ASYNC, FETCH_REWARDS_ASYNC } from './actions';
import {
  LOGOUT_USER,
  REMOVE_AUTH_SESSION,
  REMOVE_ALL_AUTH_SESSIONS,
} from 'redux/auth/actions';
import {
  fetchPaginatedDataPending,
  fetchPaginatedDataSuccess,
  fetchPaginatedDataFail,
  createDefaultPaginatedStore,
} from 'util/redux';

const dataTypes = ['campaigns', 'rewards'];

const INITIAL_STATE = Object.assign(
  {},
  ..._.map(dataTypes, type => createDefaultPaginatedStore(type)),
);

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action;
  switch (type) {
    case FETCH_CAMPAIGNS_ASYNC.pending:
      return fetchPaginatedDataPending(state, payload, 'campaigns');
    case FETCH_CAMPAIGNS_ASYNC.success:
      return fetchPaginatedDataSuccess(state, payload, 'campaigns');
    case FETCH_CAMPAIGNS_ASYNC.error:
      return fetchPaginatedDataFail(state, payload, 'campaigns');

    case FETCH_REWARDS_ASYNC.pending:
      return fetchPaginatedDataPending(state, payload, 'rewards');
    case FETCH_REWARDS_ASYNC.success:
      return fetchPaginatedDataSuccess(state, payload, 'rewards');
    case FETCH_REWARDS_ASYNC.error:
      return fetchPaginatedDataFail(state, payload, 'rewards');

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
