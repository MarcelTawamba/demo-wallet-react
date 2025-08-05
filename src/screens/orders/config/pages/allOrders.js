import { getOrders, getSellers } from '../../util/rehive';
import { OrderListItem, OrderDetail } from '../../components';

async function fetchData(screenProps) {
  // param screenProps sent from Screen component
  try {
    let sellerId;
    if (screenProps?.reduxContext?.sellers) {
      // sellers sent from OrdersContainer in reduxContext prop
      sellerId = screenProps?.reduxContext?.sellers?.[0]?.id;
    }
    if (!sellerId) {
      const sellers = await getSellers();
      sellerId = sellers?.data?.results?.[0]?.id ?? '';
    }
    let { search } = window?.location ?? {};
    const resp = await getOrders(sellerId, search);
    // console.log('fetchData -> resp', resp);
    if (resp.status === 'success') {
      return resp?.data;
    } else {
      return {
        count: 0,
        next: null,
        previous: null,
        results: [],
      };
    }
  } catch (error) {
    return {
      count: 0,
      next: null,
      previous: null,
      results: [],
      error,
    };
  }
}
const defaultValues = {
  url: '',
  secret: '',
};

// async function createData(values, control, props) {
//   const { history, onSuccess, showToast } = props;
//   const { setSubmitting, setErrors } = control;

//   if (typeof setSubmitting === 'function') setSubmitting(true);
//   const { secret, url, id } = values;

//   const data = {
//     secret,
//     url,
//   };
//   let resp = null;
//   if (id) {
//     resp = await updateOrderAdmin(id, data);
//   } else {
//     resp = await createOrderAdmin(data);
//   }

//   if (resp.status === 'success') {
//     onSuccess(resp?.data?.id);
//     showToast({ id: id ? 'webhook_update_success' : 'webhook_add_success' });
//     history.push('/developers/');
//   } else {
//     showToast({ id: id ? 'webhook_update_error' : 'webhook_add_error' });
//   }
//   if (typeof setSubmitting === 'function') setSubmitting(false);
//   return values;
// }

const formConfig = () => {
  let fields = ['user', 'currency', 'products'];
  return {
    title: 'Create order',
    defaultValues,
    submitLabel: 'CREATE',
    // onSubmit: createData,
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

const exportConfigs = companyCurrencies => {
  const companyCurrenciesLabels = companyCurrencies?.map(currency => {
    return { value: currency.code, label: currency.code };
  });

  return {
    label: 'All orders',
    title: 'Orders',
    id: 'orders',
    value: '',
    services: { fetchData }, //, createData, updateData: createData },
    components: {
      list: {
        variant: 'grid',
        pagination: true,
        gridColumns: 1,
        gridSpacing: 1,
        renderItem: OrderListItem,
        renderDetail: OrderDetail,
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
          id: {
            label: 'order_id',
          },
          status: {
            label: 'status',
            variant: 'select',
            options: [
              { value: 'complete', label: 'complete' },
              { value: 'failed', label: 'failed' },
              { value: 'pending', label: 'pending' },
              { value: 'placed', label: 'placed' },
              { value: 'reserved', label: 'reserved' },
            ],
          },
          currency: {
            label: 'currency',
            variant: 'select',
            options: companyCurrenciesLabels ? companyCurrenciesLabels : [],
          },
          placed_date: {
            label: 'Placed date',
            variant: 'date',
            options: [
              { value: 'equal', label: 'Is on the' },
              { value: 'between', label: 'Is between' },
              { value: 'less', label: 'Is before' },
              { value: 'more', label: 'Is after' },
            ],
          },
          created_date: {
            label: 'Created date',
            variant: 'date',
            options: [
              { value: 'equal', label: 'Is on the' },
              { value: 'between', label: 'Is between' },
              { value: 'less', label: 'Is before' },
              { value: 'more', label: 'Is after' },
            ],
          },
          updated_date: {
            label: 'Updated date',
            variant: 'date',
            options: [
              { value: 'equal', label: 'Is on the' },
              { value: 'between', label: 'Is between' },
              { value: 'less', label: 'Is before' },
              { value: 'more', label: 'Is after' },
            ],
          },
        },
        emptyListMessage: 'no_orders',
        initialFilters: { page_size: { value: 15 } },
      },
      detail: detailConfig,
      form: formConfig,
    },
  };
};

export default exportConfigs;
