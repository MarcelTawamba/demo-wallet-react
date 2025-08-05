import React from 'react';
import { useMediaQuery } from '@material-ui/core';
import { useTheme as useMuiTheme } from '@material-ui/styles';
import Cash from './Cash';
import Credit from './Credit';
import Pin from './Pin';
import Custom from './Custom';
import Products from './Products';
import Pull from './Pull';
import Scan from './Scan';
import TopUp from './TopUp';
import Voucher from './Voucher';
import Sale from './Sale';
import QR from './QR';
import makeStyles from '@material-ui/styles/makeStyles';
import Text from 'components/outputs/Text';
import { standardizeString } from 'util/general';
import { useTheme } from 'components/app/context';
import Hover from 'components/layout/Hover';

export const images = {
  cash: Cash,
  credit: Credit,
  custom: Custom,
  pin: Pin,
  products: Products,
  pull: Pull,
  qr: QR,
  sale: Sale,
  scan: Scan,
  top_up: TopUp,
  voucher: Voucher,
};
// export const customImages = {
//   // cash: Cash,
//   // credit: Credit,
//   // custom: Custom,
//   // pin: Pin,
//   // products: Products,
//   // pull: Pull,
//   // qr: QR,
//   // sale: Sale,
//   // scan: Scan,
//   top_up: TopUp,
//   // voucher: Voucher,
// };

const PoSPlaceholderImage = props => {
  const { size = 120, name, label, ...restProps } = props;
  const theme = useMuiTheme();
  const { colors } = useTheme();
  const smallDevice = useMediaQuery(theme.breakpoints.down(755));
  const classes = useStyles({ size, smallDevice });
  const Image = images[name];

  return (
    <Hover
      render={hover => (
        <div
          className={hover ? classes.hover : classes.container}
          {...restProps}>
          <Image colors={colors} size={smallDevice ? 0.7 * size : size} />
          <Text
            className={classes.label}
            align="center"
            id={label ? label : name}
          />
        </div>
      )}
    />
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    padding: ({ smallDevice }) => theme.spacing(smallDevice ? 2 : 4),
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
    margin: theme.spacing(2),
    [theme.breakpoints.down(600)]: {
      padding: theme.spacing(3),
    },
    border: '2px solid rgba(0,0,0,0)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  hover: {
    padding: ({ smallDevice }) => theme.spacing(smallDevice ? 2 : 4),
    margin: theme.spacing(2),
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
    [theme.breakpoints.down(600)]: {
      padding: theme.spacing(3),
    },
    border: '2px solid ' + theme.palette.primary.main,
    borderRadius: 15,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  label: {
    padding: theme.spacing(1),
    maxWidth: ({ size }) => size,
  },
  image: {
    width: ({ size }) => size,
    height: ({ size }) => size,
  },
}));

export default PoSPlaceholderImage;
