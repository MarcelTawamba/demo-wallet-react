import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    width: props => (props.fullWidth ? '100%' : 'auto'),
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',

    [theme.breakpoints.down(500)]: {
      flexDirection: 'column',
    },
  },
}));

const ResponsiveFlexBox = props => {
  const { left, right } = props;
  const classes = useStyles(props);

  return (
    <div className={classes.container}>
      {left}
      {right}
    </div>
  );
};

ResponsiveFlexBox.defaultProps = {
  fullWidth: true,
};

ResponsiveFlexBox.propTypes = {
  fullWidth: PropTypes.bool,
};

export default ResponsiveFlexBox;
