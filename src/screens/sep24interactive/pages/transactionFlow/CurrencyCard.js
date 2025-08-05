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
import CurrencyBadge from 'screens/accounts/components/currency/CurrencyBadge';
import Card from 'components/card/Card';
import { View } from 'components/layout/View';
import { Button } from 'components/inputs/Button';
import Text from 'components/outputs/Text';
import { useConversion } from 'util/rates';
import { useToast } from 'components/contexts/ToastContext';

const _CurrencyCard = props => {
  const {
    currency = {},
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

  const { description, code, divisibility } = currency;

  let cardProps = {};

  if (disabled) {
    cardProps = { style: { backgroundColor: 'transparent' } };
  }

  const isRtl = document.dir === 'rtl';
  const Content = (
    <CardActionArea
      mb={0}
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
        mb={0}
        style={{
          backgroundColor: selected ? colors.primary : 'transparent',
          opacity: ghost ? 0.5 : 1,
          position: 'relative',
          minHeight: '90px',
        }}
        w={'100%'}>
        <Overlay variant={'card'} w={'100%'} h={'100%'} />
        <View
          p={1.5}
          fD={'row'}
          jC={'space-between'}
          aI={'unset'}
          w={'100%'}
          flexGrow={1}
          style={{ position: 'relative', zIndex: 999 }}>
          <View>
            <CurrencyBadge
              text={getCurrencyCode(currency)}
              currency={currency}
              radius={24}
              style={{ padding: 0 }}
            />
          </View>

          <View
            w={'100%'}
            {...{ [isRtl ? 'mr' : 'ml']: 0.5 }}>
            <View style={{flex:1, justifyContent: "center", alignItems: "center"}}>
              <Text align={'center'} c={selected ? '#fafafa' : 'font'} s={12}>
                {description?.toUpperCase()}
              </Text>
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

const  CurrencyCard = context(_CurrencyCard);

export default CurrencyCard;
