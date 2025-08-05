import {
  getBusinesses,
  getBusinessPayouts,
  getBusinessPayoutTransactions,
  createBusinessPayout,
} from 'util/rehive';
import PayoutDetailHeader from '../components/PayoutDetailHeader';
import DestinationsSection from '../components/DestinationsSection';

async function fetchData(props, page) {
  let { reduxContext } = props;
  let { business } = reduxContext;
  let businessId = business?.id;
  const search = '';
  try {
    let resp = null;
    if (!businessId) {
      resp = await getBusinesses();
      business = resp?.data?.results[0] ?? {};
      businessId = business?.id;
    }

    let { search } = window?.location ?? {};
    if (search) search = search + '&page=' + page;
    else if (page !== 1) search = '?page=' + page;
    resp = await getBusinessPayouts(businessId, search);
    if (resp.status === 'success') {
      return resp?.data;
    }
  } catch (e) {
    console.log('fetchData -> e', e);
  }
}

const detailConfig = accounts => {
  return {
    id: 'summary',
    title: '',
    renderHeader: PayoutDetailHeader,
    sections: [
      {
        id: 'overview',
        fields: [
          { label: 'date_paid', value: 'created', variant: 'date', width: 100 },
          // {
          //   label: 'customer',
          //   value: 'metadata.service_payment_requests.payer_email',
          //   type: 'email',
          // },
          // {
          //   label: 'Description',
          //   value: 'metadata.service_payment_requests.request_reference',
          // },
          { label: 'status', value: 'status' },
          // {
          //   label: 'Payment method',
          //   value: 'metadata.service_payment_requests.payment_processor',
          // },
          { label: 'amount', value: 'amount', variant: 'amount' },
          { label: 'fee', value: () => 0, variant: 'amount' },
          { label: 'net', value: 'amount', variant: 'amount' },
        ],
      },
      {
        id: 'destinations',
        component: DestinationsSection,
      },
      {
        id: 'transactions',
        title: '',
        fields: [],
        table: {
          tableConfig: {
            fetchData: async ({ context, item }) => {
              if (!item || !context?.business?.id) {
                return [];
              }
              const resp = await getBusinessPayoutTransactions(
                context?.business?.id,
                item?.id,
              );
              if (resp.status === 'success') {
                return resp?.data?.results ?? [];
              }
              return [];
            },
            // handleSelection: (item, { history }) =>
            //   history.push('/payments/' + (item?.id ?? '') + '/'),
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
              // {
              //   label: 'type',
              //   // value: 'metadata.service_payment_requests.payer_email',
              // },
              // {
              //   label: 'description',
              //   // value: 'metadata.service_payment_requests.payer_email',
              // },
              {
                label: 'date',
                value: 'created',
                variant: 'date',
              },
            ],
          },
          // value: 'metadata.service_business.items',
        },
      },
      // {
      //   id: 'session',
      // },
      // {
      //   id: 'metadata',
      //   fields: [{ label: 'metadata', value: 'metadata', type: 'json' }],
      // },
    ],
  };
};
const defaultValues = {
  url: '',
  secret: '',
};

async function createData(values, control, props) {
  const { history, onSuccess, showToast, context = {} } = props;
  const { business } = context;
  const { setSubmitting, setErrors } = control;

  if (typeof setSubmitting === 'function') setSubmitting(true);
  const { reference, ...destination } = values;

  const data = {
    reference,
    destinations: [
      {
        ...destination,
        type: 'native',
        percentage: 100,
        currency: 'USD',
      },
    ],
  };
  let resp = null;
  resp = await createBusinessPayout(business?.id, data);

  // if (resp.status === 'success') {
  //   onSuccess(resp?.data?.id);
  //   showToast({ id: id ? 'webhook_update_success' : 'webhook_add_success' });
  //   history.push('/developers/');
  // } else {
  //   showToast({ id: id ? 'webhook_update_error' : 'webhook_add_error' });
  // }
  if (typeof setSubmitting === 'function') setSubmitting(false);
  return values;
}

const formConfig = () => {
  let fields = ['reference', 'currency', 'type', 'percentage', 'account'];
  return {
    title: 'create_payout',
    defaultValues,
    submitLabel: 'create',
    onSubmit: createData,
    fields,
  };
};

const exportConfigs = {
  '': {
    id: 'payouts',
    title: 'payouts',
    value: '',

    services: {
      fetchData,
      // createData,
    },
    components: {
      list: {
        pagination: true,
        variant: 'table',
        actions: [
          {
            label: 'update_my_payout_bank_account',
            id: 'business',
          },
        ],
        columns: [
          {
            label: 'amount',
            value: 'amount',
            variant: 'amount',
            props: {
              align: 'left',
            },
          },
          // { label: 'id', value: 'id' },
          { label: 'status', value: 'status', variant: 'status' },
          // {
          //   label: 'destination',
          //   value: 'metadata.service_payment_requests.request_reference',
          // },
          // {
          //   label: en.due,
          //   value: 'due_date',
          //   type: 'date',
          // },
          {
            label: 'date',
            value: 'created',
            variant: 'date',
            width: 100,
          },
        ],
        emptyListMessage: 'no_payouts',
        initialFilters: { page_size: { value: 15 } },
      },
      detail: detailConfig,
      form: formConfig,
    },
  },
};

export default exportConfigs;
