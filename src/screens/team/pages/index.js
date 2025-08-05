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
    const respBusinessness = await getBusinesses();
    const tempBusiness = respBusinessness?.data?.results[0] ?? {};
    businessId = tempBusiness?.id;
  }

  if (typeof setSubmitting === 'function') setSubmitting(true);
  const { email, mobile } = values;
  let data = {
    roles: ['manager'],
  };
  if (email) data.email = email;
  if (mobile) data.mobile = mobile;
  const resp = await createBusinessUser(businessId, data);
  if (resp.status === 'success') {
    onSuccess(resp?.data?.id);
    showToast({ id: 'manager_add_success', variant: 'success' });
    history.push('/team/' + resp?.data?.id + '/');
  } else {
    showToast({
      id: 'manager_add_error' + (resp?.message ? ': ' + resp?.message : ''),
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
    title: 'invite_new_team_member',
    defaultValues,
    variant: 'tabs',
    hideScreenHeader: true,
    description: 'add_manager_description',
    saveLabel: 'send',
    saveLabelCapitalize: true,
    warning: isVerified ? '' : 'add_manager_require_business_verification',
    onSubmit,
    isInvalid: !isVerified,
    sections: [
      {
        id: 'manager_information',
        title: 'manager_information',
        fields: ['email'],
      },
    ],
  };
};

const detailConfig = {
  id: 'summary',
  title: 'manager',
  sections: [
    {
      id: 'details',
      fields: [
        'email',
        { label: 'first_name', value: 'user.first_name' },
        { label: 'last_name', value: 'user.last_name' },
        'mobile',
        { label: 'send_emails_to', value: 'email' },
        { label: 'billing', value: 'billing' },
        { label: 'birth_date', value: 'birth_date', type: 'date' },
        {
          label: 'created',
          value: 'created',
          type: 'date',
          width: 100,
        },
      ],
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
      search = search + (search ? '&' : '?') + 'roles=manager';
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

async function onDelete(event, id, props) {
  event.stopPropagation();
  const { context } = props;
  const { openModal } = context;
  openModal({ id, ...props }); // delete operation will be executed on the modal
}

const listConfig = {
  filterConfig: {
    first_name: {
      type: 'text',
    },
    last_name: {
      type: 'text',
    },
    email: {
      type: 'text',
    },
    // role: {
    //   type: 'select',
    //   options: ['customer', 'manager'],
    // },
  },
  variant: 'table',

  pagination: true,
  description: 'add_and_manage_team',
  columns: [
    { label: 'last_name', value: 'user.last_name' },
    { label: 'first_name', value: 'user.first_name' },
    { label: 'email', value: 'email', variant: 'email' },
    { label: 'role', value: 'roles.0', standardize: true },
    // { label: 'status', value: 'email', variant: 'email' },
    {
      label: 'created',
      value: 'created',
      variant: 'date',
      width: 100,
    },
  ],

  actions: [{ label: 'add_new_manager', id: 'new' }],
  onDelete,
  emptyListMessage: 'no_managers',
  initialFilters: { page_size: { value: 15 } },
};

const pages = {
  '': {
    id: 'team',
    title: 'team',
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
