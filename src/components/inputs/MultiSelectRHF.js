import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { FormHelperText, Chip } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/styles';
import { Controller } from 'react-hook-form';
import useI18Language from 'hooks/useI18Language';
import { isObject } from 'lodash';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%',
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
  formControl: {
    marginTop: ({ dense }) => theme.spacing(dense ? 0 : 1),
    marginBottom: ({ dense }) => theme.spacing(dense ? 0 : 1),
    minWidth: ({ minWidth }) => (minWidth ? minWidth : 0),
    width: '100%',
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

function getStyles(item, items, theme) {
  const valueString = item?.value ?? item;
  const itemsArray = items?.currencies ?? items;
  return {
    fontWeight:
      itemsArray.indexOf(valueString) !== -1
        ? theme.typography.fontWeightMedium
        : theme.typography.fontWeightRegular,
  };
}

export default function MultiSelect(props) {
  const {
    label,
    items,
    values = [],
    setValue,
    helper,
    control,
    name,
    errors,
    required,
  } = props;
  const { getI18Translation } = useI18Language();
  const error = errors?.[name] ?? '';
  const classes = useStyles(props);
  const labelRef = useRef();
  const labelWidth = labelRef.current ? labelRef.current.clientWidth : 0;

  const theme = useTheme();
  if (!values) {
    // TODO: remove this with better error handling
    return null;
  }
  const translatedLabel = getI18Translation(label);

  return (
    <FormControl
      labelWidth={labelWidth}
      className={classes.formControl}
      variant="outlined">
      {label && (
        <InputLabel ref={labelRef} required={required} htmlFor="age-simple">
          {translatedLabel}
        </InputLabel>
      )}
      <Controller
        render={({ onChange, onBlur, value, name }) => (
          <Select
            labelWidth={labelWidth}
            multiple
            name={name}
            onChange={onChange}
            value={typeof value !== 'object' ? [] : value}
            disableUnderline
            renderValue={values => {
              return (
                <div className={classes.chips}>
                  {values.map(value => {
                    let valueString = value;
                    if (isObject(items?.[0])) {
                      valueString = items.find(i => i?.value === value)?.label;
                    }
                    return (
                      <Chip
                        key={value}
                        label={valueString}
                        className={classes.chip}
                      />
                    );
                  })}
                </div>
              );
            }}>
            {items.map(
              item =>
                item && (
                  <MenuItem
                    key={item?.value ?? item}
                    value={item?.value ?? item}
                    // onChange={event => handleChange(event)}
                    style={getStyles(item, values, theme)}>
                    {item?.label ?? item}
                  </MenuItem>
                ),
            )}
          </Select>
        )}
        control={control}
        name={name}
      />

      {helper && <FormHelperText>{helper}</FormHelperText>}
      {Boolean(error) && (
        <FormHelperText error>{error?.message}</FormHelperText>
      )}
    </FormControl>
  );
}
