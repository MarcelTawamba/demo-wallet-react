import React from 'react';
import { get } from 'lodash';

import AccountsHeader from './AccountsHeader';
import CardList from 'components/card/CardList';
import CurrencyCard from './currency/CurrencyCard';
import CurrencyCardSkeleton from './currency/CurrencyCardSkeleton';
import AccountDefinitionCard from './account/AccountCard';
import { objectToArray, standardizeString } from 'util/general';
import { calculateAccountTotal } from '../util/accounts';
import { View } from 'components/layout/View';
import { Button } from 'components/inputs/Button';

const AccountsIndex = props => {
  const {
    index,
    state,
    wallets,
    rates,
    services,
    handleStateChange,
    configAccounts,
    showDetail,
    account,
    currency,
    history,
  } = props;

  const { layout, identifier } = configAccounts;
  const containerIndex = index;

  const { accounts } = wallets;

  const data = objectToArray(accounts);
  const showAccount = layout && layout === 'accounts' && data.length > 1;

  function handleAccountChange(account) {
    if (account) {
      const { reference, currencies, name, keys } = account;
      const code = get(keys, [0], '');
      handleStateChange({
        account: identifier === 'name' ? name : reference,
        currency: code,
      });
      // showDetail(true);
    } else {
      handleStateChange({ account: '', currency: '' });
    }
  }

  function handleCurrencyChange(currency) {
    if (currency) {
      const code = get(currency, ['currency', 'code']);
      handleStateChange({
        account: currency[identifier === 'name' ? 'account_name' : 'account'],
        currency: code,
      });
      showDetail(true);
    } else {
      handleStateChange({ account: '', currency: '' });
    }
  }

  function handleChange(item) {
    if (item) {
      const { account, account_name } = item;
      const code = get(item, ['currency', 'code']);
      handleStateChange({
        account: identifier === 'name' ? account_name : account,
        currency: code,
      });
      showDetail(true);
    } else {
      showDetail(false);
      handleStateChange({ account: '', currency: '' });
    }
  }

  function handleShowAllTransactions() {
    handleStateChange({ account: '', currency: '' });
    showDetail(false);
  }

  function getUniqueCurrencies(items) {
    const currencies = new Set();
    items.forEach(item => {
      if (item.currency && item.currency.code) {
        currencies.add(item.currency.code);
      }
    });
    return currencies.size;
  }

  function shouldShowAllTransactionsButton() {
    if (showAccount) {
      if (account) {
        const accountItems = wallets.items.filter(item => item.account === account);
        return getUniqueCurrencies(accountItems) > 1;
      } else {
        return data.length > 1;
      }
    } else {
      return getUniqueCurrencies(wallets.items) > 1;
    }
  }

  const showAllTransactionsButton = shouldShowAllTransactionsButton() ? (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'flex-end', 
      alignItems: 'center',
      width: '100%',
      paddingRight: 8
    }}>
      <Button 
        variant="link"
        id="show_all_transactions"
        onPress={handleShowAllTransactions}
        fontSize="0.875rem"
        color="primary"
      />
    </div>
  ) : null;

  const cardsList = showAccount ? (
    account ? (
      <CardList
        smartLoading
        data={{
          ...wallets,
          items: wallets.items.filter(item => item.account === account),
        }}
        skeleton={<CurrencyCardSkeleton />}
        customFooter={showAllTransactionsButton}
        renderItem={(item, index) => (
          <CurrencyCard
            key={index}
            onPress={() => handleCurrencyChange(item)}
            item={item}
            containerCurrency={currency}
            selected={
              item.account === account && item.currency.code === currency
            }
            rates={rates}
            state={state}
          />
        )}
      />
    ) : (
      <CardList
        smartLoading
        data={{ ...wallets, items: data }}
        skeleton={<CurrencyCardSkeleton />}
        customFooter={showAllTransactionsButton}
        renderItem={(item, index) => (
          <AccountDefinitionCard
            key={index}
            onPress={() => handleAccountChange(item)}
            item={item}
            index={index}
            containerIndex={containerIndex}
            rates={rates}
            state={state}
          />
        )}
      />
    )
  ) : (
    <CardList
      data={wallets}
      skeleton={<CurrencyCardSkeleton />}
      customFooter={showAllTransactionsButton}
      renderItem={(item, index) => (
        <CurrencyCard
          showAccount={!showAccount}
          key={index}
          onPress={() =>
            item.disabled ? history.push('/onboarding/') : handleChange(item)
          }
          item={item}
          selected={item.account === account && item.currency.code === currency}
          rates={rates}
          state={state}
          ghost={item.disabled}
        />
      )}
    />
  );

  const content = (
    <View>
      {cardsList}
    </View>
  );

  let totalBalance = 0.0;
  if (account) {
    totalBalance = calculateAccountTotal(accounts[account], rates);
  }
  const acc = get(accounts, [account], {});

  const title =
    data.length < 2 ? '' : standardizeString(acc.label ? acc.label : acc.name);

  const header = (
    <AccountsHeader
      totalBalance={totalBalance}
      title={title}
      showAccount={showAccount}
      account={account}
      currency={currency}
      onBack={() => handleStateChange({ account: '', currency: '' })}
      rates={rates}
      services={services}
      onRefresh={props.fetchAccounts}
    />
  );

  return { content, header };
};

export default AccountsIndex;
