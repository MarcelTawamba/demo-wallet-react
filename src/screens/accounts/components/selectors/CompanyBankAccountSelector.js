import React, { Component } from 'react';

import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { View } from 'components/layout/View';
import InputLabel from 'components/outputs/InputLabel';

const CompanyBankAccountsSelector = ({ data, index, handleChange }) => {
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
        <InputLabel shrink htmlFor="curr-placeholder" id="save" />
        <Select
          value={index}
          onChange={e => handleChange(e.target.value)}
          // input={<Input name="currency" id="curr-placeholder" />}
          displayEmpty
          renderValue={val => renderValue(data, val)}
          name="currency">
          {data.map((type, ind) => (
            <MenuItem key={type.id} value={ind}>
              {type.bank_name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </View>
  );
};

export default CompanyBankAccountsSelector;

const renderValue = (data, val) => {
  let item = data[val];
  const { bank_name, currencies } = item;
  // let currencyString = '';
  // currencyString = currencies.map(curr => ' ' + curr.code);
  return bank_name; //+ ' (' + currencyString.toString().substring(1) + ')';
};
