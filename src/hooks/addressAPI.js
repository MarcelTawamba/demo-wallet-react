import { useQuery } from 'react-query';
import { getAddresses } from 'util/rehive';

export function useAddressesFetch(key = '', enabled = true) {
  const queryResult = useQuery(
    ['user-addresses-fetch', key],
    () => getAddresses(),
    {
      enabled,
      staleTime: 60000 * 10,
    },
  );

  return queryResult;
}
