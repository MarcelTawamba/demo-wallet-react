import React, { useState, useEffect } from 'react';
import RewardCard from './RewardCard';
import CardList from 'components/card/CardList';

export default function RewardList(props) {
  const {
    data,
    fetchData,
    fetchNext,
    handleStateChange,
    pending,
    modalVisible,
    setModalVisible,
    setItemName,
    history,
  } = props;

  const [modalIndex, setModalIndex] = useState(() => {
    let mIndex = 0;
    const params = new URLSearchParams(history.location.search);
    const idParam = params.get('id');
    if (idParam) {
      const tempIndex = data.items.findIndex(item => item.id === idParam);
      if (tempIndex !== -1) {
        mIndex = tempIndex;
        setModalVisible(true);
        setItemName(data.items[mIndex]?.campaign?.name);
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
    history.push(
      `/rewards/${pending ? 'pending' : 'history'}/?id=${
        data.items[index]?.id
      }`,
    );
  };
  const hideModal = () => setModalVisible(false);

  const item = data.items[modalIndex];

  return (
    <div style={{ display: 'flex', flexGrow: 1 }}>
      <CardList
        grid
        columns={4}
        type="reward"
        emptyListMessage={pending ? 'no_pending_rewards' : 'no_earned_rewards'}
        data={data}
        fetchData={fetchData}
        fetchNext={fetchNext}
        handleStateChange={handleStateChange}
        renderDetail={
          modalVisible
            ? () => (
                <RewardCard
                  handleStateChange={handleStateChange}
                  item={item}
                  hideModal={hideModal}
                  detail
                />
              )
            : null
        }
        renderItem={(item, i) => (
          <RewardCard
            key={item.id}
            handleStateChange={handleStateChange}
            item={item}
            index={i}
            showModal={showModal}
          />
        )}
      />
    </div>
  );
}
