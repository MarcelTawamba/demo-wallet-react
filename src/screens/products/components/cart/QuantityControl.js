import React, { useContext, useState, useEffect } from 'react';
import { View } from 'components/layout/View';
import IconButton from 'components/inputs/IconButton';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import Spinner from 'components/outputs/Spinner';
import { makeStyles } from '@material-ui/styles';
import { useTheme as useMuiTheme } from '@material-ui/core/styles';
import { Button } from 'components/inputs/Button';
import { CartContext } from 'screens/products/util/contexts/CartContext';

function QuantityControl({
  item,
  inputStyle,
  iconStyleProps,
  viewStyle,
  iconFontSize,
  loaderStyle,
  spinnerSize,
  variant,
  showButton,
  iconAndInputStyle,
}) {
  const {
    items: currCartItems,
    updateCartItemQuantity,
    removeFromCart,
    cart,
    loadingItem,
    error,
  } = useContext(CartContext);

  const theme = useMuiTheme();
  const classes = useStyles();

  const loading =
    loadingItem ===
    currCartItems.find(currItem =>
      currItem.variant?.id
        ? currItem.product === item?.id && currItem.variant?.id === variant
        : currItem.product === item?.id,
    )?.id;

  const [addButtonShow, setAddButtonShow] = useState(false);

  const [qntyValue, setQntyValue] = useState(() => {
    const cartItem = currCartItems.find(currItem =>
      currItem.variant?.id
        ? currItem.product === item?.id && currItem.variant?.id === variant
        : currItem.product === item?.id,
    );
    return cartItem ? cartItem?.quantity : 0;
  });

  useEffect(() => {
    const cartItem = currCartItems.find(currItem =>
      currItem.variant?.id
        ? currItem.product === item?.id && currItem.variant?.id === variant
        : currItem.product === item?.id,
    );
    setQntyValue(cartItem ? cartItem?.quantity : 0);
  }, [item.id, currCartItems, variant]);

  useEffect(() => {
    if (!loading && error) {
      const cartItem = currCartItems.find(currItem =>
        currItem.variant?.id
          ? currItem.product === item?.id && currItem.variant?.id === variant
          : currItem.product === item?.id,
      );
      setQntyValue(cartItem?.quantity);
    }
  }, [loading]);

  function handlePositive() {
    const newValue = parseInt(qntyValue) + 1;
    setQntyValue(newValue);

    const productInCart = currCartItems.find(currItem =>
      currItem.variant?.id
        ? currItem.product === item?.id && currItem.variant?.id === variant
        : currItem.product === item?.id,
    );
    updateCartItemQuantity(productInCart?.id, newValue);
    setAddButtonShow(false);
  }

  function handleNegative() {
    const newValue = parseInt(qntyValue) - 1;
    const productInCart = currCartItems.find(currItem =>
      currItem.variant?.id
        ? currItem.product === item?.id && currItem.variant?.id === variant
        : currItem.product === item?.id,
    );

    if (newValue > 0) {
      setQntyValue(newValue);
      updateCartItemQuantity(productInCart?.id, newValue);
    } else {
      removeFromCart(cart?.id, productInCart?.id);
    }
    setAddButtonShow(false);
  }

  function handleChange(e) {
    const newValue = e.target.value;
    setQntyValue(newValue);

    const productInCart = currCartItems.find(currItem =>
      currItem.variant?.id
        ? currItem.product === item?.id && currItem.variant?.id === variant
        : currItem.product === item?.id,
    );
    const isNotEual = productInCart?.quantity !== parseInt(newValue);
    if (isNaN(newValue) || newValue === '' || newValue === '0') {
      setAddButtonShow(false);
    } else setAddButtonShow(isNotEual);
  }
  function handleSubmit() {
    let newValue = qntyValue;
    const productInCart = currCartItems.find(currItem =>
      currItem.variant?.id
        ? currItem.product === item?.id && currItem.variant?.id === variant
        : currItem.product === item?.id,
    );
    if (isNaN(newValue) || newValue === '' || newValue === '0') {
      newValue = productInCart?.quantity;
      setQntyValue(parseInt(newValue));
    } else {
      // if (qntyValue !== parseInt(productInCart?.quantity)) {
      const res = updateCartItemQuantity(productInCart?.id, newValue, true);
      setAddButtonShow(false);
      // }
    }
  }

  function handleBlur() {
    let newValue = qntyValue;
    const productInCart = currCartItems.find(currItem =>
      currItem.variant?.id
        ? currItem.product === item?.id && currItem.variant?.id === variant
        : currItem.product === item?.id,
    );
    if (isNaN(newValue) || newValue === '' || newValue === '0') {
      newValue = productInCart?.quantity;
      setQntyValue(parseInt(newValue));
      setAddButtonShow(false);
    }
  }
  return (
    <View {...viewStyle} onClick={e => e.stopPropagation()}>
      <View {...iconAndInputStyle}>
        <IconButton onPress={handlePositive} simple disabled={loading}>
          <View {...iconStyleProps}>
            <AddIcon style={iconFontSize} />
          </View>
        </IconButton>
        <View pv={0.5} w={50} jC={'center'} aI={'center'}>
          {showButton?.onlyRead ? (
            <View>
              <input
                type="text"
                value={qntyValue}
                style={inputStyle}
                className={classes.inputTextColor}
                readOnly
              />
            </View>
          ) : (
            <View fD={'row'} gap={1.25} w={50} aI={'center'} h={'60px'}>
              <View>
                {loading ? (
                  <Spinner size={spinnerSize} style={loaderStyle} />
                ) : (
                  <input
                    type="text"
                    value={qntyValue}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={inputStyle}
                    className={classes.inputTextColor}
                    disabled={loading}
                  />
                )}
              </View>

              <View pl={loading ? 1.4 : 0}>
                {/* {!showButton.onlyRead && addButtonShow ? ( */}
                <Button
                  color={'primary'}
                  disabled={loading}
                  id="add_to_cart"
                  capitalize
                  onClick={handleSubmit}
                />
                {/* ) : null} */}
              </View>
            </View>
          )}
        </View>
        <IconButton onPress={handleNegative} simple disabled={loading}>
          <View {...iconStyleProps}>
            <RemoveIcon style={iconFontSize} />
          </View>
        </IconButton>
      </View>
    </View>
  );
}

export default QuantityControl;

const useStyles = makeStyles(theme => ({
  inputTextColor: {
    color: theme.palette.primary.main,
    border: '2px solid #DDDDDD',
    borderRadius: '5px',
    textAlign: 'center',
    fontWeight: 'bold',
  },
}));
