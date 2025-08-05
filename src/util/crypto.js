import { get } from 'lodash';

export const cryptoTypes = [
  { index: 0, id: 'all', name: 'All' },
  { index: 1, id: 'stellar', name: 'Stellar' },
  { index: 2, id: 'solana', name: 'Solana' },
];

export const addCryptoToAccountDeprecated = ({ currency, crypto, account }) => {
  currency.account = account.reference;
  currency.account_name = account.name;
  currency.account_label = account.label;
  let currencyCode = currency?.currency?.code;
  if (
    (currencyCode === 'XLM' && crypto.XLM) ||
    (crypto.XLM &&
      crypto.XLM.assets &&
      crypto.XLM.assets.indexOf(currencyCode) !== -1)
  ) {
    currency.crypto = 'XLM';
  } else if (
    (currencyCode === 'TXLM' && crypto.TXLM) ||
    (crypto.TXLM &&
      crypto.TXLM.assets &&
      crypto.TXLM.assets.indexOf(currencyCode) !== -1)
  ) {
    currency.crypto = 'TXLM';
  } else if (
    (currencyCode === 'ETH' && crypto.ETH) ||
    (currencyCode === 'TETH' && crypto.TETH) ||
    (currencyCode === 'XBT' && crypto.XBT) ||
    (currencyCode === 'TXBT' && crypto.TXBT)
  ) {
    currency.crypto = currencyCode;
  } else {
    currency.crypto = '';
  }

  return currency;
};

export const addCryptoToAccount = ({ currency, account, companyCurrency }) => {
  currency.account = account.reference;
  currency.account_name = account.name;
  currency.account_label = account.label;
  currency.metadata = companyCurrency?.metadata ?? {};
  currency.crypto = companyCurrency?.metadata?.native_context?.crypto
    ?.blockchain
    ? companyCurrency?.metadata?.native_context?.crypto
    : '';

  return currency;
};

export const checkIfCryptoDepricated = ({ currency, crypto }) => {
  let currencyCode = currency.currency.code;
  const currentCrypto = currency.crypto
    ? crypto[currency.crypto?.blockchain][currency.crypto?.network]
    : null;
  if (
    (currencyCode === 'XLM' && currentCrypto) ||
    currentCrypto?.assets?.includes(currencyCode)
  ) {
    return 'XLM';
  } else if (
    (currencyCode === 'TXLM' && currentCrypto) ||
    currentCrypto?.assets?.includes(currencyCode)
  ) {
    return 'TXLM';
  } else if (
    (currencyCode === 'ETH' && currentCrypto) ||
    (currencyCode === 'TETH' && currentCrypto) ||
    (currencyCode === 'XBT' && currentCrypto) ||
    (currencyCode === 'TXBT' && currentCrypto)
  ) {
    return currencyCode;
  } else {
    return '';
  }
};

export function checkIfStellar(currency) {
  // const cryptoCode = wallet?.crypto;
  // return cryptoCode.includes('XLM');
  return currency?.crypto?.blockchain === 'stellar';
}

export function stellarFederation(currency, crypto, isCrypto) {
  // const currencyCryptoCode = getCryptoCodeByMetadata(currency);
  let isFederated = false;
  let setUsername = false;

  let federatedAddress = '';
  let address = '';
  let memo = '';
  let federatedAddressLabel = '';

  let isStellar = isCrypto && checkIfStellar(currency);

  if (isCrypto && isStellar) {
    const currentCrypto =
      crypto?.[currency?.crypto?.blockchain][currency?.crypto?.network] ?? null;
    if (currentCrypto) {
      const { company, user } = currentCrypto;
      if (company && user) {
        setUsername = user.username ? false : true;
        address = user?.crypto?.public_address;
        memo = user?.crypto?.memo;
        if (company.is_federated) {
          isFederated = true;
          federatedAddress =
            (!setUsername ? user.username : user.memo) +
            '*' +
            company.federation_domain;
          federatedAddressLabel =
            'Stellar' +
            (currency?.crypto?.network === 'testnet' ? ' testnet' : '') +
            ' federated address';
        }
      }
    } else {
      isStellar = false;
    }
  }

  return {
    isFederated,
    isStellar,
    setUsername,
    federatedAddress,
    address,
    federatedAddressLabel,
    memo,
  };
}

export const getCryptoAddress = (currency, crypto, stellarTransactionType) => {
  switch (currency.crypto?.code) {
    case 'XLM':
    case 'TXLM':
      return getStellarAddress(currency, crypto, stellarTransactionType);
    case 'SOL':
      return getSolanaAddress(currency, crypto);
    default:
      return '';
  }
};

export const getCryptoCodeByMetadata = currency => {
  let value = '';
  const cryptoMetadata = currency.crypto;
  switch (cryptoMetadata?.blockchain) {
    case 'stellar':
      value = cryptoMetadata.network === 'mainnet' ? 'XLM' : 'TXLM';
      break;
    case 'solana':
      value = cryptoMetadata.code || 'SOL';
      break;
    default:
      break;
  }

  return value;
};

export const getStellarAddress = (currency, crypto, stellarTransactionType) => {
  // const currencyCryptoCode = getCryptoCodeByMetadata(currency);
  const currencyBlockchain = currency?.crypto?.blockchain;
  const currencyNetwork = currency?.crypto?.network;
  let address = '';
  if (stellarTransactionType === 'public') {
    address = get(
      crypto,
      [currencyBlockchain, currencyNetwork, 'user', 'crypto', 'public_address'],
      '',
    );
  } else {
    const currentCrypto = get(
      crypto,
      [currencyBlockchain, currencyNetwork],
      null,
    );
    if (currentCrypto) {
      const { company, user } = currentCrypto;
      address =
        (user.username ? user.username : user.memo) +
        '*' +
        get(company, 'federation_domain', '');
    }
  }

  return address;
};

export const getBitcoinAddress = (currency, crypto) =>
  get(
    crypto,
    [
      currency.crypto?.blockchain,
      currency.crypto?.network,
      'user',
      'account_id',
    ],
    '',
  );

export const getEthereumAddress = (currency, crypto) =>
  get(
    crypto,
    [
      currency.crypto?.blockchain,
      currency.crypto?.network,
      'user',
      'crypto',
      'address',
    ],
    '',
  );

export const getSolanaAddress = (currency, crypto) => {
  const currencyBlockchain = currency?.crypto?.blockchain;
  const currencyNetwork = currency?.crypto?.network;
  return get(
    crypto,
    [currencyBlockchain, currencyNetwork, 'user', 'crypto', 'public_address'],
    '',
  );
};

export function generateTxHashLink(tx_hash, type, testnet) {
  // If the type is "crypto" but the tx_hash looks like a Solana hash (base58 encoded, 88+ characters),
  // treat it as a Solana transaction
  if (type === 'crypto' && tx_hash && /^[1-9A-HJ-NP-Za-km-z]{88,}$/.test(tx_hash)) {
    type = 'solana';
  }
  
  // Normalize type to lowercase
  type = (type || '').toLowerCase();
  
  let link = 'https://';

  switch (type) {
    case 'bitcoin':
      link = link + 'live.blockcypher.com/btc' + (testnet ? '-testnet' : '');
      link = link + '/tx/' + tx_hash + '/';
      break;
    case 'stellar':
      link = link + 'stellar.expert/explorer/' + (testnet ? 'testnet' : 'public');
      link = link + '/tx/' + tx_hash + '/';
      break;
    case 'solana':
      link = link + (testnet ? 'testnet.' : '') + 'solscan.io/tx/';
      link = link + tx_hash;
      break;
    case 'ethereum':
      link = link + (testnet ? 'goerli.' : '') + 'etherscan.io/tx/';
      link = link + tx_hash;
      break;
    case 'polygon':
      link = link + (testnet ? 'mumbai.' : '') + 'polygonscan.com/tx/';
      link = link + tx_hash;
      break;
    case 'base':
      link = link + (testnet ? 'goerli.' : '') + 'basescan.org/tx/';
      link = link + tx_hash;
      break;
    case 'arbitrum':
      link = link + (testnet ? 'goerli.' : '') + 'arbiscan.io/tx/';
      link = link + tx_hash;
      break;
    case 'avalanche_c_chain':
      link = link + (testnet ? 'testnet.' : '') + 'snowtrace.io/tx/';
      link = link + tx_hash;
      break;
    case 'optimism':
      link = link + (testnet ? 'goerli-optimism.' : '') + 'etherscan.io/tx/';
      link = link + tx_hash;
      break;
    default:
      // Return empty string if we can't determine the chain type definitively
      return '';
  }
  
  return link;
}

export function generateRecipientLink(address, type, testnet) {
  // If the type is "crypto" but the address looks like a Solana address (base58 encoded, 32-44 characters),
  // treat it as a Solana address
  if (type === 'crypto' && address && /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address)) {
    type = 'solana';
  }
  
  // Normalize type to lowercase
  type = (type || '').toLowerCase();
  
  let link = 'https://';

  switch (type) {
    case 'bitcoin':
      link = link + 'live.blockcypher.com/btc' + (testnet ? '-testnet' : '') + '/address';
      link = link + '/' + address + '/';
      break;
    case 'stellar':
      link = link + 'stellar.expert/explorer/' + (testnet ? 'testnet' : 'public') + '/account';
      link = link + '/' + address + '/';
      break;
    case 'solana':
      link = link + (testnet ? 'testnet.' : '') + 'solscan.io/account/';
      link = link + address;
      break;
    case 'ethereum':
      link = link + (testnet ? 'goerli.' : '') + 'etherscan.io/address/';
      link = link + address;
      break;
    case 'polygon':
      link = link + (testnet ? 'mumbai.' : '') + 'polygonscan.com/address/';
      link = link + address;
      break;
    case 'base':
      link = link + (testnet ? 'goerli.' : '') + 'basescan.org/address/';
      link = link + address;
      break;
    case 'arbitrum':
      link = link + (testnet ? 'goerli.' : '') + 'arbiscan.io/address/';
      link = link + address;
      break;
    case 'avalanche_c_chain':
      link = link + (testnet ? 'testnet.' : '') + 'snowtrace.io/address/';
      link = link + address;
      break;
    case 'optimism':
      link = link + (testnet ? 'goerli-optimism.' : '') + 'etherscan.io/address/';
      link = link + address;
      break;
    default:
      // Return empty string if we can't determine the chain type definitively
      return '';
  }
  
  return link;
}
