import React from 'react';
import { makeStyles } from '@material-ui/styles';
import Skeleton from '@material-ui/lab/Skeleton';

export default function AppMenuSkeleton() {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      {[true, '', '', ''].map((item, index) => (
        <div className={classes.item} key={index}>
          <div className={item ? classes.rowHover : classes.row}>
            <Skeleton variant="circle" width={24} height={24} />
            <Skeleton width={100} height={20} />
          </div>
        </div>
      ))}
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  container: {
    // display: 'flex',
    // flexDirection: 'row',
    width: '100%',
    paddingTop: theme.spacing(2),
  },
  item: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing(0.5),
    paddingRight: theme.spacing(1),
    paddingLeft: ({ simple }) => theme.spacing(simple ? 1 : 2),
    width: '100%',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    // backgroundColor: '#FFF',
    width: '100%',
    justifyContent: 'space-between',
    // borderRadius: 20,
  },
  rowHover: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    backgroundColor: '#FAFAFA',
    width: '100%',
    alignItems: 'center',
    borderRadius: 20,
  },
}));
