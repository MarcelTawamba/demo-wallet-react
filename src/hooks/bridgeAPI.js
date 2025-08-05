import { useQuery } from 'react-query';
import { createUserKYCLink, getBridgeCryptoDepositAddress } from 'util/rehive';
import { useSelector } from 'react-redux';
import { authUserSelector } from 'redux/auth/selectors';

export function useKYCLink(redirectUrl, enabled = true, options = {}) {
  const user = useSelector(authUserSelector);
  const userId = user?.id;
  const isBusinessUser = user?.groups?.[0]?.name === 'business';

  const queryResult = useQuery(['kyc-link', userId], () => createUserKYCLink({ 
    redirect_uri: redirectUrl,
    ...(isBusinessUser ? { customer_type: 'business' } : {})
  }), {
    enabled: enabled && Boolean(userId),
    retry: (failureCount, error) => {
      // Don't retry on 404 (endpoint doesn't exist) errors
      if (error?.status === 404) {
        return false;
      }
      return failureCount < 3;
    },
    onError: (error) => {
      console.debug('useKYCLink: KYC API error', { 
        status: error?.status, 
        message: error?.message,
        enabled,
        userId 
      });
    },
    ...options,
  });

  return queryResult;
}

export function useBridgeCryptoDepositAddress(currencyCode, accountCurrency, chain, enabled = true, options = {}) {
  const user = useSelector(authUserSelector);
  const userId = user?.id;

  const queryResult = useQuery(
    ['bridge-deposit-address', userId, currencyCode, accountCurrency, chain],
    () => getBridgeCryptoDepositAddress(currencyCode, accountCurrency, chain),
    {
      enabled: enabled && Boolean(userId),
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 30 * 60 * 1000, // 30 minutes
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      ...options,
    }
  );

  return queryResult;
} 