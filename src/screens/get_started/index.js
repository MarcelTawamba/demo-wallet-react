import React from 'react';

import Screen from 'components/layouts/Screen';
import { useSelector } from 'react-redux';
import screenConfig from './config/sections';
import { currentCompanySelector } from 'redux/auth/selectors';
import Documentation from './components/Documentation';
import GridContainer from 'components/layouts/Screen/Layout';

export default function GetStartedContainer(props) {
  const company = useSelector(currentCompanySelector);

  return (
    <GridContainer
      content={<Documentation items={screenConfig}></Documentation>}
    />
  );

  // return <Screen screenConfig={screenConfig} company={company} {...props} />;
}
