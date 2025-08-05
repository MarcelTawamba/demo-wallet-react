// import _ from 'lodash';

// import { LOGOUT_USER } from 'redux/auth/actions';
// import { FETCH_DATA_ASYNC } from './actions';
// import { createDefaultAsyncStore } from 'util/redux';
// import { SET_PROFILE } from '../../profile/redux/actions';

// const dataTypes = [
//   'profile',
//   'publicCompanies',
//   'addresses',
//   'bankAccounts',
//   'cryptoAccounts',
//   'documents',
//   'emails',
//   'mobiles',
//   'accounts',
//   'products',
//   'orders',
//   'conversionRates',
// ];

// const INITIAL_STATE = Object.assign(
//   {},
//   ..._.map(dataTypes, type => createDefaultAsyncStore(type)),
// );

// const fetchDataPending = (state, payload) => {
//   return {
//     ...state,
//     [payload + 'Loading']: true,
//     [payload + 'Error']: '',
//   };
// };

// const fetchDataSuccess = (state, payload) => {
//   return {
//     ...state,
//     [payload.prop]: payload.data,
//     [payload.prop + 'Loading']: false,
//     [payload.prop + 'Error']: '',
//   };
// };

// const fetchDataFail = (state, payload) => {
//   return {
//     ...state,
//     [payload.prop + 'Loading']: false,
//     [payload.prop]: null,
//     [payload.prop + 'Error']: payload.message,
//   };
// };

// export default (state = INITIAL_STATE, action) => {
//   const { type, payload } = action;
//   switch (type) {
//     case FETCH_DATA_ASYNC.pending:
//       return fetchDataPending(state, payload);
//     case FETCH_DATA_ASYNC.success:
//       return fetchDataSuccess(state, payload);
//     case FETCH_DATA_ASYNC.error:
//       return fetchDataFail(state, payload);

//     case LOGOUT_USER:
//       return {
//         ...INITIAL_STATE,
//       };

//     default:
//       return state;
//   }
// };
