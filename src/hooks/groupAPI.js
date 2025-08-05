import { useQuery } from 'react-query';
import { getGroupFees, getTierFees, getTierLimits } from 'util/rehive';

export function useFetchGroupFees(group, company, enabled = true) {
  const queryResult = useQuery(
    ['group-fees', company, group],
    () => getGroupFees(group),
    {
      enabled,
      staleTime: 30 * 60 * 1000,
    },
  );

  return queryResult;
}
export function useFetchTierFees(group, tier_id, enabled = true) {
  const queryResult = useQuery(
    ['tier-fees_with_tier_id', tier_id],
    () => getTierFees(group, tier_id),
    {
      enabled,
      staleTime: 30 * 60 * 1000,
    },
  );

  return queryResult;
}
export function useFetchTierLimits(group, tier_id, enabled = true) {
  const queryResult = useQuery(
    ['tier-limit_with_tier_id', tier_id],
    () => getTierLimits(group, tier_id),
    {
      enabled,
      staleTime: 30 * 60 * 1000,
    },
  );
  return queryResult;
}
