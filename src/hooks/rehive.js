import { useMemo } from 'react';
import { fetchItems, getProfile } from 'util/rehive';
import { useQueries, useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { authUserSelector } from 'redux/auth/selectors';

export const rehiveSelector = state => ({
  items: state?.data?.results ?? state?.data ?? [],
  // ...state,
  loading: state?.isLoading ?? true,
  error: state?.error ?? '',
});

export function useRehive(items, init = true, appContext = {}) {
  let isSingle = typeof items === 'string';

  const user = useSelector(authUserSelector);

  const userId = user?.id ?? appContext?.user?.id;
  const enabled = init && Boolean(userId);

  const rehiveQueries = useQueries(
    init
      ? (isSingle ? [items] : items).map(id => {
          return {
            queryKey: [id, userId],
            queryFn: () => fetchItems(id, appContext),
            enabled,
          };
        })
      : [],
  );

  function refresh(id) {
    try {
      if (id) {
        const index = items.findIndex(item => item === id);
        rehiveQueries[index].refetch();
      } else {
        for (let i = 0; i < items.length; i++) {
          rehiveQueries[i].refetch();
        }
      }
    } catch (e) {}
  }

  let { context, loading } = useMemo(
    () => mapContext(items, rehiveQueries),
    [rehiveQueries],
  );

  return { context, refresh, loading };
}

function mapContext(items, rehiveQueries) {
  let context = {};
  let loading = false;
  let isSingle = typeof items === 'string';

  for (let i = 0; i < items.length; i++) {
    const query = rehiveQueries[i];
    const id = items[i];
    let temp = rehiveSelector(query);
    if (temp?.items?.length < 0) temp.items = [];
    if (temp?.loading) loading = true;
    context = { ...context, [id]: temp };
    if (isSingle) return { context: temp, loading: temp?.loading };
  }
  return { context, loading };
}

export function useGetProfile(key, enabled = true) {
  const queryResult = useQuery(['user', 'profile', key], getProfile, {
    enabled,
    staleTime: 2500,
  });

  return queryResult;
}
