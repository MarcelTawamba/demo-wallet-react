import React, { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { servicesInit, getLocales } from 'util/rehive';
import { useQuery } from 'react-query';
import { arrayToObject } from 'util/general';
import { uniq, merge } from 'lodash';
import { localeKeys } from './locales';
import { changeLanguage } from 'i18next';
import { configAuthSelector } from 'redux/rehive/selectors';
import { currentCompanySelector, authUserSelector } from 'redux/auth/selectors';
import { useSelector } from 'react-redux';
import config from 'config/config/defaults';

function mapConfigLocales(config) {
  let configLocales = {};
  Object.keys(config).forEach(ns => {
    const temp = config?.[ns]?.locales;
    if (temp) {
      Object.keys(temp).forEach(lang => {
        const resource = temp?.[lang];
        configLocales = merge(configLocales, { [lang]: resource });
      });
    }
  });

  return configLocales;
}
function mapServiceLocales(locale) {
  const keys = Object.keys(locale);
  let serviceLocale = {};
  keys.forEach(key => {
    const temp = locale?.[key];
    serviceLocale = merge(serviceLocale, temp);
  });

  return serviceLocale;
}

function LanguageProvider({ children }) {
  const authConfig = useSelector(configAuthSelector);
  const company = useSelector(currentCompanySelector);
  const user = useSelector(authUserSelector);

  const { data, isLoading } = useQuery(
    [company?.id, 'locales'],
    () => getLocales(company?.id),
    {
      enabled: Boolean(company?.id && servicesInit),
    },
  );

  const serviceLocalesKeys = (data?.results ?? []).map(item => item?.id);
  const serviceLocales = arrayToObject(data?.results ?? [], 'id');
  const availableLanguages = uniq([...localeKeys, ...serviceLocalesKeys]);

  useEffect(() => {
    changeLanguage(authConfig?.language);
  }, [company?.id]);

  useEffect(() => {
    if (user?.language) changeLanguage(user?.language);
  }, [user?.language]);
  useEffect(() => {
    if (!isLoading) {
      const configLocales = mapConfigLocales(config);
      availableLanguages.forEach(lang => {
        const resource = {
          ...(configLocales?.[lang] ?? {}),
          ...mapServiceLocales(serviceLocales?.[lang]?.translation ?? {}),
        };
        i18n.addResourceBundle(lang, 'common', resource, true, true);
      });
    }
  }, [isLoading]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}

export { LanguageProvider };
