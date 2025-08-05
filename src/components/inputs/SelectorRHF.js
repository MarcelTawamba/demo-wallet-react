import React, { useRef } from 'react';
import { SimpleImg } from 'react-simple-img';
import makeStyles from '@material-ui/styles/makeStyles';

import { Controller } from 'react-hook-form';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Icon from 'components/outputs/Icon';
import Text from 'components/outputs/Text';
import { Box } from '@material-ui/core';
import { standardizeString } from 'util/general';
import Spinner from 'components/outputs/Spinner';

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
    id,
    style,
    variant = 'outlined',
  } = props;
  const classes = useStyles(props);

  const labelText = label
    ? typeof label === 'function'
      ? label(props)
      : label
    : standardizeString(id);

  const labelRef = useRef();
  const labelWidth = labelRef.current ? labelRef.current.clientWidth : 0;

  let controllerProps = { name, control };
  if (defaultValue) {
    controllerProps.defaultValue = defaultValue;
  }

  const Component = (
    <Controller
      {...controllerProps}
      render={({ field }) => (
        <Select
          value={field.value}
          onChange={field.onChange}
          labelWidth={labelWidth}
          id={name}
          notched
          disableUnderline={variant === 'simple'}
          label={labelText}
          labelId={name}
          margin="dense"
          inputProps={{ className: classes.input }}
          fullWidth
          name={name}>
          {options.map(item => (
            <MenuItem
              key={item?.value ?? item}
              value={item?.value ?? item}
              button>
              <SelectorOption {...props} id={item?.value ?? item} item={item} />
            </MenuItem>
          ))}
        </Select>
      )}
    />
  );
  if (variant === 'simple') {
    return Component;
  }

  return (
    <Box pb={1} pt={1} width="100%" style={style}>
      <FormControl id={name} name={name} variant={variant} fullWidth>
        <InputLabel
          ref={labelRef}
          id={name}
          shrink
          // style={{ backgroundColor: 'white', paddingLeft: 2, paddingRight: 2 }}
          notched>
          {labelText}
        </InputLabel>
        {/* {loading && (
          <Spinner size="small" />
        ) : ( */}
        {Component}
        {/* )} */}
      </FormControl>
    </Box>
  );
}

function SelectorOption(props) {
  const { item = '' } = props;
  const { value, label, icon, iconVariant } = item;

  const labelText = label
    ? typeof label === 'function'
      ? label(props)
      : label
    : standardizeString(value);

  const iconSrc = icon
    ? typeof icon === 'function'
      ? icon(props)
      : icon
    : value;
  const iconVariantValue = iconVariant
    ? typeof iconVariant === 'function'
      ? iconVariant(props)
      : iconVariant
    : 'icon';

  return (
    <Box flexDirection="row" alignItems="center" display="flex">
      {/* {iconVariantValue === 'image' ? (
        <SimpleImg
          height={24}
          width={24}
          src={iconSrc}
          style={{ borderRadius: 100, marginRight: 12 }}
        />
      ) : (
        <Icon icon={iconSrc} size={24} inverted style={{ marginRight: 8 }} />
      )} */}
      <Text myColor="#222222">{labelText}</Text>
    </Box>
  );
}
