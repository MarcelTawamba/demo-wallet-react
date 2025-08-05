import { callApi, product_service_url } from 'util/rehive';
import { convertToFormData } from 'util/methods';

// seller
export const getSellers = () =>
  callApi('GET', product_service_url + '/manager/sellers/');

export const getSeller = sellerId =>
  callApi('GET', product_service_url + '/manager/sellers/' + sellerId + '/');

export const createSeller = data =>
  callApi('POST', product_service_url + '/manager/sellers/', data);

// product
export const getProducts = (sellerId, search = '') =>
  callApi(
    'GET',
    product_service_url +
      '/manager/sellers/' +
      sellerId +
      '/products/' +
      search,
  );

export const getProduct = (sellerId, productId, options) =>
  callApi(
    'GET',
    product_service_url +
      '/manager/sellers/' +
      sellerId +
      '/products/' +
      productId +
      '/',
    null,
    options,
  );

export const createProduct = (sellerId, data) =>
  callApi(
    'POST',
    product_service_url + '/manager/sellers/' + sellerId + '/products/',
    data,
  );
export const updateProduct = (sellerId, productId, data) =>
  callApi(
    'PATCH',
    product_service_url +
      '/manager/sellers/' +
      sellerId +
      '/products/' +
      productId +
      '/',
    data,
  );

export const deleteProduct = (sellerId, productId) =>
  callApi(
    'DELETE',
    product_service_url +
      '/manager/sellers/' +
      sellerId +
      '/products/' +
      productId +
      '/',
  );

// prices
export const createProductPrice = (sellerId, productId, data) =>
  callApi(
    'POST',
    product_service_url +
      '/manager/sellers/' +
      sellerId +
      '/products/' +
      productId +
      '/prices/',
    data,
  );
export const updateProductPrice = (sellerId, productId, priceId, data) =>
  callApi(
    'PATCH',
    product_service_url +
      '/manager/sellers/' +
      sellerId +
      '/products/' +
      productId +
      '/prices/' +
      priceId +
      '/',
    data,
  );

export const deleteProductPrice = (sellerId, productId, priceId) =>
  callApi(
    'DELETE',
    product_service_url +
      '/manager/sellers/' +
      sellerId +
      '/products/' +
      productId +
      '/prices/' +
      priceId +
      '/',
  );

// category
export const createProductCategories = (sellerId, productId, data) =>
  callApi(
    'POST',
    product_service_url +
      '/manager/sellers/' +
      sellerId +
      '/products/' +
      productId +
      '/categories/',
    data,
  );

export const deleteProductCategory = (sellerId, productId, categoryId) =>
  callApi(
    'DELETE',
    product_service_url +
      '/manager/sellers/' +
      sellerId +
      '/products/' +
      productId +
      '/categories/' +
      categoryId +
      '/',
  );

// images
export const createProductImage = (sellerId, productId, file, weight) => {
  let fields = [{ key: 'file', value: file }];
  if (typeof weight === 'number') {
    fields.push({ key: 'weight', value: weight });
  }

  return callApi(
    'POST',
    product_service_url +
      '/manager/sellers/' +
      sellerId +
      '/products/' +
      productId +
      '/images/',
    convertToFormData(fields),
    {
      is_file: true,
    },
  );
};

export const deleteProductImage = (sellerId, productId, imageId) =>
  callApi(
    'DELETE',
    product_service_url +
      '/manager/sellers/' +
      sellerId +
      '/products/' +
      productId +
      '/images/' +
      imageId +
      '/',
  );

// options
export const getProductOptions = (sellerId, productId) =>
  callApi(
    'GET',
    product_service_url +
      '/manager/sellers/' +
      sellerId +
      '/products/' +
      productId +
      '/options/',
  );

export const getProductOption = (sellerId, productId, optionId) =>
  callApi(
    'GET',
    product_service_url +
      '/manager/sellers/' +
      sellerId +
      '/products/' +
      productId +
      '/options/' +
      optionId +
      '/',
  );

export const createProductOption = (sellerId, productId, data) =>
  callApi(
    'POST',
    product_service_url +
      '/manager/sellers/' +
      sellerId +
      '/products/' +
      productId +
      '/options/',
    data,
  );

export const updateProductOption = (sellerId, productId, optionId, data) =>
  callApi(
    'PATCH',
    product_service_url +
      '/manager/sellers/' +
      sellerId +
      '/products/' +
      productId +
      '/options/' +
      optionId +
      '/',
    data,
  );

export const deleteProductOption = (sellerId, productId, optionId) =>
  callApi(
    'DELETE',
    product_service_url +
      '/manager/sellers/' +
      sellerId +
      '/products/' +
      productId +
      '/options/' +
      optionId +
      '/',
  );

// variants
export const getProductVariants = (sellerId, productId) =>
  callApi(
    'GET',
    product_service_url +
      '/manager/sellers/' +
      sellerId +
      '/products/' +
      productId +
      '/variants/',
  );

export const getProductVariant = (sellerId, productId, variantId) =>
  callApi(
    'GET',
    product_service_url +
      '/manager/sellers/' +
      sellerId +
      '/products/' +
      productId +
      '/variants/' +
      variantId +
      '/',
  );

export const createProductVariant = (sellerId, productId, data) =>
  callApi(
    'POST',
    product_service_url +
      '/manager/sellers/' +
      sellerId +
      '/products/' +
      productId +
      '/variants/',
    data,
  );

export const updateProductVariant = (sellerId, productId, variantId, data) =>
  callApi(
    'PATCH',
    product_service_url +
      '/manager/sellers/' +
      sellerId +
      '/products/' +
      productId +
      '/variants/' +
      variantId +
      '/',
    data,
  );

export const deleteProductVariant = (sellerId, productId, variantId) =>
  callApi(
    'DELETE',
    product_service_url +
      '/manager/sellers/' +
      sellerId +
      '/products/' +
      productId +
      '/variants/' +
      variantId +
      '/',
  );

export const createProductVariantPrice = (
  sellerId,
  productId,
  variantId,
  data,
) =>
  callApi(
    'POST',
    product_service_url +
      '/manager/sellers/' +
      sellerId +
      '/products/' +
      productId +
      '/variants/' +
      variantId +
      '/prices/',
    data,
  );

export const updateProductVariantPrice = (
  sellerId,
  productId,
  variantId,
  priceId,
  data,
) =>
  callApi(
    'PATCH',
    product_service_url +
      '/manager/sellers/' +
      sellerId +
      '/products/' +
      productId +
      '/variants/' +
      variantId +
      '/prices/' +
      priceId +
      '/',
    data,
  );

export const deleteProductVariantPrice = (
  sellerId,
  productId,
  variantId,
  priceId,
) =>
  callApi(
    'POST',
    product_service_url +
      '/manager/sellers/' +
      sellerId +
      '/products/' +
      productId +
      '/variants/' +
      variantId +
      '/prices/' +
      priceId +
      '/',
  );

// Vouchers
export const getVouchers = (sellerId, query) =>
  callApi(
    'GET',
    product_service_url +
      '/manager/sellers/' +
      sellerId +
      '/vouchers/' +
      (query ? query : ''),
  );

export const updateVoucher = (sellerId, id, status) =>
  callApi(
    'PATCH',
    product_service_url +
      '/manager/sellers/' +
      sellerId +
      '/vouchers/' +
      id +
      '/',
    {
      status,
    },
  );

export const getVoucher = (sellerId, id) =>
  callApi(
    'GET',
    product_service_url +
      '/manager/sellers/' +
      sellerId +
      '/vouchers/' +
      id +
      '/',
  );

export const createVoucher = (sellerId, data) =>
  callApi(
    'POST',
    product_service_url + '/manager/sellers/' + sellerId + '/vouchers/',
    data,
  );

export const importVouchers = (sellerId, data) =>
  callApi(
    'POST',
    product_service_url + '/manager/sellers/' + sellerId + '/vouchers/import/',
    data,
    { is_file: true },
  );
