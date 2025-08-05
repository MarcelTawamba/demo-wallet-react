import React, { useContext, useState, useEffect, useMemo } from 'react';
import { useQuery } from 'react-query';
import { getBusinesses, getBusinessServiceSettings } from 'util/rehive';
import { useRehiveContext } from './RehiveContext';
import { arrayToObject } from 'util/general';
import { checkBusinessGroup } from 'util/business';
import { useHistory } from 'react-router';
import { useBusinessSettings } from 'hooks/businessAPI';

const initialContext = {
  businesses: [],
  business: null,
  refetch: () => {},
  isLoading: true,
  setBusinessId: () => {},
};
const BusinessContext = React.createContext(initialContext);

const businessScreens = [
  'onboarding',
  'customers',
  'payouts',
  'payments',
  'invoices',
  'products_admin',
  'team',
  'reporting',
  'developers',
  'business',
  'pos',
];

function BusinessProvider({ children }) {
  const { user, services, company } = useRehiveContext();
  const [businessId, setBusinessId] = useState('');
  const [refetchInterval, setRefetchInterval] = useState(null);
  const hasBusinessService = services?.business_service;
  const history = useHistory();
  const paths = history?.location?.pathname.split('/');
  const isBusinessScreen = businessScreens.includes(paths?.[1] ?? '');
  const [retryRefetch, setRetryRefetch] = useState(5);

  const { data: businessServiceSettings } = useBusinessSettings(
    company?.id,
    !!hasBusinessService,
  );

  const userGroup = user?.groups?.[0]?.name ?? 'user';
  const isBusinessGroup = useMemo(
    () => checkBusinessGroup(businessServiceSettings, userGroup),
    [businessServiceSettings, userGroup],
  );

  const enabled = !!user?.id && hasBusinessService && isBusinessGroup;
  const { data, isLoading, refetch, error } = useQuery(
    ['businesses', user?.id],
    async () => getBusinesses(true),
    {
      enabled,
      refetchInterval: isBusinessScreen && retryRefetch && refetchInterval,
      onSuccess: () => {
        setRetryRefetch(Math.max(retryRefetch - 1, 0));
      },
      onError: (error) => {
        setRetryRefetch(Math.max(retryRefetch - 1, 0));
        console.debug('BusinessContext: Business API error', { 
          status: error?.status, 
          message: error?.message,
          enabled,
          hasBusinessService,
          isBusinessGroup 
        });
      },
      retry: (failureCount, error) => {
        // Don't retry on 403 (forbidden) errors
        if (error?.status === 403) {
          return false;
        }
        return failureCount < 3;
      },
    },
  );

  const businesses = data?.results ?? [];
  const bussinessById = arrayToObject(businesses, 'id');
  const business = bussinessById?.[businessId] ?? {};

  useEffect(() => {
    if (!business?.id && businesses?.length > 0) {
      const index = businesses?.findIndex(item => item.owner === user?.id);
      setBusinessId(businesses?.[index !== -1 ? index : 0]?.id);
    }
  }, [businesses]);

  useEffect(() => {
    if (!business?.id || business?.status === 'pending') {
      setRefetchInterval(15000);
    } else setRefetchInterval(null);
  }, [business]);

  const context = {
    businesses,
    bussinessById,
    business,
    item: business,
    refetch,
    refetchBusiness: refetch,
    refetchBusinesses: refetch,
    loading: isLoading || (!business?.id && error?.status !== 403),
    setBusinessId,
    hasBusinessService,
    isBusinessGroup,
  };

  return (
    <BusinessContext.Provider value={context}>
      {children}
    </BusinessContext.Provider>
  );
}

function useBusiness() {
  const value = useContext(BusinessContext);
  if (value === undefined) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return value;
}

export { BusinessContext, BusinessProvider, useBusiness };
