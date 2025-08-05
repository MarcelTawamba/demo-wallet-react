import React, { useEffect, useState } from 'react';

import { Text, View, Spinner, Button } from 'components';
import ProductProviderImage from '../flash/ProductProviderImage';
import { Dimensions, FlatList } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { ModalFullscreen } from 'components/modals/ModalFullscreen';

export default function VoucherProviderSelectorV(props) {
  const { value, options, formikProps, loading } = props;
  const [item, setItem] = useState(false);

  const { setFieldValue, setStatus } = formikProps;

  const renderItem = (item, index, value) => {
    return (
      <TouchableWithoutFeedback onPress={() => setItem(item)}>
        <ProductProviderImage
          key={item}
          item={item}
          showSelected
          selected={item === value}
          wide
        />
      </TouchableWithoutFeedback>
    );
  };

  function handleSelect() {
    setFieldValue('provider', item);
    setStatus({ scene: 'voucher' });
  }

  return (
    <React.Fragment>
      <View p={1}>
        {loading ? (
          <Spinner />
        ) : (
          <FlatList
            data={options}
            renderItem={({ item, index }) => renderItem(item, index, value)}
          />
        )}
      </View>
      <ModalFullscreen
        // noPadding
        visible={Boolean(item)}
        onDismiss={() => setItem(null)}>
        {Boolean(item) && (
          <View h={'100%'} p={0.5}>
            <ProductProviderImage item={item} wide />
            <View pv={0.5}>
              <Text t="h5" fW="600">
                {item.name}
              </Text>
            </View>
            <Text>{item.description}</Text>
            <View pv={1}>
              <Button wide onPress={handleSelect} label="PURCHASE"></Button>
            </View>
          </View>
        )}
      </ModalFullscreen>
    </React.Fragment>
  );
}
