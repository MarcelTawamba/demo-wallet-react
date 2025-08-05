import {
  createUserToken,
  getBusinesses,
  getUserTokens,
  deleteUserToken,
  getBusinessTransactions,
} from 'util/rehive';
import { dataMachine } from 'util/machines/DataMachine';
import PayoutDetailHeader from '../../components/Documentation';

const defaultValues = {
  email: '',
  mobile: '',
};

// async function createData(values, control, props) {
//   const { history, onSuccess, showToast } = props;
//   const { setSubmitting, setErrors } = control;

//   if (typeof setSubmitting === 'function') setSubmitting(true);
//   const { password, token_duration } = values;
//   let data = {
//     password,
//     duration: parseInt(token_duration === '' ? 0 : token_duration),
//     auth_method: 'token',
//   };
//   const resp = await createUserToken(data);
//   if (resp.status === 'success') {
//     onSuccess(resp?.data?.id);
//     showToast({ id: 'token_add_success' });
//     history.push('/developers/api_tokens/');
//   } else {
//     showToast({ id: 'token_add_error' });
//   }
//   if (typeof setSubmitting === 'function') setSubmitting(false);
// }

// const formConfig = props => {
//   const { company } = props;
//   let fields = ['password'];
//   if (company?.settings?.allow_session_durations) {
//     fields.push('token_duration');
//   }
//   return {
//     title: 'Add token',
//     defaultValues,
//     submitLabel: 'ADD',
//     // onSubmit: createData,
//     fields,
//   };
// };

async function fetchData(context, event) {
  let { business } = context;
  let businessId = business?.id;
  const search = '';
  try {
    let resp = null;
    if (!businessId) {
      resp = await getBusinesses();
      business = resp?.data?.results[0] ?? {};
      businessId = business?.id;
    }

    resp = await getBusinessTransactions(
      businessId,
      (search ? search + '&' : '?') + 'tx_type=credit&account_name=sales',
    );
    if (resp.status === 'success') {
      return resp?.data;
    }
  } catch (e) {
    console.log('fetchData -> e', e);
  }
}

async function onDelete(event, id, props) {
  const { history, onSuccess, showToast } = props;
  const resp = await deleteUserToken(id);
  if (resp.status === 'success') {
    onSuccess();
    showToast({ id: 'token_delete_success', variant: 'success' });
    history.push('/developers/api_tokens/');
  } else {
    showToast({ id: 'token_delete_error', variant: 'error' });
  }
}
export const apiTokensMachine = dataMachine('payouts').withConfig({
  services: {
    fetchData,
    // deleteData,
    // createData,
  },
});

const detailConfig = accounts => {
  return {
    id: 'summary',
    title: '',
    renderHeader: PayoutDetailHeader,
    sections: [
      {
        id: 'overview',
        fields: [
          { label: 'Date paid', value: 'created', variant: 'date', width: 100 },
          {
            label: 'customer',
            value: 'metadata.service_payment_requests.payer_email',
            type: 'email',
          },
          {
            label: 'Description',
            value: 'metadata.service_payment_requests.request_reference',
          },
          { label: 'status', value: 'status' },
          {
            label: 'Payment method',
            value: 'metadata.service_payment_requests.payment_processor',
          },
          { label: 'Amount', value: 'amount', variant: 'amount' },
          { label: 'Fee', value: () => 0, variant: 'amount' },
          { label: 'Net', value: 'amount', variant: 'amount' },
        ],
      },
      {
        id: 'payment_method',
        fields: [
          {
            label: 'Payment method',
            value: 'metadata.service_payment_requests.payment_processor',
          },
          { label: 'Transaction ID', value: 'id' },
          // {
          //   label: 'Account name',
          //   value: item =>
          //     standardizeString (accounts?.[item?.account] ?? item?.account),
          // },
          // { label: 'Account name', value: 'account' },
          { label: 'Account reference', value: 'account' },
        ],
      },
      {
        id: 'connections',
        fields: [
          {
            label: 'invoice',
            value: 'metadata.service_payment_requests.request_id',
            link: '/invoices/',
          },
          // { label: en.conversion, value: 'billing' },
          // { label: en.payout, value: 'billing' },
        ],
      },
      {
        id: 'session',
      },
      {
        id: 'metadata',
        fields: [{ label: 'metadata', value: 'metadata', type: 'json' }],
      },
    ],
  };
};

const exportConfigs = {
  '': {
    id: 'payouts',
    title: 'payouts',
    value: '',
    detailConfig,
    // formConfig,
    fetchData,
    machine: apiTokensMachine,
    component: {
      variant: 'table',
      config: {
        pagination: true,
        columns: [
          {
            label: 'amount',
            value: 'amount',
            variant: 'amount',
            props: {
              align: 'right',
            },
          },
          // { label: 'id', value: 'id' },
          { label: 'status', value: 'status', variant: 'status' },
          {
            label: 'destination',
            value: 'metadata.service_payment_requests.request_reference',
          },
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

        detailComponent: 'outputTable',
        // add: 'New',
        // export: true,
        // edit: true,
        // onDelete,
        // actions: {
        //   '': ['new'],
        //   view: ['new'],
        // },
      },

      emptyListMessage: 'No tokens',
      initialFilters: { page_size: { value: 15 } },
    },
  },
};

export default exportConfigs;
