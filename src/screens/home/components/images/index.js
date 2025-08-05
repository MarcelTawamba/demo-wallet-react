import React from 'react';
import Bank from './Bank';
import Crypto from './Crypto';
import UserVerify from './UserVerify';
import UserVerifySuccess from './UserVerifySuccess';
import UserVerifyPending from './UserVerifyPending';
import UserVerifyFailed from './UserVerifyFailed';
import RewardRecurring from './RewardRecurring';
import RewardTransaction from './RewardTransaction';
import AlertPlaceholder from './AlertPlaceholder';
import Document from './Document';
import { useTheme } from 'components/app/context';

const images = {
  bank: {
    image: Bank,
  },
  crypto: {
    image: Crypto,
  },
  userVerify: {
    image: UserVerify,
  },
  userVerifySuccess: {
    image: UserVerifySuccess,
  },
  userVerifyPending: {
    image: UserVerifyPending,
  },
  userVerifyFailed: {
    image: UserVerifyFailed,
  },
  rewardRecurring: {
    image: RewardRecurring,
  },
  rewardTransaction: {
    image: RewardTransaction,
  },
  alertPlaceholder: {
    image: AlertPlaceholder,
  },
  document: {
    image: Document,
  },
};

export default function Image(props) {
  const { size = 100, name, primary, primaryContrast, ...restProps } = props;
  const { colors } = useTheme();

  let customMatch = images?.[name];
  if (customMatch?.image)
    return (
      <div {...restProps}>
        <customMatch.image
          width={size}
          height={size}
          primary={primary ?? colors.primary}
          primarycontrast={primaryContrast ?? colors.primaryContrast}
        />
      </div>
    );

  return null;
}
