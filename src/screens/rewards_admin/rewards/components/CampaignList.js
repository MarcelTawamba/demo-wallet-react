import React, { useState } from 'react';
import RewardCard from './RewardCard';
import CardList from 'components/card/CardList';
import CampaignCard from './CampaignCard';

export default function CampaignList(props) {
  const {
    data,
    fetchData,
    fetchNext,
    handleStateChange,
    handleClaimReward,
    loading,
    onRefresh,
  } = props;
  // console.log('CampaignList -> data', data);

  const [modalIndex, setModalIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const showModal = index => {
    setModalIndex(index);
    setModalVisible(true);
  };
  const hideModal = () => setModalVisible(false);

  const item = data.items[modalIndex];

  return (
    <CardList
      grid
      type="reward"
      emptyListMessage={'No available rewards'}
      data={data}
      fetchData={fetchData}
      fetchNext={fetchNext}
      handleStateChange={handleStateChange}
      renderDetail={
        modalVisible && item
          ? () => (
              <CampaignCard
                key={item.id}
                handleClaimReward={handleClaimReward}
                handleStateChange={handleStateChange}
                item={item}
                loading={loading}
                hideModal={hideModal}
                pendingRewards={data.pendingRewards}
                detail
                onRefresh={onRefresh}
              />
            )
          : null
      }
      renderItem={(item, i) => (
        <CampaignCard
          key={item.id}
          handleClaimReward={handleClaimReward}
          handleStateChange={handleStateChange}
          item={item}
          index={i}
          showModal={showModal}
          pendingRewards={data.pendingRewards}
        />
      )}
    />
  );
}

// ProductList.propTypes = {};

// ProductList.defaultProps = {
