import React from 'react';
import { InputLabel as MuiInputLabel } from '@material-ui/core';
import Text from './Text';

function InputLabel({ id, langContext = {}, ...restProps }) {
  return (
    <MuiInputLabel {...restProps}>
      <Text id={id} context={langContext} />
    </MuiInputLabel>
  );
}

export default InputLabel;
