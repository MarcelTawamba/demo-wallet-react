import React from 'react';
import { makeStyles, useTheme } from '@material-ui/styles';
import Skeleton from '@material-ui/lab/Skeleton';
import { useMediaQuery } from '@material-ui/core';

const PaymentMethodSkeleton = props => {
  const classes = useStyles(props);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down(736));

  return (
    <div className={classes.container}>
      <Skeleton variant="circle" width={48} height={48} />
      <div className={classes.left}>
        <Skeleton width={matches ? 60 : 100} height={28} />
        {/* <Skeleton width={matches ? 80 : 80} height={14} /> */}
      </div>
      <div className={classes.right}>
        <Skeleton width={matches ? 40 : 60} height={16} />
      </div>
    </div>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: 64,
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(2),
  },
  left: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    paddingLeft: theme.spacing(2),
    justifyContent: 'space-between',
    height: 44,
    paddingTop: theme.spacing(0.75),
    // paddingBottom: theme.spacing(0.5),
  },
  right: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    // paddingTop: theme.spacing(0.5),
    // paddingBottom: theme.spacing(1),
  },
}));

export default PaymentMethodSkeleton;
