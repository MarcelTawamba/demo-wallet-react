import React from 'react';
import { View } from 'components/layout/View';
import TextField from './TextField';

export default function Autocomplete(props) {
  const { restProps, options } = props;

  return (
    <View mv={0.25} w={'100%'}>
      <Autocomplete
        // {...fieldConfig}
        {...restProps}
        autoComplete
        getOptionLabel={option =>
          typeof option === 'string'
            ? options?.find(x => x.value === option)?.label
            : option.label
        }
        getOptionSelected={(option, value) => Boolean(option.value === value)}
        onChange={(event, option) => {
          //   setFieldValue(name, option?.value ?? '');
        }}
        renderInput={params => (
          <TextField
            {...params}
            // error={fieldConfig.error}
            // helperText={fieldConfig.helperText}
            // label={fieldConfig?.label}
            variant="outlined"
          />
        )}
      />
    </View>
  );
}
