import React from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import { Controller } from 'react-hook-form';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import useI18Language from 'hooks/useI18Language';

const useStyles = makeStyles(theme => ({
  formControl: {
    marginTop: ({ noPadding, label }) =>
      theme.spacing(noPadding ? 0 : label ? 1 : 0),
    width: ({ variant }) => (variant === 'simple' ? 'auto' : '100%'),
    border: '1px solid rgba(0, 0, 0, 0.25)',
    borderRadius: 10,
    '&:focus': {
      border: '2px solid #ab2323',
    },
    '&:hover': {
      border: '1px solid rgba(0, 0, 0, 0.87)',
    },
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(2),
    position: 'relative',
    left: -theme.spacing(1),
  },
  formControlSimple: {
    width: ({ variant }) => (variant === 'simple' ? 'auto' : '100%'),
    left: ({ label }) => -theme.spacing(!label ? 1.5 : 0),
  },
  group: {
    display: 'flex',
    flexDirection: 'row',
    width: ({ variant }) => (variant === 'simple' ? 'auto' : '100%'),
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1),
  },
  groupSimple: {
    display: 'flex',
    flexDirection: 'row',
    width: ({ variant }) => (variant === 'simple' ? 'auto' : '100%'),
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1),
    '& .MuiSvgIcon-root': {
      margin: 0,
      padding: 0,
      height: 20,
      width: 20,
    },
  },
  label: {
    backgroundColor: ({ backgroundColor }) => backgroundColor ?? 'white',
    width: 'auto',
    left: theme.spacing(1.25),
    top: -theme.spacing(1.5),
    padding: theme.spacing(0.5),
    paddingBottom: theme.spacing(0),
    paddingRight: theme.spacing(1),
  },
  groupResponsive: {
    display: 'flex',
    width: ({ variant }) => (variant === 'simple' ? 'auto' : '100%'),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    flexDirection: 'column',
  },
  item: ({ variant }) =>
    variant === 'simple'
      ? {}
      : {
          flex: 1,
        },
}));

export default function RadioSelector(props) {
  const {
    name,
    // value,
    label = '',
    options,
    responsive,
    handleChange,
    getValues,
    control,
    variant = 'outlined',
  } = props;
  const classes = useStyles(props);
  const value = getValues(name);
  const { getI18Translation } = useI18Language();

  return (
    <FormControl
      // variant={variant}
      className={
        variant === 'simple' ? classes.formControlSimple : classes.formControl
      }>
      {Boolean(label) && (
        <InputLabel className={classes.label} shrink>
          {getI18Translation(label)}
        </InputLabel>
      )}
      <Controller
        name={name}
        defaultValue={value}
        control={control}
        render={({ field }) => (
          <RadioGroup
            aria-label={name}
            className={
              variant === 'simple'
                ? classes.groupSimple
                : responsive
                ? classes.groupResponsive
                : classes.group
            }
            value={field.value}
            onChange={(e) => field.onChange(e.target.value)}>
            {options.map(item => (
              <FormControlLabel
                key={item.label}
                value={item.value}
                className={classes.item}
                control={<Radio color={'primary'} />}
                label={getI18Translation(item.label)}
              />
            ))}
          </RadioGroup>
        )}
      />
    </FormControl>
  );
}
