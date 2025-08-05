import { paramsToSearch } from 'util/general';
import { useQueries } from 'react-query';
import { getProducts } from 'util/rehive';

export const useAvailableCurrenciesForProducts = (
  primaryCurrencies,
  enabled = false,
) => {
  const results = useQueries(
    primaryCurrencies?.items?.map(item => ({
      queryKey: [
        'products',
        paramsToSearch({ currency: item.currency.code, page: 1 }),
      ],
      queryFn: () =>
        getProducts(
          paramsToSearch({ currency: item.currency.code, page: 1 }),
          true,
        ),
      enabled,
      staleTime: 60000,
    })),
  );

  const isLoaded = results.reduce((success, item) => {
    if (item.status === 'success' || item.status === 'error') {
      return success & true;
    } else {
      return success & false;
    }
  }, true);

  let currencies = [];
  if (isLoaded) {
    currencies = primaryCurrencies?.items.filter((_, idx) =>
      Boolean(results[idx].data?.results?.length),
    );
  }

  return {
    ...primaryCurrencies,
    items: currencies,
  };
};
