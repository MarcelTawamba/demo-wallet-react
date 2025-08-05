import React, { useState } from 'react';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import { Button } from 'components/inputs/Button';
import PlaceholderImage from 'components/outputs/PlaceholderImage';

export default function DeleteProductModal(props) {
  const { item, onDismiss } = props;
  const [modalActionLoading, setModalActionLoading] = useState(false);

  function handleDelete() {
    if (!item?.id) {
      onDismiss();
      return;
    }
    setModalActionLoading(true);
    try {
      const resp = props?.pageConfig?.services?.deleteItem(item?.id, props);
      resp.then(result => {
        if (result?.status === 'success') {
          props.onSuccess(item, 'delete');
        }
        setModalActionLoading(false);
      });
    } catch (error) {
      setModalActionLoading(false);
    }
  }
  return (
    <View aI="center" style={{ marginTop: -16 }}>
      <PlaceholderImage name="product" width={180} />
      <Text
        c="#FF4C6F"
        s={20}
        width="auto"
        style={{ fontWeight: 600, marginTop: 12 }}
        id="delete_product"
      />
      <Text
        tA="center"
        width="auto"
        style={{ marginTop: 18, marginBottom: 26 }}
        id="delete_product_confirmation"
        context={{ productName: item?.name }}
      />
      <Button
        disabled={modalActionLoading}
        loading={modalActionLoading}
        noPadding
        wide
        size="small"
        onPress={handleDelete}
        style={{
          backgroundColor: modalActionLoading ? '' : '#FF4C6F',
        }}>
        <Text c="#ffffff" id="delete" uppercase />
      </Button>
      <Button
        disabled={modalActionLoading}
        noPadding
        variant="text"
        wide
        size="small"
        onPress={onDismiss}
        style={{
          marginTop: 12,
          marginBottom: 12,
        }}
        id="cancel"
      />
    </View>
  );
}
