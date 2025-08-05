import React from 'react';
import PhoneInput from 'react-phone-input-2';
import { makeStyles } from '@material-ui/core/styles';
import 'react-phone-input-2/lib/material.css';
import { FormHelperText } from '@material-ui/core';
import useI18Language from 'hooks/useI18Language';

export default function MobileInputRHF(props) {
  const { getI18Translation } = useI18Language();
  const {
    field, 
    label, 
    error,
    helperText,
    defaultValue,
    country = 'us', 
  } = props;

  const classes = useStyles();

  if (!field) {
    console.error('MobileInputRHF requires a field prop from Controller');
    return null;
  }

  return (
    <>
      <PhoneInput
        value={field.value ?? ''} 
        onChange={v => field.onChange(v ? '+' + v : '')} 
        onBlur={field.onBlur}
        inputProps={{
          ref: field.ref,
        }}
        specialLabel={label ?? getI18Translation('phone')} 
        defaultValue={defaultValue}
        containerClass={classes.container}
        inputClass={classes.input}
        country={country?.toLowerCase()} 
      />
      <FormHelperText error={error}>{helperText}</FormHelperText>
    </>
  );
}

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: 12,
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
