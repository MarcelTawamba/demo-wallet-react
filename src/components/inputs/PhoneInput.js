import React, { useState, useEffect } from 'react';
import PhoneNumber from 'react-phone-input-2';
import { makeStyles } from '@material-ui/core/styles';
import 'react-phone-input-2/lib/material.css';
import FormHelperText from '@material-ui/core/FormHelperText';
import { useSelector } from 'react-redux';
import { configAuthSelector } from 'redux/rehive/selectors';
import useI18Language from 'hooks/useI18Language';
import { isValidMobile } from 'util/validation';
export default function MobileInput(props) {
  const { getI18Translation } = useI18Language();
  const {
    existing,
    onChange,
    setFieldTouched,
    helperText = ' ',
    error,
    disabled = false,
    setIsValidNumber,
  } = props;
  const authConfig = useSelector(configAuthSelector);

  const [currentValue, setCurrentValue] = useState(existing);
  const classes = useStyles();

  useEffect(() => {
    if (onChange)
      onChange(
        currentValue?.indexOf('+') > -1
          ? currentValue
          : currentValue
          ? `+${currentValue}`
          : currentValue,
      );
  }, [currentValue]);

  const handleOnChange = value => {
    setCurrentValue(value);
    const isValidNumber = isValidMobile(`+${value}`);
    // Check if the setIsValidNumber function is defined
    if (typeof setIsValidNumber === 'function') {
      setIsValidNumber(isValidNumber === true);
    }
  };

  return (
    <>
      <PhoneNumber
        country={authConfig?.defaultNationality?.toLowerCase() || 'us'}
        value={currentValue}
        containerClass={classes.container}
        inputClass={classes.input}
        onChange={(value, country) => handleOnChange(value, country)}
        onBlur={setFieldTouched}
        specialLabel={getI18Translation('phone')}
        disabled={disabled}
      />
      <FormHelperText error={error}>{helperText}</FormHelperText>
    </>
  );
}

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: 8,
    '& .special-label': {
      fontSize: '12px !important',
      left: () => (theme.direction === 'rtl' ? 'unset !important' : 25),
      right: () => (theme.direction === 'rtl' ? 25 : 'unset'),
    },
    '& .selected-flag': {
      padding: () =>
        theme.direction === 'rtl'
          ? '0 11px 0 0 !important'
          : '0 0 0 11px !important',
      '& .arrow': {
        left: () => (theme.direction === 'rtl' ? 'unset' : 30),
        right: () => (theme.direction === 'rtl' ? 30 : 'unset'),
      },
    },
  },
  input: {
    padding: () =>
      theme.direction === 'rtl'
        ? '10.5px 58px 10.5px 14px !important'
        : '10.5px 14px 10.5px 58px !important',
    width: '100% !important',
    borderRadius: '10px !important',
    transition: 'none !important',
    fontFamily: 'inherit !important',
    '&:focus': {
      borderColor: `${theme.palette.primary.main} !important`,
      boxShadow: `0 0 0 1px ${theme.palette.primary.main} !important`,
    },
  },
}));
