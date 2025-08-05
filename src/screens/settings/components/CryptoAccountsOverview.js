import React from 'react';
import { SettingsOverviewItem } from 'components/layout/SettingsOverviewSection';

/* util */
import { concatCryptoAccount } from 'util/general';

export default function CryptoAccountsOverview(props) {
  const { reduxData, handleStateChange } = props;

  const { services, cryptoAccounts } = reduxData;

  let bitcoinAccount = null;
  const showBitcoin =
    services?.bitcoin_service || services?.bitcoin_testnet_service;
  if (showBitcoin) {
    bitcoinAccount = cryptoAccounts.items.find(
      acc => acc.crypto_type === 'bitcoin' && acc.status === 'verified',
    );
    if (!bitcoinAccount) {
      bitcoinAccount = cryptoAccounts.items.find(
        acc => acc.crypto_type === 'bitcoin',
      );
    }
  }

  let stellarAccount = null;
  const showStellar =
    services?.stellar_service || services?.stellar_testnet_service;
  if (showStellar) {
    stellarAccount = cryptoAccounts.items.find(
      acc => acc.crypto_type === 'stellar' && acc.status === 'verified',
    );
    if (!stellarAccount) {
      stellarAccount = cryptoAccounts.items.find(
        acc => acc.crypto_type === 'stellar',
      );
    }
  }

  let ethereumAccount = null;
  const showEthereum =
    services?.ethereum_service || services?.ethereum_testnet_service;
  if (showEthereum) {
    ethereumAccount = cryptoAccounts.items.find(
      acc => acc.crypto_type === 'ethereum' && acc.status === 'verified',
    );
    if (!ethereumAccount) {
      ethereumAccount = cryptoAccounts.items.find(
        acc => acc.crypto_type === 'ethereum',
      );
    }
  }

  return (
    <React.Fragment>
      {showBitcoin && (
        <SettingsOverviewItem
          key="xbt"
          responsive
          value={!bitcoinAccount && 'Not yet provided'}
          values={bitcoinAccount && concatCryptoAccount(bitcoinAccount, true)}
          label={'Bitcoin'}
          status={bitcoinAccount && bitcoinAccount.status}
          onClick={() => handleStateChange('bitcoin')}
        />
      )}
      {showEthereum && (
        <SettingsOverviewItem
          key="eth"
          responsive
          label={'Ethereum'}
          value={!ethereumAccount && 'Not yet provided'}
          values={ethereumAccount && concatCryptoAccount(ethereumAccount, true)}
          status={ethereumAccount && ethereumAccount.status}
          onClick={() => handleStateChange('ethereum')}
        />
      )}
      {showStellar && (
        <SettingsOverviewItem
          key="xlm"
          responsive
          label={'Stellar'}
          value={!stellarAccount && 'Not yet provided'}
          values={stellarAccount && concatCryptoAccount(stellarAccount, true)}
          status={stellarAccount && stellarAccount.status}
          onClick={() => handleStateChange('stellar')}
        />
      )}
    </React.Fragment>
  );
}
