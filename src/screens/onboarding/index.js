import React, { useState, useEffect } from 'react';
import CombinedOnboarding from './pages';
import { LanguageProvider } from 'components/contexts/LanguageContext';
import { authUserSelector, currentCompanyServicesSelector } from 'redux/auth/selectors';
import { configOnboardingSelector } from 'redux/rehive/selectors';
import { useSelector } from 'react-redux';
import lang from './config/locales';
import BusinessOnboarding from './business_onboarding/pages/index';
import { useHistory } from 'react-router-dom';
import { useKYCLink } from 'hooks/bridgeAPI';
import { SplashScreen } from 'components/rehive/SplashScreen';

export default function Onboarding(props) {
  const { businessServiceSettings } = props;
  const [user] = useState(useSelector(authUserSelector));
  const [isUserOnboarding, setIsUserOnboarding] = useState(true);
  const services = useSelector(currentCompanyServicesSelector);
  const history = useHistory();
  const { data: kycLinkResponse, isLoading: isKycLinkLoading } = useKYCLink(`${window.location.origin}/bridge-terms/`, services?.bridge_service);

  const onboardingConfig = useSelector(configOnboardingSelector);

  const isBusinessGroup =
    (businessServiceSettings?.manager_groups ?? []).includes(
      user?.groups?.[0]?.name,
    ) ?? false;

  // Check if bridge terms need to be completed first
  useEffect(() => {
    if (services?.bridge_service && !isKycLinkLoading && kycLinkResponse) {
      const kycStatus = kycLinkResponse?.data?.kyc?.status;
      const tosStatus = kycLinkResponse?.data?.tos?.status;
      const isKYCComplete = kycStatus === 'approved';
      const isTOSComplete = tosStatus === 'approved';

      if (!isKYCComplete || !isTOSComplete) {
        console.log('Redirecting to bridge-terms from Onboarding');
        history.replace('/bridge-terms/');
      }
    }
  }, [services, kycLinkResponse, isKycLinkLoading, history]);

  // Show loading while checking bridge terms
  if (services?.bridge_service && isKycLinkLoading) {
    return <SplashScreen />;
  }

  return (
    <LanguageProvider>
      {isUserOnboarding ? (
        <CombinedOnboarding
          {...props}
          isBusinessGroup={isBusinessGroup}
          setIsUserOnboarding={setIsUserOnboarding}
        />
      ) : (
        <BusinessOnboarding
          {...props}
          isBusinessGroup={isBusinessGroup}
          setIsUserOnboarding={setIsUserOnboarding}
        />
      )}
    </LanguageProvider>
  );
}
