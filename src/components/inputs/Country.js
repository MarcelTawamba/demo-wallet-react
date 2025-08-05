import React from 'react';
import { getNames, getName } from 'country-list';
import Autocomplete from './Autocomplete';
import { orderBy } from 'lodash';

export default function Country(props) {
  const { name } = props;
  const countries = orderBy(getNames());
  const temp = props?.getValues && typeof props.getValues === 'function' ? props.getValues(name) : props.value ?? '';
  const value = temp?.length === 2 ? getName(temp) : temp;
  return (
    <div style={{ paddingBottom: 8, width: '100%' }}>
      <Autocomplete {...props} options={countries} value={value} />
    </div>
  );
}
