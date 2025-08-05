import React from 'react';
import Select from 'react-select';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import NoSsr from '@material-ui/core/NoSsr';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import PropTypes from 'prop-types';
import useI18Language from 'hooks/useI18Language';

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
  },
  input: {
    display: 'flex',
    padding: 0,
    height: 'auto',
    paddingLeft: 4,
  },
  inputPadded: {
    display: 'flex',
    padding: 0,
    height: 'auto',
    paddingLeft: 16,
  },
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden',
    zIndex: 10000,
  },
  noOptionsMessage: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(2),
  },
  singleValue: {
    fontSize: 16,
    color: 'black',
  },
  singleValueDisabled: {
    fontSize: 16,
    color: '#777',
  },
  placeholder: {
    position: 'absolute',
    left: 2,
    bottom: 8,
    fontSize: 16,
    paddingLeft: 14,
  },
  paper: {
    position: 'absolute',
    zIndex: 5,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0,
    overflowY: 'scroll',
    minHeight: 196,
    maxHeight: 196,
    height: 196,
  },
  divider: {
    height: theme.spacing(2),
  },
});

function NoOptionsMessage(props) {
  const { getI18Translation } = useI18Language();
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.noOptionsMessage}
      {...props.innerProps}>
      {getI18Translation('no_options')}
    </Typography>
  );
}

NoOptionsMessage.propTypes = {
  children: PropTypes.node,
  innerProps: PropTypes.object,
  selectProps: PropTypes.object.isRequired,
};

function inputComponent({ inputRef, ...props }) {
  return <div ref={inputRef} {...props} />;
}

inputComponent.propTypes = {
  inputRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
};

function Control(props) {
  const { variant } = props.selectProps.TextFieldProps;
  return (
    <TextField
      InputLabelProps={{ shrink: true }}
      fullWidth
      label={props.selectProps.label}
      // placeholder=" "
      margin="dense"
      InputProps={{
        inputComponent,
        inputProps: {
          className:
            variant === 'outlined'
              ? props.selectProps.classes.inputPadded
              : props.selectProps.classes.input,
          inputRef: props.innerRef,
          children: props.children,
          ...props.innerProps,
        },
      }}
      {...props.selectProps.TextFieldProps}
    />
  );
}

Control.propTypes = {
  children: PropTypes.node,
  innerProps: PropTypes.object,
  innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  selectProps: PropTypes.object.isRequired,
};

function Option(props) {
  return (
    <MenuItem
      ref={props.innerRef}
      selected={props.isFocused}
      component="div"
      style={{
        fontWeight: props.isSelected ? 500 : 400,
      }}
      {...props.innerProps}>
      {props.children}
    </MenuItem>
  );
}

Option.propTypes = {
  children: PropTypes.node,
  innerProps: PropTypes.object,
  innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  isFocused: PropTypes.bool,
  isSelected: PropTypes.bool,
};

function Placeholder(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.placeholder}
      {...props.innerProps}>
      {props.children}
    </Typography>
  );
}

Placeholder.propTypes = {
  children: PropTypes.node,
  innerProps: PropTypes.object,
  selectProps: PropTypes.object.isRequired,
};

function SingleValue(props) {
  return (
    <Typography
      className={
        props.selectProps.disabled
          ? props.selectProps.classes.singleValueDisabled
          : props.selectProps.classes.singleValue
      }
      {...props.innerProps}>
      {props.children}
    </Typography>
  );
}

SingleValue.propTypes = {
  children: PropTypes.node,
  innerProps: PropTypes.object,
  selectProps: PropTypes.object.isRequired,
};

function ValueContainer(props) {
  return (
    <div className={props.selectProps.classes.valueContainer}>
      {props.children}
    </div>
  );
}

ValueContainer.propTypes = {
  children: PropTypes.node,
  selectProps: PropTypes.object.isRequired,
};

// function MultiValue(props) {
//   return (
//     <Chip
//       tabIndex={-1}
//       label={props.children}
//       className={clsx(props.selectProps.classes.chip, {
//         [props.selectProps.classes.chipFocused]: props.isFocused,
//       })}
//       onDelete={props.removeProps.onClick}
//       deleteIcon={<CancelIcon {...props.removeProps} />}
//     />
//   );
// }

// MultiValue.propTypes = {
//   children: PropTypes.node,
//   isFocused: PropTypes.bool,
//   removeProps: PropTypes.object.isRequired,
//   selectProps: PropTypes.object.isRequired,
// };

function Menu(props) {
  return (
    // <Popover open>
    <Paper
      square
      className={props.selectProps.classes.paper}
      {...props.innerProps}>
      {props.children}
    </Paper>
    // </Popover>
  );
}

Menu.propTypes = {
  children: PropTypes.node,
  innerProps: PropTypes.object,
  selectProps: PropTypes.object,
};

const components = {
  Control,
  Menu,
  NoOptionsMessage,
  Option,
  Placeholder,
  SingleValue,
  ValueContainer,
};

function SearchSelector(props) {
  const {
    classes,
    items,
    value,
    setValue,
    placeholder,
    label,
    disabled,
    variant = 'outlined',
  } = props;
  const { getI18Translation } = useI18Language();

  const selectStyles = {
    input: base => ({
      ...base,
      // color: 'black',
      '& input': {
        font: 'inherit',
      },
    }),
  };

  return (
    <div className={classes.root}>
      <NoSsr>
        <Select
          TextFieldProps={{ variant }}
          MenuProps={{ variant }}
          disabled={disabled}
          label={getI18Translation(label)}
          classes={classes}
          styles={selectStyles}
          options={items}
          components={components}
          value={value}
          onChange={setValue}
          placeholder={getI18Translation(placeholder)}
          isClearable
        />
      </NoSsr>
    </div>
  );
}

export default withStyles(styles)(SearchSelector);
