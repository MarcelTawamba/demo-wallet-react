import React, { forwardRef } from 'react';
import MuiTextField from '@material-ui/core/TextField';

const TextField = forwardRef((props, ref) => {
  return (
    <MuiTextField
      fullWidth
      margin="dense"
      autoComplete="off"
      variant={'outlined'}
      {...props}
      ref={ref}
    />
  );
});

export default TextField;
