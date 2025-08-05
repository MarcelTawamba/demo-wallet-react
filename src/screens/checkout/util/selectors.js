import _, { get } from 'lodash';
import {
  safe,
  arrayToObject,
  arrayToObjectNested,
  shiftToStart,
  removeDuplicates,
} from 'util/general';

// when making accs selector, create helper function that checks code and returns crypto type / add to crypto services??!
export const walletsSelector = items => {
  let activeCurrency = '';
  let primaryAccount = '';
  let currencyCode = '';

  let currencies = [];
  let tempCurrencies = [];
  for (let i = 0; i < items.length; i++) {
    const account = items[i];
    if (!primaryAccount && account.primary) {
      primaryAccount = account.reference;
    }
    tempCurrencies = account.currencies.map(currency => ({
      ...currency,
      account: account.reference,
      account_name: account.name,
      account_label: account.label,
    }));

    currencies = currencies.concat(tempCurrencies);
  }

  activeCurrency = currencies.find(currency => currency.active);
  const activeIndex = currencies.findIndex(
    item =>
      item.account === primaryAccount &&
      item.currency.code === _.get(activeCurrency, ['currency', 'code']),
  );

  if (currencies.length > 0 && activeIndex !== -1) {
    const activeItem = currencies[activeIndex];
    currencies[activeIndex] = currencies[0];
    currencies[0] = activeItem;
  }

  const accountsObj = arrayToObject(items, 'reference');
  let accountsDictionary = {};
  let accountsDictionaryNames = {};

  Object.keys(accountsObj).forEach(function (key) {
    accountsDictionary[accountsObj[key].name] = key.toString();
    accountsDictionaryNames[key.toString()] = accountsObj[key].name;
  });

  Object.keys(accountsObj).forEach(function (key) {
    const temp = arrayToObjectNested(
      accountsObj[key].currencies,
      'currency',
      'code',
    );
    const activeTemp = accountsObj[key].currencies.find(item => item.active);

    const tempKeys = shiftToStart(
      Object.keys(temp),
      '',
      get(activeTemp, ['currency', 'code']),
    );

    accountsObj[key] = {
      ...accountsObj[key],
      currencies: temp,
      keys: tempKeys,
    };
  });

  const companyCurrencies = removeDuplicates(
    currencies.map(item => item.currency),
    'code',
  );

  return {
    items: currencies,
    accounts: accountsObj,
    companyCurrencies,
    accountsDictionary,
    accountsDictionaryNames,
    multipleAccounts: safe(items, 'length', []) > 1,
    primaryAccount,
    primary: activeCurrency,
    // loading: loading,
    // error: error,
  };
};
