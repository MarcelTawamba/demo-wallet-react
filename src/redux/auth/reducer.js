import {
  CACHE_COMPANY,
  SET_COMPANY,
  LOGIN_SUCCESS,
  REGISTER_SUCCESS,
  LOGOUT_USER,
  AUTH_SUCCESS,
  RESET_LOGOUT,
  SET_TEMP_COMPANY,
  REMOVE_TEMP_COMPANY,
  REMOVE_AUTH_SESSION,
  REMOVE_ALL_AUTH_SESSIONS,
  SWITCH_AUTH_SESSION,
  RESET_AUTH,
  APP_LOAD_SUCCESS,
  NEW_AUTH,
  UPDATE_USER_PROFILE,
} from './actions';
import { get, isEmpty } from 'lodash';

const INITIAL_STATE = {
  user: {},
  email: '',
  token: '',
  logout: false,

  companyID: '',
  companyHistory: [],

  tempCompany: {},
};

const cacheCompany = (state, payload) => {
  let companies = state.companyHistory ? [...state.companyHistory] : [];
  var foundIndex = companies.findIndex(company => company.id === payload.id);
  const data = { ...payload, last_login: Date.now() };
  if (foundIndex === -1) {
    companies.push(data);
  } else {
    companies[foundIndex] = data;
  }
  return {
    ...state,
    companyHistory: companies,
    companyID: payload.id,
    tempCompany: null,
    tempCompanyID: '',
  };
};

function handleAuthSuccess(state, payload) {
  const { tempCompanyID, companyID, currentSessions } = state;
  const { user, token } = payload;
  const newCompanyID = tempCompanyID ? tempCompanyID : companyID;
  const companySessions = get(state, ['currentSessions', newCompanyID], {});
  const userID = get(user, 'id', '');
  return {
    ...state,
    currentSessions: {
      ...currentSessions,
      [newCompanyID]: {
        ...companySessions,
        [userID]: {
          user,
          token,
        },
      },
    },
    companyID: newCompanyID,
    userID,
    tempCompany: null,
    tempCompanyID: '',
  };
}

function handleUserProfileUpdate(state, user) {
  const { tempCompanyID, companyID, currentSessions } = state;
  const newCompanyID = tempCompanyID ? tempCompanyID : companyID;
  const companySessions = get(state, ['currentSessions', newCompanyID], {});
  const userID = get(user, 'id', '');
  const userSession = get(state, ['currentSessions', newCompanyID, userID], {});
  return {
    ...state,
    currentSessions: {
      ...currentSessions,
      [newCompanyID]: {
        ...companySessions,
        [userID]: {
          ...userSession,
          user,
        },
      },
    },
    companyID: newCompanyID,
    userID,
    tempCompany: null,
    tempCompanyID: '',
  };
}

function handleAuthRemove(state, payload = {}, logout) {
  let { userID, companyID } = payload;
  let { currentSessions, companyHistory } = state;

  if (!userID) {
    ({ userID } = state);
  }
  if (!companyID) {
    ({ companyID } = state);
  }
  const tempCompany = companyHistory.find(item => item.id === companyID);

  try {
    delete currentSessions[companyID][userID];
    if (isEmpty(currentSessions[companyID])) {
      delete currentSessions[companyID];
    }
  } catch (e) {}
  let extra = {};
  if (logout) {
    extra = {
      logout,
      appLoaded: false,
      companyID: '',
      userID: '',
    };
  }
  return {
    ...state,
    currentSessions,
    tempCompanyID: companyID,
    tempCompany,
    ...extra,
  };
}

function handleAuthRemoveAll(state) {
  return {
    ...state,
    currentSessions: null,
    tempCompanyID: state.companyID,
    companyID: '',
    userID: '',
    logout: true,
    appLoaded: false,
  };
}

function handleAuthSwitch(state, payload) {
  const { userID, companyID } = payload;
  return {
    ...state,
    companyID,
    userID,
  };
}

const reducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_COMPANY:
      return {
        ...state,
        companyID: payload,
      };

    case SET_TEMP_COMPANY:
      return {
        ...cacheCompany(state, payload),
        tempCompany: payload,
        tempCompanyID: payload.id,
      };

    case CACHE_COMPANY:
      return cacheCompany(state, payload);

    case LOGIN_SUCCESS:
    case AUTH_SUCCESS:
    case REGISTER_SUCCESS:
      return handleAuthSuccess(state, payload);

    case LOGOUT_USER:
      return handleAuthRemove(state, payload, true);

    case REMOVE_AUTH_SESSION:
      return handleAuthRemove(state, payload, true);
    case REMOVE_ALL_AUTH_SESSIONS:
      return handleAuthRemoveAll(state);
    case SWITCH_AUTH_SESSION:
      return handleAuthSwitch(state, payload);

    case UPDATE_USER_PROFILE:
      return handleUserProfileUpdate(state, payload);

    case REMOVE_TEMP_COMPANY:
      return {
        ...state,
        tempCompany: null,
        tempCompanyID: '',
      };

    case RESET_AUTH:
      return {
        ...state,
        appLoaded: false,
      };

    case RESET_LOGOUT:
      return {
        ...state,
        logout: false,
      };

    case NEW_AUTH:
      return {
        ...state,
        newAuth: true,
      };

    case APP_LOAD_SUCCESS:
      return {
        ...state,
        appLoaded: true,
        newAuth: false,
      };

    default:
      return state;
  }
};

export default reducer;
