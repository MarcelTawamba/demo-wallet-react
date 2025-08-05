import React from 'react';
import { useSelector } from 'react-redux';
import RadioSelector from 'components/inputs/RadioSelector';
import addresses from './config/addresses';
import { standardizeString } from 'util/general';
import CheckboxList from 'components/inputs/CheckboxList';
import { configProfileStateSelector } from 'redux/rehive/selectors';

const AddressTypeInput = props => {
  const { value, values, editing, setFieldValue, addressTypes } = props;
  let items = addressTypes.map(item => {
    return { value: item, label: item };
  });

  if (editing) {
    return (
      <RadioSelector
        title="address_type"
        responsive
        items={items}
        value={value}
        handleChange={value => setFieldValue('type', value.target.value)}
      />
    );
  }

  items = items.map(item => {
    return {
      ...item,
      checked: values.findIndex(value => value === item.value) !== -1,
    };
  });
  return (
    <CheckboxList
      items={items}
      setValue={(name, value) => {
        if (value) {
          setFieldValue('types', values.concat([name]));
        } else {
          setFieldValue(
            'types',
            values.filter(item => item !== name),
          );
        }
      }}
      label={'address_type'}
    />
  );
};

export default AddressTypeInput;
