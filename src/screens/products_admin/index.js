import React, { useState, useEffect } from 'react';

import Screen from 'components/layouts/Screen';
import screen from './config';
import { getSellers } from './util/rehive';
import { useSelector } from 'react-redux';
import { walletsSelector } from 'screens/accounts/redux/selectors';

export default function ProductsAdminContainer(props) {
  const [sellers, setSellers] = useState(null);
  const currencies = useSelector(walletsSelector);

  async function fetchData() {
    const resp = await getSellers();
    if (resp.status === 'success') {
      setSellers(resp?.data?.results);
    } else {
      // setError('Unable to fetch sellers');
    }
  }
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Screen
      screenConfig={screen}
      reduxContext={{ sellers, currencies }}
      {...props}
    />
  );
}
