import _ from 'lodash';

///////////////////
// ActionHelpers //
///////////////////
const asyncTypes = {
  pending: 'pending',
  success: 'success',
  error: 'error',
};
export const createAsyncTypes = typeString =>
  Object.values(asyncTypes).reduce((acc, curr) => {
    // console.log('curr', curr);
    acc[curr] = `${typeString}_${curr}`;
    // console.log('acc', acc);
    return acc;
  }, {});

export const createAction = (type, payload = {}) => ({ type, ...payload });

///////////////////
// createReducer //
///////////////////
export const createReducer = (initialState, handlers) => (
  state = initialState,
  action,
) =>
  handlers.hasOwnProperty(action.type)
    ? handlers[action.type](state, action)
    : state;

export const createDefaultAsyncStore = typeString => {
  return {
    [typeString]: [],
    [typeString + 'Loading']: false,
    [typeString + 'Error']: '',
  };
};

export const fetchDataPending = (state, payload, prop) => {
  return {
    ...state,
    [prop + 'Loading']: true,
    [prop + 'Error']: '',
  };
};

export const fetchDataSuccess = (state, payload, prop) => {
  return {
    ...state,
    [prop]: payload,
    [prop + 'Loading']: false,
    [prop + 'Error']: '',
  };
};

export const fetchDataFail = (state, payload, prop) => {
  return {
    ...state,
    [prop + 'Loading']: false,
    [prop]: null,
    [prop + 'Error']: payload.message,
  };
};

export const createDefaultPaginatedStore = typeString => {
  return {
    [typeString]: {
      byId: {},
      ids: [],
      error: '',
      loading: false,
      filtered: [],
      filters: [],
    },
  };
};

export const fetchPaginatedDataPending = (state, payload, prop) => {
  return {
    ...state,
    [prop]: {
      ...state[prop],
      loading: true,
      error: '',
      ids: payload === 'next' ? state[prop].ids : [],
    },
  };
};

export const fetchPaginatedDataSuccess = (state, payload, prop) => {
  return {
    ...state,
    [prop]: {
      ...state[prop],
      byId: { ...state[prop].byId, ...storeById(payload.results) },
      ids: _.union(state[prop].ids, storeIds(payload.results)),
      next: payload.next,
      count: payload.count,
      error: '',
      loading: false,
    },
  };
};

const storeById = data => {
  var byId = {};
  for (let i = 0; i < data.length; i += 1) {
    const item = data[i];
    byId[item.id] = item;
  }
  return byId;
};

const storeIds = data => {
  const ids = data.map(o => o.id);
  return ids;
};

export const fetchPaginatedDataFail = (state, payload, prop) => {
  return {
    ...state,
    [prop]: {
      ...state[prop],
      // byID: normalize(payload, products),
      error: payload.message,
      loading: false,
    },
  };
};
