import React from 'react';

import { Text, View, Spinner } from 'components';
import Carousel from 'react-native-snap-carousel';
import ProductProviderImage from '../flash/ProductProviderImage';
import { Dimensions } from 'react-native';
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function VoucherProviderSelector(props) {
  const {
    id,
    label = 'Select provider',
    initialValue,
    value,
    options,
    formikProps,
    loading,
  } = props;

  const { setFieldValue, values } = formikProps;
  const { type, provider } = values;

  if (type.includes('voucher')) {
    return (
      <View p={1}>
        <ProductProviderImage wide item={provider} />
      </View>
    );
  }

  const renderItem = (item, index, value) => {
    return (
      <ProductProviderImage
        key={item}
        item={item}
        showSelected
        selected={item === value}
      />
    );
  };

  return (
    <View pt={0.75}>
      <View fD="row" ph={1.5}>
        <Text>{label}</Text>
        <View
          h="60%"
          f={1}
          style={{
            marginLeft: 12,
            borderBottomWidth: 2,
            borderBottomColor: '#EFEFEF',
          }}
        />
      </View>
      {loading ? (
        <Spinner />
      ) : (
        <Carousel
          sliderWidth={SCREEN_WIDTH}
          itemWidth={SCREEN_WIDTH / 2}
          horizontal
          loop
          onSnapToItem={index => setFieldValue(id, options[index])}
          data={options}
          renderItem={({ item, index }) => renderItem(item, index, value)}
        />
      )}
    </View>
  );
}
