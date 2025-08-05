import React from 'react';

import Clothes from './Clothes';
import Data from './Data';
import Discounts from './Discounts';
import Ecom from './Ecom';
import Events from './Events';
import Food from './Food';
import Gaming from './Gaming';
import Homeware from './Homeware';
import Phone from './Phone';
import Transport from './Transport';
import Travel from './Travel';
import Voucher from './Voucher';
import makeStyles from '@material-ui/styles/makeStyles';
import { useTheme } from 'components/app/context';

export const images = {
  clothes: Clothes,
  data: Data,
  ecom: Ecom,
  discounts: Discounts,
  events: Events,
  food: Food,
  gaming: Gaming,
  homeware: Homeware,
  phone: Phone,
  airtime: Phone,
  transport: Transport,
  travel: Travel,
  voucher: Voucher,
};

export default function RewardPlaceholderImage(props) {
  let { name } = props;
  const { size = 90, rewardName, label, ...restProps } = props;
  const classes = useStyles(size);
  const { colors } = useTheme();

  const Image = images?.[name] ?? images.ecom;

  return (
    <div className={classes.container} {...restProps}>
      <Image colors={colors} size={size} />
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
