import React from 'react';

import Birthday from './Birthday';
import Email from './Email';
import Mobile from './Mobile';
import Recurring from './Recurring';
import Reward from './Reward';
import Transaction from './Transaction';
import makeStyles from '@material-ui/styles/makeStyles';
import { useTheme } from 'components/app/context';
import Image from 'components/outputs/Image';

export const images = {
  Birthday: Birthday,
  Email: Email,
  Recurring: Recurring,
  Mobile: Mobile,
  Reward: Reward,
  Transaction: Transaction,
};

export default function RewardPlaceholderImage(props) {
  let { name, featuredCard } = props;
  const {
    size = 90,
    rewardName,
    label,
    src,
    detailsPage,
    ...restProps
  } = props;
  const classes = useStyles(size);
  const { colors } = useTheme();

  if (src) {
    return (
      <Image
        src={src}
        alt={name}
        height={detailsPage ? 240 : featuredCard ? 120 : 160}
        width="100%"
        style={{ borderRadius: 3, objectFit: 'contain' }}
      />
    );
  }

  if (!name) {
    if (rewardName.includes('irthday')) {
      name = 'Birthday';
    } else if (rewardName.includes('mobile number')) {
      name = 'Mobile';
    } else if (rewardName.includes('email')) {
      name = 'Email';
    } else if (rewardName.includes('transactions')) {
      name = 'Transaction';
    } else {
      name = 'Reward';
    }
  }

  const PlaceholderImage = images[name];
  const { featuredCard: _, ...cleanRestProps } = restProps;

  return (
    <div className={classes.container} {...cleanRestProps}>
      <PlaceholderImage
        colors={colors}
        size={size}
        style={{ width: '100%', height: featuredCard ? 116 : 90 }}
      />
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  container: {
    // padding: theme.spacing(4),
    // paddingBottom: theme.spacing(3),
    // paddingTop: theme.spacing(3),
    // margin: theme.spacing(2),
    // [theme.breakpoints.down(600)]: {
    //   padding: theme.spacing(3),
    // },
  },
  image: {
    width: size => size,
    height: size => size,
  },
}));
