import { createAsyncTypes } from 'util/redux';

export const FETCH_DATA_ASYNC = createAsyncTypes('fetch_data');
export const fetchData = prop => {
  return { type: FETCH_DATA_ASYNC.pending, payload: prop };
};
