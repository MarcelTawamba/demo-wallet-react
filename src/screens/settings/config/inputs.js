import * as _inputs from 'config/inputs';

export const mfa = {
  otp: _inputs.otp,
  number: _inputs.mobile_mfa,
};

export const password = [
  _inputs.old_password,
  _inputs.new_password1,
  _inputs.new_password2,
];

export const cryptoAccounts = {
  name: _inputs.account_name,
  address: _inputs.cryptoAddress,
  memo: _inputs.memo,
  memoSkip: _inputs.memoSkipAccount,
  federationAddress: _inputs.federationAddressAccount,
};
export const displayCurrency = {
  displayCurrency: _inputs.displayCurrency,
};

const Inputs = {
  mfa,
  password,
  cryptoAccounts,
  displayCurrency,
};

export default Inputs;
