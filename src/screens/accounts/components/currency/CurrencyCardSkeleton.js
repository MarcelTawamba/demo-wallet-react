import React from 'react';
import { makeStyles } from '@material-ui/styles';
import Skeleton from '@material-ui/lab/Skeleton';

export default function CurrencyCardSkeleton(props) {
  const classes = useStyles(props);

  return (
    <div className={classes.container}>
      <div className={classes.left}>
        <Skeleton variant="circle" width={48} height={48} />
      </div>
      <div className={classes.right}>
        <Skeleton width={55} height={16} />
        <Skeleton width={160} height={20} />
        <Skeleton width={100} height={22} />
      </div>
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: 125,
    border: '1px solid #EFEFEF',
    alignItems: 'center',
    borderRadius: 12,
    padding: theme.spacing(3),
  },
  left: {
    maxWidth: 48,
    maxHeight: 48,
  },
  right: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    width: '100%',
    justifyContent: 'space-between',
  },
}));
