import React, { useState } from 'react';
import CombinedOnboarding from './pages';
import { LanguageContext } from 'components/contexts/LanguageContext';
import { authUserSelector } from 'redux/auth/selectors';
import { configOnboardingSelector } from 'redux/rehive/selectors';
import { useSelector } from 'react-redux';
import lang from './config/locales';

export default function Onboarding(props) {
  const [user] = useState(useSelector(authUserSelector));

  const onboardingConfig = useSelector(configOnboardingSelector);

  return (
    <LanguageContext.Provider
      value={{ ...(lang?.en ?? {}), ...(onboardingConfig.locales?.en ?? {}) }}>
      <CombinedOnboarding {...props} isBusinessGroup={false} />
    </LanguageContext.Provider>
  );
}
