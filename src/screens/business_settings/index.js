import React from 'react';
import BusinessSettingsPage from './pages/BusinessSettings';
import { LanguageProvider } from 'components/contexts/LanguageContext';
import { configOnboardingSelector } from 'redux/rehive/selectors';
import { useSelector } from 'react-redux';
import lang from './config/locales';

export default function BusinessSettings(props) {
  const onboardingConfig = useSelector(configOnboardingSelector);

  return (
    <LanguageProvider>
      <BusinessSettingsPage {...props} />
    </LanguageProvider>
  );
}
