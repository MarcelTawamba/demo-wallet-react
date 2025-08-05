import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from './TextField';

export default function SimpleSelect(props) {
  let { label, items, value, onChange } = props;
  let { options = items } = props;

  value = value?.id ?? value;

  const handleChange = event => {
    onChange(event.target?.value?.id ?? event.target?.value?.value);
  };

  const SelectorProps = {
    onChange: handleChange,
    value:
      options?.find(item => (item?.id ?? item?.value ?? item) === value) ?? '',
  };

  return (
    <TextField
      select
      SelectProps={SelectorProps}
      {...props}
      value={value}
      variant={'outlined'}
      style={{ width: '100%' }}
      label={label}>
      {options?.map(item => (
        <MenuItem value={item} key={item.id}>
          {item.label}
        </MenuItem>
      ))}
    </TextField>
  );
}
