import {
  concatBankAccount,
  concatCryptoAccount,
  getCurrencyCode,
} from 'util/general';

const cryptoAccounts = {
  value: data => data?.primary?.currency?.code ?? 'None',
  condition: props => !props?.settingsConfig?.hideCryptoAccounts,
};

const exportConfigs = {
  id: 'settings_menu',
  value: '',
  sections: [
    {
      id: 'externalAccounts',
      icon: 'wallet',
      title: 'ext',
      subtitle: 'externalAccountsSubtitle',
      condition: props => {
        const { hideCryptoAccounts, hideBankAccounts } =
          props?.context?.settingsConfig ?? {};
        return hideCryptoAccounts && hideBankAccounts;
      },
      children: {
        bank: {
          value: data => {
            const acc =
              data.items.find(acc => acc.status === 'verified') ??
              data.items?.[0];

            return acc ? concatBankAccount(acc) : 'Not yet provided';
          },
          status: data => {
            const acc =
              data.items.find(acc => acc.status === 'verified') ??
              data.items?.[0] ??
              {};

            return acc.status;
          },
          condition: props => !props?.settingsConfig?.hideBankAccounts,
        },
        // stellar: cryptoAccounts,
        bitcoin: cryptoAccounts,
        stellar: cryptoAccounts,
        ethereum: cryptoAccounts,
      },
    },
    {
      id: 'preferences',
      icon: 'settings',
      children: {
        displayCurrency: {
          value: data => data?.code ?? 'None',
          condition: props => props?.services?.conversion_service,
        },
        primaryCurrency: {
          value: data => {
            return getCurrencyCode(data?.primary?.currency) ?? 'None';
          },
          condition: props => !props?.settingsConfig?.hidePrimaryCurrency,
        },
        notifications: {
          condition: props => !props?.settingsConfig?.hideNotifications,
        },
        language: {
          condition: props => !props?.settingsConfig?.hideLanguage,
        },
      },
      condition: props => {
        const { services = {}, settingsConfig = {} } = props?.context;

        const { hidePrimaryCurrency, hideNotifications } = settingsConfig ?? {};

        return (
          hidePrimaryCurrency &&
          hideNotifications &&
          !services?.conversion_service
        );
      },
    },
    {
      id: 'security',
      icon: 'lock',
      children: {
        mfa: {
          // status: props => {
          //   return checkMFA(props?.context?.results?.mfa)
          //     ? 'enabled'
          //     : 'disabled';
          // },
        },
        password: true,
        devices: true,
      },
      condition: props => {
        return false;
      },
    },
  ],
};

export default exportConfigs;
