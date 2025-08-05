import React from 'react';
import BusinessSettingsPage from './pages/BusinessSettings';
import { LanguageContext } from 'components/contexts/LanguageContext';
import { configOnboardingSelector } from 'redux/rehive/selectors';
import { useSelector } from 'react-redux';
import lang from './config/locales';

export default function BusinessSettings(props) {
  const onboardingConfig = useSelector(configOnboardingSelector);

  return (
    <LanguageContext.Provider
      value={{ ...onboardingConfig.locales?.en, ...(lang?.en ?? {}) }}>
      <BusinessSettingsPage {...props} />
    </LanguageContext.Provider>
  );
}
