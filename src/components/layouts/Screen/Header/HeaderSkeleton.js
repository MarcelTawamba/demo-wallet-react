import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars-better';
import Skeleton from '@material-ui/lab/Skeleton';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginBottom: theme.spacing(1),
    // paddingBottom: 300,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  row2: {
    display: 'flex',
    flexDirection: 'row',
  },
  button: { borderRadius: 100, marginLeft: theme.spacing(2) },
  tab: { marginRight: theme.spacing(2) },
}));

export default function HeaderSkeleton(props) {
  const classes = useStyles(props);

  return (
    <div className={classes.root}>
      <Skeleton height={36} width={160} className={classes.content} />

      <div className={classes.row}>
        <div className={classes.row2}>
          <Skeleton height={26} width={80} className={classes.tab} />
          <Skeleton height={26} width={64} className={classes.tab} />
          <Skeleton height={26} width={100} className={classes.tab} />
        </div>
        <div className={classes.row2}>
          <Skeleton
            height={30}
            width={88}
            variant="rect"
            className={classes.button}
          />
          <Skeleton
            height={30}
            width={64}
            variant="rect"
            className={classes.button}
          />
        </div>
      </div>
    </div>
  );
}
