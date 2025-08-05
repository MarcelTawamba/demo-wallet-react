import React, { useState, useEffect, useContext } from 'react';
import { View } from 'components/layout/View';
import Spinner from 'components/outputs/Spinner';
import IconButton from 'components/inputs/IconButton';
import { makeStyles } from '@material-ui/styles';
import { useTheme as useMuiTheme } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import { CartContext } from 'screens/products/util/contexts/CartContext';

export default function QuantityEdit(props) {
  const {
    quantityHook = {},
    cart,
    loading,
    item,
    removeFromCart,
    updateCartItemQuantity,
  } = props;

  const { items: currCartItems, error } = useContext(CartContext);
  const { value: initialValue = item?.quantity, set = () => {} } = quantityHook;
  const [qntyValue, setQntyValue] = useState(initialValue);
  useEffect(() => {
    if (!loading && error) {
      setQntyValue(item.quantity);
    }
  }, [loading]);

  const theme = useMuiTheme();
  const classes = useStyles();

  if (!item) {
    return null;
  }

  function handlePositive() {
    const newValue = parseInt(qntyValue) + 1;
    setQntyValue(newValue);
    updateCartItemQuantity(item?.id, newValue);
  }

  function handleNegative() {
    const newValue = parseInt(qntyValue) - 1;
    if (newValue > 0) {
      setQntyValue(newValue);
      updateCartItemQuantity(item?.id, newValue);
    } else {
      removeFromCart(cart?.id, item?.id);
    }
  }

  // function handleChange(e) {
  //   setQntyValue(e.target.value);
  // }

  // function handleBlur() {
  //   let newValue = qntyValue;

  //   if (isNaN(newValue) || newValue === '' || newValue === '0') {
  //     newValue = item?.quantity;
  //     setQntyValue(parseInt(newValue));
  //   } else {
  //     if (qntyValue !== item?.quantity)
  //       updateCartItemQuantity(item?.id, newValue);
  //   }
  // }

  return (
    <View fD={'column'} jC={'center'} aI={'center'}>
      <IconButton onPress={handlePositive} simple disabled={loading}>
        <View className={classes.iconStyleProps}>
          <AddIcon
            style={{
              fontSize: 18,
            }}
          />
        </View>
      </IconButton>
      <View pv={0.5} w={50} jC={'center'} aI={'center'}>
        {loading ? (
          <View mv={0.25}>
            <Spinner size={23} />
          </View>
        ) : (
          <input
            type="text"
            value={qntyValue}
            // onChange={handleChange}
            // onBlur={handleBlur}
            readOnly
            className={classes.inputStyle}
          />
        )}
      </View>
      <IconButton onPress={handleNegative} simple disabled={loading}>
        <View className={classes.iconStyleProps}>
          <RemoveIcon
            style={{
              fontSize: 18,
            }}
          />
        </View>
      </IconButton>
    </View>
  );
}

const useStyles = makeStyles(theme => ({
  inputStyle: {
    fontSize: 20,
    textAlign: 'center',
    color: theme.palette.primary.main,
    fontWeight: 'bold',
    width: '60px',
    padding: '5px',
    border: '2px solid #DDDDDD',
    borderRadius: '5px',
  },
  iconStyleProps: {
    height: 22,
    width: 22,
    borderRadius: '50% !important',
    alignItems: 'center !important',
    display: 'flex',
    justifyContent: 'center !important',
    flex: 1,
    border: '2px solid #DDD',
    color: '#DDD',
  },
}));
