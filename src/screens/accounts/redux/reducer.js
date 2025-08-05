import { SET_DISPLAY_CURRENCY } from './actions';
import {
  LOGOUT_USER,
  REMOVE_ALL_AUTH_SESSIONS,
  REMOVE_AUTH_SESSION,
} from 'redux/auth/actions';

const INITIAL_STATE = {
  displayCurrency: '',
};

const reducer = (state = INITIAL_STATE, action) => {
  // console.log(action);
  switch (action.type) {
    // case PERSIST_REHYDRATE:
    //   return action.payload.auth || INITIAL_STATE;

    case SET_DISPLAY_CURRENCY:
      return {
        ...state,
        displayCurrency: action.payload,
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
