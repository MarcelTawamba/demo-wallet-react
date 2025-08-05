import { callApi, product_service_url } from 'util/rehive';

// seller
export const getSellers = () =>
  callApi('GET', product_service_url + '/manager/sellers/');

export const getSeller = sellerId =>
  callApi('GET', product_service_url + '/manager/sellers/' + sellerId + '/');

export const createSeller = data =>
  callApi('POST', product_service_url + '/manager/sellers/', data);

// product
export const getOrders = (sellerId, search = '') =>
  callApi(
    'GET',
    product_service_url + '/manager/sellers/' + sellerId + '/orders/' + search,
  );

export const getOrder = (sellerId, orderId) =>
  callApi(
    'GET',
    product_service_url +
      '/manager/sellers/' +
      sellerId +
      '/orders/' +
      orderId +
      '/',
  );

export const createOrder = (sellerId, data) =>
  callApi(
    'POST',
    product_service_url + '/manager/sellers/' + sellerId + '/orders/',
    data,
  );
export const updateOrder = (sellerId, orderId, data) =>
  callApi(
    'PATCH',
    product_service_url +
      '/manager/sellers/' +
      sellerId +
      '/orders/' +
      orderId +
      '/',
    data,
  );

// items
export const getOrderItems = (sellerId, orderId) =>
  callApi(
    'GET',
    product_service_url +
      '/manager/sellers/' +
      sellerId +
      '/orders/' +
      orderId +
      '/items/',
  );

export const getOrderItem = (sellerId, orderId, itemId) =>
  callApi(
    'GET',
    product_service_url +
      '/manager/sellers/' +
      sellerId +
      '/orders/' +
      orderId +
      '/items/' +
      itemId +
      '/',
  );

export const createOrderItem = (sellerId, orderId, data) =>
  callApi(
    'POST',
    product_service_url +
      '/manager/sellers/' +
      sellerId +
      '/orders/' +
      orderId +
      '/items/',
    data,
  );

export const updateOrderItem = (sellerId, orderId, itemId, data) =>
  callApi(
    'PATCH',
    product_service_url +
      '/manager/sellers/' +
      sellerId +
      '/orders/' +
      orderId +
      '/items/' +
      itemId +
      '/',
    data,
  );

export const deleteOrderItem = (sellerId, orderId, itemId) =>
  callApi(
    'DELETE',
    product_service_url +
      '/manager/sellers/' +
      sellerId +
      '/orders/' +
      orderId +
      '/items/' +
      itemId +
      '/',
  );

// payments
export const getOrderPayments = (sellerId, orderId) =>
  callApi(
    'GET',
    product_service_url +
      '/manager/sellers/' +
      sellerId +
      '/orders/' +
      orderId +
      '/payments/',
  );

export const getOrderPayment = (sellerId, orderId, paymentId) =>
  callApi(
    'GET',
    product_service_url +
      '/manager/sellers/' +
      sellerId +
      '/orders/' +
      orderId +
      '/payments/' +
      paymentId +
      '/',
  );

export const createOrderPayment = (sellerId, orderId, data) =>
  callApi(
    'POST',
    product_service_url +
      '/manager/sellers/' +
      sellerId +
      '/orders/' +
      orderId +
      '/payments/',
    data,
  );

export const updateOrderPayment = (sellerId, orderId, paymentId, data) =>
  callApi(
    'PATCH',
    product_service_url +
      '/manager/sellers/' +
      sellerId +
      '/orders/' +
      orderId +
      '/payments/' +
      paymentId +
      '/',
    data,
  );

export const deleteOrderPayment = (sellerId, orderId, paymentId) =>
  callApi(
    'DELETE',
    product_service_url +
      '/manager/sellers/' +
      sellerId +
      '/orders/' +
      orderId +
      '/payments/' +
      paymentId +
      '/',
  );

// refunds
export const getOrderRefunds = (sellerId, orderId) =>
  callApi(
    'GET',
    product_service_url +
      '/manager/sellers/' +
      sellerId +
      '/orders/' +
      orderId +
      '/refunds/',
  );

export const getOrderRefund = (sellerId, orderId, paymentId) =>
  callApi(
    'GET',
    product_service_url +
      '/manager/sellers/' +
      sellerId +
      '/orders/' +
      orderId +
      '/refunds/' +
      paymentId +
      '/',
  );

export const createOrderRefund = (sellerId, orderId, data) =>
  callApi(
    'POST',
    product_service_url +
      '/manager/sellers/' +
      sellerId +
      '/orders/' +
      orderId +
      '/refunds/',
    data,
  );

export const updateOrderRefund = (sellerId, orderId, data) =>
  callApi(
    'PATCH',
    product_service_url +
      '/manager/sellers/' +
      sellerId +
      '/orders/' +
      orderId +
      '/refunds/',
    data,
  );

export const deleteOrderRefund = (sellerId, orderId, paymentId) =>
  callApi(
    'DELETE',
    product_service_url +
      '/manager/sellers/' +
      sellerId +
      '/orders/' +
      orderId +
      '/refunds/' +
      paymentId +
      '/',
  );
