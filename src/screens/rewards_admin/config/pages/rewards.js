import {
  getRewardsAdmin,
  updateRewardAdmin,
  createRewardAdmin,
} from 'util/rehive';

async function fetchData() {
  try {
    const resp = await getRewardsAdmin();
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
    resp = await updateRewardAdmin(id, data);
  } else {
    resp = await createRewardAdmin(data);
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
  let fields = [
    'campaign_name',
    'user',
    'amount',
    'currency',
    'status',
    'reward_type',
  ];
  return {
    title: 'Add reward',
    defaultValues,
    submitLabel: 'ADD',
    onSubmit: createData,
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
        { label: 'id', value: 'id' },
        { label: 'campaign_name', value: 'campaign.name' },
        { label: 'campagin_description', value: 'campaign.description' },
        { label: 'amount', value: 'amount', variant: 'amount' },
        { label: 'date_created', value: 'created', variant: 'date' },
        // { label: 'default_status', value: 'campaign.default_status', standardize: true },
        { label: 'status', value: 'status', standardize: true },
        // { label: 'active', value: 'campaign.active', variant: 'boolean' },
      ],
    },
  ],
};

const exportConfigs = {
  id: 'rewards',
  label: 'rewards',
  services: { fetchData }, //, createData, updateData: createData },
  components: {
    list: {
      variant: 'table',
      columns: [
        {
          label: 'Rewards ID',
          value: 'id',
          width: 50,
          props: {
            style: {
              maxWidth: 50,
            },
          },
        },
        {
          label: 'user',
          value: 'user',
        },
        {
          label: 'campaign',
          value: 'campaign.name',
        },
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
          label: 'created',
          value: 'created',
          variant: 'date',
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
