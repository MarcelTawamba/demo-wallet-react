import React from 'react';
import List from '@material-ui/core/List';
import { View } from 'components/layout/View';
import EmptyListMessage from 'components/lists/EmptyListMessage';
import CartItem from './CartItem';
import Skeleton from '@material-ui/lab/Skeleton';

export default function Cart(props) {
  const { cart, noEdit, removeFromCart, items, loading, padded } = props;

  return (
    <List style={{ width: '100%', padding: padded ? 12 : 0 }}>
      {loading ? (
        <View fD={'row'} w={'100%'} p={1}>
          <Skeleton
            variant="rect"
            width={120}
            height={120}
            style={{ borderRadius: 10 }}
          />
          <View ml={1}>
            <Skeleton width={200} height={17} />
            <Skeleton width={100} height={15} />
            <Skeleton width={60} height={25} />
          </View>
        </View>
      ) : (
        <View p={1} w={'100%'}>
          <View w={'100%'} aI={'center'}>
            {!cart || !items ? (
              <EmptyListMessage id="empty_cart" />
            ) : items?.length ? (
              items?.map((item, index) => (
                <View mb={index === items.length - 1 ? 0 : 1} w={'100%'}>
                  <CartItem
                    {...props}
                    status={noEdit}
                    key={index}
                    item={item}
                    noEdit={noEdit}
                    removeFromCart={() => removeFromCart(cart.id, item.id)}
                  />
                </View>
              ))
            ) : (
              <EmptyListMessage id="empty_cart" />
            )}
          </View>
        </View>
      )}
    </List>
  );
}
