import React from 'react';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import OrderItem from './OrderItem';

export default function OrderItems(props) {
  const { items, currency } = props;

  return (
    <View w={'100%'} grid gap={1}>
      <View grid columns={3} gap={2} w={'100%'}>
        <Text s={14} id="product" />
        <Text s={14} tA={'center'} id="quantity" />
        <Text s={14} tA={'center'} id="amount" />
      </View>
      {items?.map(item => (
        <OrderItem {...{ item, currency }} />
      ))}
    </View>
  );
}
