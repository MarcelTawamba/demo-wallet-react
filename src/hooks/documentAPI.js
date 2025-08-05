import { useQuery } from 'react-query';
import { getDocuments, getDocumentTypes } from 'util/rehive';

const STALE_TIME = 60000 * 10;

export function useDocumentsFetch(key = '', enabled = true) {
  const queryResult = useQuery(['documents-fetch', key], getDocuments, {
    enabled,
    staleTime: STALE_TIME,
  });

  return queryResult;
}

export function useFetchDocumentTypes(key, enabled = true) {
  // key should be app/company id
  const queryResult = useQuery(
    ['document-types', key],
    () => getDocumentTypes(),
    {
      enabled,
      staleTime: STALE_TIME,
    },
  );

  return queryResult;
}
