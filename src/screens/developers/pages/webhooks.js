import {
  getUserRequestWebooks,
  createUserRequestWebook,
  updateUserRequestWebook,
  deleteUserRequestWebook,
} from 'util/rehive';

const defaultValues = {
  url: '',
  secret: '',
  event: '',
};
const servicePaymentRequestLabels = [
  {
    key: 'service_payment_requests.request.create',
    value: 'Payment requests: Create request',
  },
  {
    key: 'service_payment_requests.request.update',
    value: 'Payment requests: Update request',
  },
  // {
  //   key: 'service_payment_requests.quote.create',
  //   value: 'Payment requests: Quote create',
  // },
  // {
  //   key: 'service_payment_requests.otp.create',
  //   value: 'Payment requests: OTP create',
  // },
  // {
  //   key: 'service_payment_requests.payer_reminder',
  //   value: 'Payment requests: Payer reminder',
  // },
  // {
  //   key: 'service_payment_requests.payer_requested',
  //   value: 'Payment requests: Payer requested',
  // },
];

async function createData(values, control, props) {
  const { history, onSuccess, showToast } = props;
  const { setSubmitting, setErrors } = control;

  if (typeof setSubmitting === 'function') setSubmitting(true);
  const { secret, url, id, event } = values;

  const data = {
    secret,
    url,
    event,
  };
  let resp = null;
  if (id) {
    resp = await updateUserRequestWebook(id, data);
  } else {
    resp = await createUserRequestWebook(data);
  }

  if (resp.status === 'success') {
    onSuccess(resp?.data?.id);
    showToast({
      id: id ? 'webhook_update_success' : 'webhook_add_success',
      variant: 'success',
    });
    history.push('/developers/');
  } else {
    showToast({
      id: id ? 'webhook_update_error' : 'webhook_add_error',
      variant: 'error',
    });
  }
  if (typeof setSubmitting === 'function') setSubmitting(false);
  return values;
}

const eventValue = row => {
  return servicePaymentRequestLabels.find(label => label.key === row?.event)
    ?.value;
};

const formConfig = () => {
  let fields = ['url', 'secret', 'event'];
  return {
    title: 'add_webhook',
    defaultValues,
    variant: 'tabs',
    submitLabel: 'add',
    mode: 'onChange',
    criteriaMode: 'all',
    isInvalid: false,
    validation: ({ values }) => {
      // Check if all required fields have values
      const hasUrl = values?.url && values.url.trim().length > 0;
      const hasSecret = values?.secret && values.secret.trim().length > 0;
      const hasEvent = values?.event && values.event.trim().length > 0;
      
      const customValidation = hasUrl && hasSecret && hasEvent;
      
      return customValidation;
    },
    onSubmit: createData,
    fields,
  };
};

async function fetchData(cnt, event) {
  try {
    let resp = await getUserRequestWebooks();
    if (resp.status === 'success') {
      return resp?.data;
    }
  } catch (e) {
    console.log('fetchData -> e', e);
  }
}

async function onDelete(event, id, props) {
  const { onSuccess, showToast } = props;
  const resp = await deleteUserRequestWebook(id);
  if (resp.status === 'success') {
    onSuccess();
    showToast({ id: 'webhook_delete_success', variant: 'success' });
  } else {
    showToast({ id: 'webhook_delete_error', variant: 'error' });
  }
}

const list = {
  variant: 'table',
  actions: [{ label: 'new_webhook', id: 'new' }],

  pagination: true,
  columns: [
    {
      label: 'url',
      value: 'url',
    },
    {
      label: 'secret',
      value: 'secret',
    },
    {
      label: 'event',
      value: eventValue,
    },
  ],
  onDelete,

  emptyListMessage: 'no_webhooks',
  initialFilters: { page_size: { value: 15 } },
};

const exportConfigs = {
  id: 'webhooks',
  title: 'webhooks',
  value: '',
  services: {
    fetchData,
    fetchItem: () => {},
    createData,
    updateData: createData,
  },
  components: {
    list,
    form: formConfig,
    // item: Text,
  },
};

export default exportConfigs;
