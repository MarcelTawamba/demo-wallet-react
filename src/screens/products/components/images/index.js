import React from 'react';
import makeStyles from '@material-ui/styles/makeStyles';

import Airtime from './categories/airtime.svg';
import Clothes from './categories/clothes.svg';
import Data from './categories/data.svg';
import Ecom from './categories/ecom.svg';
import Flash from './categories/flash.svg';
import Homeware from './categories/homeware.svg';
import Phone from './categories/phone.svg';
import Travel from './categories/travel.svg';
import Ta8 from './networks/8ta-color.svg';
import Cellc from './networks/cellc-color.svg';
import Mtn from './networks/mtn-color.svg';
import Telkom from './networks/telkom-color.svg';
import Virgin from './networks/virgin-mobile-color.svg';
import Vodacom from './networks/vodacom-color.svg';
import Voucher1 from './vouchers/1voucher.svg';
import Netflix from './vouchers/netflix.svg';
import Spotify from './vouchers/spotify.svg';
import Uber from './vouchers/uber.svg';
import Ta8Gray from './networks/8ta-gray.svg';
import CellcGray from './networks/cellc-gray.svg';
import MtnGray from './networks/mtn-gray.svg';
import TelkomGray from './networks/telkom-gray.svg';
import VirginGray from './networks/virgin-mobile-gray.svg';
import VodacomGray from './networks/vodacom-gray.svg';

export const images = {
  airtime: Airtime,
  clothes: Clothes,
  data: Data,
  ecom: Ecom,
  flash: Flash,
  voucher: Flash,
  homeware: Homeware,
  phone: Phone,
  travel: Travel,
  ta8: Ta8,
  cellc: Cellc,
  mtn: Mtn,
  telkom: Telkom,
  virgin: Virgin,
  vodacom: Vodacom,
  netflix: Netflix,
  voucher1: Voucher1,
  spotify: Spotify,
  uber: Uber,
  'ta8-gray': Ta8Gray,
  'cellc-gray': CellcGray,
  'mtn-gray': MtnGray,
  'telkom-gray': TelkomGray,
  'virgin-gray': VirginGray,
  'vodacom-gray': VodacomGray,
  'netflix-gray': Netflix,
  'voucher1-gray': Voucher1,
  'spotify-gray': Spotify,
  'uber-gray': Uber,
};

const ProductPlaceholderImage = props => {
  const { height, width, name, ...restProps } = props;

  const classes = useStyles(props);

  return (
    <div className={classes.container} {...restProps}>
      <img className={classes.image} alt={name} src={images[name]} />
    </div>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    maxWidth: ({ width }) => width,
    height: ({ height }) => height,
  },
  image: {
    width: ({ width }) => width,
    height: ({ height }) => height,
  },
}));

export default ProductPlaceholderImage;
