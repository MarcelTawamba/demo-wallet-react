import React, { Component, useMemo } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { orderBy, uniqBy, get } from 'lodash';

/* redux */
import { fetchData } from 'redux/rehive/actions';
import { fetchAccounts } from './redux/actions';
import {
  bankAccountsSelector,
  cryptoAccountsSelector,
} from 'redux/rehive/selectors';
import {
  walletsSelector,
  conversionRatesSelector,
  companyBankAccountsSelector,
  accountsSelector,
  conversionPairsSelector,
  userTierSelector,
} from './redux/selectors';

/* components */
import IndexContainer from 'components/layout/IndexContainer';
import { ToastContext } from 'components/contexts/ToastContext';

import Paper from '@material-ui/core/Paper';
import Text from 'components/outputs/Text';

import CurrencyCarousel from './components/currency/CurrencyCarousel';
import AccountsActionList from './components/AccountsActionList';

import DepositForm from './components/forms/DepositForm';
import WithdrawForm from './components/forms/WithdrawForm';
import BatchSendForm from './components/forms/BatchSendForm';
import SendForm from './components/forms/SendFormContainer';
import BuyPage from './subscreens/BuyPage';
import SellPage from './subscreens/SellPage';
import DonateForm from './components/forms/DonateForm';
import TopUpForm from './components/forms/TopUpForm';
import ReceiveForm from './components/forms/ReceiveForm';
import TransactionList from './components/transactions/TransactionList';

/* util */
import { arrayMove, getUserGroup } from 'util/general';
import { userProfileSelector } from 'redux/rehive/selectors';
import { currentCompanyServicesSelector } from 'redux/auth/selectors';
import { cryptoSelector } from 'redux/crypto/selectors';
import Spinner from 'components/outputs/Spinner';
import { fetchCrypto } from 'redux/crypto/actions';
import TransferForm from './components/forms/TransferForm';
import Hidden from 'components/layout/Hidden';
import ExchangeForm from './components/forms/ExchangeForm';
import {
  configActionsSelector,
  configAccountsSelector,
} from 'redux/rehive/selectors';
import { getSubtypes } from 'util/rehive';
import { TransactionFilterConfig } from './config/filters';
import ReceivePaymentForm from './components/forms/ReceivePaymentForm';
import ErrorBoundary from 'components/error/ErrorBoundary';
import AccountsIndex from './components/AccountsIndex';
import EmptyListPlaceholderImage from 'components/outputs/PlaceholderImage/empty/EmptyListPlaceholderImage';
import ChiplessCardPage from './components/forms/ChiplessCardPage';
import RequestPaymentPage from './components/forms/RequestPaymentPage';
import { hideAction, showAction } from './util/actions';
import { checkBusinessGroup } from 'util/business';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import { useFetchCurrencyDetails } from 'hooks/accountsAPI';
import {
  useFetchGroupFees,
  useFetchTierFees,
  useFetchTierLimits,
} from 'hooks/groupAPI';

const actionsConfigDefault = [
  { id: 'history', labelId: 'history' },
  {
    id: 'buy',
    labelId: 'buy',

    condition: ({
      actionsConfig,
      currency,
      profile,
      conversionPairs,
      currencySubtypes,
    }) => {
      const subtypeEnabled = currencySubtypes?.some(
        item => item.name === 'buy',
      );
      const hide =
        !subtypeEnabled ||
        hideAction('buy', { actionsConfig, currency, profile });
      if (hide) return !hide;
      return conversionPairs?.toCurrencies.includes(currency?.currency?.code);
    },
  },
  {
    id: 'sell',
    labelId: 'sell',

    condition: ({
      actionsConfig,
      currency,
      profile,
      conversionPairs,
      currencySubtypes,
    }) => {
      const subtypeEnabled = currencySubtypes?.some(
        item => item.name === 'sell',
      );
      const hide =
        !subtypeEnabled ||
        hideAction('sell', { actionsConfig, currency, profile });
      return (
        !hide &&
        conversionPairs?.fromCurrencies.includes(currency?.currency?.code)
      );
    },
  },
  {
    id: 'send',
    labelId: 'send',
    condition: ({ actionsConfig, currency, profile, currencySubtypes }) => {
      const send_emailSubtypeEnabled = currencySubtypes?.some(
        item => item.name === 'send_email',
      );
      const send_mobileSubtypeEnabled = currencySubtypes?.some(
        item => item.name === 'send_mobile',
      );
      const send_accountSubtypeEnabled = currencySubtypes?.some(
        item => item.name === 'send_account',
      );
      const send_cryptoSubtypeEnabled = currencySubtypes?.some(
        item => item.name === 'send_crypto',
      );
      const subtypeEnabled =
        send_emailSubtypeEnabled ||
        send_accountSubtypeEnabled ||
        send_mobileSubtypeEnabled ||
        send_cryptoSubtypeEnabled;
      const hide =
        !subtypeEnabled ||
        hideAction('send', { actionsConfig, currency, profile });
      return !hide;
    },
  },
  {
    id: 'receive',
    labelId: 'receive',
    condition: ({ actionsConfig, currency, profile, currencySubtypes }) => {
      const receive_emailSubtypeEnabled = currencySubtypes?.some(
        item => item.name === 'receive_email',
      );
      const receive_mobileSubtypeEnabled = currencySubtypes?.some(
        item => item.name === 'receive_mobile',
      );
      const receive_accountSubtypeEnabled = currencySubtypes?.some(
        item => item.name === 'receive_account',
      );
      const subtypeEnabled =
        receive_emailSubtypeEnabled ||
        receive_mobileSubtypeEnabled ||
        receive_accountSubtypeEnabled;
      const hide =
        !subtypeEnabled ||
        hideAction('receive', { actionsConfig, currency, profile });
      return !hide;
    },
  },
  {
    id: 'request',
    labelId: 'request',
    label: 'Requests',
    condition: ({ actionsConfig, currency, profile, services }) => {
      const hide =
        !services?.payment_requests_service ||
        hideAction('request', { actionsConfig, currency, profile });
      return !hide;
    },
  },
  {
    id: 'deposit',
    labelId: 'deposit',
    condition: ({
      currency,
      actionsConfig,
      profile,
      tier,
      currencySubtypes,
    }) => {
      // Check if deposit_manual subtype is enabled for this currency
      const subtypeEnabled = currencySubtypes?.some(
        item => item.name === 'deposit_manual',
      );
      
      // If deposit_manual subtype is disabled, don't show deposit action
      if (!subtypeEnabled) {
        return false;
      }
      
      // Check if this is a crypto currency
      const isCrypto = Boolean(currency?.crypto);
      
      // For crypto currencies, check if they're explicitly supported for bank deposits
      const cryptoAllowed = isCrypto 
        ? Boolean(
            actionsConfig?.deposit?.config?.cryptoBankSupport?.some(
              item => item === currency?.currency?.code
            )
          ) 
        : true; // Always allow for non-crypto currencies
      
      const hide =
        !cryptoAllowed || // Hide for crypto currencies not in cryptoBankSupport
        hideAction('deposit', {
          actionsConfig,
          currency,
          profile,
          tier,
        });
        
      return !hide;
    },
  },

  {
    id: 'withdraw',
    labelId: 'withdraw',
    condition: ({ currency, actionsConfig, profile, currencySubtypes }) => {
      const subtypeEnabled = currencySubtypes?.some(
        item => item.name === 'withdraw_manual',
      );
      const hide =
        !subtypeEnabled ||
        hideAction('withdraw', { actionsConfig, currency, profile });
      return !hide;
    },
  },
  {
    id: 'card',
    labelId: 'card',

    condition: ({
      currency,
      actionsConfig,
      services,
      profile,
      currencySubtypes,
    }) => {
      if (
        services?.['Chipless Card Service (beta)'] ||
        services?.['Chipless Card Service']
      ) {
        const hide = hideAction('card', { actionsConfig, currency, profile });
        return !hide;
      }
      return false;
    },
  },
  {
    id: 'transfer',
    labelId: 'transfer',

    condition: ({
      currency,
      currencies,
      actionsConfig,
      profile,
      currencySubtypes,
    }) => {
      const send_transferSubtypeEnabled = currencySubtypes?.some(
        item => item.name === 'send_transfer',
      );
      const receive_transferSubtypeEnabled = currencySubtypes?.some(
        item => item.name === 'receive_transfer',
      );
      const subtypeEnabled =
        send_transferSubtypeEnabled && receive_transferSubtypeEnabled;
      const hide =
        !subtypeEnabled ||
        hideAction('transfer', { actionsConfig, currency, profile });
      if (hide) {
        return false;
      }
      return (
        currency &&
        currencies &&
        currencies.items.filter(
          curr =>
            curr.account !== currency.account &&
            curr.currency.code === currency?.currency?.code,
        ).length > 0
      );
    },
  },
  {
    id: 'mass_send',
    labelId: 'mass_send',
    condition: ({
      services,
      profile,
      actionsConfig,
      currency,
      businessServiceSettings,
      currencySubtypes,
    }) => {
      const hide = hideAction('mass_send', {
        actionsConfig,
        currency,
        profile,
      });
      if (hide) {
        return false;
      }
      const userGroup = getUserGroup(profile) ?? 'user';
      return (
        services?.batch_send_service &&
        (checkBusinessGroup(businessServiceSettings, userGroup) ||
          userGroup.match(/^(merchant|admin|manager|business)$/))
      );
    },
  },
  {
    id: 'exchange',
    labelId: 'exchange',
    condition: ({
      conversionPairs,
      currencies,
      currency,
      services,
      actionsConfig,
      profile,
      currencySubtypes,
    }) => {
      const buySubtypeEnabled = currencySubtypes?.some(
        item => item.name === 'buy',
      );
      const sellSubtypeEnabled = currencySubtypes?.some(
        item => item.name === 'sell',
      );
      const subtypeEnabled = buySubtypeEnabled && sellSubtypeEnabled;
      const hide =
        !subtypeEnabled ||
        hideAction('exchange', { actionsConfig, currency, profile });
      if (hide) {
        return false;
      }
      if (services?.conversion_service && conversionPairs) {
        return (
          conversionPairs.fromCurrencies.findIndex(
            item => item === currency?.currency?.code,
          ) !== -1
        );
      } else {
        return false;
      }
    },
  },
  // {
  //   id: 'receive_payment',
  //   condition: ({ profile, currency, actionsConfig }) => {
  //     const hide = hideCurrency('pay', actionsConfig, currency);
  //     if (hide) {
  //       return false;
  //     }
  //     if (
  //       get(profile, ['groups', 0, 'name'], '').match(
  //         /^(merchant|admin|manager)$/,
  //       )
  //     ) {
  //       return true;
  //     }
  //   },
  // },
  {
    id: 'donate',
    labelId: 'donate',
    condition: ({ profile, currency, actionsConfig, currencySubtypes }) => {
      const hide = hideAction('donate', { actionsConfig, currency, profile });
      return !hide;
    },
  },
  // {
  //   id: 'top_up',
  //   condition: ({ profile, currency, actionsConfig }) => {
  //     const hide = hideCurrency('top_up', actionsConfig, currency, profile);
  //     return !hide;
  //   },
  // },
  // {
  //   id: 'topup',
  //   label: 'Top up',
  //   condition: ({ actionsConfig, currency }) => {
  //     const hide = hideCurrency('topup', actionsConfig, currency);
  //     // const hasConfig = Boolean(
  //     //   get(actionsConfig, ['prepaid', 'config', currency?.currency?.code]),
  //     // );
  //     return !hide; // && hasConfig;
  //   },
  // },
  // {
  //   id: 'prepaid',
  //   label: 'Add funds',
  //   condition: ({ actionsConfig, currency, profile }) => {
  //     const hide = hideAction('prepaid', { actionsConfig, currency, profile });
  //     const hasConfig = Boolean(
  //       get(actionsConfig, ['prepaid', 'config', currency?.currency?.code]),
  //     );
  //     return !hide && hasConfig;
  //   },
  // },
];

class AccountsContainer extends Component {
  state = {
    index: 0,
    state: '',
    detailVisible: false,
    modalVisible: false,
    indexLoading: false,
    modalLoading: false,
    modalType: '',
    subtypes: [],
    loading: false,
  };

  static contextType = ToastContext;

  constructor(props) {
    super(props);
    this.handleStateChange = this.handleStateChange.bind(this);
    this.showDetail = this.showDetail.bind(this);
  }

  componentDidMount() {
    this.handleStateChange({ init: true });
    this.props.fetchAccounts();
    this.props.fetchData('bankAccounts');
    this.props.fetchData('cryptoAccounts');
    this.props.fetchData('companyBankAccounts');
    this.props.fetchData('tier');
    this.handleSubtypes();
  }

  componentDidUpdate(prevProps) {
    const { wallets, location } = this.props;
    const { pathname } = location;
    
    // If wallets data just became available and we're on the base /accounts URL, trigger the redirect
    if (
      pathname === '/accounts' &&
      (!prevProps.wallets.items || prevProps.wallets.items.length === 0) &&
      wallets.items && 
      wallets.items.length > 0 &&
      !wallets.loading
    ) {
      this.handleStateChange({ init: true });
    }
  }

  async handleSubtypes() {
    const resp = await getSubtypes();
    const types = get(resp, 'data', []).map(({ name, label }) => {
      return { value: name, label };
    });
    this.setState({
      subtypes: orderBy(
        uniqBy(types, item => item.value),
        'value',
      ),
      loading: false,
    });
  }

  parseUrl() {
    const { wallets, location } = this.props;
    const { accountsDictionary } = wallets;
    const { pathname } = location;
    let paths = pathname.split('/');
    let account = '';
    let accountName = '';
    let currency = '';
    let state = '';
    if (paths.length > 2) {
      accountName = get(paths, [2], '');
      if (accountsDictionary[accountName]) {
        account = accountsDictionary[accountName];
      } else {
        account = accountName;
      }
      currency = get(paths, [3], '');
      state = get(paths, [4], '');
    }
    return { state, account, accountName, currency };
  }

  /* Actions */
  handleStateChange = ({ state, account, currency, init, context = {} }) => {
    let accountName = account;

    const {
      location,
      history,
      wallets,
      services,
      profile,
      companyBankAccounts,
      userBankAccounts,
      conversionPairs,
      actionsConfig,
      businessServiceSettings,
      configAccounts,
    } = this.props;
    const { search, pathname } = location;
    const { accountsDictionary, items, multipleAccounts } = wallets;
    console.log(currency)
    console.log(account)
    if (!currency && !account) {
      this.setState({ detailVisible: false });
      if ((!configAccounts.layout || !multipleAccounts) && init) {
        const { currency: currentCurrency, accountName: currentAccount } =
          this.parseUrl();
        account = currentAccount && currentAccount !== '' ? currentAccount : get(items, [0, 'account_name'], '');
        accountName = account;
        currency = currentCurrency && currentCurrency !== '' ? currentCurrency : get(items, [0, 'currency', 'code']);
        
        // If we're on the base /accounts URL and have valid account/currency data, redirect to the specific URL
        if (pathname === '/accounts' && account && currency && items && items.length > 0 && !search) {
          const targetUrl = `/accounts/${account}/${currency}/`;
          if (targetUrl !== pathname) {
            history.push(targetUrl);
            return;
          }
        }
      }
    }
    if (currency === undefined) {
      ({ currency } = this.parseUrl());
    }
    if (account === undefined) {
      ({ account, accountName } = this.parseUrl());
    }
    if (state === undefined) {
      const paths = pathname.split('/');
      if (paths.length > 5) state = paths[4];
    }
    // test next state condition, if false set state to history
    const action = actionsConfigDefault.find(
      item => item.id === (state ? state : 'history'),
    );

    account = accountsDictionary[account]
      ? accountsDictionary[account]
      : account;
    const wallet = get(wallets, ['accounts', account, 'currencies', currency]);

    if (wallet) {
      if (action) {
        const { condition } = action;
        if (
          condition &&
          !condition({
            ...(context ?? {}),
            services,
            profile: profile.items,
            currency: wallet,
            companyBankAccounts,
            userBankAccounts,
            currencies: wallets,
            conversionPairs,
            actionsConfig,
            businessServiceSettings,
          })
        ) {
          state = '';
        }
      }

      history.push(
        '/accounts/' +
          accountName +
          '/' +
          currency +
          '/' +
          (state ? state + '/' : '') +
          search,
      );
    } else {
      history.push(
        '/accounts/' + (accountName ? accountName + '/' : '') + search,
      );
    }
  };

  showDetail = detailVisible => {
    this.setState({ detailVisible });
  };

  handleCarousel = (direction, currency, account) => {
    const { wallets } = this.props;
    const keys = wallets.accounts[account].keys;
    const accountKeys = Object.keys(wallets.accounts);
    const accountIndex = accountKeys.findIndex(
      item => item === wallets.accounts[account].reference,
    );
    const length = keys.length;
    const index = keys.findIndex(item => item === currency);
    let newIndex = index;
    let newAccountIndex = accountIndex;

    if (direction === 'next') {
      if (index + 1 >= length) {
        newIndex = 0;
        newAccountIndex =
          accountIndex + 1 >= accountKeys.length ? 0 : accountIndex + 1;
      } else {
        newIndex = index + 1;
      }
    } else {
      if (index === 0) {
        if (accountIndex === 0) {
          newAccountIndex = accountKeys.length - 1;
        } else {
          newAccountIndex = accountIndex - 1;
        }
        newIndex = wallets.accounts[account].keys.length - 1;
      } else {
        newIndex = index - 1;
      }
    }
    const tempAccount = wallets.accounts[accountKeys[newAccountIndex]];
    this.handleStateChange({
      currency: tempAccount.keys[newIndex],
      account: tempAccount.name,
    });
  };

  renderTransactions = (account, currency, wallet) => {
    const {
      wallets,
      fetchAccounts,
      services,
      rates,
      profile,
      history,
      configAccounts,
    } = this.props;
    if (!configAccounts.layout && (!account || !currency)) {
      account = wallets.primaryAccount;
      currency = get(
        wallets,
        ['accounts', wallets.primaryAccount, 'keys', 0],
        '',
      );
    }
    // if (!currency && account) {
    //   currency = get(wallets, ['accounts', account, 'keys', 0], '');
    // }
    const { subtypes } = this.state;

    const filterConfig = {
      ...TransactionFilterConfig,
      subtype: { ...TransactionFilterConfig.subtype, options: subtypes },
    };

    return (
      <TransactionList
        account={account}
        currency={currency}
        wallet={wallet}
        currencies={wallets}
        filterConfig={filterConfig}
        history={history}
        profile={profile}
        fetchAccounts={fetchAccounts}
        services={services}
        rates={rates}
        subtypes={subtypes}
      />
    );
  };

  renderContent({ state, account, currency, wallet, currencySubtypes }) {
    const { wallets, fetchAccounts, accountLimits } = this.props;
    const sharedRouteProps = {
      exact: true,
    };

    const { showToast } = this.context;

    if (wallets.items && wallets.items.length && wallets.items.length === 0) {
      return (
        <Paper>
          <Text id="no_accounts" />
        </Paper>
      );
    }

    const sharedComponentProps = {
      ...this.props,
      fetchRates: () => this.props.fetchData('conversionRates'),
      onSuccess: fetchAccounts,
      currencies: wallets,
      accountLimits,
      account,
      currency: wallet,
      currencyCode: currency,
      showToast,
      currencySubtypes,
      handleStateChange: this.handleStateChange,
    };

    return (
      <React.Fragment>
        <Hidden size={'md'}>
          <div>
            {this.renderActions({
              state,
              account,
              currency,
              wallet,
              vertical: false,
            })}
          </div>
        </Hidden>
        <ErrorBoundary>
          <Switch>
            <Route
              {...sharedRouteProps}
              render={() => <BuyPage {...sharedComponentProps} />}
              path="/*/*/buy/*/"
            />
            <Route
              {...sharedRouteProps}
              render={() => <SellPage {...sharedComponentProps} />}
              path="/*/*/sell/*/"
            />
            <Route
              {...sharedRouteProps}
              render={() => <SendForm {...sharedComponentProps} />}
              path="/*/*/send/"
            />
            <Route
              {...sharedRouteProps}
              render={() => <ReceiveForm {...sharedComponentProps} />}
              path="/*/*/receive/"
            />
            <Route
              {...sharedRouteProps}
              render={() => <DepositForm {...sharedComponentProps} />}
              path="/*/*/deposit/"
            />
            <Route
              {...sharedRouteProps}
              render={() => <WithdrawForm {...sharedComponentProps} />}
              path="/*/*/withdraw/"
            />
            <Route
              {...sharedRouteProps}
              render={() => <TransferForm {...sharedComponentProps} />}
              path="/*/*/transfer/"
            />
            <Route
              {...sharedRouteProps}
              render={() => <ExchangeForm {...sharedComponentProps} />}
              path="/*/*/exchange/"
            />
            <Route
              {...sharedRouteProps}
              render={() => <BatchSendForm {...sharedComponentProps} />}
              path="/*/*/mass_send/"
            />
            <Route
              {...sharedRouteProps}
              render={() => <ReceivePaymentForm {...sharedComponentProps} />}
              path="/*/*/receive_payment/"
            />
            <Route
              {...sharedRouteProps}
              render={() => <ChiplessCardPage {...sharedComponentProps} />}
              path="/*/*/card/"
            />
            <Route
              {...sharedRouteProps}
              render={() => <TopUpForm {...sharedComponentProps} />}
              path="/*/*/top_up/"
            />
            <Route
              {...sharedRouteProps}
              render={() => <DonateForm {...sharedComponentProps} />}
              path="/*/*/donate/"
            />
            <Route
              {...sharedRouteProps}
              render={() => <RequestPaymentPage {...sharedComponentProps} />}
              path="/*/*/request/"
            />
            <Route
              render={() => this.renderTransactions(account, currency, wallet)}
              path="/"
            />
            {/* <Toast /> */}
          </Switch>
        </ErrorBoundary>
      </React.Fragment>
    );
  }

  renderActions = ({ state, account, currency, wallet, vertical }) => {
    if (currency && account) {
      const { profile, wallets } = this.props;

      let actions = [...actionsConfigDefault];
      if (state && !vertical) {
        actions = arrayMove(
          actions,
          actions.findIndex(item => item.id === state),
          1,
        );
      }

      return (
        <AccountsActionList
          {...this.props}
          currencies={wallets}
          vertical={vertical}
          state={state}
          buttons={actions}
          handleStateChange={(state, context = {}) =>
            this.handleStateChange({ account, currency, state, context })
          }
          currency={wallet}
          profile={profile.items}
        />
      );
    }
    return null;
  };

  renderContentHeader = ({ state, account, currency, wallet }) => {
    if (currency && account) {
      const { wallets, rates, configAccounts } = this.props;
      const item = wallet;
      return (
        <CurrencyCarousel
          onClose={() => this.showDetail(false)}
          disabled
          rates={rates}
          item={item}
          onPress={() => {}}
          handleNext={() => this.handleCarousel('next', currency, account)}
          handlePrevious={() => this.handleCarousel('back', currency, account)}
          wallets={wallets}
          layout={configAccounts.layout}
        />
      );
    } else {
      return <div />;
    }
  };

  render() {
    const { index, detailVisible, loading } = this.state;
    const { wallets, configAccounts, currencySubtypes } = this.props;
    let { state, account, currency } = this.parseUrl();

    if (!configAccounts.layout && (!account || !currency)) {
      account = wallets.primaryAccount;
      currency = get(wallets, ['accounts', account, 'keys', 0], '');
    }
    if (!currency && account) {
      currency = get(wallets, ['accounts', account, 'keys', 0], '');
    }
    if (loading) {
      return <Spinner containerStyle={{ paddingTop: 176, height: '100vh' }} />;
    }

    const { content, header } = AccountsIndex({
      index,
      state,
      wallets,
      account,
      currency,
      handleStateChange: this.handleStateChange,
      showDetail: value => this.showDetail(value),
      ...this.props,
    });
    const wallet = get(wallets, ['accounts', account, 'currencies', currency]);
    const showWallets =
      wallets.items && wallets.items.length && wallets.items.length > 0;

    if (showWallets) {
      return (
        <IndexContainer
          flipContent={!detailVisible}
          indexHeader={header}
          index={content}
          contentHeader={this.renderContentHeader({
            state,
            account,
            currency,
            wallet,
          })}
          content={this.renderContent({
            state,
            account,
            currency,
            wallet,
            currencySubtypes,
          })}
          actions={this.renderActions({
            state,
            account,
            currency,
            wallet,
            vertical: true,
          })}
        />
      );
    } else {
      if (wallets.loading) {
        return (
          <Spinner
            containerStyle={{
              paddingTop: 176,
              height: '100vh',
            }}
          />
        );
      }
    }

    return (
      <EmptyListPlaceholderImage
        name="account"
        style={{ paddingTop: 176, height: '100vh' }}
        id="no_available_accounts"
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    wallets: walletsSelector(state),
    tier: userTierSelector(state),
    accounts: accountsSelector(state),
    crypto: cryptoSelector(state),
    rates: conversionRatesSelector(state),
    companyBankAccounts: companyBankAccountsSelector(state),
    userBankAccounts: bankAccountsSelector(state),
    cryptoAccounts: cryptoAccountsSelector(state),
    profile: userProfileSelector(state),
    services: currentCompanyServicesSelector(state),
    conversionPairs: conversionPairsSelector(state),
    actionsConfig: configActionsSelector(state),
    configAccounts: configAccountsSelector(state),
  };
};

function _AccountsContainer(props) {
  const { profile, wallets, tier } = props;
  const groupName = useMemo(
    () => get(profile, ['items', 'groups', 0, 'name'], ''),
    [profile],
  );
  const { accountsDictionary } = wallets;
  const company = useMemo(() => profile?.items?.company, [profile]);
  const { pathname } = useLocation();
  let paths = pathname.split('/');
  const currencyCode = useMemo(() => get(paths, [3], ''), [paths]);
  const accountDefinitionRef = useMemo(() => {
    const accountName = get(paths, [2], '');
    if (accountsDictionary[accountName]) {
      return accountsDictionary[accountName];
    }
    return accountName;
  }, [paths, accountsDictionary]);

  const currencyDetails = useFetchCurrencyDetails(
    accountDefinitionRef,
    currencyCode,
    Boolean(accountDefinitionRef, currencyCode),
  );
  const currencySubtypes = currencyDetails?.data?.subtypes;
  const accountLimits = currencyDetails?.data?.limits || [];
  const accountFees = currencyDetails?.data?.fees || [];
  const groupFeesData = useFetchGroupFees(
    groupName,
    company,
    Boolean(groupName, company),
  );
  const tierFeesData = useFetchTierFees(
    groupName,
    tier?.items?.[0]?.id,
    Boolean(groupName, company),
  );
  const groupFees = groupFeesData?.data?.data?.results || [];
  const tierFees = tierFeesData?.data?.data?.results || [];
  const tierLimitData = useFetchTierLimits(
    groupName,
    tier?.items?.[0]?.id,
    Boolean(groupName, company),
  );
  const tierLimits = tierLimitData?.data?.data?.results || [];

  const accountProps = {
    ...props,
    accountLimits,
    accountFees,
    groupFees,
    tierLimits,
    tierFees,
    currencySubtypes,
  };

  return <AccountsContainer {...accountProps} />;
}

export default connect(
  mapStateToProps,
  {
    fetchData,
    fetchAccounts,
    fetchCrypto,
  },
  null,
)(_AccountsContainer);
