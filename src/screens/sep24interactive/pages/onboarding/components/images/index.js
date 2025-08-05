import React from 'react';

import Address from './Address';
import Bank from './Bank';
import Branding from './Branding';
import Business from './business.svg';
import Portfolio from './Portfolio';
import Documents from './Documents';
import Product from './Product';
import BasicInfo from './BasicInfo';
import Legal from './Legal';
import Mobile from './mobile';
import Merchant from './Merchant';
import Drivers from './drivers';
import ID from './id';
import TradeCertificate from './TradeCertificate';
import FinancialStatement from './FinancialStatement';
import { makeStyles } from '@material-ui/core';
import { useTheme } from 'components/app/context';

const images = {
  address: Address,
  bank: Bank,
  branding: Branding,
  business: Business,
  documents: Documents,
  legal: Legal,
  mobile: Mobile,
};

const custom = {
  drivers: {
    image: Drivers,
  },
  id: {
    image: ID,
  },
  mobile: {
    image: Mobile,
  },
  address: {
    image: Address,
  },
  documents: {
    image: Documents,
  },
  basic_info: {
    image: BasicInfo,
  },
  merchant: {
    image: Merchant,
  },
  branding: {
    image: Branding,
  },
  legal: {
    image: Legal,
  },
  bank: {
    image: Bank,
  },
  portfolio: {
    image: Portfolio,
  },
  tradeCertificate: {
    image: TradeCertificate,
  },
  financialStatement: {
    image: FinancialStatement,
  },
  product: {
    image: Product,
  },
};

export default function Image(props) {
  const { size = 100, name, primary, primaryContrast, ...restProps } = props;
  const classes = useStyles(size);
  const { colors } = useTheme();

  let customMatch = custom[name];

  return (
    <div {...restProps}>
      {customMatch ? (
        <customMatch.image
          width={size}
          height={size}
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
    width: size => size,
    height: size => size,
  },
}));
