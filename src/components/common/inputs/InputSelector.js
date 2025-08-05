import React, { Component, useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';

import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import CloseIcon from '@material-ui/icons/Close';
import ToggleIcon from 'material-ui-toggle-icon';
import TextField from './TextField';
import { View } from 'components/layout/View';
import Checkbox from '@material-ui/core/Checkbox';
import Text from 'components/outputs/Text';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Hidden from '@material-ui/core/Hidden';

// import MomentUtils from '@date-io/moment';
// import {
//   DatePicker,
//   TimePicker,
//   DateTimePicker,
//   MuiPickersUtilsProvider,
// } from '@material-ui/pickers';

import { getName } from 'country-list';
import useCapsLock from 'hooks/capsLock';

const Input = props => {
  return <FormikInput {...props} />;
};

const FormikInput = ({ field, formikProps, ...restProps }) => {
  const {
    handleChange,
    values,
    errors,
    touched,
    isSubmitting,
    setFieldValue,
    handleBlur,
  } = formikProps;

  let { type, name, label, placeholder, helper, multiline } = field;
  const error = errors[name];
  const value = values[name];
  const touch = touched[name];
  const showError = error && touch;
  const disabled = false;

  const fieldConfig = {
    name,
    label,
    placeholder,
    value,
    type,
    multiline,
    fullWidth: true,
    onChange: handleChange,
    onBlur: handleBlur,
    // margin="normal"
    error: showError,
    helperText: showError ? error : helper ? helper : '',
    disabled: isSubmitting || disabled,
  };

  if (type === 'date') {
    fieldConfig.InputLabelProps = { shrink: true };
  }

  switch (type) {
    case 'password':
      return <Password {...fieldConfig} />;
    // case 'country':
    //   return <Country {...fieldConfig} />;
    case 'clearable':
      return <Clearable {...fieldConfig} setFieldValue={setFieldValue} />;
    case 'checkbox':
      return <MyCheckbox {...fieldConfig} setFieldValue={setFieldValue} />;
    case 'switch':
      return <MySwitch {...fieldConfig} setFieldValue={setFieldValue} />;
    // case 'date':
    //   return (
    //     <MuiPickersUtilsProvider utils={MomentUtils}>
    //       <DatePicker {...fieldConfig} />
    //     </MuiPickersUtilsProvider>
    //   );
    default:
      return (
        <View style={{ paddingBottom: 0, width: '100%' }}>
          <Basic {...fieldConfig} />
        </View>
      );
  }
};

export default Input;

const Basic = props => {
  return (
    <View pt={0.25} w={'100%'} pb={0.75}>
      <TextField
        margin="dense"
        autoComplete="off"
        variant={'outlined'}
        {...props}
      />
    </View>
  );
};

// class Country extends Component {
//   render() {
//     return <Basic {...this.props} value={getName(this.props.value)} />;
//   }
// }

const Clearable = props => {
  const endAdornment = (
    <Hidden xsDown>
      <InputAdornment position="end" style={{ paddingRight: 0 }}>
        <IconButton
          tabIndex="-1"
          onClick={() => props.setFieldValue(props.name, '')}
          // onMouseDown={this.handleButtonMouseDown}
          disabled={false}>
          <CloseIcon style={{ height: 16, width: 16 }} />
        </IconButton>
      </InputAdornment>
    </Hidden>
  );
  return <Basic {...props} endAdornment={props.value && endAdornment} />;
};

function Password(props) {
  const [showPassword, setShowPassword] = useState(false);
  const { warningContent } = useCapsLock(document);

  const toggleVisibility = () => setShowPassword(!showPassword);

  const handleButtonMouseDown = e => e.preventDefault();

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
      <Basic {...props} type={type} InputProps={{ endAdornment }} />
      {warningContent}
    </View>
  );
}

const MyCheckbox = props => {
  const { name, value, label, setFieldValue, error } = props;
  return (
    <View key={name} p={0.5}>
      <FormControlLabel
        control={
          <View ph={0.5}>
            <Checkbox
              checked={value}
              onChange={() => setFieldValue(name, !value)}
              value={name}
              color="primary"
            />
          </View>
        }
        label={label}
      />

      {error ? (
        <View>
          <Text>{error}</Text>
        </View>
      ) : null}
    </View>
  );
};

const MySwitch = props => {
  const { name, value, label, setFieldValue, error } = props;
  return (
    <View pv={1} style={{ paddingRight: 0 }}>
      <FormControlLabel
        labelPlacement="end"
        control={
          <Switch
            color="primary"
            // label={label}
            value={value}
            onChange={() => setFieldValue(!value)}
          />
        }
        label={label}
      />
    </View>
  );
};
