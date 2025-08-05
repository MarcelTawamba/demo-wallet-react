// import { createAsyncTypes } from 'util/redux';

export const APP_LOAD_SUCCESS = 'app_load_success';
export const APP_LOAD = 'app_load';
export const appLoad = login => {
  return {
    type: APP_LOAD,
    payload: login,
  };
};
export const NEW_AUTH = 'new_auth';
export const setNewAuth = () => {
  return {
    type: NEW_AUTH,
    payload: null,
  };
};

export const SET_COMPANY = 'set_company';
export const CACHE_COMPANY = 'cache_company';
export const setCompany = company => {
  return {
    type: SET_COMPANY,
    payload: company,
  };
};

export const SET_TEMP_COMPANY = 'set_temp_company';
export const setTempCompany = company => {
  return {
    type: SET_TEMP_COMPANY,
    payload: company,
  };
};

export const REMOVE_TEMP_COMPANY = 'remove_temp_company';
export const removeTempCompany = () => {
  return {
    type: REMOVE_TEMP_COMPANY,
  };
};

export const LOGIN_SUCCESS = 'login_success';
export const onLoginSuccess = data => {
  return {
    type: LOGIN_SUCCESS,
    payload: data,
  };
};

export const REGISTER_SUCCESS = 'register_success';
export const onRegisterSuccess = data => {
  return {
    type: REGISTER_SUCCESS,
    payload: data,
  };
};

export const UPDATE_USER_PROFILE = 'update_user_profile';
export const updateUserProfile = data => {
  return {
    type: UPDATE_USER_PROFILE,
    payload: data,
  };
};

export const AUTH_SUCCESS = 'auth_success';
export const onAuthSuccess = data => {
  return {
    type: AUTH_SUCCESS,
    payload: data,
  };
};

export const LOGOUT_USER = 'logout';
export const logoutUser = (company, userID) => {
  return {
    type: LOGOUT_USER,
    payload: { company, userID },
  };
};

export const REMOVE_AUTH_SESSION = 'remove_auth_session';
export const removeAuthSession = (companyID, userID) => {
  return {
    type: REMOVE_AUTH_SESSION,
    payload: { companyID, userID },
  };
};

export const REMOVE_ALL_AUTH_SESSIONS = 'remove_all_auth_sessions';
export const removeAllAuthSessions = () => {
  return {
    type: REMOVE_ALL_AUTH_SESSIONS,
  };
};

export const SWITCH_AUTH_SESSION = 'switch_auth_session';
export const switchAuthSession = (company, userID) => {
  return {
    type: SWITCH_AUTH_SESSION,
    payload: { company, userID },
  };
};

export const RESET_LOGOUT = 'reset_logout';
export const resetLogout = () => {
  return {
    type: RESET_LOGOUT,
  };
};

export const RESET_AUTH = 'reset_auth';
export const resetAuth = () => {
  return {
    type: RESET_AUTH,
  };
};
