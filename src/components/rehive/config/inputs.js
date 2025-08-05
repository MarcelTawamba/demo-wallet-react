import * as _inputs from 'config/inputs';

export const bankAccounts = {
  name: _inputs.account_name,
  number: _inputs.account_number,
  type: _inputs.type,
  bank_name: _inputs.bank_name,
  bank_code: _inputs.bank_code,
  branch_code: _inputs.branch_code,
  swift: _inputs.swift,
  iban: _inputs.iban,
  currencies: _inputs.currencies,
};

export const profile = {
  first_name: _inputs.first_name,
  last_name: _inputs.last_name,
  business_name: _inputs.business_name,
  id_number: _inputs.id_number,
  nationality: _inputs.nationality,
  birth_date: _inputs.birth_date,
  timezone: _inputs.timezone,
  // mobile: _inputs.mobile,
  // username: _inputs.username,
};

export const addresses = {
  line_1: _inputs.line_1,
  line_2: _inputs.line_2,
  city: _inputs.city,
  postal_code: _inputs.postal_code,
  state_province: _inputs.state_province,
  country: _inputs.country,
};

export const emails = {
  email: _inputs.email,
};

export const mobiles = {
  number: _inputs.mobile_number,
  otp: _inputs.otp,
};

export const password = [
  _inputs.old_password,
  _inputs.new_password1,
  _inputs.new_password2,
];

const Inputs = {
  profile,
  mobiles,
  emails,
  addresses,
  bankAccounts,
  password,
};

export default Inputs;
