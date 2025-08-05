/* eslint-disable no-unused-expressions */
import React, { useEffect } from 'react';
import { View } from 'components/layout/View';
import { useQuery } from 'react-query';
import { getTransactions } from 'util/rehive';
import { useTheme } from 'components/app/context';
import PaymentPending from 'components/outputs/PaymentPending';

export default function SendPending(props) {
  const { currency, onSuccess, user, result, setFormStateResult } = props;
  const { id } = result ?? {};

  const { data } = useQuery(
    [user?.id, 'transaction', id],
    () => getTransactions({ id }),
    {
      enabled: !!id,
      refetchInterval: 1000,
    },
  );

  const transaction = data?.results?.[0] ?? {};
  useEffect(() => {
    if (transaction?.status === 'Complete') {
      setFormStateResult();
      onSuccess(currency);
    } else if (transaction?.status === 'Failed')
      setFormStateResult(transaction);
  }, [transaction?.status]);

  const { colors } = useTheme();

  return (
    <View style={{ flex: 1 }} w="100%" aI="center" pb={2} ph={1.5}>
      <PaymentPending />
    </View>
  );
}
