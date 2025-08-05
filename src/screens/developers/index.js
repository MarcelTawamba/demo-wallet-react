import React from 'react';

import Screen from 'components/layouts/Screen';
import { useSelector } from 'react-redux';
import screenConfig from './config';
import { currentCompanySelector } from 'redux/auth/selectors';

export default function DevelopersContainer(props) {
  const company = useSelector(currentCompanySelector);

  return <Screen screenConfig={screenConfig} company={company} {...props} />;
}
