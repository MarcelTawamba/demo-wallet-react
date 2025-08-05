import { get } from 'lodash';
import SubtypeCopyConfig, { getSubtypeCopyConfig } from '../config/SubtypeCopy';
import { standardizeString } from 'util/general';
import { useAppConfig } from 'hooks/useAppConfig';

export function getMainTransaction(transactions) {
  return get(transactions, 0);
}

export function filterTransactionCollections(collections, currency) {
  return collections.filter(
    collection =>
      collection.transactions.findIndex(
        transaction =>
          get(transaction, ['currency', 'code']) ===
          get(currency, ['currency', 'code']),
      ) !== -1,
  );
}

export function filterTransactions(transactions, currency) {
  return transactions.filter(
    transaction =>
      get(transaction, ['currency', 'code']) ===
      get(currency, ['currency', 'code']),
  );
}

export function useSubtypeCopy(transaction, crypto) {
  let { metadata, tx_type, subtype, status } = transaction;
  const { data: appConfig } = useAppConfig();

  let identifier = {};
  
  // Handle all withdraw subtypes (including custom ones like withdraw_ach)
  if (subtype && subtype.startsWith('withdraw')) {
    identifier = get(transaction, ['metadata', 'native_context', 'account']) ||
                 get(transaction, ['metadata', 'rehive_context', 'account']);
  } else {
    switch (subtype) {
    case 'buy':
    case 'sell':
    case 'transfer':
    case 'send_transfer':
    case 'receive_transfer':
      identifier = metadata;
      break;
    case 'receive':
    case 'send':
    case 'send_mass':
    default:
      if (metadata?.service_payment_requests?.request) {
        if (subtype === 'send_email') {
          identifier =
            metadata?.service_payment_requests?.request?.requestor_identifier;
        } else if (
          subtype === 'receive_email' ||
          subtype === 'receive_payment'
        ) {
          identifier =
            metadata?.service_payment_requests?.request?.payer_identifier;
        } else {
          identifier = get(transaction, ['partner', 'user']);
        }
      } else {
        identifier = get(transaction, ['partner', 'user']);
      }
      if (!identifier) {
        identifier = get(transaction, ['metadata', 'rehive_context']);
      }
      if (!identifier) {
        identifier = get(transaction, ['metadata', 'service_stellar']);
      }
      if (!identifier) {
        identifier = get(transaction, ['metadata', 'service_bitcoin']);
      }
        if (!identifier) {
          identifier = metadata;
        }
    }
  }

  const subtypeConfig = getSubtypeCopyConfig(subtype, appConfig);
  let typeConfig = {};
  if (subtypeConfig.both || (crypto && subtypeConfig.crypto)) {
    typeConfig = subtypeConfig.crypto
      ? subtypeConfig.crypto
      : get(subtypeConfig, 'both');
  } else if (subtypeConfig.fiat) {
    typeConfig = subtypeConfig.fiat;
  }
  let copyConfig = {};

  if (typeConfig.credit && tx_type.includes('credit')) {
    copyConfig = get(typeConfig, 'credit');
  } else if (typeConfig.debit && tx_type.includes('debit')) {
    copyConfig = get(typeConfig, 'debit');
  }

  let iconColor = 'primary';
  let iconName = tx_type
    ? tx_type === 'credit'
      ? 'received'
      : 'sent'
    : 'question';
  if (subtypeConfig && subtypeConfig.icon) {
    iconName = subtypeConfig.icon;
  }

  let color =
    tx_type === 'credit'
      ? 'positive'
      : tx_type === 'debit'
      ? 'negative'
      : 'grey';

  if (status === 'Pending' || status === 'Failed') {
    color = 'font';

    if (status === 'Pending') {
      iconName = 'pending';
      iconColor = 'font';
    } else if (status === 'Failed') {
      iconName = 'close';
      iconColor = 'negative';
    }
  }

  let text = get(
    getSubtypeCopyConfig('default', appConfig),
    ['both', tx_type, status],
    'Unknown transaction type',
  );
  let configStatus = copyConfig?.[status];
  text = configStatus ? configStatus : standardizeString(subtype);
  let image = null;
  if (identifier && typeof copyConfig.identifier === 'function') {
    try {
      image = get(identifier, 'profile');
      text = text + copyConfig.identifier(identifier);
    } catch (e) {
      console.log('useSubtypeCopy -> e', e);
    }
  }

  return { text, color, iconName, iconColor, image };
}

export function getTransactionDetails(transaction) {}
