import React from 'react';
import { Box, makeStyles } from '@material-ui/core';
import Text from 'components/outputs/Text';
import Label from './Label';

const useStyles = makeStyles(theme => ({
  box: {
    border: '1px solid #DADADA',
    padding: '12px 16px',
    borderRadius: 8,
    display: 'flex',
    height: 80,
    // [theme.breakpoints.down(1050)]: {
    //   height: 80,
    // },
    // [theme.breakpoints.down(980)]: {
    //   height: 71,
    // },
  },
}));
export default function CardWithLabel(props) {
  const { id, label, children, onClick } = props;
  const classes = useStyles();

  let otherProps = {
    style:
      typeof onClick === 'function'
        ? { cursor: 'pointer', overflow: 'auto' }
        : {},
  };

  return (
    <Box onClick={onClick}>
      <Label id={id}>{label}</Label>
      <Box className={classes.box} {...otherProps}>
        {children}
      </Box>
    </Box>
  );
}
