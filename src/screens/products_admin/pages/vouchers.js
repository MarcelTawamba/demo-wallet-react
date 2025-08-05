import Inputs from '../components/inputs';
import {
  importVouchers,
  createVoucher,
  getSellers,
  getVouchers,
} from 'screens/products_admin/util/rehive';
import { convertToFormData } from 'util/methods';

const defaultValues = {
  product: '',
  voucher_codes: [],
  vouchers_csv: null,
};

async function createData(values, control, props) {
  const { history, onSuccess, showToast, context } = props;
  console.log('createData -> props', props);
  const sellerId = context?.sellers?.[0]?.id ?? '';
  const { setSubmitting, setError } = control;

  if (typeof setSubmitting === 'function') setSubmitting(true);
  const { product, vouchers_csv, voucher_codes } = values;
  const productId = product?.id;

  let resp = null;
  let error = '';
  if (vouchers_csv) {
    let formData = convertToFormData([
      { key: 'file', value: vouchers_csv },
      { key: 'product', value: productId },
    ]);
    resp = await importVouchers(sellerId, formData);
  } else {
    for (let i = 0; i < voucher_codes.length; i++) {
      const data = {
        product: productId,
        code: voucher_codes?.[i]?.code ?? '',
      };
      resp = await createVoucher(sellerId, data);
      if (resp?.status === 'error') {
        setError(`voucher_codes[${i}].code`, error);
        error = resp?.message;
      }
    }
  }

  if (resp?.status === 'success' && !error) {
    onSuccess(resp?.data?.id);
    showToast({ id: 'voucher_codes_add_success', variant: 'success' });
    history.push('/products_admin/vouchers/');
  } else {
    showToast({
      id:
        'voucher_codes_add_error' + (resp?.message ? ': ' + resp?.message : ''),
      variant: 'error',
    });
    // setError(vouchers_csv ? 'vouchers_csv' : 'voucher_codes', resp);
  }
  if (typeof setSubmitting === 'function') setSubmitting(false);
  return values;
}
const formConfig = props => {
  const { context } = props;
  const { sellers, loading } = context;
  const isVerifiedSeller = sellers?.[0]?.status === 'verified';
  let fields = ['product', 'voucher_codes'];
  const tabs = ['general'];
  const sections = [
    {
      id: 'product',
      title: 'product_details',
      tab: 'general',
      fields: ['product'],
      // actions: ['edit'],
    },
    {
      id: 'voucher_codes',
      title: 'voucher_codes',
      tab: 'general',
      fields: ['voucher_codes'],
    },
  ];
  return {
    title: 'add_voucher_codes',
    defaultValues,
    submitLabel: 'ADD',
    onSubmit: createData,
    inputComponents: Inputs,
    sections,
    // actions: [
    //   { label: 'Cancel', variant: 'outlined' }, //, onPress: handleBack },
    //   { label: 'Save', type: 'submit' }, //, onPress: onSubmit, disabled: !isValid },
    // ],
    tabs,
    fields,
    variant: 'tabs',
    isInvalid: !isVerifiedSeller,
    warning:
      isVerifiedSeller || loading
        ? ''
        : 'add_voucher_seller_verification_required',
  };
};

async function fetchData() {
  try {
    const query = window?.location?.search;
    const sellers = await getSellers();
    const sellerId = sellers?.data?.results?.[0]?.id ?? '';
    const resp = await getVouchers(sellerId, query);
    if (resp.status === 'success') {
      return resp?.data;
    }
  } catch (error) {
    return { error };
  }
}

const detailConfig = {
  id: 'summary',
  title: '',
  variant: true,
  actions: [{ label: 'new_voucher', id: 'new' }],
  skeleton: [''],
  sections: [
    {
      id: 'summary',
      fields: [
        { label: 'code_id', id: 'id', value: 'id' },
        { label: 'product_name', id: 'product_name', value: 'product.name' },
        // {
        //   label: 'format',
        //   id: 'format',
        //   value: 'product.virtual_format',
        //   standardize: true,
        // },
        {
          label: 'status',
          id: 'status',
          value: 'status',
          variant: 'status',
        },
        {
          id: 'code',
          label: 'voucher_code',
          value: 'code',
        },
        {
          label: 'date_created',
          id: 'created',
          value: 'created',
          variant: 'datetime',
        },
        {
          label: 'date_updated',
          id: 'updated',
          value: 'updated',
          variant: 'datetime',
        },
      ],
    },
  ],
};

const listConfig = {
  variant: 'table',
  pagination: true,
  actions: [{ label: 'new_voucher', id: 'new' }],
  columns: [
    { label: 'code_id', value: 'id' },
    { label: 'product_name', value: 'product.name' },
    { label: 'voucher_code', value: 'code' },
    // {
    //   label: 'Format',
    //   value: item => {
    //     const format = item?.product?.virtual_format ?? '';
    //     if (format === 'raw') {
    //       return 'Raw text';
    //     }
    //     return format.toUpperCase();
    //   },
    // },
    {
      label: 'status',
      value: 'status',
      variant: 'status',
    },
    {
      label: 'created',
      value: 'created',
      variant: 'date_time',
      width: 100,
    },
  ],

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
  emptyListMessage: 'no_vouchers',
  initialFilters: { page_size: { value: 15 } },
};

const exportConfigs = {
  id: 'vouchers',
  title: 'vouchers',
  value: 'vouchers',
  services: {
    fetchData,
    createData,
    updateData: createData,
  },
  components: {
    form: formConfig,
    detail: detailConfig,
    list: listConfig,
  },
};

export default exportConfigs;
