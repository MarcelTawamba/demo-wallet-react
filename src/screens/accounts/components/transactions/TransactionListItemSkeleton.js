import React from 'react';
import { makeStyles, useTheme } from '@material-ui/styles';
import Skeleton from '@material-ui/lab/Skeleton';
import { useMediaQuery } from '@material-ui/core';

const TransactionListItemSkeleton = props => {
  const classes = useStyles(props);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down(736));

  return (
    <div className={classes.container}>
      <div className={classes.circle}>
        <Skeleton variant="circle" width={32} height={32} />
      </div>
      <div className={classes.left}>
        <Skeleton width={matches ? 120 : 160} height={20} />
        <Skeleton width={matches ? 80 : 80} height={14} />
      </div>
      <div className={classes.right}>
        <Skeleton width={matches ? 60 : 90} height={20} />
        <Skeleton width={matches ? 40 : 60} height={14} />
      </div>
    </div>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: 62,
    alignItems: 'center',
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    borderTop: ({ noBorders }) => (noBorders ? '' : '1px solid #EFEFEF'),
    backgroundColor: ({ gray }) => (gray ? '#F8F8F8' : 'white'),
  },
  circle: {
    minWidth: 32,
  },
  left: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    paddingLeft: theme.spacing(2),
    justifyContent: 'space-between',
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(1),
  },
  right: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(1),
  },
}));

export default TransactionListItemSkeleton;
