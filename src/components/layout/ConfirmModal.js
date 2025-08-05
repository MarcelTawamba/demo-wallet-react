import React from 'react';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import Modal from 'components/layout/Modal';
import ButtonList from 'components/lists/ButtonList';
import WarningIcon from 'components/images/warning.svg';
import Image from 'components/outputs/Image';

export default function ConfirmModal(props) {
  const {
    visible,
    onConfirm,
    onCancel,
    title = 'confirm',
    buttonText = 'confirm',
    cancelButtonText = 'cancel',
    topSlot,
  } = props;

  return (
    <Modal
      close
      maxWidth={415}
      open={visible}
      onDismiss={() => onCancel && onCancel()}>
      <View ph={1} pb={1} w={'100%'} aI={'center'}>
        {topSlot ? topSlot() : <Image src={WarningIcon} />}
        <Text
          id={title}
          fontWeight={'500'}
          style={{ fontSize: 18, textAlign: 'center', marginTop: 18 }}
        />
        <View mv={1} w={'100%'}>
          {props.children}
        </View>
        <ButtonList
          layout={'vertical'}
          items={[
            {
              id: buttonText,
              size: 'large',
              onPress: () => onConfirm && onConfirm(),
              capitalize: true,
            },
            {
              id: cancelButtonText,
              variant: 'text',
              onPress: () => onCancel && onCancel(),
            },
          ]}
        />
      </View>
    </Modal>
  );
}
