import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars-better';
import Skeleton from '@material-ui/lab/Skeleton';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
  },
  column: {
    // width: '100%',
    display: 'flex',
    flexDirection: 'column',
    // justifyContent: 'space-between',
    // alignItems: 'center',
  },
  name: {
    marginLeft: theme.spacing(2),
  },
  subtitle: {
    marginLeft: theme.spacing(2),
  },
}));

export default function AvatarSkeleton(props) {
  const { subtitle } = props;
  const classes = useStyles(props);

  return (
    <div className={classes.root}>
      <Skeleton height={36} width={36} variant="circle" />

      <div className={classes.column}>
        <Skeleton
          height={20}
          width={100}
          className={classes.name}
          variant="text"
        />
        {subtitle && (
          <Skeleton
            height={14}
            width={60}
            className={classes.subtitle}
            variant="text"
          />
        )}
      </div>
    </div>
  );
}
