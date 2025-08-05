import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { onAuthSuccess } from 'redux/auth/actions';
import { intersection } from 'lodash';
import { appLoadedSelector, currentCompanyServicesSelector } from 'redux/auth/selectors';
import { useHistory, useLocation } from 'react-router-dom';
import { parseUrl } from 'util/general';
import { configOnboardingSelector } from 'redux/rehive/selectors';
import { useKYCLink } from 'hooks/bridgeAPI';
import { SplashScreen } from 'components/rehive/SplashScreen';

const AuthSuccess = props => {
  const { tempAuth, setLoading, initialUser } = props;
  const history = useHistory();
  const location = useLocation();

  const dispatch = useDispatch();
  const appLoaded = useSelector(appLoadedSelector);
  const onboardingConfig = useSelector(configOnboardingSelector);
  const services = useSelector(currentCompanyServicesSelector);
  const { data: kycLinkResponse, isLoading: isKycLinkLoading } = useKYCLink(`${window.location.origin}/bridge-terms/`, services?.bridge_service);

  const enterOnboarding =
    tempAuth.register &&
    !intersection(
      onboardingConfig.hideApp,
      initialUser?.groups?.map(x => x.name) ?? [],
    )?.length &&
    !intersection(
      onboardingConfig.hideRegister,
      initialUser?.groups?.map(x => x.name) ?? [],
    )?.length;

  useEffect(() => {
    // dispatch(onAuthSuccess(tempAuth));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tempAuth, dispatch]);

  useEffect(() => {
    if (appLoaded) {
      //TODO: this needs to be implemented somewhere
      setLoading(false);
      const { company, page } = parseUrl(location);
      if (page !== 'sep24') {
        // Check bridge terms first
        if (services?.bridge_service && !isKycLinkLoading && kycLinkResponse) {          
          const kycStatus = kycLinkResponse?.data?.kyc?.status;
          const tosStatus = kycLinkResponse?.data?.tos?.status;
          const isKYCComplete = kycStatus === 'approved';
          const isTOSComplete = tosStatus === 'approved';

          if (!isKYCComplete || !isTOSComplete) {
            history.push('/bridge-terms/');
            return;
          }
        }

        // Then check onboarding if bridge terms not needed
        if (enterOnboarding) {
          history.push('/onboarding/');
        } else {
          if (company) {
            history.push('/home/');
          }
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appLoaded, services, kycLinkResponse, isKycLinkLoading]);

  // Show splash screen while loading
  if (!appLoaded || isKycLinkLoading) {
    return <SplashScreen />;
  }

  return <div />;
};

export default AuthSuccess;
