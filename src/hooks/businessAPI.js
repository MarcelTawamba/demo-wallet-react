import { useQuery } from 'react-query';
import { getBusinessServiceSettings, getManagerSellers } from 'util/rehive';

export function useBusinessSettings(key = '', enabled = true) {
  const queryResult = useQuery(
    ['businessServiceSettings', key],
    getBusinessServiceSettings,
    {
      enabled,
      staleTime: 2500,
    },
  );

  return queryResult;
}

export function useGetSellers(key = '', enabled = true) {
  const queryResult = useQuery(['sellers', key], () => getManagerSellers(), {
    enabled: enabled,
    staleTime: 2500,
    cacheTime: 1000 * 60 * 15, // caching for 15 minutes
  });

  return queryResult;
}
