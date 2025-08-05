import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import moment from 'moment';
import Text from 'components/outputs/Text';

export default function ExpiredTimer(props) {
  const { context, state, send } = props;
  const bitcoinState = state?.value?.running?.bitcoin;
  const stellarState = state?.value?.running?.stellar;
  const classes = useStyles();
  const [temp, setSwitch] = useState(false);
  const { quote = {} } = context;
  const isPending = quote?.status?.match(/pending|underpaid|processing/);
  const { status, expiration_date } = quote;
  const hasExpired = Boolean(expiration_date);
  const expirationMoment = hasExpired && moment(expiration_date).local();

  const expiredDuration =
    hasExpired &&
    moment.duration(expirationMoment.diff(moment())).asMilliseconds();

  useEffect(() => {
    let timer = null;
    if (isPending) {
      timer = setTimeout(() => {
        setSwitch(!temp);
      }, 1000);
    }
    if (expiredDuration < 0) {
      send('EXPIRED');
    }
    return () => clearTimeout(timer);
  }, [temp]);

  if (!isPending || bitcoinState === 'expired' || stellarState === 'expired') {
    return null;
  }

  const isExpired = hasExpired && expiredDuration < 0 && status === 'expired';
  const expiredString = hasExpired
    ? isExpired
      ? 'Expired'
      : expiredDuration > 600000 || expiredDuration < 0
      ? ''
      : moment(expiredDuration).format('mm:ss')
    : '';

  return (
    <div className={classes.expired}>
      {status &&
      status.match(/paid|overpaid/) &&
      status !== 'underpaid' ? null : ( //<Status>{standardizeString(status)}</Status>
        <>
          {/* {hasExpired && ( */}
          <Text
            align={'right'}
            color={isExpired ? 'error' : 'primary'}
            variant="h5"
            className={classes.time}>
            {expiredString}
          </Text>
          {/* )} */}
          {isExpired && (
            <Text align={'right'} variant="s2" className={classes.expiredText}>
              {expirationMoment.format('YYYY/MM/DD HH:mm:ss')}
            </Text>
          )}
        </>
      )}
    </div>
  );
}
const useStyles = makeStyles(theme => ({
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    position: 'absolute',
    top: 0,
    padding: theme.spacing(4),
  },
  button: {
    position: 'absolute',
    left: 0,
    top: 0,
    padding: theme.spacing(2),
  },
  expired: {
    position: 'absolute',
    right: theme.spacing(4),
  },
  logo: {
    borderRadius: 140,
    height: 140,
    overflow: 'hidden',
    // padding: 10,
    backgroundColor: theme.palette.primary.contrastText,
    width: 140,
    minHeight: 140,
    minWidth: 140,
    display: 'flex',
    marginTop: -(70 + theme.spacing(4)),
    flexDirection: 'row',
    alignItems: 'center',
  },
  time: {
    whiteSpace: 'pre-wrap',
  },
  expiredText: {
    whiteSpace: 'pre-wrap',
  },
  container: {
    width: '100%',
    height: ({ height }) => (height ? '90vh' : '100vh'),
    display: 'flex',
    paddingTop: theme.spacing(4),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  page: {
    margin: theme.spacing(3),
    padding: theme.spacing(4),
    marginTop: theme.spacing(6),
    // paddingTop: 70 + theme.spacing(2),
    position: 'relative',
    borderRadius: 30,
    minWidth: 350,
    maxWidth: 550,

    // border: '1px solid #EFEFEF',
    width: '100%',
    // [theme.breakpoints.down(1200)]: {
    //   width: '45%',
    // },
    // [theme.breakpoints.down(968)]: {
    //   width: '90%',
    //   height: 'auto',
    //   padding: theme.spacing(4),
    // },
    // [theme.breakpoints.down(480)]: {
    //   width: '100%',
    //   height: 'auto',
    //   paddingBottom: theme.spacing(4),
    //   padding: theme.spacing(2),
    // },
    height: ({ fullHeight }) => (fullHeight ? '90%' : 'auto'),
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    // justifyContent: 'center',
  },

  title: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(1),
  },
}));
