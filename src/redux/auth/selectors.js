import { createSelector } from 'reselect';

import { get, reverse, sortBy } from 'lodash';
import { arrayToObject } from 'util/general';
// import { rehiveStateSelector } from '../rehive/selectors';// TODO: public company fetch to auth redux

export const authStateSelector = state => state.auth;

export const authTempCompanySelector = createSelector(
  authStateSelector,
  authState => {
    return authState.tempCompany;
  },
);

export const tokenSelector = createSelector(authStateSelector, authState => {
  return authState.token;
});

export const authLogoutSelector = createSelector(
  authStateSelector,
  authState => {
    return authState.logout;
  },
);

/* Company selectors */
export const recentCompaniesStateSelector = createSelector(
  authStateSelector,
  authState => {
    const companyHistory = get(authState, 'companyHistory', []);
    const recentCompanies = reverse(
      sortBy(companyHistory, [item => item.last_login]),
    );
    return recentCompanies;
  },
);

export const currentCompanyIDStateSelector = createSelector(
  authStateSelector,
  authState => {
    return get(authState, 'companyID', '');
  },
);

export const tempCompanyIDStateSelector = createSelector(
  authStateSelector,
  authState => {
    return get(authState, 'tempCompanyID', '');
  },
);

export const companiesSelector = createSelector(
  [
    recentCompaniesStateSelector,
    currentCompanyIDStateSelector,
    authTempCompanySelector,
    tempCompanyIDStateSelector,
  ],
  (
    recentCompaniesState,
    currentCompanyIDState,
    tempCompany,
    tempCompanyIDState,
  ) => {
    const currentCompany = recentCompaniesState.find(
      company => company.id === currentCompanyIDState,
    );

    return {
      recentCompanies: recentCompaniesState,
      recent: arrayToObject(recentCompaniesState, 'id'),
      currentCompany,
      currentCompanyID: currentCompanyIDState,
      tempCompany,
      tempCompanyID: tempCompanyIDState,
    };
  },
);

export const currentCompanySelector = createSelector(
  [companiesSelector],
  companies => {
    const { tempCompany, currentCompany } = companies;
    if (tempCompany) {
      return tempCompany;
    }
    if (currentCompany) {
      return currentCompany;
    }
    return { services: [], config: {} };
  },
);

export const currentCompanyServicesSelector = createSelector(
  [currentCompanySelector],
  company => {
    let services = {};
    company.services.map(service => {
      services[service.slug] = true;
      return { [service.slug]: true };
    });

    return services;
  },
);

export const currentSessionsStateSelector = createSelector(
  authStateSelector,
  authState => {
    return get(authState, 'currentSessions', null);
  },
);
export const appLoadedSelector = createSelector(
  authStateSelector,
  authState => {
    return authState.appLoaded ? authState.appLoaded : false;
  },
);
export const newAuthSelector = createSelector(authStateSelector, authState => {
  return get(authState, 'newAuth', true);
});

export const currentSessionsUserIdStateSelector = createSelector(
  authStateSelector,
  authState => {
    return get(authState, 'userID', null);
  },
);

export const currentSessionsSelector = createSelector(
  [
    currentSessionsStateSelector,
    currentSessionsUserIdStateSelector,
    companiesSelector,
  ],
  (currentSessionsState, currentSessionsUserIdState, companies) => {
    const companyID = companies.tempCompanyID
      ? companies.tempCompanyID
      : companies.currentCompanyID;

    const currentSession = get(
      currentSessionsState,
      [companyID, currentSessionsUserIdState],
      { token: '', user: null },
    );
    const { token, user } = currentSession;

    return {
      items: currentSessionsState,
      userID: currentSessionsUserIdState,
      companyID,
      token,
      user,
    };
  },
);

export const publicCompaniesStateSelector = createSelector(
  authStateSelector,
  authState => {
    return get(authState, 'companyPublic', []);
  },
);

export const authEmailSelector = createSelector(
  authStateSelector,
  authState => {
    return get(authState, 'email', '');
  },
);

export const authUserSelector = createSelector(
  currentSessionsSelector,
  currentSessions => {
    return currentSessions.user;
  },
);
