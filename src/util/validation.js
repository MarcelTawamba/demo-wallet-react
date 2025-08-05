import StrKey from 'util/strkey';
import { PhoneNumberUtil } from 'google-libphonenumber';
import WAValidator from 'wallet-address-validator';
import { validate } from 'bitcoin-address-validation';
import { isEmpty } from 'lodash';
import { StrKey as StellarStrKey } from 'stellar-sdk';
import { get } from 'lodash';

export const emailPattern =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const isEmail = email => {
  if (emailPattern.test(email)) {
    return true;
  }
  return false;
};
export const validateEmail = email => {
  if (!isEmail(email)) return 'Please enter a valid email address';

  return '';
};

const ssnPattern = /^(?!000|666)[0-8][0-9]{2}-(?!00)[0-9]{2}-(?!0000)[0-9]{4}$/;
export const isSSN = ssn => {
  if (ssnPattern.test(ssn)) {
    return true;
  }
  return false;
};
export const validateSSN = ssn => {
  if (!isSSN(ssn)) return 'Please enter a valid social security number';

  return '';
};

export const urlPattern =
  /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+(:[0-9]+)?|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[\w]*))?)/;
export const isUrl = string => {
  if (urlPattern.test(string)) {
    return true;
  }
  return false;
};

export const validatePassword = password => {
  if (password.length < 8) {
    return 'Password must be at least 8 characters in length';
  }
  return '';
};

export const validateGeneral = input => {
  if (!input || input.length < 0) {
    return 'Cannot be blank';
  }
  return '';
};

export const validateMobileOld = mobile => {
  try {
    const phoneUtil = PhoneNumberUtil.getInstance();
    const countryCode = mobile.includes('+') ? '' : 'US';
    const number = phoneUtil.parse(mobile, countryCode);
    let resp = phoneUtil.isPossibleNumber(number);
    if (!resp) {
      return 'Please enter a valid mobile number';
    }
  } catch (e) {
    return 'Please enter a valid mobile number';
  }

  return '';
};

export const validateMobile = mobile => {
  if (mobile?.[0] !== '+') mobile = '+' + mobile;
  try {
    const phoneUtil = PhoneNumberUtil.getInstance();
    const countryCode = mobile.includes('+') ? '' : 'US';
    const number = phoneUtil.parse(mobile, countryCode);
    let resp = phoneUtil.isPossibleNumber(number);
    if (!resp) return 'Please enter a valid mobile number';
  } catch (e) {
    return 'Please enter a valid mobile number';
  }

  return true;
};

export const isValidMobile = mobile => {
  try {
    if (mobile[0] !== '+') return false;

    const phoneUtil = PhoneNumberUtil.getInstance();
    const number = phoneUtil.parse(mobile, '');
    const type = phoneUtil.getNumberType(number);
    let resp = phoneUtil.isValidNumber(number);
    if (!resp || type === 0) {
      return false;
    }
  } catch (e) {
    return false;
  }

  return true;
};

export const isMobile = input => {
  var phoneRegex =
    /^[+][0-9]{1,3}[-. ]?[(]?[0-9]{2,3}[)]?[-. ]?[0-9]{3,4}[-. ]?[0-9]{4}$/;

  return input && input.match(phoneRegex);
};

export const validateCrypto = (address, type) => {
  if (address) {
    switch (type) {
      case 'XLM':
      case 'TXLM':
        if (StrKey.isValidEd25519PublicKey(address) || address.includes('*')) {
          return '';
        }
        break;
      default:
        // For non-Stellar cryptocurrencies, just check if address exists
        if (address) {
          return '';
        }
        break;
    }
  }
  return 'Please enter a valid ' + cryptoName(type) + ' address';
};

export const validateCryptoNew = (address, currency) => {
  const type = cryptoType(currency);
  const testnet = currency?.crypto?.network === 'testnet';
  if (address) {
    try {
      switch (type) {
        case 'stellar':
          if (
            StrKey.isValidEd25519PublicKey(address) ||
            address.includes('*')
          ) {
            return '';
          }
          break;
        case 'bitcoin':
          // TODO: should check testnet for testnet address and mainnet for main address.
          // Currently checking bitcoin address for both mainnet and testnet.
          // this method can't decide about testnet or mainnet.
          let temp;
          temp = validate(address, 'mainnet');
          if (!temp) temp = validate(address, 'testnet');
          if (temp) {
            return '';
          }
          break;
        case 'ethereum':
          // if (WAValidator.validate(address, 'ETH', testnet)) {
          return '';
        // }
        // break;
        case 'solana':
          // Solana addresses are base58 encoded and 32-44 characters long
          if (/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address)) {
            return '';
          }
          break;
        default:
          return (
            'Please enter a valid ' +
            type +
            (testnet ? ' testnet' : '') +
            ' address'
          );
      }
    } catch (e) {
      console.log('TCL: e', e);
    }
  }
  return (
    'Please enter a valid ' + type + (testnet ? ' testnet' : '') + ' address'
  );
};

export const validateCrypto2 = (address, type, testnet) => {
  if (address) {
    switch (type) {
      case 'stellar':
        if (StrKey.isValidEd25519PublicKey(address) || address.includes('*')) {
          return '';
        }
        break;
      case 'bitcoin':
        if (WAValidator.validate(address, 'BTC', testnet)) {
          return '';
        }
        break;
      case 'ethereum':
        if (WAValidator.validate(address, 'ETH', testnet)) {
          return '';
        }
        break;
      default:
        return '';
    }
  }
  return 'Please enter a valid ' + cryptoName(type) + ' address';
};

export const validateCryptoBool = (address, type, testnet) => {
  if (address) {
    switch (type) {
      case 'stellar':
        if (StrKey.isValidEd25519PublicKey(address) || address.includes('*')) {
          return true;
        }
        break;
      case 'bitcoin':
        if (WAValidator.validate(address, 'BTC', testnet)) {
          return true;
        }
        break;
      case 'ethereum':
        if (WAValidator.validate(address, 'ETH', testnet)) {
          return true;
        }
        break;
      default:
        return true;
    }
  }
  return 'Please enter a valid ' + type + ' address';
};

export const cryptoName = crypto => {
  switch (crypto) {
    case 'TXLM':
      return 'Stellar Testnet';
    case 'XLM':
      return 'Stellar';
    case 'TETH':
      return 'Ethereum Testnet';
    case 'ETH':
      return 'Ethereum';
    case 'TXBT':
      return 'Bitcoin Testnet';
    case 'XBT':
      return 'Bitcoin';
    default:
      return 'Cryptocurrency';
  }
};

export const cryptoTypeDeprecated = crypto => {
  switch (crypto) {
    case 'TXLM':
    case 'XLM':
      return 'stellar';
    case 'TETH':
    case 'ETH':
      return 'ethereum';
    case 'TXBT':
    case 'XBT':
    case 'BTC':
      return 'bitcoin';
    default:
      return '';
  }
};

export const cryptoType = currency => {
  return currency?.crypto?.blockchain ?? '';
};

// Helper function to detect crypto address types (Moved from SendForm.js)
export const detectCryptoAddressType = (recipient) => {
  // Check if recipient is undefined or null or not a string
  if (!recipient || typeof recipient !== 'string') {
    return null;
  }
  const trimmedRecipient = recipient.trim(); // Trim input

  // Ethereum addresses are hex strings starting with 0x and 42 chars long
  if (/^0x[a-fA-F0-9]{40}$/i.test(trimmedRecipient)) {
    return 'ethereum';
  }

  // Stellar addresses are either federation addresses with * or Ed25519 public keys starting with G (56 chars total)
  const hasStellarFederation = trimmedRecipient.indexOf('*') !== -1;
  // Make G check case-insensitive for public key
  if (hasStellarFederation || /^G[A-Z0-9]{55}$/i.test(trimmedRecipient)) {
    return 'stellar';
  }
  
  // Solana addresses are base58 encoded and typically 32-44 characters long
  if (/^[1-9A-HJ-NP-Za-km-z]{30,50}$/.test(trimmedRecipient)) {
    return 'solana';
  }
  
  return null;
};

export function getRecipientType(value, wallet) {
  if (!value) return null;
  
  // 1. Check if it looks like any known crypto address format FIRST
  if (detectCryptoAddressType(value)) {
      return 'crypto';
  }

  // 2. If not a crypto format, check other types
  if (!validateEmail(value)) return 'email';
  if (typeof validateMobile(value) === 'boolean') return 'mobile';
  
  // 3. Fallback check specifically for 'account' type (or potentially other non-standard inputs)
  // This check might need refinement based on what constitutes an 'account'
  if (value?.length === 10 && value?.[0] !== '+' && isNaN(value)) {
    return 'account';
  } 
  
  // If none of the above, return null or a default/unknown type
  return null; 
}

export const validateAddress = (values = {}) => {
  let errors = {};
  let { line_1, state_province = '', city, postal_code, country } = values;
  const isCountryUS =
    country === 'US' ||
    country === 'United States of America' ||
    country === 'United States';
  if (country?.cca2) country = country?.cca2;
  if (!line_1) errors.line_1 = 'Please enter address line 1';
  if (!state_province) errors.state_province = 'Please enter state/province';
  if (!city) errors.city = 'Please enter city';
  if (!postal_code) errors.postal_code = 'Please enter postal/zip code';
  if (!country) errors.country = 'Please select country';

  if (postal_code?.length !== 5 && isCountryUS)
    errors.postal_code = 'Zip code must be 5 numerical digits';

  if (isEmpty(errors)) return false;
  else return errors;
};
