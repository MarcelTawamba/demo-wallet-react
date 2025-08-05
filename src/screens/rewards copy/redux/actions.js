import { createAsyncTypes } from 'util/redux';

export const FETCH_REWARDS_ASYNC = createAsyncTypes('fetch_rewards');
export const fetchRewards = filters => {
  return {
    type: FETCH_REWARDS_ASYNC.pending,
    payload: { filters },
  };
};

export const fetchRewardsNext = () => {
  return {
    type: FETCH_REWARDS_ASYNC.pending,
    payload: 'next',
  };
};

export const FETCH_CAMPAIGNS_ASYNC = createAsyncTypes('fetch_campaigns');
export const fetchCampaigns = filters => {
  return {
    type: FETCH_CAMPAIGNS_ASYNC.pending,
    payload: { filters },
  };
};

export const fetchCampaignsNext = () => {
  return {
    type: FETCH_CAMPAIGNS_ASYNC.pending,
    payload: 'next',
  };
};
