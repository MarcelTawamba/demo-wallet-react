import React, { useState } from 'react';
import PropTypes from 'prop-types';
import RewardCard from './RewardCard';
import CardList from 'components/card/CardList';
import { useLocation } from 'react-router-dom';

export default function RewardList(props) {
  const { data, fetchData, fetchNext, handleStateChange, pending } = props;

  const location = useLocation();

  let urlId = '';
  let { pathname, search } = location;

  const params = new URLSearchParams(search);
  const id = params.get('id');

  const [modalIndex, setModalIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(Boolean(id));
  const showModal = index => {
    setModalIndex(index);
    setModalVisible(true);
  };
  const hideModal = () => setModalVisible(false);

  const item = id
    ? data.items.find(item => item.id === id)
    : data.items[modalIndex];

  return (
    <CardList
      grid
      type="reward"
      emptyListMessage={pending ? 'No pending rewards' : 'No earned rewards'}
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
  );
}

// ProductList.propTypes = {};

// ProductList.defaultProps = {
