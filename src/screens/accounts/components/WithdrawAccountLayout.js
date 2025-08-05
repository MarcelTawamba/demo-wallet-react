import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  container: {
    display: 'flex',
    width: '100%',
    margin: 0,
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    // [theme.breakpoints.down(1070)]: {
    //   flexDirection: 'column',
    //   // justifyContent: 'center',
    //   alignItems: 'center',
    // },
    // [theme.breakpoints.down(940)]: {
    //   flexDirection: 'row',
    //   // alignItems: 'center',
    //   justifyContent: 'space-between',
    // },
    // [theme.breakpoints.down(850)]: {
    //   flexDirection: 'column',
    //   // justifyContent: 'center',
    //   alignItems: 'center',
    // },
    // [theme.breakpoints.down(736)]: {
    //   flexDirection: 'row',
    //   // alignItems: 'center',
    //   justifyContent: 'space-between',
    // },
    // [theme.breakpoints.down(480)]: {
    //   flexDirection: 'column',
    //   justifyContent: 'center',
    //   alignItems: 'center',
    // },
  },
});

const WithdrawAccountLayout = ({ classes, left, right }) => {
  // const matches = useMediaQuery(`(min-width:${size}px)`);

  return (
    <div className={classes.container}>
      {/* <div style={{ width: 80 }} /> */}
      {left}
      {right}
    </div>
  );
};

WithdrawAccountLayout.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(WithdrawAccountLayout);
