import React, { useState, forwardRef } from 'react';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import ToggleIcon from 'material-ui-toggle-icon';
import TextField from './TextField';
import { View } from 'components/layout/View';
import useCapsLock from 'hooks/capsLock';
import useCapsLockField from 'hooks/useCapsLockField';

const Password = forwardRef((props, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const { warningContent } = useCapsLock(document);
  const { focused, handleFocus, handleBlur } = useCapsLockField();

  function toggleVisibility() {
    setShowPassword(!showPassword);
  }

  function handleButtonMouseDown(e) {
    e.preventDefault();
  }

  const type = showPassword ? 'text' : 'password';
  const endAdornment = (
    <InputAdornment position="end">
      <IconButton
        tabIndex="-1"
        onClick={toggleVisibility}
        onMouseDown={handleButtonMouseDown}
        disabled={false}>
        <ToggleIcon
          on={!showPassword}
          onIcon={<Visibility />}
          offIcon={<VisibilityOff />}
        />
      </IconButton>
    </InputAdornment>
  );
  return (
    <View>
      <TextField
        {...props}
        ref={ref}
        type={type}
        InputProps={{
          endAdornment,
        }}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      {focused && warningContent}
    </View>
  );
});

export default Password;
