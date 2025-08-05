import { createAsyncTypes } from 'util/redux';
import { FETCH_DATA_ASYNC } from 'redux/rehive/actions';

export const REFRESH_PROFILE_ASYNC = createAsyncTypes('refresh_profile');
export const refreshProfile = prop => {
  return { type: REFRESH_PROFILE_ASYNC.pending, payload: prop };
};

export const SET_PROFILE = 'set_profile';
export const setProfile = profile => {
  return { type: FETCH_DATA_ASYNC.success, payload: profile };
};

// export const FETCH_BANK_ACCOUNTS_ASYNC = createAsyncTypes(
//   'fetch_bank_accounts',
// );
// export const fetchData = filters => {
//   return { type: FETCH_BANK_ACCOUNTS_ASYNC.pending, payload: filters };
// };
