import React, { useState, useRef } from 'react';

import { deleteItem } from 'util/rehive';
import { View } from './View';
import Text from 'components/outputs/Text';
import { Button } from 'components/inputs/Button';
import { getValue } from 'util/general';

export default function DeleteLayout(props) {
  const { type, item = {}, onCancel, onSuccess, showToast } = props;
  const value = getValue(item, type);

  const [loading, setLoading] = useState(false);

  async function handleDelete(temp) {
    if (!temp?.id) temp = item;
    setLoading('delete');
    const resp = await deleteItem(type, temp?.id);
    if (resp?.status === 'error') {
      showToast({
        text: 'Unable to delete ' + type + ': ' + resp?.message,
        variant: 'error',
      });
    } else {
      showToast({
        id: type + '_delete',
        variant: 'success',
      });
      onSuccess();
    }
    setLoading(false);
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

  return (
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
            context={{ type }}
          />
        )}
      </View>
      <View fD="row" w="100%" ph={1.5} pb={1}>
        <Button {...buttons?.[0]} wide />
        <Button {...buttons?.[1]} wide />
      </View>
    </>
  );
}
