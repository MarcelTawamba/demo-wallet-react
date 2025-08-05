import React from 'react';
import { SettingsOverviewItem } from 'components/layout/SettingsOverviewSection';

/* util */
import { concatCryptoAccount } from 'util/general';

export default function BankAccountsOverview(props) {
  const { item, handleStateChange, page } = props;
  const type = 'bankAccounts';

  const { items } = item;
  const { label } = page;

  let value = 'Not yet provided';
  let values = null;
  let status = 'incomplete';
  let item2 = items && items.length && items.length > 0 ? items[0] : null;
  if (item2) {
    values = page?.value(item2);
    status = item.status;
  }

  return (
    <SettingsOverviewItem
      responsive
      label={label}
      value={value}
      values={values}
      status={status}
      onClick={() => handleStateChange(type, '', 0)}
    />
  );

  return (
    <React.Fragment>
      {/* <View ph={2}>
          <Typography align={'left'} variant="caption">
            Crypto
          </Typography>
        </View> */}
      {showBitcoin && (
        <SettingsOverviewItem
          responsive
          value={!bitcoinAccount && 'Not yet provided'}
          values={bitcoinAccount && concatCryptoAccount(bitcoinAccount, true)}
          label={'Bitcoin'}
          status={bitcoinAccount && bitcoinAccount.status}
          onClick={() => handleStateChange('cryptoAccounts', '', 0, 1)}
        />
      )}
      {showEthereum && (
        <SettingsOverviewItem
          responsive
          label={'Ethereum'}
          value={!ethereumAccount && 'Not yet provided'}
          values={ethereumAccount && concatCryptoAccount(ethereumAccount, true)}
          status={ethereumAccount && ethereumAccount.status}
          onClick={() => handleStateChange('cryptoAccounts', '', 0, 2)}
        />
      )}
      {showStellar && (
        <SettingsOverviewItem
          responsive
          label={'Stellar'}
          value={!stellarAccount && 'Not yet provided'}
          values={stellarAccount && concatCryptoAccount(stellarAccount, true)}
          status={stellarAccount && stellarAccount.status}
          onClick={() => handleStateChange('cryptoAccounts', '', 0, 3)}
        />
      )}
    </React.Fragment>
  );
}
