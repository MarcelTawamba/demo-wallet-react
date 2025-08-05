import { useQuery } from 'react-query';
import {
  getOrder,
  getOrderItems,
  getOrderPayments,
  getOrderRefunds,
} from 'screens/orders/util/rehive';

export function useGetOrder(sellerId, orderId, enabled = true) {
  const queryResult = useQuery(
    ['order', orderId],
    () => getOrder(sellerId, orderId),
    {
      enabled: enabled,
      staleTime: 2500,
      cacheTime: 1000 * 60 * 5,
    },
  );

  return queryResult;
}

export function useGetOrderItems(sellerId, orderId, enabled = true) {
  const queryResult = useQuery(
    ['order-items', orderId],
    () => getOrderItems(sellerId, orderId),
    {
      enabled: enabled,
      staleTime: 2500,
      cacheTime: 1000 * 60 * 5,
    },
  );

  return queryResult;
}

export function useGetOrderRefunds(sellerId, orderId, enabled = true) {
  const queryResult = useQuery(
    ['order-refunds', orderId],
    () => getOrderRefunds(sellerId, orderId),
    {
      enabled: enabled,
      staleTime: 2500,
      cacheTime: 1000 * 60 * 5,
    },
  );

  return queryResult;
}

export function useGetOrderPayments(sellerId, orderId, enabled = true) {
  const queryResult = useQuery(
    ['order-payments', orderId],
    () => getOrderPayments(sellerId, orderId),
    {
      enabled: enabled,
      staleTime: 2500,
      cacheTime: 1000 * 60 * 5,
    },
  );

  return queryResult;
}
