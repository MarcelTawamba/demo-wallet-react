import React from 'react';
import makeStyles from '@material-ui/styles/makeStyles';

import BNB from './crypto/bnb.svg';
import USDC from './crypto/usdc.svg';
import XBT from './crypto/xbt.svg';
import ETH from './crypto/eth.svg';
import XLM from './crypto/xlm.svg';
import AUD from './fiat/aud.svg';
import CAD from './fiat/cad.svg';
import EUR from './fiat/eur.svg';
import GBP from './fiat/gbp.svg';
import USD from './fiat/usd.svg';
import ZAR from './fiat/zar.svg';
import amex from './cards/amex.svg';
import visa from './cards/visa.svg';
import mastercard from './cards/mastercard.svg';

export const images = {
  BNB,
  ETH,
  TETH: ETH,
  XBT,
  TXBT: XBT,
  CAD,
  XLM,
  TXLM: XLM,
  AUD,
  EUR,
  GBP,
  USD,
  ZAR,
  USDC,
  amex,
  visa,
  mastercard,
};

const CurrencyPlaceholderImage = props => {
  const { radius, name, ...restProps } = props;
  const classes = useStyles(radius);

  return (
    <div className={classes.container} {...restProps}>
      <img className={classes.image} alt={name} src={images[name]} />
    </div>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    maxWidth: radius => (radius ? radius * 2 : 48),
    height: radius => (radius ? radius * 2 : 48),
  },
  image: {
    width: radius => (radius ? radius * 2 : 48),
    height: radius => (radius ? radius * 2 : 48),
  },
}));

export default CurrencyPlaceholderImage;
