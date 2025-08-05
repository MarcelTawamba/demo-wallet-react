import {
  getCampaignsAdmin,
  updateCampaignAdmin,
  createCampaignAdmin,
} from 'util/rehive';
import Inputs from '../../components/inputs';
import moment from 'moment';

const defaultValues = {
  url: '',
  secret: '',
  name: '',
  description: '',
  timeframe: 'none',
  campaign_type: 'claim',
  amount_type: 'fixed',
  default_status: 'accepted',
  event: 'user.create',
  active: true,
  visible: true,
  currency: '',
  end_date: new Date(),
  start_date: new Date(),
  credit_account_name: 'rewards',
};

async function createData(values, control, props) {
  const { history, onSuccess, showToast } = props;
  const { setSubmitting, setErrors } = control;

  if (typeof setSubmitting === 'function') setSubmitting(true);
  const { end_date, start_date } = values;
  const id = props?.item?.id ?? values?.id ?? '';

  const data = {
    ...values,
    end_date: moment(end_date).valueOf(),
    start_date: moment(start_date).valueOf(),
    currency:
      values?.currency?.code ??
      values?.currency ??
      props?.item?.currency?.code ??
      '',
  };

  let resp = null;
  if (id) {
    resp = await updateCampaignAdmin(id, data);
  } else {
    resp = await createCampaignAdmin(data);
  }

  if (resp.status === 'success') {
    onSuccess(resp?.data?.id);
    showToast({
      id: id ? 'campaign_update_success' : 'campaign_add_success',
      variant: 'success',
    });
    history.push('/rewards_admin/');
  } else {
    showToast({
      id: id ? 'campaign_update_error' : 'campaign_add_error',
      variant: 'error',
    });
  }
  if (typeof setSubmitting === 'function') setSubmitting(false);
  return values;
}

const formConfig = (props = {}) => {
  const { item } = props;

  let fields = [
    'campaign_name',
    'campaign_description',
    // 'rewards_account',
    'campaign_currency',
    'timeframe',
    'start_date',
    'end_date',
    'reward_total',
    // 'campaign_type',
    // {
    //   id: 'event',
    //   condition: ({ campaign_type }) => campaign_type === 'event',
    // },
    // {
    //   id: 'event_user',
    //   condition: ({ campaign_type }) => campaign_type === 'event',
    // },
    // {
    //   id: 'event_amount',
    //   condition: ({ campaign_type }) => campaign_type === 'event',
    // },
    // {
    //   id: 'expression',
    //   condition: ({ campaign_type }) => campaign_type === 'event',
    // },
    // {
    //   id: 'amount_type_event',
    //   condition: ({ campaign_type }) => campaign_type === 'event',
    // },
    // {
    //   id: 'amount_type_claim',
    //   condition: ({ campaign_type }) => campaign_type === 'claim',
    // },
    {
      id: 'reward_amount',
      // condition: ({ campaign_type }) => campaign_type === 'claim',
    },
    'max_per_user',
    'default_status',
    { id: 'variant', variant: 'group', fields: ['active', 'visible'] },
    // 'recipient_account',
  ];
  return {
    title: (item?.id ? 'edit' : 'create') + '_campaign',
    defaultValues,
    submitLabel: item?.id ? 'save' : 'add',
    capitalize: true,
    onSubmit: createData,
    inputComponents: Inputs,
    fields,
  };
};

async function fetchData() {
  try {
    const query = 'available=true';
    const resp = await getCampaignsAdmin(query);
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
  sections: [
    {
      id: 'Campaign details',
      fields: [
        { label: 'campaign_name', value: 'name' },
        { label: 'campagin_description', value: 'description' },
        { label: 'campaign_currency', value: 'currency', variant: 'currency' },
        { label: 'timeframe', value: 'timeframe', standardize: true },
        { label: 'start_date', value: 'start_date', variant: 'date' },
        { label: 'end_date', value: 'end_date', variant: 'date' },
        { label: 'reward_total', value: 'reward_total' },
        { label: 'reward_amount', value: 'reward_amount' },
        { label: 'max_per_user', value: 'max_per_user' },
        { label: 'default_status', value: 'default_status', standardize: true },
        { label: 'active', value: 'active', variant: 'boolean' },
        { label: 'visible', value: 'visible', variant: 'boolean' },
      ],
    },
  ],
};

const exportConfigs = {
  id: 'campaigns',
  title: 'campaigns',
  value: '',
  services: {
    fetchData,
    createData,
    updateData: createData,
  },
  components: {
    form: formConfig,
    detail: detailConfig,
    list: {
      variant: 'table',
      columns: [
        {
          label: 'Campaign ID',
          value: 'id',
          width: 50,
          props: {
            style: {
              maxWidth: 50,
            },
          },
        },
        {
          label: 'name',
          value: 'name',
        },
        {
          label: 'description',
          value: 'description',
          width: 50,
          props: {
            style: {
              maxWidth: 50,
            },
          },
        },
        {
          label: 'active',
          value: 'active',
          variant: 'boolean',
        },
        {
          label: 'visible',
          value: 'active',
          variant: 'boolean',
        },
        {
          label: 'start_date',
          value: 'start_date',
          variant: 'date',
        },
        {
          label: 'end_date',
          value: 'end_date',
          variant: 'date',
        },
        {
          label: 'balance',
          value: 'balance',
          variant: 'amount',
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
  },
};

export default exportConfigs;
