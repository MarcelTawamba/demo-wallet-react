import React from 'react';

import Screen from 'components/layouts/Screen';
import screen from './config/screen';

export default function RewardsContainer(props) {
  return <Screen screenConfig={screen} {...props} />;
}
