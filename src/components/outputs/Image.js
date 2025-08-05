import React, { useState } from 'react';
import { useTheme } from 'components/app/context';
import Skeleton from '@material-ui/lab/Skeleton';

import Address from '../images/Address';
import Bank from '../images/Bank';
import FAQ from '../images/FAQ';
import Support from '../images/Support';
import Branding from '../images/Branding';
import Portfolio from '../images/Portfolio';
import Documents from '../images/Documents';
import BasicInfo from '../images/BasicInfo';
import Legal from '../images/Legal';
import Mobile from '../images/mobile';
import Merchant from '../images/Merchant';
import Drivers from '../images/drivers';
import ID from '../images/id';
import Email from '../images/Email';
import Tier1 from '../images/Tier1';
import Tier2 from '../images/Tier2';
import Tier3 from '../images/Tier3';

import Password from '../images/Password';
import Preferences from '../images/Preferences';
import Bitcoin from '../images/Bitcoin';
import Ethereum from '../images/Ethereum';
import Stellar from '../images/Stellar';
import Currency from 'components/images/Currency';
import Notifications from 'components/images/Notifications';
import Security from 'components/images/Security';
import Devices from 'components/images/Devices';
import Language from 'components/images/Language';
import FAQLight from 'components/images/FAQLight';
import SupportLight from 'components/images/SupportLight';
import AboutLight from 'components/images/AboutLight';
import Tier0 from 'components/images/Tier0';
import Tier4 from 'components/images/Tier4';
import Tier5 from 'components/images/Tier5';

export default function Image(props) {
  let {
    src,
    height,
    maxWidth,
    backgroundColor,
    width,
    alt = '',
    padding,
    loading,
    href,
    style,
  } = props;

  const [imgHeight, setImgHeight] = useState(0);
  const [imgWidth, setImgWidth] = useState(0);

  const { colors } = useTheme();

  const custom = {
    drivers: { image: Drivers },
    id: { image: ID },
    mobile: { image: Mobile },
    mobiles: { image: Mobile },
    address: { image: Address },
    documents: { image: Documents },
    basic_info: { image: BasicInfo },
    merchant: { image: Merchant },
    branding: { image: Branding },
    legal: { image: Legal },
    bank: { image: Bank },
    portfolio: { image: Portfolio },
    email: { image: Email },
    emails: { image: Email },
    tier0: { image: Tier0 },
    tier1: { image: Tier1 },
    tier2: { image: Tier2 },
    tier3: { image: Tier3 },
    tier4: { image: Tier4 },
    tier5: { image: Tier5 },
    password: { image: Password },
    stellar: { image: Stellar },
    bitcoin: { image: Bitcoin },
    preferences: { image: Preferences },
    notifications: { image: Notifications },
    currency: { image: Currency },
    security: { image: Security },
    devices: { image: Devices },
    faq: { image: FAQ },
    support: { image: Support },
    language: { image: Language },
    faqLight: { image: FAQLight },
    aboutLight: { image: AboutLight },
    supportLight: { image: SupportLight },
    ethereum: { image: Ethereum },
  };

  let customMatch = custom[src];

  if (customMatch)
    return (
      <customMatch.image
        width={width}
        height={height}
        primary={colors.primary}
        primarycontrast={colors.primaryContrast}
      />
    );

  function onImgLoad({ target: img }) {
    setImgHeight(img.naturalHeight);
    setImgWidth(img.naturalWidth);
    // setLoading(false);

    // if (loadingHook) {
    //   const [loading, setLoading] = loadingHook;
    //   setLoading(false);
    // }
  }

  if (!height && maxWidth) {
    height = maxWidth;
  }
  if (!width && maxWidth) {
    width = maxWidth;
  }

  const img = src ? (
    <img
      style={
        imgHeight > imgWidth || maxWidth
          ? {
              height,
              width,
              maxWidth: maxWidth ? maxWidth : width,
              maxHeight: maxWidth ? maxWidth : height,
              padding,
              objectFit: 'cover',
              ...style,
            }
          : {
              maxHeight: height,
              padding,
              objectFit: 'cover',
              width,
              height,
              ...style,
            }
      }
      alt={alt}
      src={src}
      onLoad={event => onImgLoad(event)}
    />
  ) : null;

  return (
    <div
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        height,
        width,
        backgroundColor: backgroundColor
          ? colors[backgroundColor]
          : 'transparent',
      }}>
      {(loading || !src) && (
        <div style={{ position: 'absolute' }}>
          <Skeleton
            variant="circle"
            width={width ? width : height}
            height={height ? height : width}
          />
        </div>
      )}
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {img}
        </a>
      ) : (
        img
      )}
    </div>
  );
}
