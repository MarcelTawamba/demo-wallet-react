import React, { useEffect } from 'react';

import Screen from 'components/layouts/Screen';
import { useSelector, useDispatch } from 'react-redux';
import screenConfig from './config';

import { walletsSelector } from 'screens/accounts/redux/selectors';
import { fetchAccounts } from 'screens/accounts/redux/actions';
import { useBusiness } from 'contexts';

export default function PayoutsContainer(props) {
  const { business } = useBusiness();
  const accounts = useSelector(walletsSelector);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAccounts());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Screen
      screenConfig={screenConfig}
      business={business}
      reduxContext={{ accounts, business }}
      {...props}
    />
  );
}
