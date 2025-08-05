import React from 'react';

import PinPlaceholder from './auth/PinPlaceholder';
import BiometricsPlaceholder from './auth/BiometricsPlaceholder';
import LocalAuthPlaceholder from './auth/LocalAuthPlaceholder';
import MfaPlaceholder from './auth/MfaPlaceholder';
import OtpPlaceholder from './auth/OtpPlaceholder';
import EmailVerifyPlaceholder from './auth/EmailVerifyPlaceholder';
import MobileVerifyPlaceholder from './auth/MobileVerifyPlaceholder';
import BusinessIcon from './business/Icon';

import BuyProductsPlaceholder from './onboarding/BuyProductsPlaceholder';
import EarnRewardsPlaceholder from './onboarding/EarnRewardsPlaceholder';
import ExchangePlaceholder from './onboarding/ExchangePlaceholder';
import MassSendPlaceholder from './onboarding/MassSendPlaceholder';
import SendToEmailPlaceholder from './onboarding/SendToEmailPlaceholder';
import ProductPlaceholder from './product/ProductPlaceholder';
import Reward from './profile/Reward';
import Referral from './profile/Referral';
import InviteFriends from './profile/InviteFriends';
import { useTheme } from 'components/app/context';

const PlaceholderImage = props => {
  const { colors } = useTheme();

  const { width, height, card, rem, padded, name } = props;

  const w = padded ? width - 2 * rem * padded : width;
  const h = height ? height : card ? w / 2.5 : w;

  const imageProps = { width: w, height: h, colors };

  switch (name) {
    case 'pin':
      return <PinPlaceholder {...imageProps} />;
    case 'biometrics':
      return <BiometricsPlaceholder {...imageProps} />;
    case 'localAuth':
      return <LocalAuthPlaceholder {...imageProps} />;
    case 'mfa':
      return <MfaPlaceholder {...imageProps} />;
    case 'otp':
      return <OtpPlaceholder {...imageProps} />;
    case 'emailVerify':
      return <EmailVerifyPlaceholder {...imageProps} />;
    case 'mobileVerify':
      return <MobileVerifyPlaceholder {...imageProps} />;

    case 'buyProducts':
      return <BuyProductsPlaceholder {...imageProps} />;
    case 'slider3':
    case 'earnRewards':
      return <EarnRewardsPlaceholder {...imageProps} />;
    case 'slider2':
    case 'exchange':
      return <ExchangePlaceholder {...imageProps} />;
    case 'massSend':
      return <MassSendPlaceholder {...imageProps} />;
    case 'slider1':
    case 'sendToEmail':
      return <SendToEmailPlaceholder {...imageProps} />;
    case 'reward':
      return <Reward {...imageProps} />;
    case 'inviteFriends':
      return <InviteFriends {...imageProps} />;
    case 'referral':
      return <Referral {...imageProps} />;
    case 'businessIcon':
      return <BusinessIcon {...imageProps} />;

    case 'product':
      return <ProductPlaceholder {...imageProps} />;
    default:
      return null;
  }
};

export default PlaceholderImage;
