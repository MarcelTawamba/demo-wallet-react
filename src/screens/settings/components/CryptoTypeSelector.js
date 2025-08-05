import React from 'react';
import { View } from 'components/layout/View';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';

const CryptoTypeSelector = ({ data, value, handleChange, services }) => {
  const index = data.findIndex(item => item.id === value);
  return (
    <View fD={'row'} jC={'flex-end'} w={'100%'} pv={1}>
      <FormControl
        style={{
          width: '100%',
          textAlign: 'left',
        }}>
        <InputLabel shrink htmlFor="curr-placeholder">
          Crypto type
        </InputLabel>
        <Select
          value={index}
          onChange={e => handleChange(data[e.target.value]?.id)}
          displayEmpty
          renderValue={val => data[val].name}
          name="currency">
          {data.map((type, ind) =>
            compareCryptoService(services, type.id) ? (
              <MenuItem key={type.index} value={type.index}>
                {type.name}
              </MenuItem>
            ) : null,
          )}
        </Select>
      </FormControl>
    </View>
  );
};

const compareCryptoService = (services, crypto) => {
  switch (crypto) {
    case 'bitcoin':
      if (
        services?.bitcoin_service ||
        services?.bitcoin_testnet_service
      ) {
        return true;
      }
      return false;
    case 'ethereum':
      if (
        services?.ethereum_service ||
        services?.ethereum_testnet_service
      ) {
        return true;
      }
      return false;
    case 'stellar':
      if (
        services?.stellar_service ||
        services?.stellar_testnet_service
      ) {
        return true;
      }
      return false;
    default:
      return false;
  }
};

export default CryptoTypeSelector;
