import * as _inputs from './inputs';

export const profile = {
  first_name: _inputs.first_name,
  last_name: _inputs.last_name,
  id_number: _inputs.id_number,
  // mobile: _inputs.mobile,
  // username: _inputs.username,
};

export const address = {
  line_1: _inputs.line_1,
  line_2: _inputs.line_2,
  city: _inputs.city,
  postal_code: _inputs.postal_code,
  state_province: _inputs.state_province,
  country: _inputs.country,
};

export const email = {
  email: _inputs.email,
};

export const mobile = {
  number: _inputs.mobile_number,
};

export const bank_account = {
  name: _inputs.account_holder,
  number: _inputs.account_number,
  type: _inputs.type,
  bank_name: _inputs.bank_name,
  bank_code: _inputs.bank_code,
  branch_code: _inputs.branch_code,
  swift: _inputs.swift,
  iban: _inputs.iban,
};

export const password = {
  new_password1: _inputs.new_password1,
  new_password2: _inputs.new_password2,
  old_password: _inputs.old_password,
};

export const send = {
  amount: _inputs.amount,
  emailRecipient: _inputs.emailRecipient,
  mobileRecipient: _inputs.mobileRecipient,
  cryptoRecipient: _inputs.cryptoRecipient,
  note: _inputs.note,
  memo: _inputs.memo,
  currency: _inputs.currency,
};

export const receive = {
  amount: _inputs.amount,
  emailRecipient: _inputs.emailRecipient,
  mobileRecipient: _inputs.mobileRecipient,
  cryptoRecipient: _inputs.cryptoRecipient,
  note: _inputs.note,
  memo: _inputs.memo,
  currency: _inputs.currency,
};

export const Inputs = {
  profile,
  send,
  receive,
  password,
  bank_account,
  mobile,
  email,
  address,
};
