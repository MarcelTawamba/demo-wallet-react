import React from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import { InputLabel } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  formControl: {
    marginTop: ({ noPadding, label, marginTop }) =>
      theme.spacing(noPadding ? 0 : label ? 1 : marginTop || 0),
    width: '100%',
    border: `1px solid rgba(0, 0, 0, 0.15)`,
    borderRadius: 10,
    '&:focus': {
      border: '2px solid #ab2323',
    },
    '&:hover': ({ disabled }) =>
      disabled
        ? {}
        : {
            border: '1px solid rgba(0, 0, 0, 0.87)',
            fontColor: 'rgba(0, 0, 0, 0.87)',
            fontWeight: '600',
          },
    margin: theme.spacing(1),
    marginBottom: ({ label }) => (label ? theme.spacing(2) : 0),
    position: 'relative',
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
    left: -theme.spacing(1),
  },
  label: {
    backgroundColor: 'white',
    left: theme.spacing(1),
    position: 'absolute',
    top: -theme.spacing(1.5),
    padding: theme.spacing(0.5),
    paddingBottom: theme.spacing(0),
    paddingRight: theme.spacing(1),
  },
}));

export default function Group(props) {
  const { children, label } = props;

  const classes = useStyles(props);

  return (
    <div className={classes.formControl}>
      {Boolean(label) && (
        <InputLabel className={classes.label} shrink>
          {label}
        </InputLabel>
      )}
      {children}
    </div>
  );
}
