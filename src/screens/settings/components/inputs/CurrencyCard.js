import React from 'react';
import { useTheme } from 'components/app/context';
import { getCurrencyCode } from 'util/general';
import { useTheme as useThemeMui } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import CardActionArea from '@material-ui/core/CardActionArea';

import Card from 'components/card/Card';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import CurrencyBadge from 'screens/accounts/components/currency/CurrencyBadge';

export default function CurrencyCard(props) {
  const {
    item = {},
    selected,
    noCard,
    onPress,
    disabled,
    align = 'right',
    noPadding,
    ghost,
  } = props;
  const theme = useThemeMui();
  const { colors } = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down(420));

  const { description } = item;

  let cardProps = {};

  if (disabled) {
    cardProps = { style: { backgroundColor: 'transparent' } };
  }

  function handlePress() {
    typeof onPress === 'function' && onPress(item);
  }
  const Content = (
    <CardActionArea disabled={disabled} onClick={handlePress}>
      <View
        p={matches ? 0.5 : 1}
        style={{
          backgroundColor: Boolean(selected) ? colors.grey1 : 'transparent',
          opacity: ghost ? 0.5 : 1,
        }}
        fD={'row'}
        jC={'space-between'}
        aI={'center'}
        w={'100%'}>
        <CurrencyBadge
          text={getCurrencyCode(item)}
          currency={item}
          radius={24}
        />
        <View w={'100%'} jC={'flex-end'} p={0.5}>
          <Text align={align} style={{ fontWeight: 500, fontSize: 15 }}>
            {description}
          </Text>
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
}
