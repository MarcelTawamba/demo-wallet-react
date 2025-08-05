import { getName } from 'country-list';
import { get, isEmpty, sum as _sum } from 'lodash';
import moment from 'moment';
import momentTz from 'moment-timezone';
import copy from 'copy-to-clipboard';
import Big from 'big.js';

export const formatDivisibility = (amount = 0, divisibility) => {
  try {
    if (typeof divisibility !== 'number') return '0';
    let bigAmount = Big(amount);
    bigAmount = bigAmount.div(Big(10).pow(divisibility));
    const decimalPlaces = Math.min(4, divisibility); // limit to 4 decimal places
    return bigAmount.toFixed(decimalPlaces, Big.roundDown);
  } catch (e) {
    console.error('Error formatting divisibility', e);
    return '0';
  }
};

export const displayFormatDivisibility = (amount = 0, divisibility) => {
  return formatDivisibility(amount, divisibility);
};

export function toDivisibility(amount, divisibility) {
  if (typeof divisibility !== 'number') return '';
  let bigAmount;
  if (amount instanceof Big) {
    bigAmount = amount;
  } else if (typeof amount === 'string') {
    bigAmount = new Big(amount);
  } else if (typeof amount === 'number') {
    // TODO: We should update this function to always be called with Big type
    console.log('Warning: toDivisibility called with number instead of Big');
    bigAmount = new Big(amount);
  } else {
    return '';
  }

  return parseInt(bigAmount.times(new Big(10).pow(divisibility)));
}

export function fromDivisibility(amount, divisibility) {
  return new Big(amount).div(new Big(10).pow(divisibility));
}

export function getUserGroup(user) {
  return user?.groups?.[0]?.name ?? 'user';
}

export function getActiveTier(tiers) {
  return tiers?.items?.length > 0
    ? tiers?.items?.find(item => item.active)
    : null;
}

export const multiplyDivisibility = (amount = 0, divisibility = 0) => {
  amount = parseFloat(amount);

  try {
    return parseInt(amount * 10 ** divisibility);
  } catch (e) {
    return 0;
  }
};

export const parseDivisibility = (raw, divisibility, newCharacter) => {
  let amountString = raw.replace('.', '');
  let pos = amountString.length - divisibility;
  let amountInt = parseInt(amountString);

  if (newCharacter) {
    if ((newCharacter === '.' || newCharacter === ',') && pos > 0) {
      amountInt = amountInt * 10 ** divisibility;
    } else {
      newCharacter = parseInt(newCharacter);
      if (!isNaN(newCharacter)) {
        amountInt = amountInt * 10 + newCharacter;
      }
    }
  } else {
    // console.log('no newChar');
  }

  return isNaN(amountInt) ? 0 : amountInt;
};

export const formatDecimals = (amount, toDivisibility, noCommas=false, floor=true) => {
  const bigAmount = new Big(amount || 0);
  const decimalPlaces = toDivisibility !== undefined ? Math.min(4, toDivisibility) : 2;
  const convAmount = floor 
    ? bigAmount.toFixed(decimalPlaces, Big.roundDown)
    : bigAmount.toFixed(decimalPlaces);

  if (noCommas) {
    return convAmount.toString();
  }
  return addCommas(convAmount);
};

export const formatAmount = (
  amount,
  currency = {},
  withDivisibility,
  overrideDivisibility,
) => {
  let { divisibility = 2 } = currency;
  if (overrideDivisibility) divisibility = overrideDivisibility;

  let bnAmount = new Big(amount).abs();
  if (withDivisibility && divisibility > 0) {
    bnAmount = bnAmount.div(new Big(10).pow(divisibility));
  }

  return addCommas(bnAmount.toFixed(divisibility, Big.roundDown)) + ' ' + getCurrencyCode(currency);
};

export const formatAmountString = (
  amount,
  currency = {},
  withDivisibility,
  overrideDivisibility,
) => {
  let { divisibility = 2 } = currency;
  if (overrideDivisibility) divisibility = overrideDivisibility;

   // handling null or empty string amounts as 0 for legacy compatibility
  let bnAmount = Big(amount || 0).abs();
  if (withDivisibility && divisibility > 0) {
    bnAmount = bnAmount.div(Big(10).pow(divisibility));
  }
  return addCommas(bnAmount.toFixed(divisibility, Big.roundDown)) + ' ' + getCurrencyCode(currency);
};

export function getCurrencyCode(currency) {
  return currency?.display_code ?? currency?.code ?? '';
}

export const standardizeString = (string = '', capitalise = true) => {
  if (string) {
    try {
      if (capitalise) {
        return (string.charAt(0).toUpperCase() + string.slice(1)).replace(
          /_/g,
          ' ',
        );
      } else {
        return string.replace(/_/g, ' ');
      }
    } catch (e) {
      return '';
    }
  }
  return '';
};

export const snakeString = string => {
  const baseString = string
    ?.toLowerCase()
    .replace(/ /g, '_')
    .replace(/[^\w\s]/gi, '') ?? '';
  const randomSuffix = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return baseString + '_' + randomSuffix;
};

export const toTitleCase = str => {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

export const decodeQR = string => {
  if (string) {
    let type,
      recipient,
      amount,
      account,
      currency,
      memo,
      note,
      subtype = '';
    if (string.includes(':')) {
      let temp = string.split(':');
      type = temp[0];

      temp = temp[1].split('?');
      recipient = temp[0];
      if (temp[1]) {
        temp = temp[1].split('&');
        for (var i = 0; i < temp.length; i++) {
          let detail = temp[i].split('=');
          switch (detail[0]) {
            case 'amount':
              amount = detail[1];
              break;
            case 'note':
              note = detail[1];
              break;
            case 'memo':
              memo = detail[1];
              break;
            case 'account':
              account = detail[1];
              break;
            case 'currency':
              currency = detail[1];
              break;
            case 'subtype':
              subtype = detail[1];
              break;
            default:
          }
        }
      }
    } else {
      recipient = string;
    }
    return { type, recipient, amount, note, currency, account, memo, subtype };
  }
  return '';
};

export const concatAddress = (address, noType) => {
  if (!address) {
    return '';
  }
  let value = '';
  if (address.type && !noType) {
    value = standardizeString(address.type);
  }
  if (address.line_1) {
    value = value + (value ? ' - ' : '') + address.line_1;
  }
  if (address.line_2) {
    value = value + (value ? ', ' : '') + address.line_2;
  }
  if (address.city) {
    value = value + (value ? ', ' : '') + address.city;
  }
  if (address.state_province) {
    value = value + (value ? ', ' : '') + address.state_province;
  }
  if (address.country) {
    value = value + (value ? ', ' : '') + getName(address.country);
  }
  if (address.postal_code) {
    value = value + (value ? ', ' : '') + address.postal_code;
  }
  if (address.state_code) {
    value = value + (value ? ', ' : '') + address.state_code;
  }
  return value;
};

export const concatBankAccount = (account = {}, multiline, noName, simple) => {
  let { name, number = '', bank_name, type } = account;
  let value = '';
  if (simple) {
    const accNumLength = number?.length;
    value = number.substring(accNumLength - 4, accNumLength);
  } else {
    if (bank_name) {
      value = account.bank_name;
    }
    if (number) {
      value = value + (value ? ', ' : '') + account.number;
    }
    if (type) {
      value = value + (value ? ', ' : '') + account.type;
    }
  }
  if (noName) {
    return value;
  }

  if (multiline) {
    return [name + ' ', value];
  }
  return name + ' - ' + value;
};

export const concatCryptoAccount = (account = {}, multiline, noName) => {
  let value = '';
  let name = '';
  let { address } = account;
  let memo = account.metadata && account.metadata.memo;

  if (account.name || (account.metadata && account.metadata.name)) {
    name = account.name ? account.name : account.metadata.name;
  }

  if (
    (account.network && account.network === 'testnet') ||
    (account.metadata && account.metadata.testnet)
  ) {
    name = name + ' (testnet)';
  }
  value = name;

  if (multiline) {
    if (noName) {
      return [address, memo ? 'Memo: ' + memo : ''];
    }
    return [name, address, memo ? 'Memo: ' + memo : ''];
  }

  if (memo) {
    value = value + (value ? ' ' : '') + (memo + '*');
  }

  if (address) {
    value = value + (value ? ' ' : '') + address;
  }

  return value;
};

export function getValue(item, type) {
  switch (type) {
    case 'mobiles':
      return item?.number;
    case 'emails':
      return item?.email;
    case 'bitcoin':
    case 'stellar':
    case 'ethereum':
      return concatCryptoAccount(item);

    case 'bank':
      return concatBankAccount(item);
    case 'addresses':
      return concatAddress(item);
    default:
      return '';
  }
}

export const concatCryptoAccountNoName = (account, multiline) => {
  let value = '';
  let name = '';
  let { address } = account;
  let memo = account.metadata && account.metadata.memo;

  // value = name;

  if (memo) {
    value = value + (value ? ' ' : '') + (memo + '*');
  }

  if (address) {
    value = value + (value ? '' : '') + address;
  }

  // if (
  //   (account.network && account.network === 'testnet') ||
  //   (account.metadata && account.metadata.testnet)
  // ) {
  //   value = value + ' - testnet';
  // }
  return value;
};

export const safe = (item, field, value = '') =>
  item && item[field] ? item[field] : value;

export const bounds = (value, min, max) => Math.min(max, Math.max(min, value));

export function removeDuplicates(myArr, prop) {
  return myArr.filter((obj, pos, arr) => {
    return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
  });
}

export function sum(items = [], prop) {
  return items.reduce(function (a, b) {
    return a + parseFloat(b[prop]);
  }, 0);
}
export function mapOptions(options, labelField, valueField) {
  return options.map(item => {
    return {
      label: item?.[labelField] ?? item?.[valueField] ?? item,
      value: item?.[valueField] ?? item?.[labelField] ?? item,
      item,
    };
  });
}

export function getPrimaryOrFirst(data) {
  const temp = data.find(item => item.primary === true);
  return temp ? temp : data[0] ? data[0] : {};
}

export const arrayMove = (arr, from, to) => {
  const newArr = [...arr];
  const element = newArr.splice(from, 1)[0];
  newArr.splice(to, 0, element);
  return newArr;
};

export const queryMap = queries =>
  queries
    ? Object.keys(queries)
        .map(item => {
          const value = queries[item];
          return item + '=' + value;
        })
        .join('&')
    : '';

export const paramsMap = params =>
  params
    ? Object.keys(params)
        .map(key => {
          const param = params[key];
          return key + '=' + param;
        })
        .join('&')
    : '';

export function addCommas(str) {
  if (str?.toString()?.includes('e')) {
    return str.toString(); // if it's in scientific notation we don't want to put comma
  }
  var parts = (str + '').split('.'),
    main = parts[0],
    len = main.length,
    output = '',
    first = main.charAt(0),
    i;

  if (first === '-') {
    main = main.slice(1);
    len = main.length;
  } else {
    first = '';
  }
  i = len - 1;
  while (i >= 0) {
    output = main.charAt(i) + output;
    if ((len - i) % 3 === 0 && i > 0) {
      output = ',' + output;
    }
    --i;
  }
  output = first + output;
  if (parts.length > 1) {
    output += '.' + parts[1];
  }
  if (output?.[0] === ',') {
    output = output.substring(1);
  }
  if (output?.[0] === '~' && output?.[1] === ',') {
    output = output.slice(0, 1) + output.slice(2, output.length);
  }
  return output;
}

export const formatTime = (
  time,
  format = 'MMMM Do YYYY, h:mm:ss a',
  profile,
) => {
  if (typeof time === 'string') {
    time = parseInt(time);
  }
  const timezone = get(profile, ['items', 'timezone']);
  return timezone
    ? momentTz.tz(time, timezone).format(format)
    : moment(time).format(format);
};

export const statusColor = status => {
  switch (status) {
    case 'Complete':
      return 'success';
    case 'Failed':
    case 'Cancelled':
      return 'error';
    default:
      return 'font';
  }
};

export function generateUrl(scheme, address, options) {
  let url = '';
  if (scheme) {
    url = scheme + ':';
  }
  url = url + address + generateQueryString(options);
  return url;
}

export function generateQueryString(options) {
  let query = '';
  for (var key in options) {
    if (query !== '') {
      query += '&';
    } else {
      query = '?';
    }
    query += key + '=' + encodeURIComponent(options[key]);
  }
  return query;
}

export function copyToClipboard(text, showToast) {
  copy(text);

  if (typeof showToast === 'function') {
    showToast({ text: 'Copied to clipboard: ' + text });
  }
}

export function scientificToDecimal(num) {
  var nsign = Math.sign(num);
  //remove the sign
  num = Math.abs(num);
  //if the number is in scientific notation remove it
  if (/\d+\.?\d*e[+-]*\d+/i.test(num)) {
    var zero = '0',
      parts = String(num).toLowerCase().split('e'), //split into coeff and exponent
      e = parts.pop(), //store the exponential part
      l = Math.abs(e), //get the number of zeros
      sign = e / l,
      coeff_array = parts[0].split('.');
    if (sign === -1) {
      l = l - coeff_array[0].length;
      if (l < 0) {
        num =
          coeff_array[0].slice(0, l) +
          '.' +
          coeff_array[0].slice(l) +
          (coeff_array.length === 2 ? coeff_array[1] : '');
      } else {
        num = zero + '.' + new Array(l + 1).join(zero) + coeff_array.join('');
      }
    } else {
      var dec = coeff_array[1];
      if (dec) l = l - dec.length;
      if (l < 0) {
        num = coeff_array[0] + dec.slice(0, l) + '.' + dec.slice(l);
      } else {
        num = coeff_array.join('') + new Array(l + 1).join(zero);
      }
    }
  }

  return nsign < 0 ? '-' + num : num;
}

export const arrayToObject = (arr, keyField) =>
  Object.assign(
    {},
    ...(arr?.map(item => ({ [item?.[keyField] ?? '']: item })) ?? []),
  );

export const arrayToObjectNested = (arr, keyField, keyField2) => {
  try {
    return Object.assign(
      {},
      ...arr.map(item => ({ [item[keyField][keyField2]]: item })),
    );
  } catch (e) {}
};

export function arrayToPlaceholder(array, options = {}) {
  const { deliminator = ',', lastDeliminator = 'or', crypto } = options ?? {};
  let placeholder;
  if (array?.length === 1) placeholder = array[0];
  else {
    if (crypto) {
      const index = array.findIndex(item => item === 'crypto');
      if (index !== -1) array[index] = cryptoCodeToType(crypto) + ' address';
    }
    const last = array.pop();
    placeholder = `${array.join(`${deliminator} `)} ${lastDeliminator} ${last}`;
  }

  return placeholder.charAt(0).toUpperCase() + placeholder.slice(1);
}
export function cryptoCodeToType(code) {
  switch (code) {
    case 'XLM':
    case 'TXLM':
      return 'stellar';
    case 'XBT':
    case 'TXBT':
      return 'bitcoin';
    default:
      return null;
  }
}

export const objectToArray = (obj, keyField, keepExistingKeyValue = false) => {
  if (!obj) {
    return [];
  }
  return Object.keys(obj).map(key => {
    let item = obj[key];
    if (keyField) {
      if (typeof item === 'object') {
        if (!(keepExistingKeyValue && item?.[keyField])) {
          item[keyField] = key;
        }
      } else return { [keyField]: key, item };
    }
    return item;
  });
};

export function formatOutputValue(value, variant, item = {}) {
  const { currency } = item ?? {};

  if (variant === 'boolean') {
    value = value ? 'Yes' : 'No';
  } else if (variant.match(/array|country|prices/)) {
    if (variant === 'country') {
      value = value.map(item => getName(item));
    } else if (variant === 'prices') {
      value = value.map((item = {}) =>
        formatAmountString(item.amount, currency, true),
      );
    }
    value = value.join(', ').toString();
  } else if (variant.match(/date_time/)) {
    value = formatTime(value, 'YYYY-MM-DD h:mm A');
  } else if (variant.match(/date/)) {
    value = value ? formatTime(value, 'YYYY-MM-DD') : '';
  } else if (variant.match(/standardize/)) {
    value = standardizeString(value);
  } else if (variant.match(/status/)) {
    value = standardizeString(value);
  } else if (variant.match(/amount/) && currency) {
    value = formatAmountString(value, currency, true);
  } else if (variant.match(/categories/) && typeof value?.length === 'number') {
    value = value.map(item => item?.name ?? item?.id).join(', ');
  }

  return value;
}

export function formatVoucherCode(code, separator = '-') {
  if (code.match(/-/)) return code;

  var parts = code.match(/[\s\S]{1,4}/g) || [];

  return parts.join(separator);
}

export const reservedPages = [
  'sales',
  'accounts',
  'rewards',
  'rewards_admin',
  'pos',
  'top_up',
  'products',
  'products_admin',
  'profile',
  'settings',
  'mobile',
  'sale',
  'products_admin',
  'publicLoadingPage',
  'email',
  'checkout',
  'password',
  'redeem_voucher',
  'receive',
  'developers',
  'invoices',
  'customers',
  'payments',
  'documentation',
  'qr',
  'home',
  'onboarding',
  'business',
  'reporting',
  'payouts',
  'get_started',
  'help',
  'orders',
  'team',
  'kyc',
  'download-en-json',
  'sep24',
  'request-delete',
  'request-delete/verify',
  'deactivate',
  'bridge-terms',
];

export function safeParams(params, key, fallback = '') {
  const temp = params.get(key);
  return temp ? temp : fallback;
}

export function searchToObj(search = '') {
  search = search.replace('?', '');
  try {
    return JSON.parse(
      '{"' +
        decodeURI(search)
          .replace(/"/g, '\\"')
          .replace(/&/g, '","')
          .replace(/=/g, '":"') +
        '"}',
    );
  } catch (e) {
    return {};
  }
}

export function parseUrl(location) {
  let { pathname, search } = location;
  let paths = pathname.split('/');
  const params = new URLSearchParams(search);
  let email = safeParams(params, 'email');
  email = email.replace(' ', '+');
  const user = safeParams(params, 'user');
  const group = safeParams(params, 'group');
  const mobile = safeParams(params, 'mobile');
  let company = safeParams(params, 'company');
  let page = '';

  try {
    if (paths.length > 2 && paths[2].match(/login|register|forgot/)) {
      page = paths[2];
      company = paths[1];
    } else if (paths[1].match(/login|register|forgot/)) {
      page = paths[1];
      company = params.get('company');
    } else if (paths[1].match(/sep24/)) {
      page = paths[1];
      company = paths[2];
    } else {
      company = paths[1];
    }
  } catch (e) {}

  if (reservedPages.includes(company) || company === null) {
    company = '';
  }

  return { user, company, page, email, group, mobile, paths };
}

function isId(id) {
  return id?.length === 36 || !isNaN(id);
}

export function parseScreenUrl(pathname, search = '') {
  const filters = searchToObj(search);
  const paths = pathname.split('/').filter(item => item);

  let itemId = '';
  let screenId = paths?.[0];
  let pageId = !paths?.[1]?.match(/add$|edit|new$/) ? paths?.[1] : '' ?? '';

  if (isId(paths?.[1])) {
    itemId = paths[1];
  } else if (isId(paths?.[2])) {
    itemId = paths[2];
  }

  const isEdit = paths.findIndex(item => item === 'edit') !== -1;
  const isNew = paths.findIndex(item => item === 'new') !== -1;
  const isDelete = paths.findIndex(item => item === 'delete') !== -1;
  const isVerify = paths.findIndex(item => item === 'verify') !== -1;

  const stateId = isDelete
    ? 'delete'
    : isEdit
    ? 'edit'
    : isNew
    ? 'new'
    : isVerify
    ? 'verify'
    : itemId
    ? 'view'
    : '';
  if (pageId?.length === 36) {
    pageId = '';
  }

  return { screenId, itemId, pageId, isEdit, stateId, filters };
}

export function shiftToStart(array, field, value) {
  let index = 0;
  if (field) {
    index = array.findIndex(item => get(item, field) === value);
  } else {
    index = array.findIndex(item => item === value);
  }
  array.unshift(array.splice(index, 1)[0]);
  return array;
}

export function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function calculateInvoiceTotal(items, divisibility) {
  return (
    _sum(
      items?.map(
        item =>
          parseFloat(item?.price ? item?.price : 0) *
          (divisibility ? 10 ** divisibility : 1) *
          parseInt(item?.quantity ? item?.quantity : 1),
      ),
    ) ?? 0
  );
}

export function paramsToObj(search = '') {
  const urlParams = new URLSearchParams(search?.replace('amp;', '') ?? '');
  const entries = urlParams.entries();
  let result = {};
  for (let entry of entries) {
    const [key, value] = entry;
    result[key] = value;
  }
  return result;
}

export function paramsToSearch(params, encode = true) {
  let keys = Object.keys(params);
  if (keys.length === 0) return '';
  let search = '?';
  for (let key of keys) {
    search =
      search +
      key +
      '=' +
      (encode ? encodeURIComponent(params[key]) : params[key]) +
      '&';
  }
  search = search.substring(0, search.length - 1);
  return search;
}

export function hexToRgb(hex, percentage = 0.2) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    return `rgba(${r},${g},${b},${percentage})`;
  }

  return null;
}

export function validateColor(color) {
  if (typeof color === 'string') {
    if (color?.length === 7) return color;
    else if (color?.length === 4) return tripleHexToHex(color);
    else if (color?.substring(0, 3) === 'rgb') return color;
  } else if (typeof color === 'object' && color?.length === 3) return color;
  return '#FFFFFF';
}

export function tripleHexToHex(hex) {
  if (typeof hex === 'string' && hex?.length === 4)
    return `#${hex[1] + hex[1]}${hex[2] + hex[2]}${hex[3] + hex[3]}`;
}

export function isOdd(num) {
  return num % 2;
}

export function concatName({ first_name, last_name }) {
  return `${first_name} ${last_name ?? ''}`;
}

export function testRequiredFields(item, fields) {
  let result = true;
  fields.forEach(field => {
    if (!Boolean(item?.[field] ?? false)) {
      result = false;
    }
  });
  return result;
}

export function isBusiness({ userGroup }) {
  return userGroup?.match(/merchant|business/);
}

export function isAdmin({ userGroup }) {
  return userGroup?.match(/admin/);
}

export function removeEmptyFields(obj, strict) {
  for (var propName in obj) {
    const value = obj[propName];
    if (value === null || value === undefined || (strict && isEmpty(value))) {
      delete obj[propName];
    }
  }
  return obj;
}

export function cleanMobile(mobile) {
  return mobile.replace(/[()-]/g, '');
}

export function differenceByField(
  otherArray,
  otherId = 'value',
  currentId = 'value',
) {
  return function (current) {
    return (
      otherArray.findIndex(function (other) {
        return other?.[otherId] === current?.[currentId];
      }) === -1
    );
  };
}

export function compareValue(item = {}, id = '', keyField = 'id') {
  return (item?.[keyField] ?? '').toString() === id.toString();
}

export function errorMapper({ lang, error }) {
  let errors = [];

  for (const [key, value] of Object.entries(error?.data ?? {})) {
    errors.push(`${lang?.[key] ?? standardizeString(key)}: ${value}`);
  }

  return errors?.length ? errors?.join('\n') : 'An error occurred';
}

export function getQueryVariable(query, variable) {
  var vars = query.split('&');
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');
    if (pair[0] === variable) {
      return pair[1];
    }
  }
  return null;
}

const valueColors = {
  // defaults to font
  Paid: 'success',
  Refunded: 'info',
  'Partially refunded': 'info',
  'Overpaid & partially refunded': 'info',
  // Overpaid: 'success',
  Complete: 'success',
  Accepted: 'success',
  Underpaid: 'error',
  Rejected: 'error',
  Failed: 'error',
  Overpaid: 'info',
  // Draft: 'font',
  // Processing: 'font', //'primary',
  Available: 'success',
  Redeemed: 'info',

  Pending: 'warning',
  pending: 'warning',
  Placed: 'success',
  pending_settled: 'info',

  Enabled: 'success',
};

export function statusToColor(status) {
  return valueColors?.[status] ?? 'font';
}

