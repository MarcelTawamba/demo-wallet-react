import React, { useState } from 'react';
import { View } from 'components/layout/View';
import { Button } from 'components/inputs/Button';
import OrderCard from './OrderCardNew';
import EmptyListPlaceholderImage from 'components/outputs/PlaceholderImage/empty/EmptyListPlaceholderImage';

export default function OrderList(props) {
  const {
    items,
    profile,
    onPress,
    loadMore,
    onLoadMore,
    loading,
    fetching,
  } = props;

  return loading || fetching ? (
    new Array(3).fill(undefined).map(x => <OrderCard loading />)
  ) : !items?.length ? (
    <EmptyListPlaceholderImage name="order" id="order_empty" />
  ) : (
    <View grid gap={1}>
      {items?.map(item => (
        <OrderCard
          {...{
            item,
            profile,
            loading,
            onPress: x => onPress(x),
          }}
        />
      ))}
      {!loading && loadMore && (
        <View aI={'center'} w={'100%'} mb={2}>
          <Button
            variant={'text'}
            color={'primary'}
            loading={fetching}
            onPress={onLoadMore}
            noPadding
            id="show_more"
          />
        </View>
      )}
    </View>
  );
}
