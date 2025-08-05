import { Machine } from 'xstate';

const LOGIN = 'LOGIN';
const REGISTER = 'REGISTER';
const FORGOT = 'FORGOT';
const PRE_AUTH_SLIDES = 'PRE_AUTH_SLIDES';
const POST_AUTH_SLIDES = 'POST_AUTH_SLIDES';
const LANDING = 'LANDING';
const SUCCESS = 'SUCCESS';
const BACK = 'BACK';
const COMPANY = 'COMPANY';
const AUTH_INIT = 'AUTH_INIT';
const MFA_VERIFY = 'MFA_VERIFY';
const MFA_SET = 'MFA_SET';
const EMAIL_VERIFY = 'EMAIL_VERIFY';
const MOBILE_VERIFY = 'MOBILE_VERIFY';
const AUTH_SUCCESS = 'AUTH_SUCCESS';
const GROUP = 'GROUP';
const ABOUT = 'ABOUT';
const DISCLAIMER = 'DISCLAIMER';
const BUSINESS = 'BUSINESS';
const SELLER = 'SELLER';

const authMachine = Machine({
  id: 'auth',
  initial: AUTH_INIT,
  states: {
    [AUTH_INIT]: {
      on: { COMPANY, LANDING, LOGIN, REGISTER, FORGOT, AUTH_SUCCESS },
    },
    [COMPANY]: {
      on: { [SUCCESS]: PRE_AUTH_SLIDES, AUTH_SUCCESS },
    },
    [PRE_AUTH_SLIDES]: {
      on: { [SUCCESS]: LANDING, [BACK]: COMPANY, COMPANY },
    },
    [LANDING]: {
      on: {
        LOGIN,
        REGISTER,
        GROUP,
        [BACK]: COMPANY,
        ABOUT,
        COMPANY,
        AUTH_SUCCESS,
        BUSINESS,
        SELLER,
      },
    },
    [LOGIN]: {
      on: {
        [BACK]: LANDING,
        REGISTER,
        GROUP,
        FORGOT,
        [SUCCESS]: MFA_VERIFY,
        ABOUT,
        COMPANY,
        AUTH_SUCCESS,
      },
    },
    [GROUP]: {
      on: {
        [SUCCESS]: REGISTER,
        [BACK]: LANDING,
        COMPANY,
        AUTH_SUCCESS,
        ABOUT,
      },
    },
    [REGISTER]: {
      on: {
        [BACK]: LANDING,
        LOGIN,
        [SUCCESS]: DISCLAIMER,
        ABOUT,
        GROUP,
        COMPANY,
        AUTH_SUCCESS,
      },
    },
    [FORGOT]: {
      on: { [BACK]: LOGIN, ABOUT, COMPANY, AUTH_SUCCESS },
    },
    [ABOUT]: {
      on: {
        LANDING,
        LOGIN,
        REGISTER,
        DISCLAIMER,
        FORGOT,
        GROUP,
        COMPANY,
        AUTH_SUCCESS,
        SELLER,
      },
    },
    [DISCLAIMER]: {
      on: {
        [SUCCESS]: MFA_SET,
        [BACK]: LANDING,
        ABOUT,
        COMPANY,
      },
    },
    [MFA_VERIFY]: {
      on: { [BACK]: LANDING, [SUCCESS]: EMAIL_VERIFY, COMPANY, MFA_SET },
    },
    [MFA_SET]: {
      on: { [BACK]: LANDING, [SUCCESS]: EMAIL_VERIFY },
    },
    [EMAIL_VERIFY]: {
      on: { [BACK]: LANDING, [SUCCESS]: MOBILE_VERIFY, COMPANY },
    },
    [MOBILE_VERIFY]: {
      on: { [BACK]: LANDING, [SUCCESS]: BUSINESS, COMPANY },
    },
    [BUSINESS]: {
      on: { [BACK]: LANDING, [SUCCESS]: SELLER, COMPANY },
    },
    [SELLER]: {
      on: { [BACK]: LANDING, [SUCCESS]: POST_AUTH_SLIDES, COMPANY, ABOUT },
    },
    [POST_AUTH_SLIDES]: {
      on: { [SUCCESS]: AUTH_SUCCESS, COMPANY },
    },
    [AUTH_SUCCESS]: { type: 'final' },
  },
});

export default authMachine;
export {
  LOGIN,
  REGISTER,
  FORGOT,
  LANDING,
  COMPANY,
  BACK,
  SUCCESS,
  EMAIL_VERIFY,
  MOBILE_VERIFY,
  MFA_VERIFY,
  MFA_SET,
  ABOUT,
  DISCLAIMER,
  GROUP,
  AUTH_SUCCESS,
  AUTH_INIT,
  POST_AUTH_SLIDES,
  PRE_AUTH_SLIDES,
  BUSINESS,
  SELLER,
};
