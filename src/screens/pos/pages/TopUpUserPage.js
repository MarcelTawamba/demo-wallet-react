import React from 'react';

import Form from 'components/layout/FormNew';
import TopUpForm from 'screens/accounts/components/forms/TopUpForm';
import { useSelector } from 'react-redux';
import {
  walletsSelector,
  conversionRatesSelector,
} from 'screens/accounts/redux/selectors';
import { get } from 'lodash';
import { useHistory } from 'react-router-dom';
import { configProductSelector } from 'redux/rehive/selectors';
import { currentCompanyServicesSelector } from 'redux/auth/selectors';
import OutOfAppScreen from 'components/layout/OutOfAppScreen';

export default function TopUpUserPage(props) {
  const wallets = useSelector(walletsSelector);
  const history = useHistory();
  const rates = useSelector(conversionRatesSelector);
  const services = useSelector(currentCompanyServicesSelector);
  const config = useSelector(configProductSelector);
  const { topUpAccount = 'teller' } = config;
  const { accountsDictionary, accounts } = wallets;

  const account =
    accounts?.[
      accountsDictionary?.[topUpAccount] ??
        accountsDictionary?.teller ??
        wallets.primaryAccount
    ];

  const { currencies, keys } = account; //objectToArray(get(account, 'currencies'), 'id');

  const formProps = {
    currencies,
    currency: currencies?.[keys?.[0]] ?? {},
    services,
    rates,
    onSuccess: () => {},
    history,
  };

  return (
    <OutOfAppScreen onBack={'/accounts/'} backLabel="back_to_wallet">
      <Form center>
        <TopUpForm {...formProps} />
      </Form>
    </OutOfAppScreen>
  );
}
