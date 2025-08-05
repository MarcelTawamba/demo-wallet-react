import React from 'react';

import Screen from 'components/layouts/Screen';
import screen from './config/screen';
import { useSelector } from 'react-redux';
import { walletsSelector } from 'screens/accounts/redux/selectors';
import { useGetSellers } from 'hooks/businessAPI';
import { useRehiveContext } from 'contexts';

export default function OrdersContainer(props) {
  const currencies = useSelector(walletsSelector);
  const { user } = useRehiveContext();

  const { data: sellerData } = useGetSellers(user?.id, Boolean(user?.id));

  return (
    <Screen
      screenConfig={screen(currencies.companyCurrencies)}
      reduxContext={{ sellers: sellerData?.data?.results, currencies }}
      {...props}
    />
  );
}
