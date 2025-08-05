import IconButtonListPage from 'screens/settings/components/IconButtonListPage';
const configs = {
  bank: {
    id: 'bank',
    label: 'bankAccounts',
    icon: 'AccountBalance',
  },
  bitcoin: {
    id: 'bitcoin',
    label: 'bitcoin_accounts',
    icon: 'bitcoin',
  },
  stellar: {
    id: 'stellar',
    label: 'stellar_accounts',
    icon: 'stellar',
  },
  ethereum: {
    id: 'ethereum',
    label: 'ethereum_accounts',
    icon: 'ethereum',
    fallbackIcon: true,
  },
};

const exportConfigs = {
  variant: 'list',
  id: 'externalAccounts',
  image: 'bank',
  options: props => {
    const { services, settingsConfig } = props?.context;
    const { hideBankAccounts, hideCryptoAccounts } = settingsConfig;
    let options = hideBankAccounts ? [] : [configs.bank];
    if (!hideCryptoAccounts) {
      if (
        services?.stellar_testnet_service ||
        services?.stellar_service
      )
        options.push(configs.stellar);
      if (
        services?.bitcoin_testnet_service ||
        services?.bitcoin_service
      )
        options.push(configs.bitcoin);
      if (
        services?.ethereum_testnet_service ||
        services?.ethereum_service
      )
        options.push(configs.ethereum);
    }

    return options;
  },
  component: IconButtonListPage,
  children: ['bank', 'bitcoin', 'stellar', 'ethereum'],
};

export default exportConfigs;
