const email = {
  label: 'email',
  name: 'email',
  type: 'email',
  validation: { required: true },
};

const mobile = {
  label: 'mobile',
  name: 'mobile',
  type: 'mobile',
};

const fullName = {
  name: 'name',
  label: 'Full name',
  // validation: { required: true },
};

const paymentProcessorCurrency = {
  label: 'payment_processor_currency',
  name: 'payment_processor_currency',
  type: 'payment_processor_currency',
  options: [],
  validation: { required: true }
};

const contactMethod = {
  label: 'contact_method',
  name: 'contact_method',
  type: 'contact_method',
  validation: { required: true }
};

const paymentMethod = {
  name: 'payment_method',
  label: 'payment_method',
  type: 'payment_method',
  options: [],
};

const walletMethod = {
  label: '',
  name: 'wallet_method',
  options: [
    { value: 'scan', label: 'payment_option_scan_to_pay' },
    { value: 'login', label: 'payment_option_login_to_pay' },
  ],
};

export { email, mobile, fullName, paymentMethod, walletMethod, paymentProcessorCurrency, contactMethod };
