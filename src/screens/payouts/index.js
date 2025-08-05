import React from 'react';

import Screen from 'components/layouts/Screen';
import { useSelector } from 'react-redux';
import screenConfig from './config';
import { currentCompanySelector } from 'redux/auth/selectors';

import { useBusiness } from 'contexts';

export default function PayoutsContainer(props) {
  const company = useSelector(currentCompanySelector);
  const { business } = useBusiness();
  const context = { company, business };

  return (
    <Screen {...props} screenConfig={screenConfig} reduxContext={context} />
  );
}
