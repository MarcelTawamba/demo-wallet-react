import React from 'react';

import account from './no-account.svg';
import currency from './no-currency.svg';
import address from './no-address.svg';
import bank from './no-bank.svg';
import crypto from './no-crypto.svg';
import email from './no-email.svg';
import mobile from './no-mobile.svg';
import notification from './no-notification.svg';
import order from './no-order.svg';
import product from './no-product.svg';
import transaction from './no-transaction.svg';
import reward from './no-reward.svg';
import document from './no-document.svg';
import campaign from './no-reward.svg';
import voucher from './no-voucher.svg';
import makeStyles from '@material-ui/styles/makeStyles';
import EmptyListMessage from 'components/lists/EmptyListMessage';
import { useTheme } from 'components/app/context';
import NoProductPlaceholder from './NoProductPlaceholder';
import NoNotificationPlaceholder from './NoNotificationPlaceholder';
import NoRewardPlaceholder from './NoRewardPlaceholder';
import NoTransactionPlaceholder from './NoTransactionPlaceholder';

const images = {
  voucher,
  order,
  product,
  categories: product,
  transaction,
  reward,
  campaign,
  notification,
  mobiles: mobile,
  devices: mobile,
  emails: email,
  mobile,
  email,
  cryptoAccounts: crypto,
  bitcoin: crypto,
  stellar: crypto,
  bank,
  bankAccounts: bank,
  address,
  addresses: address,
  document,
  account,
  currency,
};

const EmptyListPlaceholderImage = props => {
  const { colors } = useTheme();
  const { width, height, card, rem, padded, name, id, text, ...restProps } =
    props;

  const w = padded ? width - 2 * rem * padded : width;
  const h = height ? height : card ? w / 2.5 : w;

  const classes = useStyles();

  const getPlaceholder = () => {
    switch (name) {
      case 'product':
        return <NoProductPlaceholder primary={colors.primary} />;
      case 'notification':
        return (
          <NoNotificationPlaceholder
            height={150}
            width={150}
            primary={colors.primary}
          />
        );
      case 'reward':
        return <NoRewardPlaceholder primary={colors.primary} />;
      case 'transaction':
        return <NoTransactionPlaceholder primary={colors.primary} />;
      case 'orders':
        return <NoProductPlaceholder primary={colors.primary} />;
      default:
        return (
          <img
            className={classes.image}
            alt={'no ' + name}
            src={images[name]}
          />
        );
    }
  };

  return (
    <div className={classes.container} {...restProps}>
      {getPlaceholder()}
      <EmptyListMessage
        id={id}
        text={text ? text : name + '_empty'}
        pt={0.125}
      />
    </div>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    // justifyContent: 'center',
    flexDirection: 'column',
    paddingTop: theme.spacing(5),
    paddingBottom: theme.spacing(5),
  },
  image: {
    width: 140,
    height: 140,
    // padding: theme.spacing(3),
  },
}));

export default EmptyListPlaceholderImage;
