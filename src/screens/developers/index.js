import React from 'react';
import { useLanguage } from 'components/contexts/LanguageContext';
import locales from './config/locales';
import Screen from 'components/layouts/Screen';
import { useSelector } from 'react-redux';
import screenConfig from './config';
import { currentCompanySelector } from 'redux/auth/selectors';

export default function DevelopersContainer(props) {
  const company = useSelector(currentCompanySelector);
  const { language } = useLanguage();

  const data = {
    company,
    locales: locales[language] || locales['en'],
  };

  return <Screen key={language} screenConfig={screenConfig} reduxContext={data} {...props} />;
}
