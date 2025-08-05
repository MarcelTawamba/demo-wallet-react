/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import PhoneNumber from 'react-phone-input-2';
import { makeStyles } from '@material-ui/core/styles';
import 'react-phone-input-2/lib/material.css';
import { useSelector } from 'react-redux';
import { configAuthSelector } from 'redux/rehive/selectors';
import useI18Language from 'hooks/useI18Language';

export default function MobileInput(props) {
  const { getI18Translation } = useI18Language();
  const { existing, onChange } = props;
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

  return (
    <PhoneNumber
      country={authConfig?.defaultNationality?.toLowerCase() || 'us'}
      value={currentValue}
      containerClass={classes.container}
      inputClass={classes.input}
      onChange={value => setCurrentValue(value)}
      specialLabel={getI18Translation('phone')}
    />
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
