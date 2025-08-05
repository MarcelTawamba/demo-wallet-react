import React, { useState } from 'react';
import List from '@material-ui/core/List';
import { View } from 'components/layout/View';
import EmptyListMessage from 'components/lists/EmptyListMessage';
import Spinner from 'components/outputs/Spinner';
import CartItem from './CartItem';
import Text from 'components/outputs/Text';
import { displayFormatDivisibility } from 'util/general';

import ErrorOutput from 'components/outputs/Error';
import { Button } from 'components/inputs/Button';
import { deleteOrder } from 'util/rehive';

const Cart = props => {
  const {
    cart,
    noHeader,
    currency,
    footer,
    noEdit,
    removeFromCart,
    fetchCart,
    updateCartItemQuantity,
    items,
    error,
    loading,
    cartItem,
    profile,
    cartItemLoading,
    padded,
  } = props;
  const [clearLoading, setClearLoading] = useState(false);

  async function handleClear() {
    setClearLoading(true);
    await deleteOrder(cart.id);
    await fetchCart();
    setClearLoading(false);
  }

  const hasItems = items && items.length && items.length > 0;

  return (
    <View w={'100%'} fD="column">
      <List
        style={{ width: '100%', padding: padded ? 12 : 0 }}
        subheader={
          !noHeader && (
            <View fD="row" jC="space-between">
              <View p={0.5}>
                <Text myColor="primary" variant="h5" bold id="cart" />
              </View>
              {Boolean(cart) && (
                <Button
                  noPadding
                  variant={'text'}
                  loading={clearLoading}
                  disabled={clearLoading}
                  style={{
                    margin: 2,
                    padding: 8,
                    borderRadius: 3,
                    minWidth: 0,
                  }}
                  onPress={handleClear}>
                  <Text
                    myColor={clearLoading ? 'transparent' : 'primary'}
                    style={{ fontSize: 12 }}
                    id="clear"
                    uppercase
                  />
                </Button>
              )}
            </View>
          )
        }>
        {loading ? (
          <Spinner />
        ) : (
          <View ph={0.5} w={'100%'}>
            <View w={'100%'} aI={'center'}>
              {/* <Text variant={'h6'}>Cart items</Text> */}
              {!cart || !items ? (
                <EmptyListMessage id="empty_cart" />
              ) : hasItems ? (
                items.map((item, index) => (
                  <CartItem
                    profile={profile}
                    status={noEdit}
                    key={index}
                    item={item}
                    currency={currency}
                    cartItem={cartItem}
                    cartItemLoading={cartItemLoading}
                    noEdit={noEdit}
                    removeFromCart={() => removeFromCart(cart.id, item.id)}
                    updateCartItemQuantity={updateCartItemQuantity}
                  />
                ))
              ) : (
                <EmptyListMessage id="empty_cart" />
              )}
            </View>
            {cart && hasItems ? (
              <View fD={'column'} w={'100%'}>
                <ErrorOutput>{error}</ErrorOutput>
                <View
                  style={{ marginTop: 8, borderTop: '1px solid #CECECE' }}
                  w={'100%'}
                  pt={1}
                  fD={'row'}
                  jC={'space-between'}>
                  <Text variant={'h6'} align={'left'}>
                    {'Total '}
                  </Text>
                  <Text variant={'h6'} align={'right'}>
                    {currency.symbol +
                      displayFormatDivisibility(
                        cart.total_price,
                        currency.divisibility,
                      )}
                  </Text>
                </View>
              </View>
            ) : null}
          </View>
        )}
        {hasItems ? footer : null}
      </List>
    </View>
  );
};

export default Cart;
