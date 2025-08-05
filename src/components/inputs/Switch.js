import React from 'react';
import Box from '@material-ui/core/Box';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import MuiSwitch from '@material-ui/core/Switch';

export default function Switch(props) {
  const { name, label, checked, onChange, inputRef, disabled } = props;
  return (
    <Box p={0.25}>
      <FormControlLabel
        labelPlacement="end"
        control={
          <MuiSwitch
            onChange={e => onChange(e.target.checked)}
            checked={checked}
            inputRef={inputRef}
            disabled={disabled}
            color="primary"
          />
        }
        label={label}
      />
    </Box>
  );
}
