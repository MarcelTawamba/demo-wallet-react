import React, { useState, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Controller } from 'react-hook-form';
import { getConversionCurrencies } from 'util/rehive';
import { useEffect } from 'react';
import { Box } from '@material-ui/core';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import CurrencyBadge from 'screens/accounts/components/currency/CurrencyBadge';
import { getCurrencyCode } from 'util/general';
import useI18Language from 'hooks/useI18Language';
import { useSelector, useDispatch } from 'react-redux';
import { SET_CONVERSION_CURRENCIES } from 'redux/rehive/reducer';

const useStyles = makeStyles(theme => ({
  paper: {
    margin: 0,
    padding: 0,
    paddingInlineStart: 0,
    width: '100%',
    paddingInlineEnd: 0,
  },
  listbox: {
    margin: 0,
    padding: 0,
    paddingInlineStart: 0,
    width: '100%',
    paddingInlineEnd: 0,
  },
  groupUl: {
    margin: 0,
    padding: 0,
    paddingInlineStart: 0,
    width: '100%',
    paddingInlineEnd: 0,
  },
}));

export default function DisplayCurrencyInput(props) {
  const { control, context, errors, onLoadingChange } = props;
  const { displayCurrency } = context;
  const classes = useStyles();
  const { getI18Translation } = useI18Language();
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  
  // Get currencies from Redux store
  const cachedCurrencies = useSelector(state => state.rehive?.conversionCurrencies ?? []);

  useEffect(() => {
    // Only fetch if we don't have cached data
    if (cachedCurrencies.length === 0) {
      onLoadingChange?.(true);
      getConversionCurrencies()
        .then(response => {
          if (response.status === 'success') {
            dispatch({ type: SET_CONVERSION_CURRENCIES, payload: response.data.results });
          } else {
            setError(response.message);
          }
        })
        .catch(e => {
          setError(e?.message);
          console.log('DisplayCurrencyForm -> Error loading currencies:', e);
        })
        .finally(() => {
          onLoadingChange?.(false);
        });
    }
  }, [dispatch, cachedCurrencies.length]); // Only run when cached currencies change or on mount

  const helperText = errors?.displayCurrency?.message ?? error;

  return (
    <Box pt={0.5} w={'100%'} pb={0.75}>
      <Controller
        defaultValue={displayCurrency?.code}
        render={({ field: { onChange, value } }) => (
          <Autocomplete
            value={cachedCurrencies.find(option => option.code === (value?.code ?? value)) ?? null}
            options={cachedCurrencies ?? []}
            ListboxProps={{ padding: 0, margin: 0, width: '100%' }}
            classes={classes}
            getOptionSelected={(option, value) =>
              option.code === (value?.code ?? value)
            }
            getOptionLabel={option =>
              typeof option === 'string' ? option : option.code ?? ''
            }
            filterOptions={(options, { inputValue }) => {
              const filtered = options.filter(
                item =>
                  item.code.toLowerCase().includes(inputValue.toLowerCase()) ||
                  item.description
                    .toLowerCase()
                    .includes(inputValue.toLowerCase()),
              );
              return filtered;
            }}
            renderOption={option => <Option item={option} />}
            renderInput={params => (
              <TextField
                {...params}
                label={getI18Translation('displayCurrency')}
                helperText={helperText}
                error={Boolean(helperText)}
                margin="dense"
                variant="outlined"
              />
            )}
            onChange={(event, newValue) => {
              onChange(newValue);
            }}
          />
        )}
        name="displayCurrency"
        control={control}
        rules={{ required: true }}
      />
    </Box>
  );
}

function Option(props) {
  const { item } = props;
  const { description } = item;
  return (
    <View fD={'row'} w={'100%'} jC={'flex-start'} aI={'center'}>
      <CurrencyBadge text={getCurrencyCode(item)} currency={item} radius={16} />
      <View fD={'column'} jC={'flex-end'} w={'100%'}>
        <Text align={'left'}>
          {getCurrencyCode(item) + (description && ' - ' + description)}
        </Text>
      </View>
    </View>
  );
}
