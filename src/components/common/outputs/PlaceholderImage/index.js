import React from 'react';
// import { Image, Dimensions } from 'react-native';
// import PropTypes from 'prop-types';

// import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
// import { View } from 'components/layout/View';
// import { CustomIcon } from './../CustomIcon';
// import context from 'components/app/context';
// import CardBlocks from './general/CardBlocks';
// import RehiveLogo from './general/RehiveLogo';
// import CardCircles from './general/CardCircles';
// import Circles from './general/Circles';
import PinPlaceholder from './auth/PinPlaceholder';
import BiometricsPlaceholder from './auth/BiometricsPlaceholder';
import LocalAuthPlaceholder from './auth/LocalAuthPlaceholder';
import MfaPlaceholder from './auth/MfaPlaceholder';
import OtpPlaceholder from './auth/OtpPlaceholder';
import EmailVerifyPlaceholder from './auth/EmailVerifyPlaceholder';
import MobileVerifyPlaceholder from './auth/MobileVerifyPlaceholder';

import BuyProductsPlaceholder from './onboarding/BuyProductsPlaceholder';
import EarnRewardsPlaceholder from './onboarding/EarnRewardsPlaceholder';
import ExchangePlaceholder from './onboarding/ExchangePlaceholder';
import MassSendPlaceholder from './onboarding/MassSendPlaceholder';
import SendToEmailPlaceholder from './onboarding/SendToEmailPlaceholder';
import { useTheme } from 'components/app/context';

const PlaceholderImage = props => {
  const { colors } = useTheme();

  const { width, height, card, rem, padded, name } = props;

  const w = padded ? width - 2 * rem * padded : width;
  const h = height ? height : card ? w / 2.5 : w;

  const imageProps = { width: w, height: h, colors };

  switch (name) {
    // case 'blocks-card':
    //   return <CardBlocks {...imageProps} />;
    // case 'rehive':
    //   return <RehiveLogo {...imageProps} />;
    // case 'circles-card':
    //   return <CardCircles {...imageProps} />;
    // case 'circles':
    //   return <Circles {...imageProps} />;
    // case 'info':
    //   return this.renderIcon(w, h, 'information-outline');
    // case 'alert':
    //   return this.renderIcon(w, h, 'alert-circle-outline');
    // case 'product':
    //   return this.renderIcon(w, h, 'cart-outline');
    // case 'reward':
    //   return this.renderCustomIcon(w, h, 'Rewards');

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

    default:
      return null;
    // return this.renderUrlImage(w, h, name);
  }
};

// _CustomImage.propTypes = {
//   backgroundColor: PropTypes.string,
//   width: PropTypes.number,
//   height: PropTypes.number,
//   padding: PropTypes.number,
//   colors: PropTypes.object,
// };

// _CustomImage.defaultProps = {
//   backgroundColor: 'white',
//   width: SCREEN_WIDTH,
//   height: 120,
//   padding: 0,
//   colors: {},
// };

export default PlaceholderImage;
