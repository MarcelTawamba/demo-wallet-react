import React from 'react';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import Modal from 'components/layout/Modal';
import ButtonList from 'components/lists/ButtonList';
import LottieImage from 'components/outputs/LottieImage';

export default function ResultModal(props) {
  const { visible, onCancel, status = 'error', title = 'error' } = props;

  return (
    <Modal
      close
      maxWidth={415}
      open={visible}
      onDismiss={() => onCancel && onCancel()}>
      <View ph={1} pb={1} w={'100%'} aI={'center'}>
        <LottieImage name={status} size={125} />
        <Text
          id={title}
          fontWeight={'500'}
          style={{ fontSize: 18, textAlign: 'center' }}
        />
        <View mv={1} w={'100%'}>
          {props.children}
        </View>
        <ButtonList
          layout={'vertical'}
          items={[
            {
              id: 'cancel',
              variant: 'text',
              onPress: () => onCancel && onCancel(),
            },
          ]}
        />
      </View>
    </Modal>
  );
}
