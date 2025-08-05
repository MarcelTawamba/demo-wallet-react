import React from 'react';
import momentTz from 'moment-timezone';
import Autocomplete from './Autocomplete';

export default function Timezone(props) {
  const timezones = momentTz.tz.names();
  const value = props?.getValues('timezone');
  return <Autocomplete {...props} options={timezones} value={value} />;
}
