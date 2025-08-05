import { standardizeString } from 'util/general';
import PaymentDetailHeader from '../components/PaymentDetailHeader';
import {
  getBusinessTransactions,
  getBusinesses,
  getBusinessTransaction,
} from 'util/rehive';
import SessionSection from '../components/SessionSection';

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
      if (search) search = search + '&page=' + page;
      else if (page !== 1) search = '?page=' + page;
      const resp = await getBusinessTransactions(
        businessId,
        (search ? search + '&' : '?') +
          'tx_type=credit&account_name=sales&subtype__in=sale_pos,sale_online,sale_app,deposit_crypto,receive_email,receive_otp',
      );
      return resp?.data;
    }
  } catch (e) {
    console.log('fetchData -> e', e);
  }
}

async function fetchItem(transactionId, props) {
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
      const resp = await getBusinessTransaction(businessId, transactionId);
      // if (resp.status === 'success') {
      return resp;
      // }
    }
  } catch (error) {
    console.log('fetchData -> error', error);
    return { error };
  }
}

const detailConfig = ({ item, context }) => {
  const { accounts } = context;

  return {
    id: 'summary',
    title: 'Payment',
    hideScreenHeader: true,
    renderHeader: PaymentDetailHeader,
    variant: false,
    sections: [
      {
        id: 'overview',
        fields: [
          { label: 'id', value: 'id' },
          { label: 'date_paid', value: 'created', variant: 'date', width: 100 },
          {
            label: 'customer',
            value: 'metadata.service_payment_requests.payer_email',
            type: 'email',
          },
          {
            label: 'description',
            value: 'metadata.service_payment_requests.request_reference',
          },
          { label: 'status', value: 'status' },
          {
            label: 'payment_method',
            value: 'metadata.service_payment_requests.payment_processor',
          },
          { label: 'amount', value: 'amount', variant: 'amount' },
          { label: 'fee', value: () => 0, variant: 'amount' },
          { label: 'net', value: 'amount', variant: 'amount' },
        ],
      },
      {
        id: 'payment_method',
        layout: 'single',

        fields: [
          {
            label: 'payment_method',
            value: 'metadata.service_payment_requests.payment_processor',
            hideIfEmpty: true,
          },
          { label: 'transaction_id', value: 'id' },
          {
            label: 'account_name',
            value: item =>
              standardizeString(
                accounts?.accountsDictionaryNames?.[item?.account] ??
                  item?.account,
              ),
          },
          // { label: 'Account name', value: 'account' },
          { label: 'account_reference', value: 'account' },
        ],
      },
      {
        id: 'connections',

        fields: [
          {
            label: 'invoice',
            value: 'metadata.service_payment_requests.request_id',
            link: '/invoices/',
            hideIfEmpty: true,
          },
          {
            label: 'order',
            value: 'metadata.service_product.order.id',
            // link: '/orders/',
            hideIfEmpty: true,
          },
          // { label: en.payout, value: 'billing' },
        ],
      },
      {
        id: 'session',

        component: SessionSection,
      },
      {
        id: 'metadata',

        fields: [{ label: 'metadata', value: 'metadata', type: 'json' }],
      },
    ],
  };
};

const listConfig = {
  variant: 'table',

  pagination: true,
  columns: [
    {
      label: 'amount',
      value: 'amount',
      variant: 'amount',
      props: {
        // align: 'right',
      },
    },
    // { label: 'id', value: 'id' },
    { label: '', value: 'status', variant: 'status' },
    {
      label: 'description',
      value: 'metadata.service_payment_requests.request_reference',
    },
    // {
    //   label: en.due,
    //   value: 'due_date',
    //   type: 'date',
    // },
    {
      label: 'customer',
      value: 'partner.user.email',
      variant: 'text',
      width: 100,
    },
    {
      label: 'date',
      value: 'created',
      variant: 'date',
      width: 100,
    },
  ],

  detailComponent: 'outputTable',
  add: 'New',
  export: true,
  edit: true,
  delete: true,
  emptyListMessage: 'no_payments_available',
  filterConfig: {
    id: { label: 'ID' },
    metadata__service_bitcoin__tx_hash: { label: 'Hash' },
    metadata__service_bitcoin__recipient_public_address: {
      label: 'Address',
    },
    status: {
      type: 'select',
      options: ['Complete', 'Pending', 'Failed'],
    },
  },
  initialFilters: { page_size: { value: 15 } },
};

const pages = {
  '': {
    id: 'payments',
    title: 'payments',
    value: '',
    services: {
      fetchData,
      fetchItem,
    },
    components: {
      detail: detailConfig,
      list: listConfig,
    },
  },
};

export default pages;
