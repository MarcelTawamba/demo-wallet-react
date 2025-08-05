// import lib for making component
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import PropTypes from 'prop-types';
import { Box } from '@material-ui/core';

// make component
const Spinner = ({
  size = 40,
  classes,
  ph = 0,
  w,
  pt,
  p,
  pb,
  containerStyle,
  align,
  ...restProps
}) => {
  return (
    <Box
      ph={ph}
      pb={pb}
      pt={pt}
      display="flex"
      flexDirection="column"
      p={p ? p : ph ? 0 : 0.25}
      width={w ? w : '100%'}
      style={{
        ...containerStyle,
        alignItems:
          align === 'left'
            ? 'flex-start'
            : align === 'right'
            ? 'flex-end'
            : 'center',
      }}>
      <CircularProgress
        size={size}
        className={classes.progress}
        {...restProps}
      />
    </Box>
  );
};

const styles = {
  _containerStyle: {
    alignItems: 'center',
    width: '100%',
  },
};

Spinner.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Spinner);
