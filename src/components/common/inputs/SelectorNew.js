import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import SimpleSelect from '@material-ui/core/Select';
import { FormHelperText } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { findIndex } from 'lodash';

const useStyles = makeStyles(theme => ({
  root: {
    // display: 'flex',
    // flexWrap: 'wrap',
    borderRadius: 10,
    // width: '100%',
    // maxWidth: ({ maxWidth }) => (maxWidth ? maxWidth : 500),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    border: '1px solid #EFEFEF',
    width: ({ width }) => (width ? width : '100%'),
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

const Selector = props => {
  let { label, items, value, onValueChange, helper } = props;
  const classes = useStyles(props);
  if (!value && value !== '') {
    // TODO: remove this with better error handling
    return null;
  }

  return (
    <div className={classes.root} autoComplete="off">
      <FormControl className={classes.formControl}>
        {label && <InputLabel htmlFor="age-simple">{label}</InputLabel>}
        <SimpleSelect
          disableUnderline
          value={value}
          renderValue={value => {
            const item = items.find(item => item.value === value);
            if (item) {
              if (item.label) {
                return item.label;
              } else {
                return item;
              }
            } else if (value && !value.code) {
              return value;
            }
            return '';
          }}
          onChange={event => onValueChange(event.target.value)}>
          {items.map(
            item =>
              item && (
                <MenuItem
                  key={item.id ? item.id : item.value}
                  value={item.value}>
                  {item.label}
                </MenuItem>
              ),
          )}
        </SimpleSelect>
        {helper && <FormHelperText>{helper}</FormHelperText>}
      </FormControl>
    </div>
  );
};

export default Selector;
