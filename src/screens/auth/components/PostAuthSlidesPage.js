import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  configSlidesPostAuthSelector,
  configOnboardingSelector,
} from 'redux/rehive/selectors';
import { intersection } from 'lodash';
import { onAuthSuccess } from 'redux/auth/actions';
import Slides from 'components/outputs/Slides';
import { currentCompanyServicesSelector } from 'redux/auth/selectors';
import { useKYCLink } from 'hooks/bridgeAPI';
import { SplashScreen } from 'components/rehive/SplashScreen';

const PostAuthSlidesPage = props => {
  const { onSuccess, history, loading, setLoading, tempAuth, initialUser } =
    props;
  const slides = useSelector(configSlidesPostAuthSelector);
  const onboardingConfig = useSelector(configOnboardingSelector);
  const dispatch = useDispatch();
  const services = useSelector(currentCompanyServicesSelector);
  const { data: kycLinkResponse, isLoading: isKycLinkLoading } = useKYCLink(`${window.location.origin}/bridge-terms/`, services?.bridge_service);
  const [checkedBridgeTerms, setCheckedBridgeTerms] = useState(false);

  const hideAppGroups = intersection(
    onboardingConfig.hideApp,
    initialUser?.groups?.map(x => x.name) ?? [],
  );
  const hideRegisterGroups = intersection(
    onboardingConfig.hideRegister,
    initialUser?.groups?.map(x => x.name) ?? [],
  );
  
  const enterOnboarding =
    tempAuth.register &&
    !hideAppGroups?.length &&
    !hideRegisterGroups?.length;
    

  useEffect(() => {
    // First dispatch the auth success action to ensure user is authenticated
    dispatch(onAuthSuccess(tempAuth));
  }, [tempAuth, dispatch]);

  useEffect(() => {
    // Only proceed with navigation checks if we have the necessary data
    if (isKycLinkLoading || !services) {
      return;
    }

    // Check bridge terms first
    if (services?.bridge_service && kycLinkResponse) {      
      const kycStatus = kycLinkResponse?.data?.kyc?.status;
      const tosStatus = kycLinkResponse?.data?.tos?.status;
      const isKYCComplete = kycStatus === 'approved';
      const isTOSComplete = tosStatus === 'approved';

      if (!isKYCComplete || !isTOSComplete) {
        history.push('/bridge-terms/');
        setCheckedBridgeTerms(true);
        return;
      }
    }

    // Then check onboarding if bridge terms not needed or already completed
    if (enterOnboarding) {
      history.push('/onboarding/');
    }

    setCheckedBridgeTerms(true);
  }, [services, kycLinkResponse, isKycLinkLoading, history, enterOnboarding]);

  const showSlider = slides && slides.length && slides.length > 0;

  useEffect(() => {
    if (!showSlider || !tempAuth.register) {
      onSuccess();
    } else {
      setLoading(false);
    }
  }, [onSuccess, setLoading, showSlider, tempAuth.register]);

  if (loading || isKycLinkLoading || !checkedBridgeTerms) {
    return <SplashScreen />;
  }

  return <Slides items={slides} onSuccess={() => onSuccess()} showButtons />;
};

export default PostAuthSlidesPage;
