import React from 'react';
import { View } from 'components/layout/View';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';

const CryptoTypeSelector = ({ data, index, handleChange }) => {
  return (
    <View style={{ paddingBottom: 16, width: '100%' }}>
      <FormControl
        style={{
          width: '100%',
          // marginTop: '0.49rem',
          paddingLeft: 0,
          paddingRight: 0,
          textAlign: 'left',
        }}>
        <InputLabel shrink htmlFor="curr-placeholder">
          Crypto type
        </InputLabel>
        <Select
          value={index}
          onChange={e => handleChange(e.target.value)}
          // input={<Input name="currency" id="curr-placeholder" />}
          displayEmpty
          renderValue={val => data[val].name}
          name="currency">
          {data.map((type, ind) => (
            <MenuItem key={type.index} value={type.index}>
              {type.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </View>
  );
};

export default CryptoTypeSelector;
