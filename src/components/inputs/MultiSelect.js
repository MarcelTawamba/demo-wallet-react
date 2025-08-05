import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import SimpleSelect from '@material-ui/core/Select';
import { FormHelperText, Chip } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/styles';
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

// Helper function to find the display label for a currency code
function findCurrencyLabel(value, items) {
  // First try to find in the items array
  if (isObject(items?.[0])) {
    const item = items.find(i => i?.value === value);
    if (item?.label) {
      return item.label;
    }
  }
  
  // If not found, try to extract the display_code from the value
  try {
    if (value && value.includes('_')) {
      // For codes like "USDC_SOL", we want to display "USDC"
      const parts = value.split('_');
      if (parts.length > 1) {
        return parts[0];
      }
    }
  } catch (error) {
    console.error('Error parsing currency code:', error);
  }
  
  // If all else fails, just return the value
  return value;
}

const MultiSelect = props => {
  const {
    label,
    items = [],
    values = [],
    setValue,
    helper,
    inputVariant = 'outlined',
  } = props;
  const classes = useStyles(props);
  const { getI18Translation } = useI18Language();

  const theme = useTheme();
  
  // Ensure values is always an array
  const safeValues = Array.isArray(values) ? values : [];
  
  // Ensure setValue is a function
  const handleSetValue = (newValue) => {
    if (typeof setValue === 'function') {
      setValue(newValue);
    } else {
      console.warn('MultiSelect: setValue is not a function');
    }
  };
  
  const translatedLabel = getI18Translation(label);

  return (
    <FormControl variant={inputVariant} className={classes.formControl}>
      {label && (
        <InputLabel margin="dense" id={`multiselect_label_${label}`}>
          {translatedLabel}
        </InputLabel>
      )}
      <SimpleSelect
        margin="dense"
        multiple
        value={safeValues}
        id={`multiselect_${label}`}
        labelId={`multiselect_label_${label}`}
        label={translatedLabel}
        renderValue={values => {
          return (
            <div className={classes.chips}>
              {values.map(value => {
                let valueString = findCurrencyLabel(value, items);
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
        }}
        onChange={event => {
          handleSetValue(event.target.value);
          try {
            document
              .getElementsByClassName('MuiPopover-root')[0]
              .querySelector('div')
              .click();
          } catch (error) {}
        }}>
        {items.map(
          item =>
            item && (
              <MenuItem
                key={item?.value ?? item}
                value={item?.value ?? item}
                style={getStyles(item, safeValues, theme)}>
                {item?.label ?? item}
              </MenuItem>
            ),
        )}
      </SimpleSelect>
      {helper && <FormHelperText>{helper}</FormHelperText>}
    </FormControl>
  );
};

export default MultiSelect;
