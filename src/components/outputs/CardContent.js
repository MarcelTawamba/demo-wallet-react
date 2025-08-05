import React from 'react';
import { Box, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  box: {
    display: 'flex',
    width: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    // [theme.breakpoints.down(1050)]: {
    //   height: 80,
    // },
    // [theme.breakpoints.down(980)]: {
    //   height: 71,
    // },
  },
}));

export default function CardContent(props) {
  const { children, onClick, image } = props;
  const classes = useStyles();

  let otherProps = {
    style: typeof onClick === 'function' ? { cursor: 'pointer' } : {},
  };

  return (
    <Box className={classes.box} {...otherProps}>
      {children}
      {!!image && <Box height="100%">{image}</Box>}
    </Box>
  );
}
