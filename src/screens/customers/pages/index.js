import {
  createBusinessUser,
  getBusinessInvoices,
  getBusinessTransactions,
  getBusinessUsers,
  getBusinessUser,
  getBusinesses,
} from 'util/rehive';

const defaultValues = {
  email: '',
  mobile: '',
};

async function onSubmit(values, control, props) {
  const { history, context, onSuccess, showToast } = props;
  const { setSubmitting, setErrors } = control;
  const { business = {} } = context;
  let businessId = business?.id;

  if (!businessId) {
    const respBusinesses = await getBusinesses();
    const tempBusiness = respBusinesses?.data?.results[0] ?? {};
    businessId = tempBusiness?.id;
  }

  if (typeof setSubmitting === 'function') setSubmitting(true);
  const { email, mobile } = values;
  let data = {
    roles: ['customer'],
  };
  if (email) data.email = email;
  if (mobile) data.mobile = mobile;
  const resp = await createBusinessUser(businessId, data);
  if (resp.status === 'success') {
    onSuccess(resp?.data?.id);
    showToast({ id: 'customer_add_success', variant: 'success' });
    history.push('/customers/' + resp?.data?.id + '/');
  } else {
    showToast({
      id: 'customer_add_error' + (resp?.message ? ': ' + resp?.message : ''),
      variant: 'error',
    });
  }
  if (typeof setSubmitting === 'function') setSubmitting(false);
}

const formConfig = props => {
  const { context = {} } = props;
  const { business = {} } = context;
  const { currency, status } = business;
  const isVerified = status === 'verified';

  return {
    title: 'add_customer',
    defaultValues,
    variant: 'tabs',
    hideScreenHeader: true,
    saveLabel: 'send',
    saveLabelCapitalize: true,
    warning: isVerified ? '' : 'add_customer_warning',
    onSubmit,
    isInvalid: !isVerified,
    // fields: ['email', 'mobile'],
    sections: [
      {
        id: 'customer_information',
        title: 'customer_information',
        fields: ['email'],
      },
    ],
  };
};

const tableConfigs = {
  customerTransactions: {
    fetchData: async ({ context, business, item }) => {
      if (!business && context) {
        ({ business } = context);
      }

      if (!item || !business?.id) {
        return [];
      }
      if (business?.id) {
        const resp = await getBusinessTransactions(
          business?.id,
          '?metadata__service_payment_requests__payer_email=' +
            (item?.email ? encodeURIComponent(item.email) : ''),
        );
        if (resp.status === 'success') {
          return resp?.data?.results ?? [];
        }
      }
      return [];
    },
    columns: [
      {
        label: 'amount',
        value: 'amount',
        variant: 'amount',
      },
      {
        label: 'status',
        value: 'status',
        variant: 'status',
      },
      {
        label: 'type',
        value: 'subtype',

        // standardize: true,
      },
      {
        label: 'description',
        value: 'description',
      },
      {
        label: 'date',
        value: 'created',
        variant: 'date',
      },
    ],
  },
  customerInvoices: {
    fetchData: async ({ context, business, item }) => {
      if (!business && context) {
        ({ business } = context);
      }
      if (!item || !business?.id) {
        return [];
      }
      const resp = await getBusinessInvoices(
        business?.id,
        '?payer_email=' + encodeURIComponent(item?.email || ''),
      );
      return resp?.data?.results ?? [];
    },
    handleSelection: (item, { history }) =>
      history.push('/invoices/' + (item?.id ?? '') + '/'),
    pagination: true,
    columns: [
      {
        label: 'amount',
        value: 'request_amount',
        variant: 'amount',
      },
      {
        label: 'invoice_number',
        value: 'request_reference',
      },
      {
        label: 'status',
        value: 'status',
        variant: 'status',
      },
      {
        label: 'due',
        value: 'due_date',
        variant: 'date',
      },
      {
        label: 'created',
        value: 'created',
        variant: 'date',
      },
    ],
  },
};

const detailConfig = {
  id: 'summary',
  title: 'Customer',
  sections: [
    {
      id: 'details',
      fields: [
        'email',
        { label: 'first_name', value: 'user.first_name' },
        { label: 'last_name', value: 'user.last_name' },
        'mobile',
        { label: 'send_emails_to', value: 'email' },
        {
          label: 'created',
          value: 'created',
          type: 'date',
          width: 100,
        },
      ],
    },
    {
      id: 'invoices',
      fields: [],
      table: tableConfigs['customerInvoices'],
    },
    {
      id: 'transactions',
      fields: [],
      table: tableConfigs['customerTransactions'],
    },
  ],
};

async function fetchData(props, page) {
  let { reduxContext } = props;
  let { business } = reduxContext;
  let businessId = business?.id;
  try {
    let resp = null;
    if (!businessId) {
      resp = await getBusinesses();
      business = resp?.data?.results[0] ?? {};
      businessId = business?.id;
    }
    if (businessId) {
      let { search } = window?.location ?? {};
      search = search + (search ? '&' : '?') + 'roles=customer';
      if (search && page !== 1) search = search + '&page=' + page;
      const resp = await getBusinessUsers(businessId, search);
      return resp?.data;
    }
  } catch (e) {
    console.log('fetchData -> e', e);
  }
}
async function fetchItem(itemId, props) {
  let { reduxContext } = props;
  let { business } = reduxContext;
  let businessId = business?.id;
  return await getBusinessUser(businessId, itemId);
}

const listConfig = {
  filterConfig: {
    email: {
      type: 'text',
    },
    mobile: {
      type: 'text',
    },
    first_name: {
      type: 'text',
    },
    last_name: {
      type: 'text',
    },
    // role: {
    //   type: 'select',
    //   options: ['customer', 'manager'],
    // },
  },
  variant: 'table',

  pagination: true,
  columns: [
    { label: 'email', value: 'email', variant: 'email' },
    { label: 'last_name', value: 'user.last_name' },
    { label: 'first_name', value: 'user.first_name' },
    // { label: 'name', value: concatName },
    { label: 'mobile', value: 'mobile' },
    { label: 'role', value: 'roles.0', standardize: true },
    {
      label: 'created',
      value: 'created',
      variant: 'date',
      width: 100,
    },
  ],

  actions: [{ label: 'new_customer', id: 'new' }],

  emptyListMessage: 'no_customers',
  initialFilters: { page_size: { value: 15 } },
};

const pages = {
  '': {
    id: 'customers',
    title: 'customers',
    value: '',
    services: {
      fetchData,
      fetchItem,
    },
    components: {
      detail: detailConfig,
      form: formConfig,
      list: listConfig,
    },
  },
};

export default pages;
