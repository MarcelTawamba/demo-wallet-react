import React from 'react';

import RewardCard from '../../components/RewardCard';
import RewardDetail from '../../components/RewardDetail';
import { getRewards } from 'util/rehive';

async function fetchData() {
  try {
    const resp = await getRewards();
    if (resp.status === 'success') {
      return resp?.data;
    }
  } catch (error) {
    return { error };
  }
}

const exportConfigs = {
  label: 'Earned',
  services: { fetchData },
  components: {
    list: {
      filterConfig: {
        type: {
          label: 'Available',
          type: 'text',
        },
        enabled: {
          label: 'Expired',
          type: 'boolean',
        },
        id: {
          label: 'Complete',
          type: 'text',
        },
      },
      emptyListMessage: 'no_rewards',
      initialFilters: { page_size: { value: 15 } },
    },
    item: (item, helpers) => <RewardCard item={item} helpers={helpers} />,
    detail: (item, helpers) => <RewardDetail item={item} helpers={helpers} />,
  },
};

export default exportConfigs;
