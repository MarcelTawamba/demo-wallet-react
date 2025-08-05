import React from 'react';
import Modal from 'components/layout/Modal';
import PaymentPending from 'components/outputs/PaymentPending';

export default function CheckoutPending(props) {
  const { open, onDismiss } = props;
  return (
    <Modal
      open={open}
      onDismiss={onDismiss}
      maxWidth={500}
      borderRadius={20}
      hasPaddingTop>
      <PaymentPending />
    </Modal>
  );
}
