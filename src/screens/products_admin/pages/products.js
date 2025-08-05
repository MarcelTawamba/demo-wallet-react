import Inputs from '../components/inputs';
import {
  getProducts,
  updateProduct,
  createProduct,
  getSellers,
  getProduct,
  deleteProduct,
  createProductCategories,
  createProductPrice,
  deleteProductPrice,
  deleteProductCategory,
  createProductImage,
  deleteProductImage,
  updateProductPrice,
} from '../util/rehive';
import {
  arrayToObject,
  arrayToObjectNested,
  removeEmptyFields,
  multiplyDivisibility,
  displayFormatDivisibility,
} from 'util/general';
import { difference, differenceWith, isEmpty, isEqual } from 'lodash';
import ProductPricing from '../components/detail/ProductPricing';
import ProductImages from '../components/detail/ProductImages';

const defaultValues = {
  type: 'physical',
  enabled: true,
  instant_buy: false,
  requires_billing_address: false,
  requires_shipping_address: false,
  requires_contact_mobile: false,
  requires_contact_email: false,
  virtual_format: 'raw',
  virtual_type: 'internal',
  virtual_redemption: 'user',
  categories: [],
  countries: [],
  pricing_type: 'simple',
  tracked: true,
  quantity: null,
  sku: '',
  prices: [],
  images: [],
  voucher: false,
};
const mapDefaultValues = (values = {}) => {
  let item = { ...values };
  item = removeEmptyFields(item); // true
  delete item.created;
  delete item.updated;
  delete item.metadata;

  // Map name field to product_name for form compatibility
  if (item.name && !item.product_name) {
    item.product_name = item.name;
  }

  return {
    ...defaultValues,
    voucher: !isEmpty(item?.voucher_schema),
    pricing_type: item?.options?.length > 0 ? 'variants' : 'simple',
    ...item,
    options: item?.options?.map(x => ({
      ...item,
      values: x?.values?.map(name => ({ name })),
    })),
    prices: item?.prices?.map(price => ({
      currency: price.currency.code,
      amount: parseFloat(displayFormatDivisibility(price.amount, price.currency.divisibility)),
    })) ?? [],
  };
};

async function createData(values, control, props) {
  const { history, onSuccess, setItem, showToast, context, item } = props;
  const { setSubmitting, setErrors } = control;
  const sellerId = context?.sellers?.[0]?.id ?? '';

  if (!sellerId) {
    showToast({ id: 'no_seller', variant: 'error' });
  } else {
    if (typeof setSubmitting === 'function') setSubmitting(true);
    let productId = item?.id;

    let data = {
      ...values,
    };


    // Ensure product_name is mapped to name if it exists
    if (data.product_name && !data.name) {
      data.name = data.product_name;
      delete data.product_name;
    }
    
    delete data.prices;
    delete data.categories;
    delete data.images;
    delete data.options;
    delete data.variants;
    delete data.id;
    delete data.voucher;

    if (data?.quantity) {
      data.tracked = true;
    } else {
      data.quantity = null;
      data.tracked = false;
    }
    if (values?.voucher)
      data.voucher_schema = {
        creation_type: 'manual',
        display_format: 'qr',
        type: 'static',
      };
    else data.voucher_schema = null;

    let resp = null;
    if (productId) {
      resp = await updateProduct(sellerId, productId, data);
    } else {
      resp = await createProduct(sellerId, data);
      productId = resp?.data?.id;
    }

    let { status = 'success' } = resp;
    if (status === 'success') {
      // categories
      let respCategories = {};
      if (!isEqual(resp?.data?.categories, values?.categories)) {
        if (values?.categories?.length)
          showToast({
            id: 'updating_product_categories',
          });
        respCategories = await createProductCategories(sellerId, productId, {
          categories: values.categories.map(item => item.id),
        });
        if (respCategories?.status === 'error') {
          status = 'error_adding_category';
        }
        // const oldCategories =
        //   respCategories?.data?.categories?.map(item => item.id) ?? [];
        const oldCategories =
          resp?.data?.categories?.map(item => item.id) ?? [];
        const newCategories = values?.categories?.map(item => item.id);
        const toRemoveCategories = difference(oldCategories, newCategories);
        for (let i = 0; i < toRemoveCategories.length; i++) {
          respCategories = await deleteProductCategory(
            sellerId,
            productId,
            toRemoveCategories[i],
          );
          if (respCategories.status === 'error') {
            status = 'error_removing_category';
          }
        }
      }

      // prices
      const oldPrices = resp?.data?.prices;
      if (values?.prices?.length || oldPrices.length) {
        const newPrices = values?.prices;
        // Convert oldPrices to have currency as string (code) for consistent comparison
        const normalizedOldPrices = oldPrices?.map(price => ({
          ...price,
          currency: price.currency?.code || price.currency,
        })) ?? [];
        
        const newPricesObj = arrayToObject(newPrices, 'currency');
        const oldPricesObj = arrayToObject(normalizedOldPrices, 'currency');

        const companyCurrencies = context?.currencies?.companyCurrencies ?? {};
        const currencyOptionsObj = arrayToObject(companyCurrencies, 'code');
        for (let i = 0; i < companyCurrencies.length; i++) {
          const currency = context?.currencies?.companyCurrencies?.[i];
          const oldPrice = oldPricesObj?.[currency?.code];
          const newPrice = newPricesObj?.[currency?.code];

          if (newPrice) {
            const data2 = {
              currency: newPrice?.currency,
              amount: multiplyDivisibility(
                newPrice?.amount,
                currencyOptionsObj?.[newPrice?.currency]?.divisibility,
              ),
            };
            
            // Convert old price amount to the same format for comparison
            const oldAmount = oldPrice?.amount;
            const newAmount = data2?.amount;
            
            if (!oldPrice && newPrice) {
              if (data2?.amount) {
                showToast({
                  id: 'adding_product_price',
                });
                const respPrice = await createProductPrice(
                  sellerId,
                  productId,
                  data2,
                );
                if (respPrice.status === 'error') {
                  status = 'error_adding_price';
                }
              }
            } else if (oldPrice && newPrice) {
              // Only update if the amount has actually changed
              if (oldAmount !== newAmount && data2?.amount) {
                showToast({
                  id: 'updating_product_price',
                });
                const respPrice = await updateProductPrice(
                  sellerId,
                  productId,
                  oldPrice?.id,
                  data2,
                );
                if (respPrice.status === 'error') {
                  status = 'error_updating_price';
                }
              }
              // If amounts are the same, do nothing (leave the price as is)
            }
          } else if (oldPrice && !newPrice) {
            // Only delete if there's an old price but no new price (user explicitly removed it)
            const respPrice = await deleteProductPrice(
              sellerId,
              productId,
              oldPrice?.id,
            );
            if (respPrice.status === 'error') {
              status = 'error_deleting_price';
            }
          }
        }
      }

      // images
      if (values?.images?.length || item?.images?.length) {
        let respImages = {};
        const oldImages = item?.images;
        let newImages = values?.images;

        function compareFunc(x, y) {
          return (
            (x?.file ?? '').split('?')?.[0] ===
            (y?.preview ?? y?.file ?? '').split('?')?.[0]
          );
        }
        const toRemoveImages = differenceWith(
          oldImages,
          newImages,
          compareFunc,
        );

        for (let i = 0; i < toRemoveImages.length; i++) {
          showToast({
            id: 'deleting_product_image',
          });
          // respImages = await deleteProductImage(
          //   sellerId,
          //   productId,
          //   toRemoveImages[i]?.id,
          // );
          // if (respImages.status === 'error') {
          //   status = 'error_removing_image';
          // }
        }

        //TODO: update below to get images by weight, lowest? 0?
        const coverImage = newImages?.[0]?.preview ?? newImages?.[0]?.file;
        if (
          coverImage &&
          oldImages?.[0]?.file.split('?')?.[0] !== coverImage.split('?')?.[0]
        ) {
          showToast({
            id: 'uploading_cover_image',
          });
          // const respImage = await createProductImage(
          //   sellerId,
          //   productId,
          //   newImages?.[0]?.file,
          //   1,
          // );
          // if (respImage.status === 'error') {
          //   status = 'error_updating_cover_image';
          // } else {
          //   newImages.shift();
          // }
        } else {
          newImages.shift();
        }

        function compareFunc2(x, y) {
          return (
            (x?.preview ?? y?.file ?? '').split('?')?.[0] ===
            (y?.file ?? '').split('?')?.[0]
          );
        }

        const toAddImages = differenceWith(newImages, oldImages, compareFunc2);

        for (let i = 0; i < toAddImages.length; i++) {
          const file = toAddImages?.[i]?.file;
          if (file) {
            showToast({
              id: 'uploading_detail_image_' + (i + 1),
            });
            // const respImage = await createProductImage(
            //   sellerId,
            //   productId,
            //   file,
            //   i + 2,
            // );
            // if (respImage.status === 'error') {
            //   status = 'error';
            // }
          }
        }
      }

      if (status === 'success') {
        const productResp = await getProduct(sellerId, productId);
        onSuccess(resp?.data?.id);
        showToast({
          id: productId ? 'product_update_success' : 'product_add_success',
          variant: 'success',
        });
        setItem(productResp?.data);
        history.push('/products_admin/' + resp?.data?.id + '/');
        return productResp?.data;
      } else {
        showToast({
          id:
            (productId ? 'product_update_error' : 'product_add_error') +
            ' : ' +
            status,
          variant: 'error',
        });
      }
    } else {
      showToast({
        id: productId ? 'product_update_error' : 'product_add_error',
        variant: 'error',
      });
    }
  }
  if (typeof setSubmitting === 'function') setSubmitting(false);
  // return values;
}

const formConfig = props => {
  const { context, item } = props;
  const { sellers } = context;
  const isVerifiedSeller = sellers?.[0]?.status === 'verified';
  const tabs = [
    'general',
    'images',
    { value: 'variants', label: 'pricing_and_quantity' },
  ];
  const sections = [
    {
      id: 'product_details',
      title: 'product_details',
      tab: 'general',
      fields: ['product_name', 'short_description', 'categories'],
      fields2: ['description'],
      actions: ['edit'],
    },
    // {
    //   id: 'voucher',
    //   title: 'voucher',
    //   tab: 'general',
    //   info: 'A voucher product is a virtual voucher that can be redeemed',
    //   fields: ['voucher'],
    // },
    {
      id: 'product_switches',
      title: 'product_options',
      tab: 'general',
      fields: [
        'enabled',
        //'instant_buy',
        'requires_billing_address',
        'requires_shipping_address',
      ],
      fields2: ['requires_contact_mobile', 'requires_contact_email'],
    },
    {
      id: 'pricing_type',
      title: 'pricing_type',
      tab: 'variants',
      fields: [
        'pricing_type',
        {
          id: 'product_tracked',
          variant: 'group',
          condition: ({ pricing_type }) => pricing_type === 'simple',
          fields: [
            {
              id: 'tracked',
              condition: ({ pricing_type }) => pricing_type === 'simple',
            },
            {
              id: 'quantity',
              condition: ({ tracked, pricing_type }) =>
                pricing_type === 'simple' && tracked === true,
            },
          ],
        },
        {
          id: 'sku',
          condition: ({ pricing_type }) => pricing_type === 'simple',
        },
        {
          id: 'prices',
          condition: ({ pricing_type }) => pricing_type === 'simple',
        },
      ],
    },
    {
      id: 'options',
      condition: ({ pricing_type }) => pricing_type === 'variants',
      tab: 'variants',
      title: 'Options',
      info: 'options_helper_text',
      fields: [
        {
          id: 'options',
          type: 'options',
          condition: ({ pricing_type }) => pricing_type === 'variants',
        },
      ],
    },
    {
      id: 'variants',
      condition: ({ pricing_type }) => pricing_type === 'variants',
      tab: 'variants',
      title: 'Variants',
      info: 'variants_helper_text',
      fields: [
        {
          id: 'variants',
          type: 'variants',
          condition: ({ pricing_type }) => pricing_type === 'variants',
        },
      ],
    },
    {
      id: 'images',
      // title: 'Images',
      tab: 'images',
      fields: ['images'],
    },
  ];
  return {
    title: item?.id ? 'edit_product' : 'add_product',
    defaultValues,
    onSubmit: createData,
    inputComponents: Inputs,
    mapDefaultValues,
    sections,
    variant: 'tabs',
    tabs,
    isNumberedTab: true,
    skeleton: ['', '', ''],
    isInvalid: !isVerifiedSeller,
    warning: isVerifiedSeller ? '' : 'add_product_seller_verification_required',
  };
};

async function fetchData(context, event, reduxContext) {
  try {
    const sellers = await getSellers();
    const sellerId = sellers?.data?.results?.[0]?.id ?? '';
    const query = window?.location?.search;
    const resp = await getProducts(sellerId, query);
    if (resp.status === 'success') {
      return resp?.data;
    }
  } catch (error) {
    console.log('fetchData -> error', error);
    return { error };
  }
}

async function fetchItem(productId, props) {
  const sellerId = props?.reduxContext?.sellers?.[0]?.id;
  try {
    if (sellerId) {
      const resp = await getProduct(sellerId, productId, { doThrow: true });
      // if (resp.status === 'success') {
      return resp;
      // }
    }
  } catch (error) {
    console.log('fetchData -> error', error);
    return { error };
  }
}
async function deleteItem(productId, props) {
  const sellerId = props?.context?.sellers?.[0]?.id;
  try {
    if (sellerId) {
      const resp = await deleteProduct(sellerId, productId);
      return resp;
    }
  } catch (error) {
    console.log('fetchData -> error', error);
    return { error };
  }
}

const detailConfig = {
  id: 'summary',
  title: 'Product',
  variant: 'management',
  skeleton: ['', 'images', ''],
  actions: [{ label: 'new_product', id: 'new' }],
  sections: [
    {
      id: 'product_details',
      actions: [
        {
          link: 'edit/',
          id: 'edit',
          variant: 'link',
          customIcon: 'edit',
          align: 'right',
        },
        {
          link: 'delete/',
          id: 'delete',
          color: '#FF4C6F',
          variant: 'link',
          customIcon: 'delete',
          customIconColor: '#FF4C6F',
          align: 'right',
        },
      ],
      fields: [
        // { label: 'product_id', value: 'id' },
        { label: 'product_name', value: 'name' },
        {
          label: 'short_description',
          value: 'short_description',
        },
        {
          label: 'Voucher',
          value: 'voucher_schema',
          standardize: true,
          variant: 'boolean',
        },
        {
          label: 'categories',
          value: 'categories',
          variant: 'categories',
        },
      ],
      rightField: {
        label: 'description',
        value: 'description',
        variant: 'markdown',
      },
    },
    {
      id: 'product_images',
      component: ProductImages,
      fields: [
        {
          id: 'images',
          variant: 'product_images',
        },
      ],
    },
    {
      id: 'pricing_quantity_and_variants',
      component: ProductPricing,
    },
  ],
};

const listConfig = {
  variant: 'table',
  pagination: true,
  noCellBorder: true,
  filterConfig: {
    id: { label: 'ID' },
    name: { label: 'Name' },
    // metadata__service_bitcoin__tx_hash: { label: 'Hash' },
    // metadata__service_bitcoin__recipient_public_address: {
    //   label: 'Address',
    // },
    // status: {
    //   type: 'select',
    //   options: ['Complete', 'Pending', 'Failed'],
    // },
    // initialFilters: { page_size: { value: 15 } },
  },
  columns: [
    {
      label: 'product_name',
      value: 'name',
      imageValue: 'images',
      variant: 'image',
    },
    // { label: 'Description', value: 'description' },
    {
      label: 'quantity',
      value: item => {
        const { quantity, variants, tracked } = item;
        let variantQuantity = 0;
        for (let i = 0; i < variants.length; i++) {
          const variant = variants[i];
          if (variant?.tracked && variant?.quantity !== null) {
            variantQuantity = variantQuantity + variant.quantity;
          }
        }
        return !tracked && !variantQuantity
          ? 'Untracked'
          : variantQuantity
          ? variantQuantity
          : quantity;
      },
    }, //props: { align: 'right' }
    // { label: 'Supplier', value: 'supplier' },
    {
      label: 'voucher',
      value: 'voucher_schema',
      width: 90,
      variant: 'boolean',
    },
    { label: 'enabled', value: 'enabled', variant: 'boolean' },
    {
      label: 'created',
      value: 'created',
      variant: 'date',
      width: 100,
    },
  ],
  actions: [{ label: 'new_product', id: 'new' }],

  // filterConfig: {
  //   type: {
  //     label: 'Available',
  //     type: 'text',
  //   },
  //   enabled: {
  //     label: 'Expired',
  //     type: 'boolean',
  //   },
  //   id: {
  //     label: 'Complete',
  //     type: 'text',
  //   },
  // },
  emptyListMessage: 'no_products',
  initialFilters: { page_size: { value: 15 } },
};

const exportConfigs = {
  id: 'products',
  title: 'products',
  value: '',
  services: {
    fetchData,
    fetchItem,
    createData,
    updateData: createData,
    deleteItem,
  },
  components: {
    form: formConfig,
    detail: detailConfig,
    list: listConfig,
  },
};

export default exportConfigs;
