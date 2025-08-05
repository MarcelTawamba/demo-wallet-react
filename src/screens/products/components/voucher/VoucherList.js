import React, { useState } from 'react';
import CardList from 'components/card/CardList';
import { VoucherCard } from './VoucherCard';
import Modal from 'components/layout/Modal';

export default function VoucherList(props) {
  const {
    vouchers,
    fetchData,
    fetchDataNext,
    index,
    indexLoading,
    currency,
    handleStateChange,
    addToCart,
    showToast,
  } = props;

  const [modalIndex, setModalIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const showModal = index => {
    setModalIndex(index);
    setModalVisible(true);
  };
  const hideModal = () => setModalVisible(false);

  const item = vouchers.items[modalIndex];

  return (
    <div style={{ display: 'flex', flexGrow: 1 }}>
      <CardList
        grid
        type="voucher"
        emptyListMessage="no_vouchers"
        data={vouchers}
        fetchData={fetchData}
        fetchNext={fetchDataNext}
        handleStateChange={handleStateChange}
        renderItem={(item, i) => (
          <VoucherCard
            handleStateChange={handleStateChange}
            showModal={showModal}
            item={item}
            key={item.id}
            index={i}
            loading={index === i && indexLoading}
            currency={currency}
            showToast={showToast}
            addToCart={addToCart}
          />
        )}
      />
      <Modal maxWidth={500} open={modalVisible} onDismiss={hideModal}>
        <VoucherCard
          handleStateChange={handleStateChange}
          onComplete={() => {
            setModalVisible(false);
            fetchData();
          }}
          item={item}
          noCard
          hideModal={hideModal}
          index={index}
          showToast={showToast}
          loading={indexLoading}
          currency={currency}
          addToCart={addToCart}
        />
      </Modal>
    </div>
  );
}
