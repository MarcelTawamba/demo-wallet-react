import React from 'react';

import CampaignCard from '../../components/CampaignCard';
import { getCampaigns } from 'util/rehive';

async function fetchData() {
  try {
    const query = 'available=true'; //'page_size=15&active=true&end_date__gt=' + now.toString();
    const resp = await getCampaigns(query);
    if (resp.status === 'success') {
      return resp?.data;
    }
  } catch (error) {
    return { error };
  }
}

const exportConfigs = {
  title: 'Available',
  value: '',
  services: {
    fetchData,
    // createData,
  },
  components: {
    list: {
      variant: 'list',
      detailComponent: 'outputTable',
      add: 'New',
      export: true,
      edit: true,
      delete: true,

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
    item: (item, helpers) => <CampaignCard item={item} helpers={helpers} />,
    detail: (item, helpers) => (
      <CampaignCard item={item} helpers={helpers} detail />
    ),
  },
};

export default exportConfigs;
