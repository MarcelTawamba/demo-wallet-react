import { useQuery } from 'react-query';
import { fetchCurrencyDetail } from 'util/rehive';

export function useFetchCurrencyDetails(
  accountRef,
  currencyCode,
  enabled = true,
) {
  const queryResult = useQuery(
    ['currencyDetails', accountRef, currencyCode],
    () => fetchCurrencyDetail(accountRef, currencyCode),
    {
      enabled,
      staleTime: 30 * 60 * 1000,
    },
  );

  return queryResult;
}
