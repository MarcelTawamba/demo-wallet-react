import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  container: {
    cursor: 'pointer',
    background: 'transparent',
    borderRadius: 20,
    '&:hover': {
      background: '#EEE',
    },
  },
}));

export default function SimpleButton(props) {
  const classes = useStyles(props);
  const { onClick, children } = props;

  return (
    <div onClick={onClick} className={classes.container}>
      {children}
    </div>
  );
}
