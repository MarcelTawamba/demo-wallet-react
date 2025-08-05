import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useEffect } from 'react';
import { getStatements, getStatement, createStatement, deleteStatement } from 'util/rehive';

const STALE_TIME = 60000 * 10; // 10 minutes
const POLL_INTERVAL = 1000; // 1 second polling

// Hook to fetch a list of statements
export function useStatementsFetch(page = '', key = '', enabled = true) {
  const queryResult = useQuery(
    ['statements-fetch', page, key],
    () => getStatements(page),
    {
      enabled,
      staleTime: STALE_TIME,
    }
  );

  return queryResult;
}

// Hook to fetch a single statement by ID
export function useStatementFetch(id, key = '', enabled = true) {
  const queryClient = useQueryClient();
  
  // Basic fetch without polling
  const queryResult = useQuery(
    ['statement-fetch', id, key],
    () => getStatement(id),
    {
      enabled: enabled && !!id,
      staleTime: 0, // Don't cache these results
      cacheTime: 0, // Don't cache at all
      refetchOnMount: true, // Always refetch when component mounts
    }
  );

  // Set up manual polling for pending statements
  useEffect(() => {
    let intervalId = null;
    
    // Check for either 'pending' or 'processing' status
    const isPendingOrProcessing = 
      queryResult.data?.data?.status === 'pending' || 
      queryResult.data?.data?.status === 'processing';
    
    if (isPendingOrProcessing && enabled) {
      // Start polling
      intervalId = setInterval(() => {
        queryClient.invalidateQueries(['statement-fetch', id, key]);
      }, POLL_INTERVAL);
    }
    
    // Clean up interval on unmount or when status changes
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [id, key, queryResult.data?.data?.status, enabled, queryClient]);

  return {
    ...queryResult,
    // Force isFetching to true when polling is active
    isFetching: queryResult.isFetching || 
      queryResult.data?.data?.status === 'pending' || 
      queryResult.data?.data?.status === 'processing'
  };
}

// Hook to create a new statement
export function useCreateStatement() {
  const queryClient = useQueryClient();
  
  return useMutation(
    (data) => createStatement(data),
    {
      onSuccess: () => {
        // Invalidate the statements list query to trigger a refetch
        queryClient.invalidateQueries(['statements-fetch']);
      },
    }
  );
}

// Hook to delete a statement
export function useDeleteStatement() {
  const queryClient = useQueryClient();
  
  return useMutation(
    (id) => deleteStatement(id),
    {
      onSuccess: () => {
        // Invalidate the statements list query to trigger a refetch
        queryClient.invalidateQueries(['statements-fetch']);
      },
    }
  );
} 