import React from 'react';
import { useLanguage } from 'components/contexts/LanguageContext';
import locales from './config/locales';
import Screen from 'components/layouts/Screen';
import { useSelector } from 'react-redux';
import { configFAQsSelector, configHelpSelector } from 'redux/rehive/selectors';
import screenConfig from './config/screen';
import { currentCompanySelector } from 'redux/auth/selectors';

export default function Help(props) {
  const faqConfig = useSelector(configFAQsSelector);
  const company = useSelector(currentCompanySelector);
  const helpConfig = useSelector(configHelpSelector);
  const { language } = useLanguage();

  const data = {
    faqConfig,
    company,
    locales: locales[language] || locales['en'],
  };

  return (
    <Screen
      key={language}
      screenConfig={screenConfig}
      reduxContext={data}
      {...props}
    />
  );
}
