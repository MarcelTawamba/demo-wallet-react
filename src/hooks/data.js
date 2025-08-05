import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

export function usePolling({
  queryId,
  queryFn,
  refetchInterval = 0,
  timeout,
  onSuccess,
  onFail,
  enabled,
  successFn = item => item?.status === 'success',
  failFn = item => item?.status === 'fail',
  getItem,
}) {
  const [refetchCount, setRefetchCount] = useState(0);
  const totalRetries = timeout > 0 ? timeout / refetchInterval : 0;

  function onQuerySuccess() {
    setRefetchCount(refetchCount + 1);
  }

  const { data } = useQuery(queryId, queryFn, {
    enabled: enabled && refetchCount < totalRetries,
    refetchInterval,
    onSuccess: onQuerySuccess,
  });
  useEffect(() => {
    if (refetchCount > totalRetries) {
      typeof onFail === 'function' && onFail();
    }
  }, [refetchCount]);

  const item = (typeof getItem === 'function' ? getItem(data) : data) ?? {};
  useEffect(() => {
    if (typeof successFn === 'function' && successFn(item)) {
      typeof onSuccess === 'function' && onSuccess(item);
    } else if (typeof failFn === 'function' && failFn(item)) {
      typeof onFail === 'function' && onFail(item);
      setRefetchCount(totalRetries + 1);
    }
  }, [item]);

  return item;
}
