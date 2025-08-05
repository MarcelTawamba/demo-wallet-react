import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Hover from 'components/layout/Hover';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import QuantityInput from 'screens/products/components/cart/QuantityInput';
import {
  displayFormatDivisibility,
  formatTime,
  standardizeString,
} from 'util/general';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from 'components/inputs/IconButton';
import Spinner from 'components/outputs/Spinner';

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    margin: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
  },
  checkbox: {
    padding: 0,
    margin: 0,
  },
  status: {
    paddingTop: theme.spacing(0.5),
    display: 'flex',
    flexDirection: 'column',
  },
});

const SaleItem = ({
  item,
  currency,
  index,
  status,
  removeFromCart,
  updateCartItemQuantity,
  cartItem,
  cartItemLoading,
  noEdit,
  classes,
  profile,
}) => {
  // console.log('item', item);
  const [quantity, setQuantity] = useState(
    item && item.quantity ? item.quantity : 0,
  ); //status
  useEffect(() => {
    setQuantity(item.quantity);
  }, [item.quantity]);
  // console.log('item', item);
  if (!item || !item.price) {
    return null;
  }
  const { id, price } = item;
  const priceString =
    currency.symbol + displayFormatDivisibility(price, currency.divisibility);

  return (
    <Hover
      style={{ width: '100%' }}
      render={hover => (
        <View pv={0.5} w={'100%'}>
          <View fD={'row'} w={'100%'} aI={'space-between'}>
            <Text>
              <b>{item.name}</b>
            </Text>
            {/* {status && ( */}
            <Text width={'auto'} align={'right'}>
              <b>{priceString}</b>
            </Text>
            {/* )} */}
          </View>

          <View
            fD={'row'}
            jC={'space-between'}
            aI={'center'}
            w={'100%'}
            h={30}
            pt={0.25}>
            {cartItem === item.id && cartItemLoading ? (
              <Spinner size={16} />
            ) : hover && !noEdit && !cartItemLoading ? (
              <React.Fragment>
                <QuantityInput
                  small
                  quantityHook={[quantity, setQuantity]}
                  edited={quantity !== item.quantity}
                  updateCartItemQuantity={() =>
                    updateCartItemQuantity(id, quantity)
                  }
                />
                <IconButton
                  style={{ padding: 4 }}
                  key={'cart_item_remove'}
                  aria-label={'cart_item_remove'}
                  tooltip="Remove from cart"
                  // color={'error'}
                  // disabled={disabled}
                  onClick={() => removeFromCart(id)}>
                  <CloseIcon
                    style={{ height: 16, width: 16 }}
                    color={'error'}
                  />
                </IconButton>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <View w={'auto'} pv={0.25}>
                  <Text
                    variant={'caption'}
                    id="qty_with_number"
                    context={{ quantity }}
                  />
                </View>
                <div className={classes.status}>
                  <Text
                    // width={'auto'}
                    variant={'caption'}
                    align={'right'}
                    myColor={
                      status
                        ? item.status !== 'failed'
                          ? 'positive'
                          : 'error'
                        : ''
                    }>
                    {status ? standardizeString(item.status) : ''}
                  </Text>
                  {status && item.status && (
                    <Text variant={'caption'} align={'right'} opacity={0.7}>
                      {formatTime(item.updated, 'MMMM Do, YYYY', profile)}
                    </Text>
                  )}
                </div>
              </React.Fragment>
            )}
          </View>
        </View>
      )}
    />
  );
};

SaleItem.propTypes = {
  classes: PropTypes.object.isRequired,
};

SaleItem.defaultProps = {
  updateCartItemQuantity: () => {},
};

export default withStyles(styles)(SaleItem);
