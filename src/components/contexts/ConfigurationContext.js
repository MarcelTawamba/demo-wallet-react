import React, { useContext, useState, useEffect } from 'react';
import { pick, isNull } from 'lodash';
import {
  getCompanyByDomain,
  getPublicCompany,
  getCompanyByID,
  servicesInit,
} from 'util/rehive';
import { currentCompanySelector } from 'redux/auth/selectors';
import { useSelector } from 'react-redux';
import { enableTracking } from 'util/tracking';

const defaultConfig = {
  company: '',
  apple_app_store_url:
    'https://apps.apple.com/us/app/rehive-wallet/id1371128319',
  android_play_store_url:
    'https://play.google.com/store/apps/details?id=com.rehivewallet&hl=en',
  url: 'https://app.rehive.com/',
  privacy_policy_url: 'https://rehive.com/privacy/',
  terms_and_conditions_url: 'https://rehive.com/end-user-terms/',
};

const greyLabelDomains = [
  'app.rehive.com',
  'qa.rehive.com',
  'app.staging.rehive.com',
  'localhost',
];

const ConfigurationContext = React.createContext();

function ConfigurationProvider({ children }) {
  const [config, setConfig] = useState(null);
  const [companyDataLoading, setCompanyDataLoading] = useState(false);

  const company = useSelector(currentCompanySelector);
  const domain = window.location.hostname;
  // const domain = 'wallet2.s.tokenexplorer.com';

  const isGreyLabel = new RegExp(greyLabelDomains.join('|')).test(domain);

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (
      !isGreyLabel ||
      !company?.id ||
      config?.id === company?.id ||
      !servicesInit
    )
      return;

    setCompanyDataLoading(true);
    getCompanyByID(company.id).then(resp => {
      getPublicCompany(company.id).then(resp2 => {
        setConfig({ ...defaultConfig, ...resp2?.data, ...resp });
        setCompanyDataLoading(false);
      });
    });
  }, [company.id, servicesInit]);

  async function init() {
    if (isGreyLabel) {
      setConfig(defaultConfig);
      enableTracking();
    } else await fetchConfig({ domain });
  }

  async function fetchConfig({ domain }) {
    setCompanyDataLoading(true);
    const resp = await getCompanyByDomain(domain);

    if (!resp?.id) {
      setCompanyDataLoading(false);
      return setConfig({ status: 'error' });
    }
    if (!resp?.config?.tracking?.disable) enableTracking();

    const resp2 = await getPublicCompany(resp.id);

    setConfig({
      ...resp,
      company: resp.id,
      ...(resp2?.data ?? {}),
    });
    setCompanyDataLoading(false);
  }

  return (
    <ConfigurationContext.Provider
      value={{
        config: config ?? {},
        loading: isNull(config),
        companyDataLoading,
        isGreyLabel,
      }}>
      {children}
    </ConfigurationContext.Provider>
  );
}

function useConfiguration() {
  const context = useContext(ConfigurationContext);

  if (context === undefined)
    throw new Error(
      'useConfiguration must be used within a ConfigurationProvider',
    );

  return context;
}

export { ConfigurationContext, ConfigurationProvider, useConfiguration };
