import { cloneDeep } from 'lodash';
import { useQueries, useQuery } from 'react-query';
import {
  getTier,
  getTierRequirementSets,
  getTiers,
} from 'util/rehive';

const STALE_TIME = 60000 * 10;

export function useFetchGroupTiers(groupName, key = '', enabled = true) {
  // key should be app/company id
  const queryResult = useQuery(
    ['tiers', groupName, key],
    () => getTiers(groupName),
    {
      enabled,
      staleTime: STALE_TIME,
    },
  );

  return queryResult;
}

export function useFetchTierRequirementSets(groupName, tierId, enabled = true) {
  const queryResult = useQuery(
    ['tier-requirement-sets', groupName, tierId],
    () => getTierRequirementSets(groupName, tierId),
    {
      enabled,
      staleTime: STALE_TIME,
    },
  );

  return queryResult;
}

const getTierReqSetData = async (groupName, tierId) => {
  const response = await getTierRequirementSets(groupName, tierId);
  return response;
};

export function useFetchMultiTierRequirementSets(groupName, tierList) {
  let data = [];
  const result = useQueries(
    tierList?.map(tier => {
      return {
        queryKey: ['tier-requirement-sets', groupName, tier.id],
        queryFn: () => getTierReqSetData(groupName, tier.id),
        staleTime: STALE_TIME,
        retry: 1,
      };
    }),
  );
  if (result?.[tierList.length - 1]?.data) {
    // checking the last api response

    data = result.map((setsData, index) => {
      const sets = cloneDeep(setsData.data?.results);
      let requirementSets = [];
      const childSets = sets?.filter(item => item.parent);
      if (childSets?.length) {
        childSets.forEach(item => {
          const parent = sets.find(mainItem => mainItem.id === item.parent);
          if (parent.subRequirementSets) {
            parent.subRequirementSets.push(item);
          } else {
            parent.subRequirementSets = [item];
          }
        });
        requirementSets = sets.filter(item => !item.parent);
      } else requirementSets = sets;

      return {
        ...tierList[index],
        requirementSets,
      };
    });
  }
  return data;
}

export function useFetchActiveTier(group, key, enabled = true, refetchInterval) {
  const queryResult = useQuery(
    ['user-active-tier', group, key],
    () => getTier(group),
    {
      enabled,
      staleTime: STALE_TIME,
      refetchInterval,
      refetchIntervalInBackground: false, // Don't poll when tab is not active
      notifyOnChangeProps: ['data', 'error'], // Only trigger re-renders when data or error changes
      structuralSharing: true, // Prevent re-renders if data structure is the same
    },
  );

  return queryResult;
}
