import React from 'react';
import Icon from 'components/outputs/Icon';

const VALID_ACCOUNT_NAMES = [
  'merchant',
  'supplier',
  'user',
  'cold-storage',
  'locker',
  'hot-wallet',
  'investments',
  'default',
  'lending',
  'operational',
  'rewards',
  'sales',
  'savings',
  'shared',
  'spending',
  'warm-storage',
  'general',
];

const AccountIcon = props => {
  let { icon, size } = props;
  if (icon === 'default' || !VALID_ACCOUNT_NAMES.includes(icon))
    icon = 'general';
  if (icon === 'locker') icon = 'cold-storage';

  return <Icon icon={icon} size={size} />;
};

export default AccountIcon;
