import React, { useEffect, useMemo, useState } from 'react';
import { View } from 'components/layout/View';
import { Button } from 'components/inputs/Button';
import Text from 'components/outputs/Text';
import { makeStyles } from '@material-ui/core/styles';
import Icon from 'components/outputs/Icon';
import { useRehive } from 'hooks/rehive';
import { useCountdown } from 'hooks/general';

function ThrottlingScreen(props) {
  const classes = useStyles(props);
  const { setShowThrottle } = props;
  const handleRefresh = () => {
    setShowThrottle(false);
  };

  const query = useRehive('tier');
  const message =
    query?.context?.error?.message ?? query?.context?.items?.message ?? '';
  const endDate = useMemo(() => {
    const splits = (message ?? '')?.split('available in ');
    const splits2 = (splits?.[1] ?? '')?.split(' seconds');

    const dateSplit = parseInt(splits2?.[0]);
    const temp = new Date();
    temp.setSeconds(temp.getSeconds() + dateSplit + 3);
    return temp;
  }, [message]);

  const timer = useCountdown(endDate);
  const timerSeconds = timer?.[3];

  useEffect(() => {
    if (message && timerSeconds < 0) setShowThrottle(false);
  }, [timerSeconds]);

  return (
    <View h={'100%'} w="100%" jC="center" aI="center" bC="#ffffff">
      <Icon size={48} iconColor="#707070" color="#e8e8e8" name="report" />
      <View className={classes.root}>
        <Text
          fontWeight="600"
          s={18}
          className={classes.title}
          id="throttling_title"
        />
        <Text variant="body2" s={16} className={classes.description} id="" />
        {/* {timerSeconds > 0 ? ( */}
        <div className={classes.refresh}>
          {!!message && timerSeconds > 0 && (
            <Text
              tA="center"
              color="primary"
              id="throttling_refresh"
              context={{ timerSeconds }}
            />
          )}
        </div>
        {/* ) : message && false ? (
          <Button wide color="primary" onClick={handleRefresh}>
            Refresh
          </Button>
        ) : null} */}
      </View>
    </View>
  );
}

export default ThrottlingScreen;

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 416,
    textAlign: 'center',
    marginTop: '8px !important',
  },
  title: {
    marginTop: 12,
  },
  description: {
    marginTop: 8,
    marginBottom: 12,
  },
  refresh: {
    height: 52.5,
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    width: '100%',
  },
}));
