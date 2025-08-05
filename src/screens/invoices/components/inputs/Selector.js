import React, { useRef } from 'react';
import makeStyles from '@material-ui/styles/makeStyles';

import { Controller } from 'react-hook-form';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Text from 'components/outputs/Text';
import { Box } from '@material-ui/core';
import { standardizeString, formatAmountString } from 'util/general';

const useStyles = makeStyles(theme => ({
  input: {
    // position: 'relative',
    paddingTop: 9,
    paddingBottom: 9,
  },
}));

export default function Selector(props) {
  const {
    control,
    defaultValue,
    options,
    label,
    name,
    items,
    id,
    style,
    variant = 'outlined',
  } = props;
  const classes = useStyles(props);

  const labelRef = useRef();
  const labelWidth =
    labelRef.current && label ? labelRef.current.clientWidth : 0;

  let controllerProps = { name, control };
  if (defaultValue) {
    controllerProps.defaultValue = defaultValue;
  }

  function handleChange(event) {
    console.log('handleChange -> event', event);
    const { name, value } = event?.target;
    console.log('handleChange -> name', name);
    console.log('handleChange -> value', value);

    control.setValue(name, value);
  }

  return (
    <Box pb={1} pt={1} width="100%" style={style}>
      <FormControl id={name} name={name} variant={variant} fullWidth>
        <InputLabel ref={labelRef} id={name} shrink notched>
          {label}
        </InputLabel>
        <Controller
          {...controllerProps}
          render={({ field }) => (
            <Select
              displayEmpty={true}
              renderValue={value => <SelectorOption {...props} item={value} />}
              labelWidth={labelWidth}
              id={name}
              notched
              disableUnderline={variant === 'simple'}
              labelId={name}
              margin="dense"
              onChange={(e) => {
                field.onChange(e);
                handleChange(e);
              }}
              value={field.value || ""}
              inputProps={{ className: classes.input }}
              fullWidth
              name={name}>
              {options.map(item => (
                <MenuItem
                  key={item?.index ?? item}
                  value={item?.index ?? item}
                  button>
                  <SelectorOption
                    {...props}
                    id={item?.index ?? item}
                    item={item?.index}
                  />
                </MenuItem>
              ))}
            </Select>
          )}
        />
      </FormControl>
    </Box>
  );
}

function SelectorOption(props) {
  const { item = {}, items, currency, placeholder } = props;

  const { name, price } = items?.[item?.index ?? item] ?? {};

  return (
    <Box
      flexDirection="row"
      alignItems="center"
      display="flex"
      justifyContent="space-between"
      width="100%">
      {name ? (
        <>
          <Text>{name}</Text>
          <Text align="right">{formatAmountString(price, currency)}</Text>
        </>
      ) : (
        <Text myColor="fontLight">{placeholder}</Text>
      )}
    </Box>
  );
}
