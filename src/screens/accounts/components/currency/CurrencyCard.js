import React from 'react';
import { useSelector } from 'react-redux';
import { configAccountsSelector } from 'redux/rehive/selectors';
import context from 'components/app/context';
import {
  formatDivisibility,
  addCommas,
  getCurrencyCode,
  standardizeString,
  copyToClipboard,
  displayFormatDivisibility,
} from 'util/general';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Overlay from 'components/outputs/Overlays';
import CardActionArea from '@material-ui/core/CardActionArea';
import CurrencyBadge from './CurrencyBadge';
import Card from 'components/card/Card';
import { View } from 'components/layout/View';
import { Button } from 'components/inputs/Button';
import Text from 'components/outputs/Text';
import { useConversion } from 'util/rates';
import { useToast } from 'components/contexts/ToastContext';

const _WalletCard = props => {
  const {
    item = {},
    index,
    showAccount,
    colors,
    rates,
    selected,
    state,
    noCard,
    handleStateChange,
    onPress,
    showDetail,
    disabled,
    align = 'right',
    noPadding,
    ghost,
  } = props;

  const theme = useTheme();
  const { showToast } = useToast();
  const matches = useMediaQuery(theme.breakpoints.down(420));
  const accountsConfig = useSelector(configAccountsSelector);

  const {
    currency = {},
    account_label,
    account_name,
    available_balance,
    account,
  } = item;
  const { description, code, divisibility } = currency;

  const available = formatDivisibility(available_balance, divisibility);

  let { convAvailable, convRate } = useConversion(available, rates, currency);

  let cardProps = {};

  if (disabled) {
    cardProps = { style: { backgroundColor: 'transparent' } };
  }
  const isRtl = document.dir === 'rtl';
  const Content = (
    <CardActionArea
      disabled={disabled}
      styles={{ position: 'relative' }}
      data-testid="account-currency-menu-card"
      onClick={
        onPress
          ? onPress
          : () => {
              handleStateChange(state, index, true);
              showDetail();
            }
      }>
      <View
        style={{
          backgroundColor: selected ? colors.primary : 'transparent',
          opacity: ghost ? 0.5 : 1,
          position: 'relative',
          minHeight:
            !showAccount &&
            !(accountsConfig?.displayAccountReference && account)
              ? '100px'
              : '125px',
        }}
        w={'100%'}>
        <Overlay variant={'card'} w={'100%'} h={'100%'} />
        <View
          p={matches ? 1 : 1.5}
          fD={'row'}
          jC={'space-between'}
          aI={'unset'}
          w={'100%'}
          flexGrow={1}
          style={{ position: 'relative', zIndex: 999 }}>
          <View
            jC={
              accountsConfig?.displayAccountReference
                ? 'space-between'
                : 'center'
            }>
            <CurrencyBadge
              text={getCurrencyCode(currency)}
              currency={currency}
              radius={24}
              style={{ padding: 0 }}
            />
            {!!(accountsConfig?.displayAccountReference && account) && (
              <Button
                variant={'link'}
                textStyle={{ fontSize: 12 }}
                onPress={event => {
                  event.stopPropagation();
                  copyToClipboard(account, showToast);
                }}
                color={selected ? '#fafafa' : 'grey4'}>
                {account}
              </Button>
            )}
          </View>

          <View
            w={'100%'}
            jC={
              !showAccount &&
              !(accountsConfig?.displayAccountReference && account)
                ? 'center'
                : showAccount
                ? 'space-between'
                : 'flex-start'
            }
            aI={'unset'}
            {...{ [isRtl ? 'mr' : 'ml']: 0.5 }}>
            {showAccount && (
              <Text
                c={selected ? '#fafafa' : 'font'}
                style={{ fontSize: 10, fontWeight: 300 }}
                align={align}>
                {account_label?.toUpperCase() ??
                  standardizeString(account_name)}
              </Text>
            )}
            <View>
              <Text align={align} c={selected ? '#fafafa' : 'font'} s={12}>
                {description?.toUpperCase()}
              </Text>
              <Text
                c={selected ? '#fafafa' : 'primary'}
                align={align}
                s={16}
                fontWeight={700}>
                {addCommas(
                  displayFormatDivisibility(available_balance, divisibility),
                ) +
                  ' ' +
                  getCurrencyCode(currency)}
              </Text>
              {Boolean(convRate) && code !== rates?.displayCurrency?.code && (
                <Text
                  c={selected ? '#fafafa' : 'grey4'}
                  align={align}
                  s={12}
                  variant={'body2'}>
                  {convAvailable}
                </Text>
              )}
            </View>
          </View>
        </View>
      </View>
    </CardActionArea>
  );

  if (noCard) {
    return Content;
  }
  return (
    <Card noPadding={noPadding} {...cardProps}>
      {Content}
    </Card>
  );
};

const WalletCard = context(_WalletCard);

export default WalletCard;
