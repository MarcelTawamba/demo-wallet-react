import React from 'react';
import { View } from 'components/layout/View';
import { getPaymentRequestTransactions } from 'util/rehive';
import PaymentPending from 'components/outputs/PaymentPending';
import { usePolling } from 'hooks/data';

export default function PaymentRequestPending(props) {
  const { setResult, result } = props;
  // const { id } = result?.data?.response ?? {};
  const requestIdForTransaction = result?.data?.requestIdForTransaction;

  function onSuccess(response) {
    setResult({
      ...result,
      data: { ...result?.data, response, requestIdForTransaction: null },
    });
  }

  function onFail(response) {
    setResult({
      ...result,
      status: 'error',
      data: { ...result?.data, response },
    });
  }

  usePolling({
    queryId: ['transaction-collection', requestIdForTransaction],
    queryFn: () =>
      getPaymentRequestTransactions(requestIdForTransaction, '', true),
    refetchInterval: 3000,
    timeout: 30000,
    onSuccess,
    onFail,
    enabled: !!requestIdForTransaction,
    successFn: item => item?.status === 'complete',
    failFn: item => item?.status === 'failed',
    getItem: data => data?.data?.results?.[0],
  });

  return (
    <View style={{ flex: 1 }} w="100%" aI="center" pt={8} pb={2} ph={1.5}>
      <PaymentPending />
    </View>
  );
}
