import React, { useEffect } from 'react';

import screenConfig from './config/screen';

import Screen from 'components/layouts/Screen/Screen';
import { useSelector, useDispatch } from 'react-redux';
import {
  configSettingsSelector,
  userProfileSelector,
  bankAccountsSelector,
  cryptoAccountsSelector,
  configAuthSelector,
  configFAQsSelector,
  devicesSelector,
} from 'redux/rehive/selectors';
import { currentCompanyServicesSelector } from 'redux/auth/selectors';
import {
  displayCurrencySelector,
  primaryCurrenciesSelector,
  walletsSelector,
  ratesStateSelector,
} from 'screens/accounts/redux/selectors';
import { fetchData as fetchReduxData } from 'redux/rehive/actions';

function useRedux() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchReduxData('devices'));
    dispatch(fetchReduxData('profile'));
    dispatch(fetchReduxData('bankAccounts'));
    dispatch(fetchReduxData('cryptoAccounts'));
  }, [dispatch]);
}

export default function SettingsContainer(props) {
  const settingsConfig = useSelector(configSettingsSelector);
  const services = useSelector(currentCompanyServicesSelector);
  const accounts = useSelector(walletsSelector);
  const authConfig = useSelector(configAuthSelector);
  const profile = useSelector(userProfileSelector);

  const displayCurrency = useSelector(displayCurrencySelector);
  const primaryCurrency = useSelector(primaryCurrenciesSelector);
  const rates = useSelector(ratesStateSelector);
  const faqConfig = useSelector(configFAQsSelector);

  useRedux();

  const data = {
    accounts,
    authConfig,
    profile,
    settingsConfig,
    services,
    rates,
    displayCurrency,
    primaryCurrency,
    faqConfig,
  };

  return <Screen screenConfig={screenConfig} reduxContext={data} {...props} />;
}
