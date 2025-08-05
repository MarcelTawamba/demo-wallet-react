import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import context from 'components/app/context';
import { get } from 'lodash';
import { getCurrencyCode } from 'util/general';

const CurrencySelector = props => {
  const {
    data,
    currency,
    label,
    handleChange,
    renderDetailValue,
    altStyle,
    colors,
    tooltip,
  } = props;
  const value = currency?.currency?.code;
  const index = data.findIndex(
    item => item.currency?.code === currency.currency?.code,
  );
  // const error = errors[field.name];

  return (
    <FormControl
      style={{
        minWidth: (getCurrencyCode(currency?.currency)?.length ?? 3) * 30,
        // paddingLeft: 8,
        // paddingRight: 4,
        textAlign: 'left',
        padding: 0,
      }}>
      <Select
        disableUnderline
        SelectDisplayProps={{
          style: {
            margin: 0,
            padding: 0,
          },
        }}
        value={index}
        style={{
          fontSize: 26,
          color: colors.primary,
          width: '100%',
          margin: 0,
          padding: 0,
        }}
        onChange={e => handleChange(e.target.value)}
        displayEmpty
        renderValue={val => getCurrencyCode(data?.[val]?.currency)}
        name="currency">
        {data.map((curr, ind) => (
          <MenuItem key={ind} value={ind}>
            {renderDetailValue
              ? renderDetailValue(curr)
              : getCurrencyCode(curr.currency) +
                ' (' +
                curr.account_name +
                ') ' +
                curr.balance}
          </MenuItem>
        ))}
      </Select>
      {/* </Tooltip> */}
    </FormControl>
  );
};

export default context(CurrencySelector);
