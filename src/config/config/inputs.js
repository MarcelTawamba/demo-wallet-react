export const line_1 = {
  name: 'line_1',
  label: 'Address line 1',
  placeholder: 'e.g. 158 Kloof Street',
};
export const line_2 = {
  name: 'line_2',
  label: 'Address line 2',
  placeholder: 'e.g. Gardens',
};
export const city = {
  name: 'city',
  label: 'City',
  placeholder: 'e.g. Cape Town',
};
export const postal_code = {
  name: 'postal_code',
  label: 'Postal or ZIP code',
  placeholder: 'e.g. 9001',
};
export const state_province = {
  name: 'state_province',
  label: 'State or province',
  placeholder: 'e.g. Western Cape',
};
export const country = {
  name: 'country',
  label: 'country',
  type: 'country',
  placeholder: 'e.g. South Africa',
};
export const account_name = {
  name: 'name',
  label: 'Account name',
  placeholder: 'e.g. Personal account',
};
export const account_number = {
  name: 'number',
  label: 'Account number',
  placeholder: 'e.g. 4083764677',
};
export const type = {
  name: 'type',
  label: 'Account type',
  placeholder: 'e.g. Check account',
};
export const bank_name = {
  name: 'bank_name',
  label: 'Bank name',
  placeholder: 'e.g. South Bank',
};
export const bank_code = {
  name: 'bank_code',
  label: 'Bank code',
  placeholder: 'e.g. 12324',
};
export const branch_code = {
  name: 'branch_code',
  label: 'Branch code',
  placeholder: 'e.g. 46589',
};
export const swift = {
  name: 'swift',
  label: 'swift',
  helper: 'Usually 8 or 11 characters',
  placeholder: 'e.g. CTBAAU2S',
};
export const bic = {
  name: 'bic',
  helper: 'Usually 8 or 11 characters',
  placeholder: 'e.g. CTBAAU2S',
};
export const iban = {
  name: 'iban',
  label: 'IBAN number',
  placeholder: 'e.g. PT50002700000001234567833',
  helper: '15 - 34 alphanumeric characters',
};
export const vat_number = {
  name: 'vat_number',
  label: 'VAT number',
  validation: { required: true },
};
export const first_name = {
  name: 'first_name',
  label: 'First name',
  validation: { required: 'true' },
  placeholder: 'e.g. John',
};
export const last_name = {
  name: 'last_name',
  label: 'Last name',
  validation: { required: 'true' },
  placeholder: 'e.g. Smith',
};
export const business_name = {
  name: 'business_name',
  label: 'Business name',
  validation: { required: 'true' },
  placeholder: '',
};
export const username = {
  name: 'username',
  label: 'Username',
  validation: { required: 'true' },
  placeholder: 'e.g. johnsmith88',
};
export const id_number = {
  name: 'id_number',
  label: 'Identification number',
  helper: 'SSN, Passport, BSN or ID number',
  validation: { length: 8, required: 'true' },
  placeholder: 'e.g. 4001023456789',
};
export const birth_date = {
  name: 'birth_date',
  label: 'Birth date',
  type: 'date',
};
export const timezone = {
  name: 'timezone',
  label: 'Timezone',
  placeholder: 'select',
  type: 'timezone',
};
export const nationality = {
  name: 'nationality',
  label: 'nationality',
  type: 'country',
};
export const mobile = {
  name: 'mobile',
  label: 'Mobile number',
  type: 'mobile',
  helper: 'Please include country code',
  validation: {},
  placeholder: 'e.g. +1821234567',
};
export const mobile_number = {
  name: 'number',
  label: 'Mobile number',
  type: 'mobile',
  helper: 'Please include country code',
  validation: {},
  placeholder: 'e.g. +1821234567',
};
export const mobile_mfa = {
  name: 'number',
  label: 'Mobile number',
  type: 'mobile',
  helper: 'Please include country code',
  validation: {},
  placeholder: 'e.g. +1821234567',
};
export const email = {
  name: 'email',
  label: 'Email address',
  type: 'email',
  validation: { required: 'true' },
  enum: null,
  placeholder: 'e.g. hello@gmail.com',
};
export const password = {
  name: 'password',
  label: 'Password',
  type: 'password',
  helper: 'Must be a minimum of 8 characters',
  validation: { required: 'true', min: 8 },
};
export const confirm_password = {
  name: 'confirm_password',
  label: 'Confirm password',
  type: 'password',
  helper: 'Must be a minimum of 8 characters',
  validation: { required: 'true', min: 8 },
};
export const company = {
  name: 'company',
  label: 'Company',
  validation: { required: 'true' },
  // helper: 'Start with a wallet',
  placeholder: 'App ID',
};
export const new_password1 = {
  name: 'new_password1',
  label: 'New password',
  type: 'password',
  helper: 'Must be a minimum of 8 characters',
  validation: { required: 'true', min: 8 },
};
export const new_password2 = {
  name: 'new_password2',
  label: 'Confirm new password',
  type: 'password',
  helper: 'Must be a minimum of 8 characters',
  validation: { required: 'true', min: 8 },
};
export const old_password = {
  name: 'old_password',
  label: 'Current password',
  type: 'password',
  helper: 'Must be a minimum of 8 characters',
  validation: { required: 'true', min: 8 },
};
export const amount = {
  name: 'amount',
  label: 'Amount',
  type: 'number',
  placeholder: '0.00',
};
// export const recipient = {
//   name:'recip',
//   label: 'Last name',
//   validation: { required: 'true' },
//   placeholder: 'e.g. Smith',
// };
export const emailRecipient = {
  name: 'recipient',
  type: 'email',
  label: 'Recipient',
  validation: { required: 'true' },
  placeholder: 'e.g. hello@gmail.com',
};
export const mobileRecipient = {
  name: 'recipient',
  label: 'Recipient',
  type: 'mobile',
  helper: 'Please include country code, e.g. +1',
  placeholder: 'e.g. +1821234567',
};
export const cryptoRecipient = {
  name: 'recipient',
  label: 'Recipient',
  helper: 'Please enter a valid crypto address',
  multiline: true,
  placeholder: 'e.g. GCFXHS4GXL6BVUCXBWXGTITROWLVYXQKQLF4...',
};
export const cryptoAddress = {
  name: 'address',
  label: 'Address',
  multiline: true,
  placeholder: 'e.g. GCFXHS4GXL6BVUCXBWXGTITROWLVYXQKQLF4...',
};
export const note = {
  name: 'note',
  label: 'Note',
  placeholder: 'e.g. Payment',
};
export const memo = {
  name: 'memo',
  label: 'Memo',
  placeholder: 'e.g. 8DLYX2LBKP',
};
export const currency = {
  name: 'currency',
  label: 'Currency',
  type: 'currencySelector',
};
export const federationAddress = {
  name: 'federationAddress',
  label: 'Username for federation address',
  helper: 'Your easily identifiable stellar address',
};
export const federationAddressAccount = {
  name: 'federationAddress',
  label: 'Federated stellar address',
  helper: 'Your easily identifiable stellar address',
};
export const displayCurrency = {
  name: 'displayCurrency',
  label: 'Display currency',
  placeholder: 'Please select a display currency...',
  type: 'dropdown',
};
export const otp = {
  name: 'otp',
  label: 'OTP',
  type: 'pin',
  length: 6,
};
export const terms = {
  name: 'terms',
  label: 'Terms',
  type: 'checkbox',
};
export const memoSkip = {
  name: 'memoSkip',
  label: 'No memo required for this transaction',
  type: 'checkbox',
};
export const memoSkipAccount = {
  name: 'memoSkip',
  label: 'No memo required for this account',
  type: 'checkbox',
};
export const merchant = {
  name: 'merchant',
  label: 'Merchant',
  description: 'Would you like to register as a merchant?',
  type: 'switch',
};
export const description = {
  name: 'description',
  label: 'Description',
  multiline: true,
  rows: 5,
  rowsMax: 5,
  // type: 'multiline',
};
export const customerEmail = {
  name: 'email',
  label: 'Customer email',
  type: 'email',
};
export const amountSimple = {
  name: 'amount',
  label: 'Amount',
  type: 'number',
};

export const buy = {
  name: 'buy',
  label: 'Buy',
  placeholder: '0.00',
  type: 'number',
};
export const sell = {
  name: 'sell',
  label: 'Sell',
  placeholder: '0.00',
  type: 'number',
};

export const exchangeCurrency = {
  name: 'currency',
  label: 'For currency',
  type: 'currencySelector',
};

export const currencies = {
  name: 'currencies',
  label: 'Currencies',
  type: 'multi',
};

export const voucher_code = {
  name: 'voucher_code',
  label: 'voucher_code',
  placeholder: 'voucher_placeholder',
  helper: 'voucher_helper',
};

export const routing_number = {
  name: 'routing_number',
  label: 'Routing number',
  placeholder: 'e.g. 021000021',
};

export const residency = {
  name: 'residency',
  label: 'residency',
  type: 'country',
  placeholder: 'select_country'
};
