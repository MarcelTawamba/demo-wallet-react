import React from 'react';

import Screen from 'components/layouts/Screen';
import screenConfig from './config';

import { useBusiness } from 'contexts';

export default function CustomersContainer(props) {
  const { business } = useBusiness();

  return (
    <Screen
      screenConfig={screenConfig}
      reduxContext={{ business }}
      {...props}
    />
  );
}
