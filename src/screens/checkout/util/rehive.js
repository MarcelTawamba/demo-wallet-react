/* eslint-disable no-throw-literal */
import {
  r,
  token,
  rehive_base_url,
  business_service_url,
  payment_request_service_url,
  stripe_service_url,
  stellar_service_url,
  stellar_testnet_service_url,
  bitcoin_testnet_service_url,
  bitcoin_service_url,
  ethereum_testnet_service_url,
  ethereum_service_url,
  rewards_service_url,
  product_service_url,
  conversion_service_url,
  chipless_card_service_url,
  notification_service_url,
  mass_send_service_url,
  lightning_service_url,
  google_places_predictions,
  google_places_details,
} from 'util/rehive';

export const verifyToken = token =>
  callApi('GET', rehive_base_url + '/auth/', null, { customToken: token });

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

export const resetPasswordConfirm = data => r.auth.password.resetConfirm(data);

/* TRANSACTIONS */
export const getTransactions = filters => r.transactions.get({ filters });

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

export const getSubtypes = () => callApi('GET', rehive_base_url + '/subtypes/');

export const getExports = page =>
  callApi(
    'GET',
    rehive_base_url +
      '/transactions/exports/?page_size=5' +
      (page ? '&page=' + page : ''),
  );

export const getExport = id =>
  callApi('GET', rehive_base_url + '/transactions/exports/' + id + '/');

export const createExport = (query, file_format) => {
  const data = { query, file_format };
  return callApi('POST', rehive_base_url + '/transactions/exports/', data);
};

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

export const createBusinessUser = (businessId, data) =>
  callApi(
    'POST',
    business_service_url + '/manager/businesses/' + businessId + '/users/',
    data,
  );

export const getBusinessInvoices = (businessId, search = '') =>
  callApi(
    'GET',
    business_service_url +
      '/manager/businesses/' +
      businessId +
      '/invoices/' +
      search,
  );

export const getBusinessInvoice = (businessId, invoiceId) =>
  callApi(
    'GET',
    business_service_url +
      '/manager/businesses/' +
      businessId +
      '/invoices/' +
      invoiceId +
      '/',
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

export const getBusinessServiceSettings = () =>
  callApi('GET', business_service_url + '/user/company/');

export const getBusinessProfile = businessId =>
  callApi(
    'GET',
    business_service_url + '/manager/businesses/' + businessId + '/',
  );
export const getBusinesses = () =>
  callApi('GET', business_service_url + '/manager/businesses/');

export const updateBusinessProfile = (businessId, data, is_file) =>
  callApi(
    'PATCH',
    business_service_url + '/manager/businesses/' + businessId + '/',
    data,
    { is_file },
  );
export const createBusinessProfile = data =>
  callApi('POST', business_service_url + '/manager/businesses/', data);

export const getBusinessCategories = () =>
  callApi('GET', business_service_url + '/manager/business-categories/');

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

export const getInvoiceRefunds = (businessId, invoiceId) =>
  callApi(
    'GET',
    business_service_url +
      '/manager/businesses/' +
      businessId +
      '/invoices/' +
      invoiceId +
      '/refunds/',
  );

/* ACCOUNTS */
export const getAccounts = () => r.accounts.get();

export const getTier = group =>
  callApi('GET', rehive_base_url + '/groups/' + group + '/tiers/?active=true');

export const getTiers = group =>
  callApi('GET', rehive_base_url + '/groups/' + group + '/tiers/');

export const getTierRequirements = (group, tier) =>
  callApi(
    'GET',
    rehive_base_url + '/groups/' + group + '/tiers/' + tier + '/requirements/',
  );

// Create, retrieve, currencies?

export const setActiveCurrency = (reference, currencyCode) =>
  r.accounts.currencies.update(reference, currencyCode, { active: true });

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



/* PUBLIC */
export const getPublicCompanies = () => r.public.companies.get();

export const getPublicCompany = company =>
  callApi('GET', rehive_base_url + '/public/companies/' + company + '/');

export const getPublicCompanyGroups = company =>
  callApi('GET', rehive_base_url + '/public/companies/' + company + '/groups/');

export const getPublicCompanyGroup = (company, group) =>
  callApi(
    'GET',
    rehive_base_url + '/public/companies/' + company + '/groups/' + group + '/',
  );

export const getCompanyCurrencies = () =>
  r.company.currencies.get({ filters: { page_size: 100 } });

export const getCompanyBankAccounts = () => r.company.bankAccounts.get();

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

export const createCryptoTransfer = data => {
  let url = '';
  switch (data.crypto) {
    case 'TXBT':
      url = bitcoin_testnet_service_url + '/wallet/send/';
      break;
    case 'XBT':
      url = bitcoin_service_url + '/wallet/send/';
      break;
    case 'TETH':
      url = ethereum_testnet_service_url + '/wallet/send/';
      break;
    case 'ETH':
      url = ethereum_service_url + '/wallet/send/';
      break;
    case 'TXLM':
      url = stellar_testnet_service_url + '/transactions/send/';
      break;
    case 'XLM':
    default:
      url = stellar_service_url + '/transactions/send/';
      break;
  }

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

/* PAYMENT REQUESTING */
export const createPaymentRequest = data =>
  callApi('POST', payment_request_service_url + '/user/requests/', data);

export const getPaymentRequest = id =>
  callApi('GET', payment_request_service_url + '/requests/' + id + '/');

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
    null,
    { doThrow },
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
export const getProducts = query =>
  callApi(
    'GET',
    product_service_url + '/user/products/' + (query ? '?' + query : ''),
  );
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

export const updateVoucherAdmin = (id, status) =>
  callApi('PATCH', product_service_url + '/admin/vouchers/' + id + '/', {
    status,
  });

export const getVouchersAdmin = query =>
  callApi(
    'GET',
    product_service_url + '/admin/vouchers/' + (query ? '?' + query : ''),
  );

export const getVoucher = id =>
  callApi('GET', product_service_url + '/user/vouchers/' + id + '/');

export const getNext = link => callApi('GET', link);

export const getOrders = query =>
  callApi(
    'GET',
    product_service_url + '/user/orders/' + (query ? '?' + query : ''),
  );

export const getOrder = id =>
  callApi('GET', product_service_url + '/user/orders/' + id + '/');

export const getOrderItems = orderID =>
  callApi('GET', product_service_url + '/user/orders/' + orderID + '/items/');

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

export const getProductCategories = () =>
  callApi('GET', product_service_url + '/user/categories/?page_size=250');

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

// variant prices!?

//ADMIN

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

/* CONVERSION */
export const getConversionRates = keys =>
  callApi(
    'GET',
    conversion_service_url + '/user/rates/snapshot/?key__in=' + keys,
    null,
    { doThrow: true },
  );
export const getConversionRate = (currency, created) =>
  callApi(
    'GET',
    conversion_service_url +
      '/user/rates/snapshot/?key__in=' +
      currency +
      '&created__lt=' +
      created,
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
    null,
    { doThrow: true },
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

/* LIGHTNING */
export const uploadWithdrawalInvoice = invoice =>
  callApi('POST', lightning_service_url + '/withdrawals/', { invoice });

/* GENERAL */
export const callApi = (method, route, data, options = {}) => {
  const { is_file, customToken, cors = true, doThrow } = options;
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

  return Promise.resolve(
    fetch(route, config)
      .then(response => {
        if (doThrow) {
          return parseApi(response.json());
        }
        return response.json();
      })
      .catch(err => err),
  );
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
export const resendVerification = (type, data, company) => {
  let response = null;
  switch (type) {
    case 'mobile':
      response = resendMobileVerification(data.number, company);
      break;
    case 'email':
      response = resendEmailVerification(data.email, company);
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
