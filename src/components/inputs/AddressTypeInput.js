import React, { useEffect, useCallback, useState } from 'react';
import RadioSelector from 'components/inputs/RadioSelector';
import { standardizeString } from 'util/general';
import CheckboxList from 'components/inputs/CheckboxList';
import { useSelector } from 'react-redux';
import { configProfileStateSelector } from 'redux/rehive/selectors';

export default function AddressTypeInput(props) {
  const { register, setValue, isAdd, getValues } = props;
  const name = isAdd ? 'types' : 'type';
  const value = (getValues ? getValues(name) : undefined) ?? (isAdd ? [] : '');
  const profileConfig = useSelector(configProfileStateSelector);
  const addressTypes = profileConfig?.addressTypes?.length
    ? profileConfig.addressTypes
    : ['permanent'];

  let items = addressTypes.map(item => {
    return { value: item, label: item };
  });
  const [types, setTypes] = useState(value ?? []);
  const [type, setType] = useState(value ?? '');

  const simple = addressTypes?.length === 1;

  useEffect(() => {
    if (register) register(name);
  }, [register, name]);

  useEffect(() => {
    if (simple && isAdd && setValue) setValue('types', addressTypes);
  }, [addressTypes, isAdd, simple, setValue]);

  useEffect(() => {
    if (isAdd && setValue) setValue('types', types);
  }, [types, isAdd, setValue]);

  useEffect(() => {
    if (!isAdd && setValue) setValue('type', type);
  }, [type, isAdd, setValue]);

  const onChange = useCallback(
    (type, newValue) => {
      let temp = [];
      if (newValue) {
        temp = types?.concat([type]);
      } else {
        temp = types?.filter(item => item !== type);
      }
      setTypes(temp);
    },
    [setTypes, types], //triggerValidation
  );

  if (simple) {
    return null;
  }

  if (!isAdd) {
    return (
      <RadioSelector
        title="address_type"
        responsive
        items={items}
        value={type}
        handleChange={e => setType(e.target.value)}
      />
    );
  }

  items = items.map(item => {
    return {
      ...item,
      checked:
        (types?.length > 0 ? types : []).findIndex(
          value => value === item.value,
        ) !== -1,
    };
  });
  return (
    <CheckboxList items={items} setValue={onChange} label={'address_type'} />
  );
}
