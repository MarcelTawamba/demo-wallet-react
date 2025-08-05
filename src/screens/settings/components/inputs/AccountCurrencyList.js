import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { uniq, uniqBy, isObject } from 'lodash';

import MultiSelectRHF from 'components/inputs/MultiSelectRHF';
import MultiSelect from 'components/inputs/MultiSelect';
import { useSelector } from 'react-redux';
import { walletsSelector } from 'screens/accounts/redux/selectors';

// Import the getCurrencyCode function
import { getCurrencyCode } from 'util/general';

const useStyles = makeStyles(theme => ({
  text: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  edit: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    justifyContent: 'flex-end',
  },
}));

export default function AccountCurrencyList(props) {
  const { formik, values, setValue, ...restProps } = props;
  let label =
    typeof restProps?.field === 'object' ? restProps?.field?.label : '';
  if (!label && typeof restProps?.field === 'string') label = restProps?.field;
  else label = 'currencies';
  const accounts = useSelector(walletsSelector);

  // Include all currencies, not just non-crypto ones
  const codes = uniqBy(
    accounts.items
      .map(currency => ({
        label: getCurrencyCode(currency?.currency),
        value: currency?.currency?.code,
      })),
    'value',
  );

  // Also include company currencies
  if (accounts.companyCurrencies && accounts.companyCurrencies.length > 0) {
    accounts.companyCurrencies.forEach(currency => {
      if (!codes.find(code => code.value === currency.code)) {
        codes.push({
          label: getCurrencyCode(currency),
          value: currency.code,
        });
      }
    });
  }

  // Ensure selected currencies are included in the list
  const selectedValues = values || restProps.values || [];
  
  // Make sure selectedValues is always an array before using forEach
  const currencyArray = Array.isArray(selectedValues) 
    ? selectedValues 
    : (typeof selectedValues === 'string' 
        ? selectedValues.split(',').map(s => s.trim()).filter(Boolean)
        : []);
  
  currencyArray.forEach(value => {
    if (!codes.find(code => code.value === value)) {
      // Try to find the currency in the companyCurrencies
      const currency = accounts.companyCurrencies?.find(curr => curr.code === value);
      if (currency) {
        codes.push({
          label: getCurrencyCode(currency),
          value: currency.code,
        });
      } else {
        // If we can't find the currency, try to extract a display code
        let displayLabel = value;
        try {
          if (value.includes('_')) {
            // For codes like "USDC_SOL", we want to display "USDC"
            const parts = value.split('_');
            if (parts.length > 1) {
              displayLabel = parts[0];
            }
          }
        } catch (error) {
          console.error('Error parsing currency code:', error);
        }
        
        codes.push({
          label: displayLabel,
          value: value,
        });
      }
    }
  });

  const classes = useStyles();

  return (
    <div className={classes.container}>
      {formik ? (
        <MultiSelect
          required
          {...restProps}
          values={values}
          setValue={setValue}
          items={codes ?? []}
          label={label}
          inputVariant="standard"
        />
      ) : (
        <MultiSelectRHF
          required
          {...restProps}
          items={codes ?? []}
          label={label}
        />
      )}
    </div>
  );
}
