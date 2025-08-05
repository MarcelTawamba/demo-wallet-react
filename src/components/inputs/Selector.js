import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import SimpleSelect from '@material-ui/core/Select';
import { FormHelperText } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import Text from 'components/outputs/Text';
import { standardizeString } from 'util/general';
import useI18Language from 'hooks/useI18Language';

const useStyles = makeStyles(theme => ({
  root: {
    // display: 'flex',
    // flexWrap: 'wrap',
    // height: 64,
    width: ({ width }) => (width ? width : '100%'),
  },
  formControl: {
    marginTop: ({ dense }) => theme.spacing(dense ? 0 : 1),
    marginBottom: ({ dense }) => theme.spacing(dense ? 0 : 1),
    minWidth: ({ minWidth }) => (minWidth ? minWidth : 0),
    width: '100%',
  },
  selectEmpty: {
    marginTop: theme.spacing(2.5),
  },
  select: {
    marginTop: theme.spacing(0.5),
  },
  label: {
    backgroundColor: 'white',
    zIndex: 100,
    paddingLeft: ({ variant }) =>
      variant === 'outlined' ? theme.spacing(0.5) : 0,
    paddingRight: theme.spacing(0),
    top: ({ variant }) => (variant === 'outlined' ? -theme.spacing(0.5) : 0),
    left: ({ variant }) => (variant === 'outlined' ? theme.spacing(1) : 0),
  },
}));

const Selector = props => {
  const { getI18Translation } = useI18Language();
  const {
    label,
    items,
    value,
    onValueChange,
    helper,
    emptyListMessage = 'no_options',
    variant,
    style,
    valueBold,
    align = 'left',
    disabled,
  } = props;

  const classes = useStyles(props);
  if (!value && value !== '') {
    // TODO: remove this with better error handling
    return null;
  }
  // useEffect(() => {

  // }, [value])

  return (
    <div className={classes.root} autoComplete="off">
      <FormControl className={classes.formControl}>
        {label && (
          <InputLabel htmlFor="age-simple" shrink className={classes.label}>
            {getI18Translation(label)}
          </InputLabel>
        )}
        {items && items.length > 0 ? (
          <SimpleSelect
            // renderValue={value => <Text>{value}</Text>}
            style={style}
            className={variant === 'outlined' ? classes.select : ''}
            margin={variant === 'outlined' ? 'dense' : 'none'}
            variant={variant}
            disabled={items.length === 1 || disabled}
            disableUnderline
            value={value}
            renderValue={value => {
              const item = items.find(item =>
                value.code
                  ? item.value.code === value.code
                  : item.value.toString() === value.toString(),
              );
              if (item) {
                return item?.label
                  ? getI18Translation(item?.label)
                  : item?.value
                  ? standardizeString(item?.value)
                  : getI18Translation(item);
              } else if (value && !value.code) {
                return (
                  <Text align={align} bold={valueBold}>
                    {standardizeString(value)}
                  </Text>
                );
              }
              return '';
            }}
            onChange={event => onValueChange(event.target.value)}>
            {items.map(
              item =>
                item && (
                  <MenuItem
                    key={item.id ? item.id : item.value}
                    value={item.value}
                    disabled={item.disabled}>
                    {item?.label
                      ? getI18Translation(item?.label)
                      : standardizeString(item.value)}
                  </MenuItem>
                ),
            )}
          </SimpleSelect>
        ) : (
          <Text
            opacity={0.67}
            className={classes.selectEmpty}
            id={emptyListMessage}
          />
        )}
        {helper && <FormHelperText>{helper}</FormHelperText>}
      </FormControl>
    </div>
  );
};

export default Selector;
