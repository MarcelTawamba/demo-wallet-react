import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'components/layout/View';
import MomentUtils from '@date-io/moment';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';

export default function Date(props) {
  const {
    register,
    control,
    name,
    label,
    getValues = control?.getValues,
    setValue = control?.setValue,
    onChange,
    format = 'DD/MM/YYYY',
    inputProps = {},
    style = {},
    value: fieldValue, // Add fieldValue from field prop
    ref, // Add ref from field prop
  } = props;
  const [date, setDate] = useState(null);

  // Use fieldValue if available, otherwise use getValues
  const value = fieldValue !== undefined ? fieldValue : (typeof getValues === 'function' ? getValues(name) ?? '' : '');

  useEffect(() => {
    register && register(name);
  }, [register]);
  useEffect(() => {
    setDate(value || null);
  }, [setDate, value]);

  return (
    <View w={'100%'} style={{ ...style }}>
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <DatePicker
          label={label}
          onChange={date => {
            if (onChange) {
              // Use the onChange from field prop if available
              onChange(date.format('YYYY-MM-DD'));
            } else if (setValue) {
              // Fall back to setValue if onChange is not available
              setValue(name, date.format('YYYY-MM-DD'), {
                shouldValidate: true,
                shouldDirty: true,
              });
            }
          }}
          {...inputProps}
          value={date}
          margin="dense"
          inputVariant="outlined"
          fullWidth
          id="date-picker-dialog"
          format={format}
          views={['year', 'month', 'date']}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
      </MuiPickersUtilsProvider>
    </View>
  );
}
