import React, { useCallback } from 'react';
import TextField from './TextField';
import MuiAutocomplete from '@material-ui/lab/Autocomplete';
import { Controller } from 'react-hook-form';

export default function Autocomplete(props) {
  let {
    control,
    setValue,
    name,
    label,
    options = [],
    triggerValidation,
    validation,
    value = '',
    getValues,
  } = props;

  if (!value && getValues && typeof getValues === 'function') value = getValues(name);

  const isObjectOption = typeof options[0] !== 'string';

  const onChange = useCallback(
    (e, newValue) => {
      if (setValue && typeof setValue === 'function') {
        setValue(name, isObjectOption ? newValue?.value : newValue);
      }
      // triggerValidation(name);
    },
    [setValue, name, isObjectOption], //triggerValidation
  );

  return (
    <div style={{ paddingBottom: 0, width: '100%' }}>
      <Controller
        defaultValue={value}
        name={name}
        control={control}
        render={({ field }) => (
          <MuiAutocomplete
            onChange={onChange}
            autoSelect
            fullWidth
            options={options}
            value={field.value}
            getOptionLabel={option => {
              if (!option || option === '') return '';
              if (!isObjectOption) return option;
              if (typeof option === 'string') {
                const foundOption = options?.find(x => x.value === option);
                return foundOption?.label || option;
              }
              return option.label || '';
            }}
            getOptionSelected={(option, value) =>
              isObjectOption ? option.value === value : option === value
            }
            renderInput={params => (
              <TextField
                {...params}
                fullWidth
                label={label}
                variant="outlined"
                required={validation?.required}
                margin="dense"
                autocomplete="off"
                InputLabelProps={{
                  shrink: !!field.value || !!params?.inputProps?.value,
                }}
              />
            )}
          />
        )}
      />
    </div>
  );
}
