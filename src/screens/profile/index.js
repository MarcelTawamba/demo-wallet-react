import React from 'react';
import { useSelector } from 'react-redux';
import {
  userProfileSelector,
  configProfileStateSelector,
} from 'redux/rehive/selectors';
import Screen from 'components/layouts/Screen/Screen';
import screenConfig from './config/screen';

export default function Profile(props) {
  const profile = useSelector(userProfileSelector);
  const profileConfig = useSelector(configProfileStateSelector);

  const data = {
    profileConfig,
    profile,
  };

  return <Screen screenConfig={screenConfig} reduxContext={data} {...props} />;
}
