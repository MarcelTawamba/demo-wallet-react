import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import moment from 'moment';
import Text from 'components/outputs/Text';

export default function ExpiredTimer(props) {
  const { setExpired, quote, expired } = props;
  const classes = useStyles();
  const [temp, setSwitch] = useState(false);
  const { status = '', expiration_date = '' } = quote ?? {};
  const isPending = status === 'pending';

  const hasExpired = Boolean(expiration_date);
  const expirationMoment = hasExpired && moment(expiration_date).local();

  const expiredDuration =
    hasExpired &&
    moment.duration(expirationMoment.diff(moment())).asMilliseconds();

  const isExpired = (hasExpired && expiredDuration < 0) || status === 'expired';
  const expiredString = hasExpired
    ? isExpired
      ? 'Expired'
      : moment(expiredDuration).format('mm:ss')
    : '';

  useEffect(() => {
    let timer = null;
    if (isPending) {
      timer = setTimeout(() => {
        setSwitch(!temp);
      }, 500);
    }
    if (expiredDuration < 0) {
      setExpired(true);
    }
    return () => clearTimeout(timer);
  }, [temp, isPending]);

  if (!quote || !isPending) {
    return null;
  }

  return (
    <div className={classes.expired}>
      <Text
        align={'right'}
        color={isExpired ? 'error' : 'primary'}
        variant="h5"
        className={classes.time}>
        {expiredString}
      </Text>
      {isExpired && (
        <Text align={'right'} variant="s2" className={classes.expiredText}>
          {expirationMoment.format('YYYY/MM/DD HH:mm:ss')}
        </Text>
      )}
    </div>
  );
}
const useStyles = makeStyles(theme => ({
  expired: {
    position: 'absolute',
    right: theme.spacing(4),
  },

  time: {
    whiteSpace: 'pre-wrap',
  },
  expiredText: {
    whiteSpace: 'pre-wrap',
  },
}));
