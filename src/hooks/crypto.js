import { getStellarAssets, getCryptoUser, getCryptoCompany } from 'util/rehive';
import { useMemo, useEffect } from 'react';
import { useQueries, useQueryClient } from 'react-query';

function mapCryptoQueries(type, enabled) {
  let tempQueries = [];
  tempQueries.push({
    queryKey: ['crypto', type, 'user'],
    queryFn: () => getCryptoUser(type),
    options: {
      enabled,
      // refetchInterval: 5000,
      // refetchIntervalInBackground: true,
    },
  });

  tempQueries.push({
    queryKey: ['crypto', type, 'company'],
    queryFn: () => getCryptoCompany(type),
    options: {
      enabled,
      // refetchInterval: 5000,
      // refetchIntervalInBackground: true,
    },
  });

  if (type === 'XLM' || type === 'TXLM') {
    tempQueries.push({
      queryKey: ['crypto', type, 'assets'],
      queryFn: () => getStellarAssets(type === 'TXLM'),
      options: {
        enabled,
        // refetchInterval: 5000,
        // refetchIntervalInBackground: true,
      },
    }); //TODO: response.data.map(a => a.currency_code)
  }

  return tempQueries;
}

export function useCrypto({ init, services, user }) {
  let cryptoServices = [];
  if (services?.stellar_service) cryptoServices.push('XLM');
  if (services?.stellar_testnet_service) cryptoServices.push('TXLM');
  if (services?.bitcoin_service) cryptoServices.push('XBT');
  if (services?.ethereum_service) cryptoServices.push('ETH');
  if (services?.bitcoin_testnet_service) cryptoServices.push('TXBT');
  if (services?.ethereum_testnet_service) cryptoServices.push('TETH');

  let cryptoQueryArray = [];
  const queryClient = useQueryClient();

  const enabled = Boolean(init && user?.id);
  function mapper() {
    function mapz(type) {
      cryptoQueryArray = cryptoQueryArray.concat(
        mapCryptoQueries(type),
        enabled,
      );
    }
    cryptoServices.forEach(mapz);

    return cryptoQueryArray;
  }
  useMemo(mapper, [cryptoServices, init]);
  const cryptoQueries = useQueries(enabled ? cryptoQueryArray : []) ?? [];

  useEffect(() => {
    if (init) {
      queryClient.invalidateQueries('crypto');
      refresh();
    }
  }, [init]);
  function refresh() {
    for (let i = 0; i < cryptoQueries.length; i++) {
      cryptoQueries[i].refetch();
    }
  }
  const tempContext = useMemo(
    () => mapState(cryptoQueries, cryptoQueryArray, cryptoServices),
    [cryptoQueries, cryptoQueryArray, cryptoServices],
  );
  const amountLoaded = Object.keys(tempContext ?? {}).filter(
    key => tempContext?.[key] && key !== 'undefinded',
  )?.length;
  const loading = cryptoServices?.length !== amountLoaded;
  const context = loading ? CRYPTO_INITIAL_STATE : tempContext;

  return { context, refresh, loading };
}

function mapState(queries, queryArray, services) {
  let context = {};
  queryArray.map((item, index) => {
    const code = item?.queryKey?.[1];
    if (code) {
      const key = item?.queryKey?.[2];

      let data = queries?.[index]?.data?.data ?? queries?.[index]?.data ?? {};
      if (key === 'assets' && data?.length > 0)
        data = data.map(item => item?.currency_code);
      context[code] = { ...(context?.[code] ?? {}), [key]: data };
    }
  });
  return context ?? CRYPTO_INITIAL_STATE;
}

export const CRYPTO_INITIAL_STATE = {
  XBT: null,
  TXBT: null,
  ETH: null,
  TETH: null,
  XBT: null,
  TXBT: null,
};
