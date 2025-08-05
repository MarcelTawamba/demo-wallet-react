import React from 'react';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import CampaignCard from './CampaignCard';
import { useHistory } from 'react-router-dom';

export default function MoreRewards({ rewards, onRefresh, ...restProps }) {
  const history = useHistory();
  const rewardItems = rewards.splice(0, 3);

  return (
    <div>
      <Text s={15} c="#393939" fontWeight="500" id="more_rewards" />
      <View pt={0.5}>
        {rewardItems.map(reward => (
          <div style={{ marginBottom: 16 }}>
            <CampaignCard
              key={reward.id}
              item={reward}
              showModal={() => history.push(`/rewards/?id=${reward.id}`)}
              onRefresh={onRefresh}
            />
          </div>
        ))}
      </View>
    </div>
  );
}
