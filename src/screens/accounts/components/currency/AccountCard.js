import React, { useState, useEffect } from 'react';
import { useTheme } from 'components/app/context';
import {
  concatCryptoAccount,
  concatBankAccount,
  getCurrencyCode,
  hexToRgb,
} from 'util/general';

import CurrencyBadge from './CurrencyBadge';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import { hasStellarTrustline } from 'util/crypto/stellar';
import Icon from 'components/outputs/NewIcon';
import { CircularProgress } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { currentCompanyServicesSelector } from 'redux/auth/selectors';
import Image from 'components/outputs/Image';

export default function AccountCard(props) {
  let {
    item,
    currency,
    crypto,
    selected,
    onPress,
    trustlineHook,
    badgeRightAlign,
    disabled,
    disableHover,
  } = props;
  const { colors } = useTheme();

  const title =
    item.metadata && item.metadata.name ? item.metadata.name : item.name;

  const [loading, setLoading] = useState(true);
  const trustlineHookLocal = useState(true);
  const [showTrustlineError, setShowTrustlineError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  if (!trustlineHook) {
    trustlineHook = trustlineHookLocal;
  }

  const type = item?.crypto_type;
  const isStellar = type === 'stellar';
  const isTestnet = item.network === 'testnet' ? true : false;

  const accountText = item.address
    ? concatCryptoAccount(item, true, true)[0]
    : concatBankAccount(item, false, true);

  const accountText2 = isStellar
    ? concatCryptoAccount(item, true, true)[1]
    : '';

  const [hasTrustline, setHasTrustline] = trustlineHook;
  useEffect(() => {
    async function testTrustline(address) {
      let resp = await hasStellarTrustline(
        accountText,
        currency?.code,
        address,
        isTestnet,
      );
      setHasTrustline(resp);
      setLoading(false);
    }
    if (
      isStellar &&
      crypto &&
      currency?.currency?.code !== 'XLM' &&
      currency?.currency?.code !== 'TXLM'
    ) {
      setLoading(true);
      setHasTrustline(false);
      const assetDetails = currency?.crypto
        ? crypto?.[currency?.crypto?.blockchain][
            currency?.crypto?.network
          ]?.assetsDetails?.find(asset => asset.currency_code === currency.code)
        : {};
      testTrustline(assetDetails?.address);
    } else {
      setLoading(false);
    }
  }, [isStellar, accountText, currency?.code, crypto]);

  useEffect(() => {
    const _showTrustlineError = loading
      ? false
      : isStellar &&
        !hasTrustline &&
        currency?.currency?.code !== 'XLM' &&
        currency?.currency?.code !== 'TXLM';
    // TODO: Remove temporary bypass of trustline warning
    // Replaced the code below as it was not functioning correctly.
    // setShowTrustlineError(_showTrustlineError);
    // typeof props.setShowTrustlineError === 'function' &&
    //   props.setShowTrustlineError(_showTrustlineError);
    setShowTrustlineError(false);
  }, [hasTrustline, currency, loading]);

  // Determine background color based on state
  let backgroundColor = 'transparent'; // Default
  if (isHovered && !disabled && !disableHover) {
    backgroundColor = '#F5F5F5'; // Hover color
  }
  if (selected) {
    // Selection color overrides hover, handle error case too
    backgroundColor = showTrustlineError
      ? 'rgba(204, 37, 56, 0.1)' // Error selection color
      : hexToRgb(colors.primary, 0.1); // Normal selection color
  }

  let viewStyle = {
    cursor: disabled ? 'default' : 'pointer',
    transition: 'background-color 0.2s ease',
    backgroundColor: backgroundColor, // Apply the calculated background color
    borderRadius: 5,
    overflow: 'hidden',
    minHeight: '70px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '8px',
    outline: 'none',
  };

  const Badge = (
    <CurrencyBadge
      style={{ paddingRight: 0 }}
      text={getCurrencyCode(currency)}
      currency={currency}
      radius={12}
    />
  );

  return loading ? (
    <View aI="center" h="100%" jC="center">
      <CircularProgress size={32} />
    </View>
  ) : (
    <View
      fD="column"
      w="100%"
      style={viewStyle}
      onClick={disabled ? undefined : onPress}
      onMouseEnter={() => !disabled && !disableHover && setIsHovered(true)}
      onMouseLeave={() => !disabled && !disableHover && setIsHovered(false)}>
      <View
        jC={badgeRightAlign ? 'space-between' : 'flex-start'}
        fD="row"
        aI={'flex-start'}
        gap="0.75"
        w="100%"
        >
        {!badgeRightAlign && Badge}
        <View w="86%">
          {title && (
            <Text 
              s={12} 
              c={disabled ? 'fontLight' : 'fontDark'} 
              style={{ 
                fontWeight: disabled ? 400 : 500,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
              {title}
            </Text>
          )}
          <Text> 
            <Text
              color={disabled ? 'fontLight' : 'primary'}
              s={14}
              style={{
                marginTop: 2,
                opacity: disabled ? 0.8 : 1,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
              {accountText}
            </Text>
            <Text
              style={{
                fontSize: 14,
                paddingBottom: 4,
                color: disabled ? '#8C8C8C' : undefined,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: 'block'
              }}>
              {accountText2}
            </Text>
          </Text>
        </View>
        {badgeRightAlign && Badge}
      </View>
      {!badgeRightAlign && showTrustlineError && (
        <View fD="row" aI="center" ph={0.75} mt={0.25}>
          <Icon
            icon="error"
            color="#FF4C6F"
            circled={false}
            style={{ marginRight: 12 }}
          />
          <Text id="stellar_trustline_required" c="#FF4C6F" variant="body2" />
        </View>
      )}
    </View>
  );
}
