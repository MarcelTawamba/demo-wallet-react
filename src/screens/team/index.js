import React, { useState } from 'react';
import { Button } from 'components/inputs/Button';
import Modal from 'components/layout/Modal';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import Screen from 'components/layouts/Screen';
import screenConfig from './config';

import { useBusiness } from 'contexts';
import { editBusinessUser } from 'util/rehive';

export default function TeamContainer(props) {
  const { business } = useBusiness();
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState();
  const openModal = data => {
    setModalData(data);
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
  };
  return (
    <>
      <Screen
        screenConfig={screenConfig}
        reduxContext={{ business, openModal, closeModal }}
        {...props}
      />
      <RemoveManagerModal
        showModal={showModal}
        modalData={modalData}
        closeModal={closeModal}
      />
    </>
  );
}

export function RemoveManagerModal(props) {
  const { showModal, closeModal, modalData } = props;
  const { onSuccess, showToast, items, context, id } = modalData ?? {};

  const onCancel = () => {
    console.log('Cancelled');
    closeModal();
  };

  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const user = items.find(item => item.id === id);
    const businessId = context?.business?.id;
    if (user.roles.includes('manager')) {
      const updatedRoles = user.roles.filter(role => role !== 'manager');
      setLoading('delete');
      try {
        const resp = await editBusinessUser(businessId, id, {
          roles: updatedRoles,
        });

        if (resp.status === 'success') {
          onSuccess();
          showToast({ id: 'manager_delete_success', variant: 'success' });
        } else {
          showToast({ id: 'manager_delete_error', variant: 'error' });
        }
      } catch (error) {
        showToast({ id: 'manager_delete_error', variant: 'error' });
      }
      setLoading(false);
      closeModal();
    }
  }

  const buttons = [
    {
      id: 'cancel',
      onPress: onCancel,
      variant: 'text',
      color: 'primary',
    },
    {
      id: 'confirm',
      capitalize: true,
      color: 'primary',
      onPress: handleDelete,
      disabled: loading,
      loading,
    },
  ];

  const value = items ? items.find(item => item.id === id)?.email : '';

  return (
    <Modal maxWidth={415} open={showModal} disableBackdropClick>
      <>
        <View p={2} pt={1} w="100%">
          <Text
            pv={0.5}
            tA={'center'}
            s={18}
            c="fontLight"
            id="are_you_sure_to_delete"
          />
          {value ? (
            <Text
              color={'primary'}
              style={{
                wordWrap: 'break-word',
                textAlign: 'center',
                marginTop: 24,
              }}>
              {value}
            </Text>
          ) : (
            <Text
              style={{
                wordWrap: 'break-word',
                textAlign: 'center',
                marginTop: 24,
              }}
              id="unable_to_find_type"
              context={'address'}
            />
          )}
        </View>
        <View fD="row" w="100%" ph={1.5} pb={1}>
          <Button {...buttons?.[0]} wide />
          <Button {...buttons?.[1]} wide />
        </View>
      </>
    </Modal>
  );
}
