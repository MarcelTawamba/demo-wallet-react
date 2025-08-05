import React from 'react';
import TransactionList from 'screens/accounts/components/transactions/TransactionList';
import { useSelector } from 'react-redux';
import { conversionRatesSelector } from 'screens/accounts/redux/selectors';
import { userProfileSelector } from 'redux/rehive/selectors';
import { currentCompanyServicesSelector } from 'redux/auth/selectors';
import { View } from 'components/layout/View';

export default function CombinedTransactions(props) {
  const { history, wallets } = props;

  const profile = useSelector(userProfileSelector);
  const rates = useSelector(conversionRatesSelector);
  const services = useSelector(currentCompanyServicesSelector);

  return (
    <View bC={'white'} bR={15} w={'100%'}>
      <View p={1} w={'100%'}>
        <TransactionList
          currencies={wallets}
          history={history}
          profile={profile}
          services={services}
          rates={rates}
          subtypes={[]}
          alternatingRowColors={false}
          hideHeader
          summary
        />
      </View>
    </View>
  );
}
