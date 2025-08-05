import {
  emailPattern,
  urlPattern,
  validateMobile,
  validateCryptoBool,
} from 'util/validation';
import document_categories from 'screens/profile/config/document_categories.json';

export * from 'screens/invoices/config/inputs';
export * from 'screens/checkout/config/inputs';

const genderOptions = [
  { label: 'Male', value: 'male', key: 'male' },
  { label: 'Female', value: 'female', key: 'female' },
  { label: 'Other', value: 'other', key: 'other' },
];
const eventOptions = [
  {
    label: 'Payment requests: Create request',
    value: 'service_payment_requests.request.create',
    key: 'service_payment_requests.request.create',
  },
  {
    label: 'Payment requests: Update request',
    value: 'service_payment_requests.request.update',
    key: 'service_payment_requests.request.update',
  },
  // {
  //   label: 'Payment requests: Quote create',
  //   value: 'service_payment_requests.quote.create',
  //   key: 'service_payment_requests.quote.create',
  // },
  // {
  //   label: 'Payment requests: Otp create',
  //   value: 'service_payment_requests.otp.create',
  //   key: 'service_payment_requests.otp.create',
  // },
  // {
  //   label: 'Payment requests: Payer remainder',
  //   value: 'service_payment_requests.payer_reminder',
  //   key: 'service_payment_requests.payer_reminder',
  // },
  // {
  //   label: 'Payment requests: Payer requested',
  //   value: 'service_payment_requests.payer_requested',
  //   key: 'service_payment_requests.payer_requested',
  // },
];

const titleOptions = [
  { label: 'Mr', value: 'mr', key: 'mr' },
  { label: 'Mrs', value: 'mrs', key: 'mrs' },
  { label: 'Ms', value: 'ms', key: 'ms' },
  { label: 'Mx', value: 'mx', key: 'mx' },
];

const maritalOptions = [
  { label: 'Single', value: 'single', key: 'single' },
  { label: 'Married', value: 'married', key: 'married' },
  { label: 'Divorced', value: 'divorced', key: 'divorced' },
];

export const line_1 = {
  name: 'line_1',
  label: 'line_1',
  placeholder: 'e.g. 1187 Hayes Street',
};
export const line_2 = {
  name: 'line_2',
  label: 'line_2',
  placeholder: 'e.g. Alamo Square',
};
export const city = {
  name: 'city',
  label: 'city',
  placeholder: 'e.g. San Francisco',
};
export const postal_code = {
  name: 'postal_code',
  label: 'postal_code',
  placeholder: 'e.g. 94117',
};
export const state_province = {
  name: 'state_province',
  label: 'state_province',
  placeholder: 'e.g. California',
};
export const country = {
  name: 'country',
  label: 'country',
  type: 'country',
  placeholder: 'e.g. United States of America',
};
export const account_name = {
  name: 'name',
  placeholder: 'e.g. Personal account',
};
export const account_name_for_business = {
  name: 'name',
  placeholder: 'e.g. Business account',
};
export const account_number = {
  name: 'number',
  label: 'account_number',
  placeholder: 'e.g. 4083764677',
};
export const type = {
  name: 'type',
  label: 'type',
  placeholder: 'e.g. Checking',
};
export const bank_name = {
  name: 'bank_name',
  label: 'bank_name',
  placeholder: 'e.g. Chase',
};
export const name = {
  name: 'name',
  label: 'account_name',
  placeholder: 'e.g. My Chase Account',
};
export const number = {
  name: 'number',
  label: 'account_number',
  placeholder: 'e.g. 4083764677',
};
export const bank_number = {
  name: 'number',
  label: 'bank_number',
  placeholder: 'e.g. 123456',
};
export const bank_code = {
  name: 'bank_code',
  label: 'bank_code',
  placeholder: 'e.g. 12324',
};
export const branch_address = {
  name: 'branch_address',
  label: 'branch_address',
  type: 'location',
};
export const branch_code = {
  name: 'branch_code',
  label: 'branch_code',
  placeholder: 'e.g. 46589',
};
export const swift = {
  name: 'swift',
  label: 'swift',
  helper: 'swift_helper',
  placeholder: 'e.g. CTBAAU2S',
};
export const bic = {
  name: 'bic',
  label: 'bic',
  helper: 'bic_helper',
  placeholder: 'e.g. CTBAAU2S',
};
export const iban = {
  name: 'iban',
  label: 'iban',
  placeholder: 'e.g. PT50002700000001234567833',
  helper: 'iban_helper',
};

export const clabe = {
  name: 'clabe',
  label: 'clabe',
  placeholder: 'e.g. 123456789012345678',
};

export const owner_full_name = {
  name: 'owner_full_name',
  label: 'owner_full_name',
  title: 'Account holder name',
  placeholder: 'e.g. John Smith',
};

export const owner_first_name = {
  name: 'owner_first_name',
  label: 'owner_first_name',
  title: 'Account holder first name',
  placeholder: 'e.g. John',
};

export const owner_middle_name = {
  name: 'owner_middle_name',
  label: 'owner_middle_name',
  title: 'Account holder middle name',
  placeholder: 'e.g. Robert',
};

export const owner_last_name = {
  name: 'owner_last_name',
  label: 'owner_last_name',
  title: 'Account holder last name',
  placeholder: 'e.g. Smith',
};

export const owner_company_name = {
  name: 'owner_company_name',
  label: 'company_name',
  title: 'Company name',
  placeholder: 'e.g. Acme Corp',
};

export const owner_email = {
  name: 'owner_email_address',
  label: 'owner_email',
  title: 'Owner email',
  type: 'email',
  placeholder: 'e.g. john@example.com',
};

export const owner_phone = {
  name: 'owner_phone_number',
  label: 'owner_phone',
  title: 'Owner phone',
  type: 'mobile',
  placeholder: 'e.g. +1234567890',
};

export const owner_ein_tin = {
  name: 'owner_ein_tin',
  label: 'ein_tin',
  title: 'EIN/TIN',
  placeholder: 'e.g. 12-3456789',
};

export const owner_cpf_cpnj = {
  name: 'owner_cpf_cpnj',
  label: 'cpf_cpnj',
  title: 'CPF/CPNJ',
  placeholder: 'e.g. 123.456.789-00',
};

export const first_name = {
  name: 'first_name',
  label: 'first_name',
  validation: { required: false },
  placeholder: 'e.g. John',
};
export const last_name = {
  name: 'last_name',
  label: 'last_name',
  validation: { required: false },
  placeholder: 'e.g. Smith',
};
export const business_name = {
  name: 'business_name',
  label: 'business_name',
  validation: { required: true },
  placeholder: '',
};
export const username = {
  name: 'username',
  label: 'username',
  validation: { required: 'true' },
  placeholder: 'e.g. johnsmith88',
};
export const id_number = {
  name: 'id_number',
  type: 'id_number',
  label: 'id_number',
  // helper: 'SSN, Passport, BSN or ID number',
  validation: { length: 8, required: false },
  placeholder: 'e.g. 4001023456789',
};
export const birth_date = {
  name: 'birth_date',
  label: 'birth_date',
  type: 'date',
  inputProps: { disableFuture: true, initialFocusedDate: '1990-01-01' },
};
export const timezone = {
  name: 'timezone',
  label: 'timezone',
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
  label: 'mobile',
  type: 'mobile',
  helper: 'mobile_helper',
  validation: { required: true, validate: validateMobile },
  placeholder: 'e.g. +1821234567',
};
export const mobile_number = {
  name: 'number',
  label: 'mobile_number',
  type: 'mobile',
  helper: 'mobile_helper',
  validation: { required: true, validate: validateMobile },
  placeholder: 'e.g. +1821234567',
};
export const mobile_mfa = {
  name: 'number',
  label: 'mobile_number',
  type: 'mobile',
  helper: 'mobile_helper',
  validation: { required: true, validate: validateMobile },
  placeholder: 'e.g. +1821234567',
};
export const email = {
  name: 'email',
  label: 'email_address',
  type: 'email',
  validation: {
    required: true,
    pattern: { value: emailPattern, message: 'Please enter a valid email' },
  },
  enum: null,
  placeholder: 'e.g. hello@gmail.com',
};
export const password = {
  name: 'password',
  label: 'password',
  type: 'password',
  validation: { required: true, minLength: 8 },
};
export const password_new = {
  name: 'password-new',
  label: 'password',
  type: 'password-new',
  validation: { required: true, minLength: 8 },
};
export const old_password = {
  ...password,
  type: 'password-new',
  autoComplete: 'new-password',
  name: 'old_password',
  label: 'old_password',
  validation: { required: true, minLength: 8 },
};
export const new_password1 = {
  ...password,
  type: 'password-new',
  autoComplete: 'new-password',
  name: 'new_password1',
  label: 'new_password',
  validation: { required: true, minLength: 8 },
};
export const new_password2 = {
  ...password,
  type: 'password-new',
  autoComplete: 'new-password',
  name: 'new_password2',
  label: 'confirm_new_password',
  validation: {
    required: true,
    minLength: 8,
    validate: {
      matchesPassword: (value, { new_password1 }) =>
        new_password1 === value || 'Must match new password',
    },
  },
};
export const confirm_password = {
  ...password,
  name: 'confirm_password',
  label: 'confirm_password',
  validation: { required: true, minLength: 8 },
};
export const company = {
  name: 'company',
  label: 'company',
  validation: { required: 'true' },
  // helper: 'Start with a wallet',
  placeholder: 'app_id',
};
export const amount = {
  name: 'amount',
  label: 'amount',
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
  label: 'recipient',
  type: 'email',
  validation: { required: 'true' },
  placeholder: 'e.g. hello@gmail.com',
};
export const mobileRecipient = {
  name: 'recipient',
  label: 'recipient',
  type: 'mobile',
  // helper: 'mobile_helper, e.g. +1',
  placeholder: 'e.g. +1821234567',
};
export const cryptoRecipient = {
  name: 'recipient',
  label: 'recipient',
  helper: 'recipient_crypto_helper',
  multiline: true,
  placeholder: 'Enter a valid crypto wallet address',
};
export const cryptoAddress = {
  name: 'address',
  label: 'address',
  multiline: true,
  placeholder: 'e.g. GCFXHS4GXL6BVUCXBWXGTITROWLVYXQKQLF4...',
};
export const bitcoinAddress = {
  name: 'address',
  label: 'address',
  multiline: true,
  placeholder: 'e.g. GCFXHS4GXL6BVUCXBWXGTITROWLVYXQKQLF4...',
  validation: {
    required: true,
    validate: value => validateCryptoBool(value, 'bitcoin'),
  },
};
export const bitcoinTestnetAddress = {
  name: 'address',
  label: 'bitcoin_testnet_address',
  multiline: true,
  placeholder: 'e.g. GCFXHS4GXL6BVUCXBWXGTITROWLVYXQKQLF4...',
  validation: {
    required: true,
    validate: value => validateCryptoBool(value, 'bitcoin', true),
  },
};
export const stellarAddress = {
  name: 'address',
  label: 'address',
  multiline: true,
  placeholder: 'e.g. GCFXHS4GXL6BVUCXBWXGTITROWLVYXQKQLF4...',
  validation: {
    required: true,
    minLength: 56,
    maxLength: 56,
    validate: value => validateCryptoBool(value, 'stellar'),
  },
};
export const stellarTestnetAddress = {
  name: 'address',
  label: 'address',
  multiline: true,
  placeholder: 'e.g. GCFXHS4GXL6BVUCXBWXGTITROWLVYXQKQLF4...',
  validation: {
    required: true,
    minLength: 56,
    maxLength: 56,
    validate: value => validateCryptoBool(value, 'stellar', true),
  },
};
export const stellarFederationAddress = {
  name: 'address',
  label: 'federation_address',
  multiline: true,
  placeholder: 'e.g. test*stellar',
  validation: {
    required: true,
    validate: value => validateCryptoBool(value, 'stellar', true),
  },
};
export const stellarAddressType = {
  name: 'stellarAddressType',
  label: 'address_type',
  variant: 'select',
  responsive: true,
  options: [
    { value: 'public', label: 'public_address_memo' },
    { value: 'federation', label: 'federation_address' },
  ],
};

export const testnetSelector = {
  name: 'network',
  label: 'network',
  variant: 'select',
  options: [
    { value: 'mainnet', label: 'Mainnet' },
    { value: 'testnet', label: 'Testnet' },
  ],
};
export const ethereumAddress = {
  name: 'address',
  label: 'address',
  multiline: true,
  placeholder: 'e.g. 0x3826539Cbd8d68DCF119e80B994557B427...',
  validation: {
    required: true,
    validate: value => validateCryptoBool(value, 'ethereum'),
  },
};
export const ethereumTestnetAddress = {
  name: 'address',
  label: 'ethereum_testnet_address',
  multiline: true,
  placeholder: 'e.g. 0x3826539Cbd8d68DCF119e80B994557B427...',
  validation: {
    required: true,
    validate: value => validateCryptoBool(value, 'ethereum'),
  },
};
export const note = {
  name: 'note',
  label: 'note',
  placeholder: 'e.g. Payment',
};
export const memo = {
  name: 'memo',
  label: 'memo',
  placeholder: 'e.g. 8DLYX2LBKP',
  validation: {
    maxLength: 28,
    required: true,
  },
  // validation: ({ watch, context }) => {
  //   const values = watch();
  //   // const { memoSkip, address } = values;

  //   // const { results = [] } = context;
  //   // const requiresMemo =
  //   //   results.find(item => item.public_address === address)?.requires_memo ??
  //   //   false;

  //   return {
  //     maxLength: 28,
  //     required: true,
  //     // validate: value =>
  //     //   memoSkip || value
  //     //     ? true
  //     //     : 'Must include memo', //'This third party exchange wallet requires a memo, sometimes referred to as a tag or reference. Failing to include this could result in a delay of up to 10 days while we confirm your identity.'
  //   };
  // },
};

export const memoSkipInfo = {
  type: 'message',
  variant: 'warning',
  message: `This is a third party wallet or exchange that requires a memo, sometimes referred to as a tag or reference. Failing to provide the correct memo could result in losing your funds or a significant delay from the third party while they confirm your identity before they allocate the funds to your account.`,
};

export const currency = {
  name: 'currency',
  label: 'currency',
  type: 'currencySelector',
};
export const federationAddress = {
  name: 'federationAddress',
  label: 'federation_address_username',
  helper: 'federation_address_helper',
};
export const federationAddressAccount = {
  name: 'federationAddress',
  label: 'featured_stellar_address',
  helper: 'federation_address_helper',
};
export const displayCurrency = {
  name: 'displayCurrency',
  label: 'displayCurrency',
  placeholder: 'display_currency_placeholder',
  type: 'displayCurrency',
};
export const primaryCurrency = {
  name: 'primaryCurrency',
  label: 'primaryCurrency',
  placeholder: 'display_primary_placeholder',
  type: 'primaryCurrency',
  validation: { required: true },
};
export const otp = {
  name: 'otp',
  label: 'otp',
  type: 'pin',
  validation: { required: true, minLength: 5 },
  length: 6,
};
export const terms = {
  name: 'terms',
  label: 'terms',
  type: 'checkbox',
};
export const memoSkip = {
  name: 'memo_skip_transaction_label',
  label: 'memo_skip_transaction_label',
  type: 'checkbox',
};
export const memoSkipAccount = {
  name: 'memo_skip_transaction_label',
  label: 'memo_skip_account_label',
  type: 'checkbox',
};
export const merchant = {
  name: 'merchant',
  label: 'merchant',
  description: 'merchant_register_description',
  type: 'switch',
};
export const description = {
  name: 'description',
  label: 'description',
  multiline: true,
  rows: 5,
  rowsMax: 5,
  // type: 'multiline',
};
export const customerEmail = {
  name: 'email',
  label: 'customer_email',
  type: 'email',
};

export const deleteAccountEmail = {
  name: 'email',
  label: '',
  type: 'email',
  validation: {
    required: true,
    pattern: { value: emailPattern, message: 'Please enter a valid email' },
  },
  enum: null,
  placeholder: 'Email address',
};

export const companyName = {
  name: 'company',
  label: '',
  type: 'text',
  validation: {
    required: true,
  },
  placeholder: 'Company',
};

export const amountSimple = {
  name: 'amount',
  label: 'amount',
  type: 'number',
};

export const buy = {
  name: 'buy',
  label: 'buy',
  placeholder: '0.00',
  type: 'number',
};
export const sell = {
  name: 'sell',
  label: 'sell',
  placeholder: '0.00',
  type: 'number',
};

export const exchangeCurrency = {
  name: 'currency',
  label: 'for_currency',
  type: 'currencySelector',
};

export const currencies = {
  name: 'currencies',
  label: 'currencies',
  type: 'currencies',
};

export const voucher_code = {
  name: 'voucher_code',
  label: 'voucher_code',
  placeholder: 'voucher_placeholder',
  helper: 'voucher_helper',
};

const metadata = {
  label: 'metadata',
  name: 'metadata',
  type: 'json',
  multiline: true,
  rows: 8,
};

const due_delay = {
  label: 'payment_due',
  name: 'due_delay',
  type: 'number',
};

const send_request_on = {
  name: 'send_request_on',
  label: 'send_invoice_on',
  // id: 'metadata',
  type: 'date',
};

const send_reminders = {
  name: 'send_reminders',
  label: 'send_reminders',
  type: 'switch',
};

const invoiceReference = {
  label: 'invoice_reference',
  name: 'request_reference',
};

export {
  metadata,
  due_delay,
  send_request_on,
  send_reminders,
  invoiceReference,
  // ...invoices,
};

export const file_upload = {
  name: 'file_upload',
  label: 'file_upload',
  buttonText: 'UPLOAD',
  placeholder: 'Select files to upload',
};

export const single_upload = {
  name: 'file_upload',
  label: 'file_upload',
  type: 'upload',
};

export const vat_number = {
  name: 'vat_number',
  label: 'vat_number',
  validation: { required: true },
};

export const token_duration = {
  name: 'duration',
  label: 'duration',
  // placeholder: 'Duration in seconds',
  helper: 'In seconds eg. 300, use 0 for permanent token',
};

export const url = {
  name: 'url',
  label: 'url',
  validation: { required: true, pattern: urlPattern },
};

export const secret = {
  name: 'secret',
  label: 'secret',
  validation: { required: true },
};
export const event = {
  name: 'event',
  label: 'event',
  type: 'autocomplete',
  options: eventOptions,
  validation: { required: true },
};

export const business_currency = {
  name: 'currency',
  label: 'invoice_currency',
  helper: 'invoice_currency_helper',
  type: 'dropdown',
  options: [],
  validation: { required: true },
};

export const referral = {
  name: 'referral_code',
  label: 'referral_code',
};

export const fathers_name = {
  name: 'fathers_name',
  label: 'fathers_name',
};

export const mothers_name = {
  name: 'mothers_name',
  label: 'mothers_name',
};

export const grandmothers_name = {
  name: 'grandmothers_name',
  label: 'grandmothers_name',
};

export const grandfathers_name = {
  name: 'grandfathers_name',
  label: 'grandfathers_name',
};

export const gender = {
  name: 'gender',
  label: 'gender',
  type: 'autocomplete',
  options: genderOptions,
};

export const marital_status = {
  name: 'marital_status',
  label: 'marital_status',
  type: 'autocomplete',
  options: maritalOptions,
};

export const title = {
  name: 'title',
  label: 'title',
  type: 'autocomplete',
  options: titleOptions,
};

export const central_bank_number = {
  name: 'central_bank_number',
  label: 'central_bank_number',
};

export const role = {
  name: 'role',
  label: 'role',
  validation: { required: true },
};

export const identificationDocuments = {
  name: 'identificationDocuments',
  label: 'id_type',
  type: 'autocomplete',
  options: document_categories.proof_of_identity.options.map(x => {
    return {
      label: x.label,
      value: x.id,
      key: x.id,
    };
  }),
};

export const routing_number = {
  name: 'routing_number',
  label: 'routing_number',
  placeholder: 'e.g. 021000021',
};

export const beneficiary_type = {
  name: 'beneficiary_type',
  label: 'beneficiary_type',
  placeholder: 'e.g. individual',
};

export const owner = {
  name: 'owner',
  label: 'owner',
  type: 'object',
};

export const residency = {
  name: 'residency',
  label: 'Country of Residence',
  type: 'country',
  placeholder: 'Select your country of residence',
};
