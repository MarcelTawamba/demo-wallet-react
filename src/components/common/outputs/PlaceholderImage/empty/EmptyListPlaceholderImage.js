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

const EmptyListPlaceholderImage = props => {
  const { width, height, card, rem, padded, name, text, ...restProps } = props;

  const w = padded ? width - 2 * rem * padded : width;
  const h = height ? height : card ? w / 2.5 : w;

  // const imageProps = { width: w, height: h, colors };

  const classes = useStyles();

  const images = {
    voucher,
    order,
    product,
    transaction,
    reward,
    campaign,
    notification,
    mobiles: mobile,
    emails: email,
    cryptoAccounts: crypto,
    bank,
    address,
    document,
    account,
    currency,
  };

  return (
    <div className={classes.container} {...restProps}>
      <img className={classes.image} alt={'no ' + name} src={images[name]} />
      <EmptyListMessage text={text} pt={0.125} />
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
    width: 200,
    height: 200,
    // padding: theme.spacing(3),
  },
}));

export default EmptyListPlaceholderImage;
