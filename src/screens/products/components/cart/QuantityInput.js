import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import DoneIcon from '@material-ui/icons/Done';

import { View } from 'components/layout/View';
import TextField from '@material-ui/core/TextField';
import IconButton from 'components/inputs/IconButton';

const QuantityInput = ({
  quantityHook,
  small,
  classes,
  updateCartItemQuantity,
  edited,
  ...restProps
}) => {
  const [quantity, setQuantity] = quantityHook;

  const iconProps = {
    fontSize: 'small',
    style: { height: small ? 16 : 24, width: small ? 16 : 24 },
  };

  return (
    <View
      fD={'row'}
      aI={'center'}
      jC={'flex-start'}
      // pl={0.5}
      style={{ width: '100%', maxWidth: small ? 130 : 160 }}>
      <IconButton
        style={{ padding: 2, margin: 2 }}
        key={'quantity_remove'}
        aria-label={'quantity_remove'}
        disabled={quantity === 1}
        onClick={() => setQuantity(Math.max(parseInt(quantity - 1), 1))}>
        <RemoveIcon {...iconProps} />
      </IconButton>
      <TextField
        style={{
          height: small ? 20 : 24,
          width: small ? 40 : 45,
          margin: 0,
          padding: 0,
        }}
        InputProps={{
          style: {
            fontSize: small ? 11 : 14,
            height: small ? 20 : 24,
            margin: 0,
            padding: 0,
          },
        }}
        onChange={e =>
          setQuantity(e.target.value === '' ? '' : parseInt(e.target.value))
        }
        value={quantity}
        variant="outlined"
      />
      <IconButton
        style={{ padding: 2, margin: 2 }}
        key={'quantity_add'}
        aria-label={'quantity_add'}
        // disabled={disabled}
        onClick={() => setQuantity(parseInt(quantity + 1))}>
        <AddIcon {...iconProps} />
      </IconButton>
      {edited && (
        <IconButton
          style={{ padding: 2, margin: 2 }}
          key={'quantity_save'}
          aria-label={'quantity_save'}
          // disabled={disabled}
          tooltip={'Save'}
          onClick={updateCartItemQuantity}>
          <DoneIcon {...iconProps} />
        </IconButton>
      )}
    </View>
  );
};

const styles = theme => ({
  container: {
    layout: 'flex',
    flexDirection: 'row',
  },
  button: {},
  noPadding: {
    padding: 0,
  },
});

export default withStyles(styles)(QuantityInput);
