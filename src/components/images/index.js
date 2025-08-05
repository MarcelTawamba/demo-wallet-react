import React from 'react';

import Address from './address.svg';
import AddressVerify from './address-verify.svg';
import Bank from './bank.svg';
import Branding from './branding.svg';
import Business from './business.svg';
import Documents from './documents.svg';
import Identity from './identity.svg';
import Legal from './legal.svg';
import Mobile from './mobile.svg';
import UserDetails from './user-details';
import Passport from './passport';
import Drivers from './drivers';
import ID from './id';
import FAQ from './FAQ';
import Support from './Support';
import Payment from './payment.svg';
import Portfolio from './portfolio.svg';
import Error from './404.svg';
import { makeStyles } from '@material-ui/core';
import { useTheme } from 'components/app/context';

import Password from './Password';
import Preferences from './Preferences';
import Bitcoin from './Bitcoin';
import Stellar from './Stellar';
import sumsub from './providers/sumsub.svg';
import Ethereum from './Ethereum';

const images = {
  address: Address,
  bank: Bank,
  branding: Branding,
  business: Business,
  documents: Documents,
  legal: Legal,
  mobile: Mobile,
  identity: Identity,
  payment: Payment,
  portfolio: Portfolio,
  error: Error,
  password: Password,
  stellar: Stellar,
  bitcoin: Bitcoin,
  preferences: Preferences,
  sumsub,
  ethereum: Ethereum,
  // addressverify: AddressVerify,
};

const custom = {
  userdetails: {
    image: UserDetails,
  },
  passport: {
    image: Passport,
  },
  drivers: {
    image: Drivers,
  },
  id: {
    image: ID,
  },
  faq: {
    image: FAQ,
  },
  support: {
    image: Support,
  },
};

export default function Image(props) {
  const {
    size = 100,
    width = size,
    height = size,
    name,
    primary,
    primaryContrast,
    ...restProps
  } = props;
  const classes = useStyles(props);
  const { colors } = useTheme();

  let customMatch = custom[name];

  return (
    <div {...restProps}>
      {customMatch ? (
        <customMatch.image
          width={width}
          height={height}
          primary={primary ?? colors.primary}
          primarycontrast={primaryContrast ?? colors.primaryContrast}
        />
      ) : (
        <img className={classes.image} alt={name} src={images[name]} />
      )}
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  image: {
    width: ({ size, width }) => width ?? size,
    height: ({ size, height }) => height ?? size,
  },
}));
