import React from 'react';
import screenConfig from './config';
import Screen from 'components/layouts/Screen';
import { parseScreenUrl } from 'util/general';
import { useHistory } from 'react-router-dom';
import { useQuery } from 'react-query';
import { getInvoiceRefunds, getBusinessInvoice } from 'util/rehive';
import { useBusiness } from 'contexts';
import Spinner from 'components/outputs/Spinner';

export default function InvoicesContainer(props) {
  const { business } = useBusiness();

  const { location } = useHistory();
  const { pathname } = location;
  let { itemId } = parseScreenUrl(pathname);

  const { data: invoiceRefunds = [], isLoading } = useQuery(
    ['refunds', itemId],
    () => getInvoiceRefunds(business?.id, itemId, true),
    { enabled: Boolean(business?.id && itemId) },
  );
  const { data: invoice = [], isLoading: isLoadingInvoice } = useQuery(
    ['invoice', itemId],
    () => getBusinessInvoice(business?.id, itemId, true),
    { enabled: Boolean(business?.id && itemId) },
  );

  if (!Boolean(business?.id))
    return <Spinner containerStyle={{ justifyContent: 'center' }} />;

  return (
    <Screen
      screenConfig={screenConfig}
      reduxContext={{
        business,
        refunds: { ...invoiceRefunds, loading: isLoading },
        invoice: { ...invoice, loading: isLoadingInvoice },
      }}
      {...props}
    />
  );
}
