import {
  getOrdersAdmin,
  updateOrderAdmin,
  createOrderAdmin,
} from 'util/rehive';
import Inputs from '../components/inputs';

async function fetchData() {
  try {
    const resp = await getOrdersAdmin();
    if (resp.status === 'success') {
      return resp?.data;
    }
  } catch (error) {
    return { error };
  }
}
const defaultValues = {
  url: '',
  secret: '',
};

async function createData(values, control, props) {
  const { history, onSuccess, showToast } = props;
  const { setSubmitting, setErrors } = control;

  if (typeof setSubmitting === 'function') setSubmitting(true);
  const { secret, url, id } = values;

  const data = {
    secret,
    url,
  };
  let resp = null;
  if (id) {
    resp = await updateOrderAdmin(id, data);
  } else {
    resp = await createOrderAdmin(data);
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

const formConfig = () => {
  let fields = ['user', 'currency', 'products'];
  return {
    title: 'Create order',
    defaultValues,
    submitLabel: 'CREATE',
    onSubmit: createData,
    inputComponents: Inputs,
    fields,
  };
};

const detailConfig = {
  id: 'summary',
  title: '',
  sections: [
    {
      id: '',
      fields: [
        { label: 'campaign_name', value: 'name' },
        { label: 'campagin_description', value: 'description' },
      ],
    },
  ],
};

const exportConfigs = {
  label: 'Orders',
  services: { fetchData, createData, updateData: createData },
  components: {
    list: {
      variant: 'table',
      columns: [
        { label: 'ID', value: 'id' },
        { label: 'User', value: 'user' },
        { label: 'status', value: 'status', variant: 'status' },
        { label: 'Total price', value: 'total_price', variant: 'amount' },

        {
          label: 'Placed',
          value: 'placed',
          variant: 'date_time',
        },
      ],
      filterConfig: {
        type: {
          label: 'Available',
          type: 'text',
        },
        enabled: {
          label: 'Expired',
          type: 'boolean',
        },
        id: {
          label: 'Complete',
          type: 'text',
        },
      },
      emptyListMessage: 'no_rewards',
      initialFilters: { page_size: { value: 15 } },
    },
    detail: detailConfig,
    form: formConfig,
  },
};

export default exportConfigs;
