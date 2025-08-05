import React, { useState } from 'react';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import Modal from 'components/layout/Modal';
import EmptyListMessage from 'components/lists/EmptyListMessage';
import { Button } from 'components/inputs/Button';
import CurrencyCard from './CurrencyCard';
import { useModal } from 'hooks/general';

export default function CurrencySelector(props) {
  const {
    data = [],
    item,
    index,
    onChange,
    actionLabel,
    onAction,
    crypto,
    trustlineHook,
    label = 'withdraw_to',
    title = 'select_withdraw_account',
  } = props;

  const { modalVisible, hideModal, showModal } = useModal();

  function handleChange(item) {
    onChange(item);
    hideModal();
  }
  return (
    <React.Fragment>
      <View w={'100%'} pv={0.5}>
        <View w="100%" jC="space-between" fD="row">
          {Boolean(label) && <Text variant={'caption'} id="" />}
          {typeof onAction === 'function' && Boolean(actionLabel) && (
            <Button
              label={actionLabel}
              onPress={onAction}
              color={'primary'}
              variant={'link'}
              size="small"
              fontSize={12}
            />
          )}
        </View>

        <View p={0.25} />
        {data.length > 0 ? (
          <CurrencyCard
            noPadding
            item={item}
            crypto={crypto}
            currency={item}
            selected={false}
            onPress={showModal}
            trustlineHook={trustlineHook}
          />
        ) : (
          <EmptyListMessage text="no_available_currencies" />
        )}
      </View>

      <Modal
        close
        title={title}
        maxWidth={500}
        open={modalVisible}
        onDismiss={hideModal}>
        <View pb={1} w={'100%'}>
          {data.map((i, ind) => (
            <View ph={1.5} pv={0.5} w={'100%'} key={i?.code}>
              <CurrencyCard
                padding
                item={i}
                index={ind}
                currency={item}
                crypto={crypto}
                selected={i?.code === item?.code}
                onPress={handleChange}
              />
            </View>
          ))}
        </View>
      </Modal>
    </React.Fragment>
  );
}
