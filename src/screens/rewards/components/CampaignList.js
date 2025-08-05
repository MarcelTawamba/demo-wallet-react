import React, { useState, useEffect } from 'react';
import CardList from 'components/card/CardList';
import CampaignCard from './CampaignCard';
import ReferReward from './images/ReferReward';
import { useTheme } from 'components/app/context';
import { useSelector } from 'react-redux';
import { configProfileStateSelector } from 'redux/rehive/selectors';
import { useRehiveContext } from 'contexts';

export default function CampaignList(props) {
  const {
    data,
    fetchData,
    fetchNext,
    handleStateChange,
    handleClaimReward,
    loading,
    onRefresh,
    modalVisible,
    setModalVisible,
    setItemName,
    history,
  } = props;

  const { user } = useRehiveContext();
  const userGroup = user?.groups?.[0]?.name;

  data.items =
    data?.items.filter(item =>
      item?.groups.length > 0 ? item.groups.includes(userGroup) : true,
    ) ?? [];

  const profileConfig = useSelector(configProfileStateSelector);
  const refEnabled = profileConfig?.referral?.enabled;

  const { colors } = useTheme();

  const [modalIndex, setModalIndex] = useState(() => {
    let mIndex = 0;
    const params = new URLSearchParams(history.location.search);
    const idParam = params.get('id');
    if (idParam) {
      const tempIndex = data.items.findIndex(item => item.id === idParam);
      if (tempIndex !== -1) {
        mIndex = tempIndex;
        setModalVisible(true);
        setItemName(data.items[mIndex]?.name);
      }
    }
    return mIndex;
  });

  useEffect(() => {
    if (history.location.search === '') {
      setModalVisible(false);
    }
  }, [history.location.search]);

  const showModal = index => {
    history.push(`/rewards/?id=${data.items[index]?.id}`);
  };
  const hideModal = () => setModalVisible(false);

  const item = data.items[modalIndex];

  return (
    <div style={{ display: 'flex', flexGrow: 1 }}>
      <CardList
        grid
        columns={4}
        type="reward"
        emptyListMessage="campaign_empty"
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
                  moreRewards={data.items.filter(dItem => dItem.id !== item.id)}
                />
              )
            : null
        }
        renderItem={(item, i) => (
          <>
            {i === 0 && refEnabled && (
              <ReferReward history={history} key={item.id} colors={colors} />
            )}
            <CampaignCard
              key={item.id}
              handleClaimReward={handleClaimReward}
              handleStateChange={handleStateChange}
              item={item}
              index={i}
              showModal={showModal}
              pendingRewards={data.pendingRewards}
              onRefresh={onRefresh}
            />
          </>
        )}
      />
    </div>
  );
}
