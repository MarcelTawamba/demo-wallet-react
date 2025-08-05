import { createSelector } from 'reselect';

import _, { get, orderBy, uniq } from 'lodash';
import {
  configAccountsSelector,
  rehiveStateSelector,
} from 'redux/rehive/selectors';
import { currentCompanyServicesSelector } from 'redux/auth/selectors';
import {
  safe,
  arrayToObject,
  arrayToObjectNested,
  shiftToStart,
  removeDuplicates,
} from 'util/general';
import { cryptoSelector } from 'redux/crypto/selectors';
import { calculateRate } from 'util/rates';
import { addCryptoToAccount } from 'util/crypto';

export const accountsStateSelector = createSelector(
  rehiveStateSelector,
  rehiveState => {
    return rehiveState.accounts ? rehiveState.accounts : [];
  },
);

export const ratesStateSelector = createSelector(
  rehiveStateSelector,
  rehiveState => {
    return rehiveState.conversionRates ? rehiveState.conversionRates : [];
  },
);

export const primaryCurrenciesSelector = createSelector(
  [accountsStateSelector, configAccountsSelector],
  (accountsState, accountsConfig) => {
    const accIndex = accountsState.findIndex(acc => acc.primary);
    const primaryAccounts =
      accIndex !== -1
        ? accountsState?.[accIndex]?.currencies ??
          accountsState[0]?.currencies ??
          []
        : accountsState?.[0]?.currencies ?? [];

    const primaryCurrency = primaryAccounts.find(acc => acc.active);

    return {
      items: primaryAccounts && primaryAccounts.length ? primaryAccounts : [],
      primary: primaryCurrency
        ? primaryCurrency
        : primaryAccounts?.find(
            x => x.currency.code === accountsConfig?.defaultPrimaryCurrency,
          ) ?? primaryAccounts[0],
    };
  },
);

export const accountsSelector = createSelector(
  rehiveStateSelector,
  rehiveState => {
    return {
      items: rehiveState.accounts ? rehiveState.accounts : [],
      // multipleAccounts: safe(accounts, 'length', []) > 1,
      // primaryAccount,
      loading: rehiveState.accountsLoading,
      error: rehiveState.accountsError,
    };
  },
);

export const companyCurrenciesSelector = createSelector(
  rehiveStateSelector,
  rehiveState => {
    return {
      items: rehiveState?.companyCurrencies ?? [],
      loading: rehiveState?.companyCurrenciesLoading,
      error: rehiveState?.companyCurrenciesError,
    };
  },
);

export const userTierSelector = createSelector(
  rehiveStateSelector,
  rehiveState => {
    return {
      items: rehiveState.tier ?? [],
      loading: rehiveState.tierLoading,
      error: rehiveState.tierError,
    };
  },
);

export const userTiersSelector = createSelector(
  rehiveStateSelector,
  rehiveState => {
    return {
      items: rehiveState.tiers ?? [],
      loading: rehiveState.tiersLoading,
      error: rehiveState.tiersError,
    };
  },
);

// when making accs selector, create helper function that checks code and returns crypto type / add to crypto services??!
export const walletsSelector = createSelector(
  [
    accountsSelector,
    cryptoSelector,
    primaryCurrenciesSelector,
    configAccountsSelector,
    userTierSelector,
    companyCurrenciesSelector,
  ],
  (
    accounts,
    cryptoState,
    primarySelector,
    accountsConfig,
    tier,
    companyCurrencies,
  ) => {
    const primaryCurrencyCode = primarySelector?.primary?.currency?.code ?? '';
    const { items, loading, error } = accounts;

    let activeCurrency = '';
    let primaryAccount = '';
    let currencyCode = '';

    let hiddenCurrencies =
      accountsConfig.hideCurrencies &&
      accountsConfig.hideCurrencies.find(x =>
        tier?.items?.map(y => y?.level).includes(x?.tier),
      );

    hiddenCurrencies = get(hiddenCurrencies, ['currencies'], []);

    let currencies = [];
    let tempCurrencies = [];
    for (let i = 0; i < items.length; i++) {
      if (!primaryAccount && items[i].primary) {
        primaryAccount = items[i].reference;
      }
      tempCurrencies = items[i].currencies.map(currency => {
        const companyCurrency = companyCurrencies.items?.find(
          item => item?.code === currency?.currency?.code,
        );
        return {
          ...addCryptoToAccount({
            currency,
            account: items[i],
            companyCurrency,
          }),
          disabled: hiddenCurrencies.includes(currency.currency.code),
        };
      });

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

    const accountsObj = arrayToObject(accounts.items, 'reference');
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

      let tempKeys = shiftToStart(
        Object.keys(temp),
        '',
        get(activeTemp, ['currency', 'code']),
      );

      tempKeys = orderBy(
        tempKeys,
        [x => hiddenCurrencies.includes(x), x => x === primaryCurrencyCode],
        ['asc', 'desc'],
      );

      accountsObj[key] = {
        ...accountsObj[key],
        currencies: temp,
        keys: tempKeys,
      };
    });

    // const companyCurrencies = removeDuplicates(
    //   currencies.map(item => item.currency),
    //   'code',
    // );

    currencies = orderBy(
      currencies,
      [x => x.disabled, x => x.currency.code === primaryCurrencyCode],
      ['asc', 'desc'],
    );

    return {
      items: currencies,
      accounts: accountsObj,
      // companyCurrencies,
      companyCurrencies: companyCurrencies.items,
      accountsDictionary,
      accountsDictionaryNames,
      multipleAccounts: safe(items, 'length', []) > 1,
      primaryAccount,
      primary: activeCurrency,
      loading: loading,
      error: error,
    };
  },
);

export const homeSelector = createSelector(
  [accountsStateSelector, walletsSelector],
  (accountsState, currencies) => {
    const { homeIndex } = accountsState;

    return {
      currency:
        currencies && currencies.items && currencies.items[homeIndex]
          ? currencies.items[homeIndex]
          : {},
    };
  },
);

export const allTransactionsSelector = createSelector(
  [accountsStateSelector],
  accountsState => {
    return accountsState.transactions ? accountsState.transactions : [];
  },
);

export const displayCurrencySelector = createSelector(
  [rehiveStateSelector],
  rehiveState => {
    return rehiveState.displayCurrency
      ? rehiveState.displayCurrency
      : { code: 'USD', divisibility: 2 };
  },
);

export const conversionRatesSelector = createSelector(
  [
    accountsStateSelector,
    ratesStateSelector,
    currentCompanyServicesSelector,
    displayCurrencySelector,
    rehiveStateSelector,
  ],
  (accountsState, ratesState, services, displayCurrency, rehiveState) => {
    if (ratesState.rates) {
      try {
        let totalBalance = 0.0;
        const hasConversion = Boolean(services?.conversion_service);
        if (hasConversion) {
          try {
            accountsState.forEach(account =>
              account.currencies?.forEach(currencyObj => {
                const { currency, available_balance } = currencyObj;
                const fromCode = currency.code;
                const toCode = displayCurrency.code;
                const rate = calculateRate(fromCode, toCode, ratesState.rates);

                totalBalance =
                  totalBalance +
                  (available_balance / 10 ** currency.divisibility) * rate;
              }),
            );

            const diff =
              totalBalance.toString().length -
              Math.floor(totalBalance).toString().length;
            if (diff < 3) {
              totalBalance = totalBalance.toFixed(2);
            } else if (diff > displayCurrency.divisibility) {
              totalBalance = totalBalance.toFixed(displayCurrency.divisibility);
            }
          } catch (e) {
            console.log('totalBalance error', e);
          }
        }
        return {
          ...ratesState,
          displayCurrency,
          totalBalance,
          loading: rehiveState.conversionRatesLoading,
          error: rehiveState.conversionRatesError,
          hasConversion,
          empty: false,
        };
      } catch (e) {
        console.log(e);
      }
    }
    return {
      items: [],
      displayCurrency: {},
      totalBalance: 0,
      hasConversion: false,
      empty: true,
    };
  },
);

export const conversionPairsSelector = createSelector(
  [rehiveStateSelector],
  rehiveState => {
    const { conversionPairs, conversionPairsLoading, conversionPairsError } =
      rehiveState;

    if (!conversionPairs?.length)
      return {
        fromCurrencies: [],
        toCurrencies: [],
        items: [],
        loading: conversionPairsLoading ? conversionPairsLoading : false,
        error: conversionPairsError ? conversionPairsError : '',
      };

    return {
      fromCurrencies: uniq(
        conversionPairs?.map(item => item.key.split(':')[0]) ?? [],
      ),
      toCurrencies: uniq(
        conversionPairs?.map(item => item.key.split(':')[1]) ?? [],
      ),
      items: conversionPairs ? conversionPairs : [],
      loading: conversionPairsLoading ? conversionPairsLoading : false,
      error: conversionPairsError ? conversionPairsError : '',
    };
  },
);

export const companyBankAccountsSelector = createSelector(
  rehiveStateSelector,
  rehiveState => {
    return {
      items: rehiveState.companyBankAccounts
        ? rehiveState.companyBankAccounts
        : [],
      loading: rehiveState.companyBankAccountsLoading,
      error: rehiveState.companyBankAccountsError,
    };
  },
);
