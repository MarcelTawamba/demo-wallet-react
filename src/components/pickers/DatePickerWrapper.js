import React from 'react';
import { DatePicker } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';

/**
 * DatePickerWrapper - A wrapper for DatePicker to handle Material-UI deprecation warnings
 * 
 * This component simply forwards all props to the Material-UI DatePicker,
 * but wraps it with MuiPickersUtilsProvider to ensure consistent behavior.
 */
const DatePickerWrapper = (props) => {
  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <DatePicker {...props} />
    </MuiPickersUtilsProvider>
  );
};

export default DatePickerWrapper; 