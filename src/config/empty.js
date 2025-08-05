export const EMPTY_BANK_ACCOUNT = {
  name: '',
  number: '',
  type: '',
  bank_name: '',
  bank_code: '',
  branch_code: '',
  swift: '',
  iban: '',
  currencies: [],
};

export const EMPTY_PROFILE = {
  first_name: '',
  last_name: '',
  id_number: '',
  birth_date: '',
  nationality: '',
  residency: '',
};

export const EMPTY_MOBILE = { number: '' };

export const EMPTY_EMAIL = { email: '' };

export const EMPTY_CRYPTO = {
  name: '',
  address: '',
};
export const EMPTY_CRYPTO_MAINNET = {
  name: '',
  address: '',
  network: 'mainnet',
};
export const EMPTY_CRYPTO_TESTNET = {
  name: '',
  address: '',
  network: 'testnet',
};
export const EMPTY_STELLAR_MAINNET = {
  name: '',
  address: '',
  stellarAddressType: 'public',
  network: 'mainnet',
  memo: '',
  memoSkip: false,
};
export const EMPTY_STELLAR_TESTNET = {
  name: '',
  address: '',
  stellarAddressType: 'public',
  network: 'testnet',
  memo: '',
  memoSkip: false,
};

export const EMPTY_ADDRESS = {
  line_1: '',
  line_2: '',
  city: '',
  state_province: '',
  country: '',
  postal_code: '',
};

export const EMPTY_PASSWORD = {
  old_password: '',
  new_password1: '',
  new_password2: '',
};

const Empty = {
  EMPTY_ADDRESS,
  EMPTY_BANK_ACCOUNT,
  EMPTY_CRYPTO,
  EMPTY_EMAIL,
  EMPTY_MOBILE,
  EMPTY_PROFILE,
};

export default Empty;
