import React from 'react';

import Input from 'components/inputs';
import { walletsSelector } from 'screens/accounts/redux/selectors';
import { useSelector } from 'react-redux';

export default function CompanyCurrencySelector(props) {
  let { config, watch, setValue } = props;

  const accounts = useSelector(walletsSelector);
  const accountRef =
    accounts?.accountsDictionary?.rewards ?? accounts?.primaryAccount;
  const account = accounts?.accounts?.[accountRef] ?? {};
  const { currencies, keys = [] } = account;
  const value = watch('currency');
  const values = watch();

  // useEffect(() => {
  //   console.log('CompanyCurrencySelector -> value', value);
  //   if (!value && keys?.[0]) {
  //     console.log('CompanyCurrencySelector -> useEffect', keys);
  //     setValue('currency', keys?.[0]);
  //   }
  // }, [keys, value]);
  if (!value && keys?.[0]) {
    setValue('currency', keys?.[0]);
  }

  const newConfig = {
    ...config,
    options: keys?.map(item => ({
      value: item,
      label: item + ' - ' + (currencies?.[item]?.currency?.description || ''),
    })),
    type: 'selector',
  };

  return <Input {...props} config={newConfig} />; // loading={loading}
}
