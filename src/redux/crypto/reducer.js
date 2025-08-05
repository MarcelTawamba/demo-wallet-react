import { FETCH_CRYPTO_ASYNC } from './actions';
import {
  LOGOUT_USER,
  REMOVE_ALL_AUTH_SESSIONS,
  REMOVE_AUTH_SESSION,
} from '../auth/actions';

const INITIAL_STATE = {
  XBT: null,
  TXBT: null,
  ETH: null,
  TETH: null,
  XLM: null,
  TXLM: null,
};

const reducer = (state = INITIAL_STATE, action) => {
  // console.log(action);
  switch (action.type) {
    // case PERSIST_REHYDRATE:
    //   return action.payload.auth || INITIAL_STATE;

    case FETCH_CRYPTO_ASYNC.pending:
      return {
        ...state,
        loading: true,
      };
    case FETCH_CRYPTO_ASYNC.success:
      return {
        ...state,
        loading: false,
        [action.payload.blockchain]: {
          [action.payload.network]: {
            user: action.payload.user,
            assets: action.payload.assets,
            company: action.payload.company,
            assetsDetails: action.payload.assetsDetails,
            error: '',
          },
        },
      };
    case FETCH_CRYPTO_ASYNC.error:
      return {
        ...state,
        loading: false,
        [action.payload.blockchain]: {
          [action.payload.network]: null,
        },
      };

    case REMOVE_ALL_AUTH_SESSIONS:
    case REMOVE_AUTH_SESSION:
    case LOGOUT_USER:
      return INITIAL_STATE;

    default:
      return state;
  }
};

export default reducer;
