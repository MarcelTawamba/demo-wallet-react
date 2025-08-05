import React, { useEffect } from 'react';

import { useState } from 'react';
import { getBusinessUser, getInvoiceRefunds } from 'util/rehive';
import Detail from 'components/layouts/Detail';
import DetailSkeleton from 'components/layouts/Detail/DetailSkeleton';

const refundConfig = {
  id: 'refunds',
  title: '',
  fields: [],
  table: {
    tableConfig: {
      fetchData: async ({ business, item }) => {
        if (!item || !business?.id) {
          return [];
        }
        const resp = await getInvoiceRefunds(business?.id, item?.id);
        if (resp.status === 'success') {
          return resp?.data?.results ?? [];
        }
        return [];
      },
      columns: [
        {
          label: 'amount',
          value: 'amount',
          variant: 'amount',
        },
        { label: 'reason', value: 'reason' },
        {
          label: 'status',
          value: 'status',
          variant: 'status',
        },
        {
          label: 'date',
          value: 'created',
          variant: 'date',
        },
      ],
    },
  },
};

export default function InvoiceDetail(props) {
  const { item, context } = props;
  const { business } = context;
  const [customer, setCustomer] = useState({});
  const [customerLoading, setCustomerLoading] = useState(true);
  const [init, setInit] = useState(false);

  const tempId = item?.payer_user?.id ?? '';
  async function fetchData(customerId) {
    setInit(true);
    setCustomerLoading(true);

    const resp = await getBusinessUser(business?.id, customerId);
    if (resp.status === 'success') {
      setCustomer(resp?.data);
    }
    setCustomerLoading(false);
  }

  useEffect(() => {
    if (tempId) {
      if (tempId !== customer?.id && !init && business?.id) {
        fetchData(tempId);
      }
    } else {
      setCustomerLoading(false);
    }
  }, [business, customer, customerLoading, item]);

  if (!item) return <DetailSkeleton variant />;

  let detailConfig = { ...props?.detailConfig };

  if (item.refunded) {
    let temp = [...detailConfig?.sections];
    temp.splice(3, 0, refundConfig);
    detailConfig.sections = temp;
  }

  return (
    <Detail
      {...props}
      context={{
        ...context,
        // refunds: { ...invoiceRefunds, loading: isLoading },
        customer: { item: customer, loading: customerLoading },
      }}
      detailConfig={detailConfig}
      item={item}
      customer={customer}
      customerLoading={customerLoading}
      fetchCustomer={fetchData}
    />
  );
}
