import React, { createContext, useContext, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import defaults from 'config/config/defaults';
import { userProfileSelector } from 'redux/rehive/selectors';
import {
  currentCompanySelector,
  appLoadedSelector,
  authUserSelector,
} from 'redux/auth/selectors';
import {
  userTierSelector,
  userTiersSelector,
} from 'screens/accounts/redux/selectors';
import { FETCH_DATA_ASYNC } from 'redux/rehive/actions';

const RehiveContext = createContext();
const RehiveMethods = createContext();

function mapConfig(company) {
  let config = {};

  Object.keys(defaults).forEach(key => {
    let item = defaults[key];
    config[key + 'Config'] = mergeConfig(company, key, item);
  });
  return config;
}
function mapServices(company) {
  let services = {};
  company.services.map(service => {
    services[service.slug] = true;
    return { [service.slug]: true };
  });
  return services;
}

function RehiveProvider({ children, initial = {} }) {
  const company = useSelector(currentCompanySelector);
  const user = useSelector(authUserSelector);
  const init = useSelector(appLoadedSelector);
  const services = useMemo(() => mapServices(company), [company]);
  const config = useMemo(() => mapConfig(company), [company]);
  const dispatch = useDispatch();

  const tier = useSelector(userTierSelector);
  const tiers = useSelector(userTiersSelector);

  const context = {
    company,
    tier: tier?.items?.[0],
    init,
    tiers: tiers?.items,
    user,
    services,
  };

  const refresh = {
    refreshUser: () => {},
    refreshTiers: () => {
      dispatch({ type: FETCH_DATA_ASYNC.pending, payload: 'tiers' });
    }
  };
  const methods = {
    refresh,
    ...refresh,
  };

  return (
    <RehiveContext.Provider
      value={{
        ...context,
        context,
        config,
      }}>
      <RehiveMethods.Provider value={methods}>
        {children}
      </RehiveMethods.Provider>
    </RehiveContext.Provider>
  );
}
function useRehiveContext() {
  const context = useContext(RehiveContext);
  if (context === undefined) {
    return null;
  }
  return context;
}
function useRehiveMethods() {
  const context = useContext(RehiveMethods);
  if (context === undefined) {
    throw new Error(
      'useRehiveMethod must be used within a RehiveMethodProvider',
    );
  }
  return context;
}

function mergeConfig(company, key, def = {}) {
  let temp = company?.config?.[key] ?? def;
  return { ...def, ...temp };
}

export { useRehiveContext, useRehiveMethods, RehiveProvider };
