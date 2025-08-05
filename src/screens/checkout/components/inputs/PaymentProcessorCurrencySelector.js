import React, { useRef } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { Box } from '@material-ui/core';
import useI18Language from 'hooks/useI18Language';

const useStyles = makeStyles(() => ({
  input: {
    paddingTop: 9,
    paddingBottom: 9,
  },
}));

export default function CompanyCurrencySelector(props) {
  let { control, context, name = 'payment_processor_currency' } = props;
  const classes = useStyles();
  const { getI18Translation } = useI18Language();
  
  // Use form context if control not provided as props
  const formContext = useFormContext();
  const formControl = control || formContext?.control;
  const formWatch = formContext?.watch;
  
  // Add error handling
  if (!formControl) {
    console.error('CompanyCurrencySelector requires control either as props or via FormProvider context');
    return null;
  }
  
  const values = formWatch?.() || {};

  const matching_processor = context?.invoice?.available_payment_processors.filter(
    item =>
      item?.unique_string_name === values?.payment_method
  );
  
  // Handle null values in selectable_currencies by falling back to currencies array
  const processor = matching_processor[0];
  let currencies = processor?.selectable_currencies || [];
  
  // If selectable_currencies contains null values, use the currencies array instead
  if (currencies.length === 1 && currencies[0] === null) {
    currencies = processor?.currencies || [];
  }
  
  // Filter out any null values
  currencies = currencies.filter(currency => currency !== null);
  
  const defaultValue = currencies[0] || '';
  
  const labelText = getI18Translation('currency') || 'Currency';
  const labelRef = useRef();
  const labelWidth = labelRef.current ? labelRef.current.clientWidth : 0;

  return (
    <Box pb={1} pt={1} width="100%">
      <FormControl variant="outlined" fullWidth>
        <InputLabel
          ref={labelRef}
          id={name}
          shrink
          notched>
          {labelText}
        </InputLabel>
        <Controller
          name={name}
          control={formControl}
          defaultValue={defaultValue}
          rules={{ required: true }}
          render={({ field }) => (
            <Select
              value={field.value}
              onChange={field.onChange}
              labelWidth={labelWidth}
              id={name}
              notched
              label={labelText}
              labelId={name}
              margin="dense"
              inputProps={{ className: classes.input }}
              fullWidth
              name={name}>
              {currencies.map(currency => (
                <MenuItem
                  key={currency}
                  value={currency}
                  button>
                  {currency}
                </MenuItem>
              ))}
            </Select>
          )}
        />
      </FormControl>
    </Box>
  );
}

