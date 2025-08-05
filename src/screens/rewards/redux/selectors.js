import { createSelector } from 'reselect';
import _ from 'lodash';

const rewardsStateSelector = state => state.rewards;

export const rewardsSelector = createSelector(
  [rewardsStateSelector],
  rewardsState => {
    const { rewards } = rewardsState;
    const { ids, byId, error, loading, next } = rewards;

    const items = ids.map(id => byId[id]);
    return {
      items: items ? _.orderBy(items, 'created', 'desc') : [],
      more: Boolean(next),
      loading,
      error,
    };
  },
);

export const rewardsNextSelector = createSelector(
  [rewardsStateSelector],
  rewardsState => {
    const { rewards } = rewardsState;
    const { next } = rewards;

    return next;
  },
);

export const campaignsSelector = createSelector(
  [rewardsStateSelector],
  rewardsState => {
    const { campaigns, rewards } = rewardsState;
    const { ids, byId, error, loading, next } = campaigns;

    let active = [];
    let expired = [];

    let pendingRewards = [];
    let acceptedRewards = [];

    const rewardItems = rewards.ids.map(id => rewards.byId[id]);
    const items = ids.map(id => byId[id]);

    rewardItems &&
      rewardItems.length &&
      rewardItems.length > 0 &&
      rewardItems.forEach(reward => {
        if (reward.status === 'pending') {
          pendingRewards.push(_.get(reward, ['campaign', 'id']));
        } else if (reward.status === 'accepted') {
          acceptedRewards.push(_.get(reward, ['campaign', 'id']));
        }
      });

    if (items && items.length && items.length > 0) {
      active = items.filter(
        campaign =>
          campaign.active &&
          campaign.end_date > Date.now() &&
          !pendingRewards.includes(campaign.id) &&
          (!campaign.max_per_user ||
            acceptedRewards.filter(reward => reward === campaign.id).length <
              campaign.max_per_user),
      );
      expired = _.difference(items, active);
    }

    return {
      items: active ? active : [],
      items2: expired,
      pendingRewards: pendingRewards,
      more: Boolean(next),
      loading,
      error,
    };
  },
);

export const campaignsNextSelector = createSelector(
  [rewardsStateSelector],
  rewardsState => {
    const { campaigns } = rewardsState;
    const { next } = campaigns;

    return next;
  },
);
