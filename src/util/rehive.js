/* eslint-disable no-throw-literal */
import Rehive from 'rehive';
import { isEmpty, keyBy } from 'lodash';
import { convertToFormData } from './methods';
import {
  generateQueryString,
  getUserGroup,
  paramsToSearch,
} from 'util/general';
import { getEnvVar } from '../utils/env';
export const staging = false;
export let servicesInit = false;

export let rehive_base_url = getEnvVar('VITE_REHIVE_API_URL');
export let stellar_service_url = '';
export let stellar_testnet_service_url = '';
export let bitcoin_service_url = '';
export let bitcoin_testnet_service_url = '';
export let ethereum_service_url = '';
export let ethereum_testnet_service_url = '';
export let rewards_service_url = '';
export let product_service_url = '';
export let conversion_service_url = '';
export let mass_send_service_url = '';
export let notification_service_url = '';
export let lightning_service_url = '';
export let stripe_service_url = '';
export let chipless_card_service_url = '';
export let payment_request_service_url =
  'https://payment-requests.services.rehive.com/api';
export let business_service_url = '';
export let app_service_url = getEnvVar('VITE_APP_EXTENSION_API_URL');
export let bridge_service_url = '';

export let google_places_details = 'https://europe-west1-rehive-services.cloudfunctions.net/places-details';
export let google_places_predictions =
  'https://europe-west1-rehive-services.cloudfunctions.net/places-autocomplete';

// SDK initialization
export let r = null;
export let token = '';

export const initWithoutToken = () => {
  if (r) {
    r.removeToken();
  } else {
    r = new Rehive({
      apiVersion: 3,
      storageMethod: 'session',
      customAPIURL: rehive_base_url + '/',
    });
  }
  token = '';
};

export const initWithToken = apiToken => {
  r = new Rehive({
    apiVersion: 3,
    apiToken,
    storageMethod: 'session',
    customAPIURL: rehive_base_url + '/',
  });
  token = apiToken;
};

export const verifyToken = token =>
  callApi('GET', rehive_base_url + '/auth/', null, { customToken: token });

/* PUBLIC */
export const getPublicCompanies = () => r.public.companies.get();

const serviceUrlFormatter = url => {
  return url ? (url.endsWith('/') ? url.slice(0, -1) : url) : '';
};

export const getPublicCompany = async (company, doThrow) => {
  const response = await callApi(
    'GET',
    `${rehive_base_url}/public/companies/${company}/`,
    null,
    {
      doThrow,
    },
  );
  if (response?.data?.services?.length) {
    const services = keyBy(response?.data?.services, 'slug');
    stellar_service_url = serviceUrlFormatter(services.stellar_service?.url);
    stellar_testnet_service_url = serviceUrlFormatter(
      services.stellar_testnet_service?.url,
    );
    bitcoin_service_url = serviceUrlFormatter(services.bitcoin_service?.url); // need confirmation
    bitcoin_testnet_service_url = serviceUrlFormatter(
      services.bitcoin_testnet_service?.url,
    ); // need confirmation
    ethereum_service_url = serviceUrlFormatter(services.ethereum_service?.url); // need confirmation
    ethereum_testnet_service_url = serviceUrlFormatter(
      services.ethereum_testnet_service?.url,
    ); // need confirmation

    rewards_service_url = serviceUrlFormatter(services.rewards_service?.url);
    product_service_url = serviceUrlFormatter(services.product_service?.url);
    conversion_service_url = serviceUrlFormatter(
      services.conversion_service?.url,
    );
    mass_send_service_url = serviceUrlFormatter(
      services.batch_send_service?.url,
    );
    notification_service_url = serviceUrlFormatter(
      services.notifications_service?.url,
    );
    app_service_url = serviceUrlFormatter(services.app_service?.url);
    payment_request_service_url = serviceUrlFormatter(
      services.payment_requests_service?.url,
    );
    business_service_url = serviceUrlFormatter(services.business_service?.url);

    bridge_service_url = serviceUrlFormatter(services.bridge_service?.url);
  }
  servicesInit = true;
  return response;
};

export const getPublicCompanyGroups = (company, doThrow) =>
  callApi(
    'GET',
    rehive_base_url + '/public/companies/' + company + '/groups/',
    null,
    {
      doThrow,
    },
  );

export const getPublicCompanyGroup = (company, group) =>
  callApi(
    'GET',
    rehive_base_url + '/public/companies/' + company + '/groups/' + group + '/',
  );

export const getCompanyCurrencies = () => r.company.currencies.get();

export const getCompanyBankAccounts = () => r.company.bankAccounts.get();

/* AUTHENTICATION */
export const login = data => r.auth.login(data); //{ ...data, session_duration: 10 }

export const register = data => r.auth.register(data);

export const logout = () => r.auth.logout();

export const resendEmailVerification = (email, company) =>
  r.auth.email.resendEmailVerification({ email, company });

export const resendMobileVerification = (mobile, company) =>
  r.auth.mobile.resendMobileVerification({ mobile, company });

export const resetPassword = data => r.auth.password.reset(data);

export const changePassword = data => r.auth.password.change(data);

export const submitOTP = otp => r.auth.mobile.verify({ otp });

export const verifyEmail = key => r.auth.email.verify({ key });

export const getUserTokens = () =>
  callApi('GET', rehive_base_url + '/auth/tokens/');

export const createUserToken = data =>
  callApi('POST', rehive_base_url + '/auth/tokens/', data);

export const deleteUserToken = id =>
  callApi('DELETE', rehive_base_url + '/auth/tokens/' + id + '/');

/* MULTI FACTOR AUTHENTICATION */
export const getMFA = () => r.auth.mfa.status.get();

export const enableAuthSMS = mobile => r.auth.mfa.sms.enable({ mobile });

export const disableAuthSMS = () => r.auth.mfa.sms.disable();

export const enableAuthToken = () => r.auth.mfa.token.enable();

export const disableAuthToken = () => r.auth.mfa.token.disable();

export const verifyMFA = (payload, customToken) =>
  callApi('POST', rehive_base_url + '/auth/mfa/verify/', payload, {
    customToken,
  });

// Start - NEW MFA helper method added

export const getMFAAuthenticators = (query = '') =>
  // @param query // example: verified=1
  // alternate to getMFA
  callApi('GET', `${rehive_base_url}/auth/mfa/authenticators/?${query}`);

export const createMFAAuthenticator = (type, details = {}) => {
  // alternate to enableSMS, enableToken
  // type: "totp", "sms", "static"

  const payload = { type, details };
  return callApi(
    'POST',
    rehive_base_url + '/auth/mfa/authenticators/',
    payload,
    { doThrow: true },
  );
};

export const deleteMfaAuthenticator = identifier =>
  // alternate to disable sms/token
  callApi(
    'DELETE',
    `${rehive_base_url}/auth/mfa/authenticators/${identifier}/`,
  );

export const deliverTokenForMFA = payload => {
  // alternate to sendAuthSMS
  return callApi('POST', rehive_base_url + '/auth/mfa/deliver/', payload);
};

// End - NEW MFA helper method added

export const resetPasswordConfirm = data => r.auth.password.resetConfirm(data);

/* USERS */
// Profile
export const getProfile = () => r.user.get();

export const updateProfile = data => r.user.update(data);

export const updateProfileImage = file => {
  let formData = new FormData();
  formData.append('profile', file);
  return r.user.update(formData);
};

// Address
export const getAddresses = id => r.user.addresses.get(id);

export const createAddress = data => r.user.addresses.create(data);

export const updateAddress = data => r.user.addresses.update(data);

export const deleteAddress = id => r.user.addresses.delete(id);

// Bank Accounts
export const getBankAccounts = id => r.user.bankAccounts.get(id);
export const getBankAccountsByFilter = (filter = '') =>
  callApi('GET', `${rehive_base_url}/user/bank-accounts/?${filter}`);

export const getBankAccount = id => r.user.bankAccounts.get(id);

export const createBankAccount = data => r.user.bankAccounts.create(data);

export const updateBankAccount = (id, data) =>
  r.user.bankAccounts.update(id, data);

export const deleteBankAccount = id => r.user.bankAccounts.delete(id);

export const addBankAccountCurrency = (id, currency) =>
  callApi(
    'POST',
    rehive_base_url + '/user/bank-accounts/' + id + '/currencies/',
    { currency },
  );

export const deleteBankAccountCurrency = (id, currency) =>
  callApi(
    'DELETE',
    rehive_base_url +
      '/user/bank-accounts/' +
      id +
      '/currencies/' +
      currency +
      '/',
  );

// Crypto Accounts
export const getCryptoAccounts = id => r.user.cryptoAccounts.get(id);

export const createCryptoAccount = data => r.user.cryptoAccounts.create(data);

export const updateCryptoAccount = (id, data) =>
  r.user.cryptoAccounts.update(id, data);

export const deleteCryptoAccount = id => r.user.cryptoAccounts.delete(id);

// Documents
export const getDocuments = id => r.user.documents.get(id);

export const createDocument = (file, category, type, metadata) => {
  let formDataArray = [
    { key: 'file', value: file },
    { key: 'document_category', value: category },
    { key: 'document_type', value: type },
  ];

  if (!isEmpty(metadata))
    formDataArray.push({ key: 'metadata', value: metadata });

  let formData = convertToFormData(formDataArray);
  return r.user.documents.create(formData);
};

export const createDocumentNew = ({ file, type, metadata }) => {
  let data = [
    { key: 'file', value: file },
    { key: 'document_type', value: type },
  ];

  if (metadata) data.push({ key: 'metadata', value: JSON.stringify(metadata) });
  return r.user.documents.create(convertToFormData(data));
};

export const createDocumentWithType = ({ file, type, metadata }) => {
  let data = [
    { key: 'file', value: file },
    { key: 'type', value: type },
  ];

  if (metadata) data.push({ key: 'metadata', value: JSON.stringify(metadata) });
  return r.user.documents.create(convertToFormData(data));
};

// Emails
export const getEmails = id => r.user.emails.get(id);

export const createEmail = data => r.user.emails.create(data);

export const updateEmail = (id, data) => r.user.emails.update(id, data);

export const deleteEmail = id => r.user.emails.delete(id);

// Mobiles
export const getMobiles = id => r.user.mobiles.get(id);

export const updateMobile = (id, data) => r.user.mobiles.update(id, data);

export const createMobile = data => r.user.mobiles.create(data);

export const deleteMobile = id => r.user.mobiles.delete(id);

/* TRANSACTIONS */
export const getTransactions = (filters = {}) =>
  r.transactions.get({ filters });

export const getNextTransactions = filters =>
  r.transactions.getNext({ filters });

export const getTransactionCollections = filters =>
  r.transaction_collections.get({ filters });

export const getNextTransactionCollections = filters =>
  r.transaction_collections.getNext({ filters });

export const createCredit = (amount, currency) =>
  r.transactions.createCredit({
    amount: parseInt(amount, 0),
    currency,
  });

export const createDebit = data => r.transactions.createDebit(data);

export const createTransfer = data => r.transactions.createTransfer(data);

export const createTransactionCollection = transactions =>
  r.transaction_collections.create({ transactions });

export const getTransactionMessages = id =>
  callApi('GET', `${rehive_base_url}/transactions/${id}/messages/`);

export const getSubtypes = () => callApi('GET', rehive_base_url + '/subtypes/');

export const getExports = (resource, page) =>
  callApi(
    'GET',
    rehive_base_url +
      '/exports/?resource=' +
      resource +
      '&page_size=5' +
      (page ? '&page=' + page : ''),
  );

export const getExport = id =>
  callApi('GET', rehive_base_url + '/exports/' + id + '/');

export const createExport = (resource, query, file_format) => {
  const data = { resource, query, file_format };
  return callApi('POST', rehive_base_url + '/exports/', data);
};

/* STATEMENTS */
export const createStatement = (data) => {
  return callApi('POST', rehive_base_url + '/statements/', data);
};

export const getStatements = (page) =>
  callApi(
    'GET',
    rehive_base_url +
      '/statements/' +
      (page ? '?page=' + page : ''),
  );

export const getStatement = (identifier) =>
  callApi('GET', rehive_base_url + '/statements/' + identifier + '/');

export const deleteStatement = (identifier) =>
  callApi('DELETE', rehive_base_url + '/statements/' + identifier + '/');

/* BUSINESS SERVICE */
export const getBusinessUsers = (businessId, search = '') =>
  callApi(
    'GET',
    business_service_url +
      '/manager/businesses/' +
      businessId +
      '/users/' +
      search,
  );

export const getBusinessUser = (businessId, userId) =>
  callApi(
    'GET',
    business_service_url +
      '/manager/businesses/' +
      businessId +
      '/users/' +
      userId +
      '/',
  );
export const editBusinessUser = (businessId, userId, data) =>
  callApi(
    'PATCH',
    business_service_url +
      '/manager/businesses/' +
      businessId +
      '/users/' +
      userId +
      '/',
    data,
  );

export const createBusinessUser = (businessId, data) =>
  callApi(
    'POST',
    business_service_url + '/manager/businesses/' + businessId + '/users/',
    data,
  );

export const getBusinessInvoices = (businessId, search = '', doThrow) =>
  callApi(
    'GET',
    business_service_url +
      '/manager/businesses/' +
      businessId +
      '/invoices/' +
      search,
    null,
    { doThrow },
  );

export const getBusinessInvoice = (businessId, invoiceId, doThrow) =>
  callApi(
    'GET',
    business_service_url +
      '/manager/businesses/' +
      businessId +
      '/invoices/' +
      invoiceId +
      '/',
    null,
    { doThrow },
  );

export const updateBusinessInvoice = (businessId, invoiceId, data) =>
  callApi(
    'PATCH',
    business_service_url +
      '/manager/businesses/' +
      businessId +
      '/invoices/' +
      invoiceId +
      '/',
    data,
  );
export const notifyInvoice = invoiceId =>
  callApi(
    'POST',
    payment_request_service_url + '/user/requests/' + invoiceId + '/notify/',
  );

export const createBusinessInvoice = (businessId, data) =>
  callApi(
    'POST',
    business_service_url + '/manager/businesses/' + businessId + '/invoices/',
    data,
  );

export const getBusinessTransactions = (businessId, search = '') =>
  callApi(
    'GET',
    business_service_url +
      '/manager/businesses/' +
      businessId +
      '/transactions/' +
      search,
  );

export const getBusinessTransaction = (businessId, transactionId) =>
  callApi(
    'GET',
    business_service_url +
      '/manager/businesses/' +
      businessId +
      '/transactions/' +
      transactionId +
      '/',
  );

export const getBusinessInvoiceLogs = (businessId, invoiceId, search = '') =>
  callApi(
    'GET',
    business_service_url +
      '/manager/businesses/' +
      businessId +
      '/invoices/' +
      invoiceId +
      '/logs/' +
      search,
  );

export const getBusinessServiceSettings = (doThrow = true) =>
  callApi('GET', business_service_url + '/user/company/', null, { doThrow });

export const getBusinessProfile = businessId =>
  callApi(
    'GET',
    business_service_url + '/manager/businesses/' + businessId + '/',
  );
export const getBusinesses = (doThrow = false) =>
  callApi('GET', business_service_url + '/manager/businesses/', null, {
    doThrow,
  });

export const updateBusinessProfile = (businessId, data, is_file) =>
  callApi(
    'PATCH',
    business_service_url + '/manager/businesses/' + businessId + '/',
    data,
    { is_file },
  );
export const createBusinessProfile = data =>
  callApi('POST', business_service_url + '/manager/businesses/', data);

export const updateBusinessCategories = (businessId, data) =>
  callApi(
    'POST',
    business_service_url + '/manager/businesses/' + businessId + '/categories/',
    data,
  );
export const deleteBusinessCategory = (businessId, categoryId) =>
  callApi(
    'DELETE',
    business_service_url +
      '/manager/businesses/' +
      businessId +
      '/categories/' +
      categoryId +
      '/',
  );

export const getBusinessCategories = () =>
  callApi(
    'GET',
    business_service_url + '/manager/business-categories/?page_size=250',
    null,
    {
      doThrow: true,
    },
  );

export const createBusinessPayout = (businessId, data) =>
  callApi(
    'POST',
    business_service_url + '/manager/businesses/' + businessId + '/payouts/',
    data,
  );

export const getBusinessPayouts = (businessId, search = '') =>
  callApi(
    'GET',
    business_service_url +
      '/manager/businesses/' +
      businessId +
      '/payouts/' +
      search,
  );

export const getBusinessPayout = (businessId, payoutId) =>
  callApi(
    'GET',
    business_service_url +
      '/manager/businesses/' +
      businessId +
      '/payouts/' +
      payoutId +
      '/',
  );

export const getBusinessPayoutTransactions = (businessId, payoutId) =>
  callApi(
    'GET',
    business_service_url +
      '/manager/businesses/' +
      businessId +
      '/payouts/' +
      payoutId +
      '/transactions/',
  );

export const getBusinessDocuments = ({ businessId }) =>
  callApi(
    'GET',
    `${business_service_url}/manager/businesses/${businessId}/documents/`,
  );

export const createBusinessDocument = ({
  businessId,
  file,
  type,
  metadata,
}) => {
  let data = [
    { key: 'file', value: file },
    { key: 'type', value: type },
  ];

  if (metadata) data.push({ key: 'metadata', value: JSON.stringify(metadata) });

  return callApi(
    'POST',
    `${business_service_url}/manager/businesses/${businessId}/documents/`,
    convertToFormData(data),
    {
      is_file: true,
    },
  );
};

export const createInvoiceRefund = (businessId, invoiceId, data) =>
  callApi(
    'POST',
    business_service_url +
      '/manager/businesses/' +
      businessId +
      '/invoices/' +
      invoiceId +
      '/refunds/',
    data,
  );

export const getInvoiceRefunds = (businessId, invoiceId, doThrow) =>
  callApi(
    'GET',
    business_service_url +
      '/manager/businesses/' +
      businessId +
      '/invoices/' +
      invoiceId +
      '/refunds/',
    null,
    { doThrow },
  );

/* ACCOUNTS */
export const getAccounts = () => r.accounts.get();

export const getTier = (group, doThrow) => {
  return callApi(
    'GET',
    rehive_base_url + '/groups/' + group + '/tiers/?active=true',
    null,
    { doThrow },
  );
};

export const getTiers = (group, doThrow) => {
  if (!group) {
    return Promise.resolve({ status: 'success', data: { results: [] } });
  }

  return callApi('GET', rehive_base_url + '/groups/' + group + '/tiers/', null, {
    doThrow,
  }).then(response => {
    if (response?.status === 'error') {
      throw response;
    }
    return response;
  }).catch(error => {
    throw error;
  });
};

export const getTierRequirements = (group, tier) =>
  callApi(
    'GET',
    rehive_base_url + '/groups/' + group + '/tiers/' + tier + '/requirements/',
  );

export const getTierRequirementSets = (group, tierId) =>
  r.groups.tiers.requirementSets.get(group, tierId);

// export const getDocumentTypes = () => r.documentTypes.get();

// export const getDocumentTypes = (pageSize = 100, doThrow = true) =>
//   callApi(
//     'GET',
//     `${rehive_base_url}/document-types/?page_size=${pageSize}`,
//     null,
//     {
//       doThrow,
//     },
//   );

export const getDocumentTypes = async (pageSize = 50, doThrow = true) => {
  let results = [];
  let page = 1;
  let hasMorePages = true;
  const maxApiCall = 5;

  // Initializing the data object with default values
  const data = {
    count: 0,
    next: null,
    previous: null,
    results: [],
  };

  while (hasMorePages && page <= maxApiCall) {
    const response = await callApi(
      'GET',
      `${rehive_base_url}/document-types/?page_size=${pageSize}&page=${page}`,
      null,
      {
        doThrow,
      },
    );

    // Accumulating results from each page
    results = [...results, ...response.results];

    data.count = response.count;

    if (response?.next) {
      page += 1;
    } else {
      hasMorePages = false;
    }
  }

  data.results = results;
  return data;
};

export const getGroupFees = group =>
  callApi('GET', rehive_base_url + '/groups/' + group + '/fees/');
export const getTierFees = (group, tier_id) =>
  callApi(
    'GET',
    rehive_base_url + '/groups/' + group + '/tiers/' + tier_id + '/fees/',
  );

export const getTierLimits = (group, tier_id) =>
  callApi(
    'GET',
    rehive_base_url + '/groups/' + group + '/tiers/' + tier_id + '/limits/',
  );

// Create, retrieve, currencies?

export const setActiveCurrency = (reference, currencyCode) =>
  r.accounts.currencies.update(reference, currencyCode, { active: true });

export const getProductServiceSettings = (doThrow = true) =>
  callApi('GET', product_service_url + '/user/company/', null, { doThrow });

export const fetchCurrencyDetail = (accountRef, code, doThrow = true) =>
  callApi(
    'GET',
    `${rehive_base_url}/accounts/${accountRef}/currencies/${code}/`,
    null,
    {
      doThrow,
    },
  );

/* COMPANY */
export const getCompany = () => r.company.get();

/* METRICS */
export const getMetrics = businessId =>
  callApi(
    'GET',
    business_service_url + '/manager/businesses/' + businessId + '/metrics/',
  );

export const getMetric = (businessId, metricId) =>
  callApi(
    'GET',
    business_service_url +
      '/manager/businesses/' +
      businessId +
      '/metrics/' +
      metricId +
      '/',
  );

export const getMetricPoints = (businessId, metricId, filters = '') =>
  callApi(
    'GET',
    business_service_url +
      '/manager/businesses/' +
      businessId +
      '/metrics/' +
      metricId +
      '/points/' +
      filters,
  );

/* STRIPE */
export const setupStripeSession = data =>
  callApi('POST', stripe_service_url + '/user/sessions/', {
    mode: 'setup',
    ...data,
  });

export const makeStripePayment = data =>
  callApi('POST', stripe_service_url + '/user/payments/', data);

export const getStripePayment = id =>
  callApi('GET', stripe_service_url + '/user/payments/' + id + '/');

export const getStripeUser = () =>
  callApi('GET', stripe_service_url + '/user/');

export const getStripePaymentMethods = () =>
  callApi('GET', stripe_service_url + '/user/payment-methods/');

export const getStripeSessionStatus = id =>
  callApi('GET', stripe_service_url + '/user/session/' + id + '/');

export const getStripeCompany = () =>
  callApi('GET', stripe_service_url + '/user/company/');


/* CRYPTO */
export const getStellarAssets = testnet =>
  callApi(
    'GET',
    (testnet ? stellar_testnet_service_url : stellar_service_url) +
      '/company/assets/',
  );

export const getStellarCompany = testnet =>
  callApi(
    'GET',
    (testnet ? stellar_testnet_service_url : stellar_service_url) + '/company/',
  );

export const setStellarUsername = (data, testnet) =>
  callApi(
    'PATCH',
    (testnet ? stellar_testnet_service_url : stellar_service_url) + '/user/',
    data,
  );
export const getStellarKnownPublicAddresses = testnet =>
  callApi(
    'GET',
    (testnet ? stellar_testnet_service_url : stellar_service_url) +
      '/user/known-public-addresses/',
  );

export const getCryptoUser = type => {
  let url = '';
  switch (type) {
    case 'TXBT':
      url = bitcoin_testnet_service_url;
      break;
    case 'XBT':
      url = bitcoin_service_url;
      break;
    case 'TETH':
      url = ethereum_testnet_service_url;
      break;
    case 'ETH':
      url = ethereum_service_url;
      break;
    case 'TXLM':
      url = stellar_testnet_service_url;
      break;
    default:
      url = stellar_service_url;
      break;
  }
  return callApi('GET', url + '/user/');
};

export const getBitcoinCompany = testnet =>
  callApi(
    'GET',
    (testnet ? bitcoin_testnet_service_url : bitcoin_service_url) + '/company/',
  );

export const createCryptoTransfer = (data, cryptoMetadata) => {
  const url = `${
    cryptoMetadata.network === 'mainnet'
      ? stellar_service_url
      : stellar_testnet_service_url
  }/transactions/send/`;

  delete data.crypto;
  return new Promise((resolve, reject) =>
    callApi('POST', url, data)
      .then(response => {
        if (response.ok || response.status === 'success') {
          resolve(response);
        } else {
          reject(response);
        }
      })
      .catch(err => reject(err)),
  );
};

/* SEP-24 */
export const validateSep24SessionToken = (company, token, testnet) =>
  callApi(
    'POST',
    (testnet ? stellar_testnet_service_url : stellar_service_url) +
      '/user/anchor/' +
      company +
      '/auth/',
    null,
    {
      customToken: token,
    },
  );

export const validateInternalSep24Session = (session_id, testnet) =>
  callApi(
    'POST',
    (testnet ? stellar_testnet_service_url : stellar_service_url) +
      '/user/anchor/sessions/' +
      session_id +
      '/validate/',
    null,
  );

export const updateSEP24Transaction = (transaction_id, data, testnet) =>
  callApi(
    'PATCH',
    (testnet ? stellar_testnet_service_url : stellar_service_url) +
      '/user/anchor/transactions/' +
      transaction_id +
      '/',
    data,
  );

export const getSEP24Transaction = (transaction_id, testnet) =>
  callApi(
    'GET',
    (testnet ? stellar_testnet_service_url : stellar_service_url) +
      '/user/anchor/transactions/' +
      transaction_id +
      '/',
  );

/* PAYMENT REQUESTING */
export const createPaymentRequest = data =>
  callApi('POST', payment_request_service_url + '/user/requests/', data);

export const updatePaymentRequest = (id, data) =>
  callApi('PATCH', payment_request_service_url + '/requests/' + id + '/', {
    ...data,
  });

export const cancelPaymentRequest = (id, { incoming = false }) =>
  callApi(
    'PATCH',
    payment_request_service_url +
      `${incoming ? '' : '/user'}/requests/` +
      id +
      '/',
    {
      status: 'cancelled',
    },
  );

export const getPaymentRequests = (filters, doThrow) =>
  callApi(
    'GET',
    `${payment_request_service_url}/user/requests/${generateQueryString(
      filters,
      null,
      { doThrow },
    )}`,
  );

export const getNextPaymentRequests = url => callApi('GET', url);

export const getReceivedPaymentRequests = filters =>
  callApi(
    'GET',
    `${payment_request_service_url}/user/requests/${generateQueryString({
      ...filters,
      request_type: 'payer',
    })}`,
  );

export const getPaymentRequest = (id, doThrow) =>
  callApi('GET', payment_request_service_url + '/requests/' + id + '/', null, {
    doThrow,
  });

export const notifyPaymentRequest = id =>
  callApi(
    'POST',
    payment_request_service_url + '/user/requests/' + id + '/notify/',
  );

export const getPaymentRequestMethods = id =>
  callApi(
    'GET',
    payment_request_service_url + '/requests/' + id + '/payment_processors/',
  );

export const choosePaymentRequestMethod = (id, data) =>
  callApi('PATCH', payment_request_service_url + '/requests/' + id + '/', data);

export const verifyPaymentRequestChallenge = (id, data) =>
  callApi(
    'POST',
    payment_request_service_url + '/requests/' + id + '/otp_challenge/',
    data,
  );

export const getPaymentRequestTransactions = (id, search = '', doThrow) =>
  callApi(
    'GET',
    payment_request_service_url + '/requests/' + id + '/transactions/' + search,
  );

export const getUserRequestWebooks = () =>
  callApi('GET', payment_request_service_url + '/user/webhooks/');

export const createUserRequestWebook = data =>
  callApi('POST', payment_request_service_url + '/user/webhooks/', data);

export const updateUserRequestWebook = (id, data) =>
  callApi(
    'PATCH',
    payment_request_service_url + '/user/webhooks/' + id + '/',
    data,
  );

export const deleteUserRequestWebook = id =>
  callApi('DELETE', payment_request_service_url + '/user/webhooks/' + id + '/');

/* REWARDS */
export const getRewards = () =>
  callApi('GET', rewards_service_url + '/user/rewards/');

export const getReward = id =>
  callApi('GET', rewards_service_url + '/user/rewards/' + id + '/');

export const claimReward = data =>
  callApi('POST', rewards_service_url + '/user/rewards/', data);

export const getCampaigns = query =>
  callApi(
    'GET',
    rewards_service_url + '/user/campaigns/' + (query ? '?' + query : ''),
  );

export const getCampaign = id =>
  callApi('GET', rewards_service_url + '/user/campaigns/' + id + '/');

export const getReferralCode = () =>
  callApi('GET', rewards_service_url + '/user/');

export const setRefereeCode = referee_code =>
  callApi('PATCH', rewards_service_url + '/user/', { referee_code });

//ADMIN

export const getRewardsAdmin = () =>
  callApi('GET', rewards_service_url + '/admin/rewards/');

export const createRewardAdmin = data =>
  callApi('POST', rewards_service_url + '/admin/rewards/', data);

export const updateRewardAdmin = (id, data) =>
  callApi('PATCH', rewards_service_url + '/admin/rewards/' + id + '/', data);

export const getCampaignsAdmin = () =>
  callApi('GET', rewards_service_url + '/admin/campaigns/');

export const createCampaignAdmin = data =>
  callApi('POST', rewards_service_url + '/admin/campaigns/', data);

export const updateCampaignAdmin = (id, data) =>
  callApi('PATCH', rewards_service_url + '/admin/campaigns/' + id + '/', data);

/* PRODUCTS */
export const getProducts = (query = '', doThrow) =>
  callApi('GET', product_service_url + '/user/products/' + query, null, {
    doThrow,
  });
export const getProduct = id =>
  callApi('GET', product_service_url + '/user/products/' + id + '/');

export const getVouchers = query =>
  callApi(
    'GET',
    product_service_url + '/user/vouchers/' + (query ? '?' + query : ''),
  );

export const updateVoucher = (id, status) =>
  callApi('PATCH', product_service_url + '/user/vouchers/' + id + '/', {
    status,
  });

export const getVoucher = id =>
  callApi('GET', product_service_url + '/user/vouchers/' + id + '/');

export const getNext = link => callApi('GET', link);

export const getSellerVoucherActions = (sellerId, voucherId) =>
  callApi(
    'GET',
    product_service_url +
      `/manager/sellers/${sellerId}/vouchers/${voucherId}/actions/`,
    null,
    {
      doThrow: true,
    },
  );

export const getSellerVoucherAction = (sellerId, voucherId, actionId) =>
  callApi(
    'GET',
    product_service_url +
      `/manager/sellers/${sellerId}/vouchers/${voucherId}/actions/${actionId}/`,
    null,
    {
      doThrow: true,
    },
  );

export const getManagerVoucherActions = voucherId =>
  callApi(
    'GET',
    product_service_url + `/manager/vouchers/${voucherId}/actions/`,
    null,
    {
      doThrow: true,
    },
  );

export const getUserVoucherActions = voucherId =>
  callApi(
    'GET',
    product_service_url + `/user/vouchers/${voucherId}/actions/`,
    null,
    {
      doThrow: true,
    },
  );

export const verifyManagerVoucherCode = (sellerId, data) =>
  callApi(
    'POST',
    product_service_url + `/manager/sellers/${sellerId}/vouchers/query/`,
    data,
    {
      doThrow: true,
    },
  );

export const createAdminRedemption = data =>
  callApi('POST', product_service_url + `/admin/redemptions/`, data, {
    doThrow: true,
  });

export const getAdminRedemption = redemptionId =>
  callApi(
    'GET',
    product_service_url + `/admin/redemptions/${redemptionId}/`,
    null,
    {
      doThrow: true,
    },
  );

export const createManagerRedemption = (sellerId, data) =>
  callApi(
    'POST',
    product_service_url + `/manager/sellers/${sellerId}/redemptions/`,
    data,
    {
      doThrow: true,
    },
  );

export const getManagerRedemptions = sellerId =>
  callApi(
    'GET',
    product_service_url + `/manager/sellers/${sellerId}/redemptions/`,
    null,
    {
      doThrow: true,
    },
  );

export const getManagerRedemption = (sellerId, redemptionId) =>
  callApi(
    'GET',
    product_service_url +
      `/manager/sellers/${sellerId}/redemptions/${redemptionId}/`,
    null,
    {
      doThrow: true,
    },
  );

export const createUserRedemption = data =>
  callApi('POST', product_service_url + `/manager/redemptions/`, data, {
    doThrow: true,
  });

export const getUserRedemptions = sellerId =>
  callApi('GET', product_service_url + `/user/redemptions/`, null, {
    doThrow: true,
  });

export const getUserRedemption = (sellerId, redemptionId) =>
  callApi(
    'GET',
    product_service_url + `/user/redemptions/${redemptionId}/`,
    null,
    {
      doThrow: true,
    },
  );

export const getOrders = query =>
  callApi(
    'GET',
    product_service_url + '/user/orders/' + (query ? '?' + query : ''),
  );

export const getOrder = id =>
  callApi('GET', product_service_url + '/user/orders/' + id + '/');

export const getOrderItems = orderID =>
  callApi('GET', product_service_url + '/user/orders/' + orderID + '/items/');

export const getOrdersNew = query =>
  callApi(
    'GET',
    product_service_url + '/user/orders/' + (query ? '?' + query : ''),
    null,
    { doThrow: true },
  );

export const getOrderItemsNew = orderID => {
  return callApi(
    'GET',
    product_service_url + '/user/orders/' + orderID + '/items/',
    null,
    { doThrow: true },
  );
};

export const createOrder = currency =>
  callApi('POST', product_service_url + '/user/orders/', {
    currency,
  });

export const updateOrder = (id, data) =>
  callApi('PUT', product_service_url + '/user/orders/' + id + '/', data);

export const createOrderPayment = id =>
  callApi('POST', product_service_url + '/user/orders/' + id + '/payments/', {
    type: 'rehive',
  });

export const getOrderPayment = (id, paymentId) =>
  callApi(
    'GET',
    product_service_url + '/user/orders/' + id + '/payments/' + paymentId + '/',
    null,
    { doThrow: true },
  );

export const completeOrder = id =>
  callApi('PATCH', product_service_url + '/user/orders/' + id + '/', {
    status: 'complete',
  });

export const deleteOrder = id =>
  callApi('DELETE', product_service_url + '/user/orders/' + id + '/', {
    status: 'complete',
  });

export const createOrderItem = (orderID, product, quantity) =>
  callApi('POST', product_service_url + '/user/orders/' + orderID + '/items/', {
    product,
    quantity,
  });
export const createOrderItemNew = (orderID, data) =>
  callApi(
    'POST',
    product_service_url + '/user/orders/' + orderID + '/items/',
    data,
  );

export const updateOrderItem = (orderID, itemID, quantity) =>
  callApi(
    'PATCH',
    product_service_url + '/user/orders/' + orderID + '/items/' + itemID + '/',
    {
      quantity,
    },
  );

export const deleteOrderItem = (orderID, itemID) =>
  callApi(
    'DELETE',
    product_service_url + '/user/orders/' + orderID + '/items/' + itemID + '/',
    {
      status: 'complete',
    },
  );

export const getProductCategories = doThrow =>
  callApi(
    'GET',
    product_service_url + '/user/categories/?page_size=250',
    null,
    { doThrow },
  );

export const updateVoucherMerchant = (id, status) =>
  callApi('PATCH', product_service_url + '/merchant/vouchers/' + id + '/', {
    status,
  });
export const getVouchersMerchant = query =>
  callApi(
    'GET',
    product_service_url + '/merchant/vouchers/' + (query ? '?' + query : ''),
  );

// ADMIN
export const getProductsAdmin = () =>
  callApi('GET', product_service_url + '/admin/products/');

export const createProductAdmin = data =>
  callApi('POST', product_service_url + '/admin/products/', data);

export const updateProductAdmin = (id, data) =>
  callApi('PATCH', product_service_url + '/admin/products/' + id + '/', data);

export const getOrdersAdmin = () =>
  callApi('GET', product_service_url + '/admin/orders/');

export const createOrderAdmin = data =>
  callApi('POST', product_service_url + '/admin/orders/', data);

export const updateOrderAdmin = (id, data) =>
  callApi('PATCH', product_service_url + '/admin/orders/' + id + '/', data);

export const getProductCategoriesAdmin = query =>
  callApi(
    'GET',
    product_service_url + '/admin/categories/' + (query ? '?' + query : ''),
  );
export const deleteProductCategoryAdmin = id =>
  callApi('DELETE', product_service_url + '/admin/categories/' + id + '/');

export const createProductCategoryAdmin = data =>
  callApi('POST', product_service_url + '/admin/categories/', data);

export const updateProductCategoryAdmin = (id, data) =>
  callApi('PATCH', product_service_url + '/admin/categories/' + id + '/', data);

export const getVouchersAdmin = query =>
  callApi(
    'GET',
    product_service_url + '/admin/vouchers/' + (query ? '?' + query : ''),
  );

export const createVoucherAdmin = data =>
  callApi('POST', product_service_url + '/admin/vouchers/', data);

export const updateVoucherAdmin = (id, data) =>
  callApi('PATCH', product_service_url + '/admin/vouchers/' + id + '/', data);

export const updateVoucherAdminStatus = (id, status) =>
  callApi('PATCH', product_service_url + '/admin/vouchers/' + id + '/', {
    status,
  });

// options
export const getProductOptions = productId =>
  callApi(
    'GET',
    product_service_url + '/admin/products/' + productId + '/options/',
  );

export const getProductOption = (productId, optionId) =>
  callApi(
    'GET',
    product_service_url +
      '/admin/products/' +
      productId +
      '/options/' +
      optionId +
      '/',
  );

export const createProductOption = (productId, data) =>
  callApi(
    'POST',
    product_service_url + '/admin/products/' + productId + '/options/',
    data,
  );

export const updateProductOption = (productId, data) =>
  callApi(
    'PUT',
    product_service_url + '/admin/products/' + productId + '/options/',
    data,
  );

export const deleteProductOption = (productId, optionId) =>
  callApi(
    'DELETE',
    product_service_url +
      '/admin/products/' +
      productId +
      '/options/' +
      optionId +
      '/',
  );

// variants
export const getProductVariants = productId =>
  callApi(
    'GET',
    product_service_url + '/admin/products/' + productId + '/variants/',
  );

export const getProductVariant = (productId, variantId) =>
  callApi(
    'GET',
    product_service_url +
      '/admin/products/' +
      productId +
      '/variants/' +
      variantId +
      '/',
  );

export const createProductVariant = (productId, data) =>
  callApi(
    'POST',
    product_service_url + '/admin/products/' + productId + '/variants/',
    data,
  );

export const updateProductVariant = (productId, data) =>
  callApi('PUT', product_service_url + '/admin/products/' + productId, data);

export const deleteProductVariant = (productId, variantId) =>
  callApi(
    'DELETE',
    product_service_url +
      '/admin/products/' +
      productId +
      '/variants/' +
      variantId +
      '/',
  );
export const createProductVariantPrice = (productId, variantId, data) =>
  callApi(
    'POST',
    product_service_url +
      '/admin/products/' +
      productId +
      '/variants/' +
      variantId +
      '/prices/',
    data,
  );

/* CONVERSION */
export const getConversionRates = keys =>
  callApi(
    'GET',
    conversion_service_url + '/user/rates/snapshot/?key__in=' + keys,
  );
export const getConversionRate = (currency, created, doThrow) =>
  callApi(
    'GET',
    conversion_service_url +
      '/user/rates/snapshot/?key__in=' +
      currency +
      '&created__lt=' +
      created,
    null,
    { doThrow },
  );

export const makeDeleteRequest = data =>
  callApi('POST', rehive_base_url + '/auth/request-delete/', data);

export const makeDeleteRequestVerify = data => {
  return callApi(
    'POST',
    `${rehive_base_url}/auth/request-delete/verify/`,
    data,
  );
};
export const makeDeactivateRequestVerify = data => {
  return callApi('POST', `${rehive_base_url}/auth/deactivate/verify/`, data);
};

export const getConversionRateSnapshots = search =>
  callApi(
    'GET',
    conversion_service_url + '/user/rates/snapshots/' + search,
    null,
    { doThrow: true },
  );

export const getConversionSettings = () =>
  callApi('GET', conversion_service_url + '/user/settings/');

export const getConversionCurrencies = () =>
  callApi('GET', conversion_service_url + '/user/currencies/?page_size=250');

export const getConversionCurrency = id =>
  callApi('GET', conversion_service_url + '/user/currencies/?code=' + id);

export const setConversionSettings = data =>
  callApi('PATCH', conversion_service_url + '/user/settings/', data);

export const getConversionPairs = () =>
  callApi(
    'GET',
    conversion_service_url + '/user/conversion-pairs/?page_size=250',
  );

export const getConversion = id =>
  callApi('GET', conversion_service_url + '/user/conversions/' + id + '/');

export const getConversions = query =>
  callApi(
    'GET',
    conversion_service_url + '/user/conversions/' + (query ? '?' + query : ''),
  );

export const createConversion = data =>
  callApi('POST', conversion_service_url + '/user/conversions/', data);

export const updateConversion = (id, status) =>
  callApi('PATCH', conversion_service_url + '/user/conversions/' + id + '/', {
    status,
  });

/* CHIPLESS CARD */
export const getChiplessCards = () =>
  callApi('GET', chipless_card_service_url + '/user/cards/');

export const createChiplessCard = data =>
  callApi('POST', chipless_card_service_url + '/user/cards/', data);

export const updateChiplessCard = (cardId, data) =>
  callApi(
    'PATCH',
    chipless_card_service_url + '/user/cards/' + cardId + '/',
    data,
  );

export const getChiplessCardLimits = cardId =>
  callApi(
    'GET',
    chipless_card_service_url + '/user/cards/' + cardId + '/limits/',
  );

export const createChiplessCardLimit = (cardId, data) =>
  callApi(
    'POST',
    chipless_card_service_url + '/user/cards/' + cardId + '/limits/',
    data,
  );

export const removeChiplessCardLimit = (cardId, limitId) =>
  callApi(
    'DELETE',
    chipless_card_service_url +
      '/user/cards/' +
      cardId +
      '/limits/' +
      limitId +
      '/',
  );

export const updateChiplessCardLimit = (cardId, limitId, data) =>
  callApi(
    'PATCH',
    chipless_card_service_url +
      '/user/cards/' +
      cardId +
      '/limits/' +
      limitId +
      '/',
    data,
  );

/* NOTIFICATIONS */
export const getNotifications = () =>
  callApi(
    'GET',
    notification_service_url + '/user/notifications/?page_size=250', //
  );

export const updateNotification = (id, data) =>
  callApi(
    'PATCH',
    notification_service_url + '/user/notifications/' + id + '/',
    data,
  );

/* MASS SEND */
export const uploadMassSendCSV = file => {
  let formData = new FormData();
  formData.append('file', file);
  return callApi('POST', mass_send_service_url + '/uploads/', formData, {
    is_file: true,
  });
};

export const getUploadCsvStatus = batchId =>
  callApi('GET', `${mass_send_service_url}/uploads/${batchId}/`);

export const getMassTransactionStatus = batchId =>
  callApi('GET', `${mass_send_service_url}/uploads/${batchId}/transactions/`);

/* LIGHTNING */
export const uploadWithdrawalInvoice = invoice =>
  callApi('POST', lightning_service_url + '/withdrawals/', { invoice });

/* GENERAL */
// Request deduplication to prevent double API calls
const pendingRequests = new Map();

export const callApi = (method, route, data, options = {}) => {
  const { is_file, customToken, cors = true, doThrow } = options;
  
  // Create unique request key for deduplication
  const requestKey = `${method}:${route}:${JSON.stringify(data)}:${customToken || token || ''}`;
  
  // Return existing promise if same request is already in progress
  if (pendingRequests.has(requestKey)) {
    return pendingRequests.get(requestKey);
  }

  let headers = is_file
    ? {}
    : {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        // 'X-Rehive-Origin': 'rehive-wallet-react/1.8.0',
      };

  if (token || customToken) {
    headers['Authorization'] = 'Token ' + (customToken ? customToken : token);
  }

  let config = {
    // credentials: 'include',
    mode: cors ? 'cors' : 'no-cors',
    method,
    headers,
  };

  if (data) {
    config['body'] = is_file ? data : JSON.stringify(data);
  }

  const promise = Promise.resolve(
    fetch(route, config)
      .then(response => {
        if (response.status === 429) {
          postMessage(JSON.stringify({ rehiveThrottling: true }));
        } else if (response.status === 401) {
          postMessage(JSON.stringify({ authSessionExpired: true }));
        }
        if (doThrow) {
          return parseApi(response.json());
        }
        return response.json();
      })
      .catch(err => err),
  );
  
  // Store promise and clean up when done
  pendingRequests.set(requestKey, promise);
  promise.finally(() => {
    pendingRequests.delete(requestKey);
  });
  
  return promise;
};
async function parseApi(resp) {
  const response = await resp;
  if (response.status === 'success') {
    if (response.data && response.data.data) {
      return response.data.data;
    } else if (response.data) {
      return response.data;
    } else if (response.message) {
      return { message: response.message };
    } else {
      return {};
    }
  } else {
    if (response.data) {
      throw {
        status: response.status_code,
        message: response.message,
        data: response.data,
      };
    } else {
      throw { status: response.status_code, message: response.message };
    }
  }
}

export const primaryItem = (type, data) => {
  return updateItem(type, { ...data, primary: true });
};

export const updateItem = (type, data, id) => {
  let response = null;
  id = data?.id ?? id;

  switch (type) {
    case 'mobiles':
      const number = !data?.number?.includes('+')
        ? `+${data?.number}`
        : data?.number;

      if (id) {
        response = updateMobile(id, data);
      } else {
        response = createMobile({ ...data, number });
      }
      break;
    case 'addresses':
      if (id) {
        response = updateAddress(data);
      } else {
        response = createAddress(data);
      }
      break;
    case 'emails':
      if (id) {
        response = updateEmail(id, data);
      } else {
        response = createEmail(data);
      }
      break;
    case 'cryptoAccounts':
      if (id) {
        response = updateCryptoAccount(id, data);
      } else {
        response = createCryptoAccount(data);
      }
      break;
    case 'bankAccounts':
      if (id) {
        response = updateBankAccount(id, data);
      } else {
        response = createBankAccount(data);
      }
      break;
    case 'profile':
      response = updateProfile({
        business_name: data.business_name,
        first_name: data.first_name,
        last_name: data.last_name,
        id_number: data.id_number,
        birth_date: data.birth_date,
        nationality: data.nationality,
        residency: data.residency,
        timezone: data.timezone,
        central_bank_number: data.central_bank_number,
        mothers_name: data.mothers_name,
        fathers_name: data.fathers_name,
        grandfathers_name: data.grandfathers_name,
        grandmothers_name: data.grandmothers_name,
        gender: data.gender,
        title: data.title,
        marital_status: data.marital_status,
      });
      break;
    // case 'address':
    //   response = updateAddress(data);
    // break;
    default:
  }
  return Promise.resolve(response);
};

export const deleteItem = (type, id) => {
  let response = null;
  switch (type) {
    case 'mobiles':
      response = deleteMobile(id);
      break;
    case 'addresses':
      response = deleteAddress(id);
      break;
    case 'emails':
      response = deleteEmail(id);
      break;
    case 'cryptoAccounts':
    case 'stellar':
    case 'bitcoin':
    case 'ethereum':
      response = deleteCryptoAccount(id);
      break;
    case 'bank':
    case 'bankAccounts':
      response = deleteBankAccount(id);
      break;
    default:
  }

  return Promise.resolve(response);
};

export const resendVerification = (type, data, company) => {
  let response = null;
  switch (type) {
    case 'mobile':
    case 'mobiles':
      response = resendMobileVerification(data.number ?? data, company);
      break;
    case 'email':
    case 'emails':
      response = resendEmailVerification(data.email ?? data, company);
      break;
    default:
  }

  return Promise.resolve(response);
};

export const getPlacePredictions = queryString =>
  callApi(
    'GET',
    `${google_places_predictions}?input=${encodeURI(queryString)}`,
  );

export const getPlaceDetails = placeId =>
  callApi('GET', `${google_places_details}?place_id=${placeId}`);

// Mobiles
export const getDevices = doThrow =>
  callApi('GET', rehive_base_url + '/user/devices/', null, { doThrow });

export const getDevice = id =>
  callApi('GET', rehive_base_url + '/user/devices/' + id + '/');

export const addDevice = data =>
  callApi('POST', rehive_base_url + '/user/devices/', data);

export const addDeviceApp = (id, data) =>
  callApi('POST', rehive_base_url + '/user/devices/' + id + '/apps/', data);

export const deleteDevice = id =>
  callApi('DELETE', rehive_base_url + '/user/devices/' + id + '/');

export const deleteDeviceApp = (id, appId) =>
  callApi(
    'DELETE',
    rehive_base_url + '/user/devices/' + id + '/apps/' + appId + '/',
  );

export const getSellers = (search = '', doThrow) =>
  callApi('GET', product_service_url + '/user/sellers/' + search, null, {
    doThrow,
  });
export const getManagerSellers = (search = '', doThrow) =>
  callApi('GET', product_service_url + '/manager/sellers/' + search, null, {
    doThrow,
  });

export const getSeller = sellerId =>
  callApi('GET', product_service_url + '/user/sellers/' + sellerId + '/');

export const fetchItems = (type, context) => {
  let response = null;
  switch (type) {
    case 'profile':
    case 'user':
      response = getProfile();
      break;
    case 'mobiles':
      response = getMobiles();
      break;
    case 'addresses':
    case 'address':
      response = getAddresses();
      break;
    case 'emails':
      response = getEmails();
      break;
    case 'crypto_account':
    case 'cryptoAccount':
    case 'cryptoAccounts':
    case 'stellar':
    case 'bitcoin':
    case 'ethereum':
      response = getCryptoAccounts();
      break;
    case 'bank_account':
    case 'bankAccount':
      response = getBankAccounts();
      break;

    case 'businessServiceSettings':
      response = getBusinessServiceSettings();
      break;

    case 'document':
    case 'documents':
      response = getDocuments();
      break;
    case 'sellers':
      response = getSellers('', true);
      break;
    case 'manager-sellers':
      response = getManagerSellers('', true);
      break;

    case 'tier':
      response = getTier(getUserGroup(context?.user), true);
      break;

    case 'tiers':
      response = getTiers(getUserGroup(context?.user), true);
      break;

    case 'conversionCurrencies':
    case 'displayCurrency':
      response = getConversionCurrencies(true);
      break;
    case 'currencies':
    case 'accounts':
    case 'wallets':
      response = getAccounts();
      break;
    case 'conversionRates':
      response = getConversionSettings(true);
      break;
    case 'conversionPairs':
      response = getConversionCurrencies();
      break;
    case 'devices':
      response = getDevices(true);
      break;
    case 'notifications':
      response = getNotifications();
      break;
    case 'referralCode':
      response = getReferralCode();
      break;
    case 'mfa':
      // response = getMFA();
      response = getMFAAuthenticators('verified=1');
      break;
    default:
      break;
  }

  return Promise.resolve(response);
};

export const fetchItem = (type, id) => {
  let response = null;
  switch (type) {
    case 'mobile':
    case 'mobiles':
      response = getMobiles(id);
      break;
    case 'address':
    case 'addresses':
      response = getAddresses(id);
      break;
    case 'email':
    case 'emails':
      response = getEmails(id);
      break;
    case 'crypto_account':
    case 'cryptoAccount':
      response = getCryptoAccounts(id);
      break;
    case 'bank_account':
    case 'bankAccount':
      response = getBankAccounts(id);
      break;
    default:
  }

  return Promise.resolve(response);
};
export const getCompanyAppConfig = (companyId, doThrow = true) =>
  callApi(
    'GET',
    app_service_url + '/public/company/?company_id=' + companyId,
    null,
    {
      doThrow,
    },
  );

export const getUserAppConfig = (doThrow = true) =>
  callApi('GET', app_service_url + '/user/', null, {
    doThrow,
  });

export const updateUserAppConfig = () =>
  callApi('PATCH', app_service_url + '/user/');

// WALLET SERVICE

export const getCompanyByDomain = domain =>
  callApi('GET', `${app_service_url}/public/company/?domain=${domain}`, null, {
    doThrow: true,
  });

export const getCompanyByID = companyId =>
  callApi(
    'GET',
    `${app_service_url}/public/company/?company=${companyId}`,
    null,
    {
      doThrow: true,
    },
  );

export const getUserLocales = (doThrow = true) =>
  callApi('GET', app_service_url + '/user/locales/', null, {
    doThrow,
  });

export const getUserLocale = (id, doThrow = true) =>
  callApi('GET', app_service_url + '/user/locales/' + id + '/', null, {
    doThrow,
  });

export const updateUserLocale = (id, data) =>
  callApi('PATCH', app_service_url + '/user/locales/' + id + '/', data);

export const getLocales = (company, doThrow = true) =>
  callApi(
    'GET',
    app_service_url + `/public/company/${company}/locales/`,
    null,
    {
      doThrow,
    },
  );

export const getLocale = (company, id, doThrow = true) =>
  callApi(
    'GET',
    app_service_url + `/public/company/${company}/locales/${id}/`,
    null,
    {
      doThrow,
    },
  );

/* BRIDGE SERVICE */
export const createUserKYCLink = data => {
  return callApi('POST', bridge_service_url + '/user/kyc-links/', data);
};

export const getBridgeCryptoDepositAddress = (currency_code, account_currency, chain) => {
  return callApi('POST', bridge_service_url + '/user/crypto-deposit/', {
    "currency": currency_code,
    "account_currency": account_currency,
    "chain": chain
  });
};