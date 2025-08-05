import React from 'react';
import { LanguageContext } from 'components/contexts/LanguageContext';
import Screen from 'components/layouts/Screen';
import { useSelector } from 'react-redux';
import { configFAQsSelector, configHelpSelector } from 'redux/rehive/selectors';
import screenConfig from './config/screen';
import { currentCompanySelector } from 'redux/auth/selectors';

export default function Help(props) {
  const faqConfig = useSelector(configFAQsSelector);
  const company = useSelector(currentCompanySelector);
  const helpConfig = useSelector(configHelpSelector);

  const data = {
    faqConfig,
    company,
  };

  return (
    <LanguageContext.Provider value={helpConfig.locales?.en}>
      <Screen screenConfig={screenConfig} reduxContext={data} {...props} />
    </LanguageContext.Provider>
  );
}
