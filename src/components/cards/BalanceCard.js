import React from 'react';
import { makeStyles } from '@material-ui/styles';
import {
  formatDivisibility,
  addCommas,
  getCurrencyCode,
  displayFormatDivisibility,
} from 'util/general';
import CardActionArea from '@material-ui/core/CardActionArea';
import CurrencyBadge from 'screens/accounts/components/currency/CurrencyBadge';
import Card from 'components/card/Card';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import { useConversion } from 'util/rates';

export default function BalanceCard(props) {
  const {
    item = {},
    colors,
    rates,
    selected,
    onPress,
    disabled,
    noPadding,
    ghost,
  } = props;

  const classes = useStyles();

  const { currency = {}, available_balance } = item;

  const { description, code, divisibility } = currency;

  const available = formatDivisibility(available_balance, divisibility);

  let { convAvailable, convRate } = useConversion(available, rates, currency);

  let cardProps = {};

  if (disabled) cardProps = { style: { backgroundColor: 'transparent' } };

  const balance = `${addCommas(
    displayFormatDivisibility(available_balance, divisibility),
  )} ${getCurrencyCode(currency)}`;

  const Content = (
    <Card
      padding
      noPadding={noPadding}
      className={[classes.root, classes.card]}
      {...cardProps}>
      <View
        p={1}
        style={{
          backgroundColor: selected ? colors.grey1 : 'transparent',
          opacity: ghost ? 0.5 : 1,
        }}
        fD={'row'}
        aI={'center'}
        w={'100%'}>
        <CurrencyBadge
          text={getCurrencyCode(currency)}
          currency={currency}
          radius={20}
          style={{ padding: 0 }}
        />
        <View fD={'row'} aI={'center'} jC={'space-between'} ml={1} w={'100%'}>
          <View>
            <Text s={15} fontWeight={500}>
              {description}
            </Text>
            <Text s={13} c={'grey4'}>
              {code}
            </Text>
          </View>
          <View>
            <Text c={'primary'} s={15} fontWeight={500} align={'right'}>
              {convAvailable ? convAvailable.replace('~', '') : balance}
            </Text>
            {Boolean(convRate) && code !== rates?.displayCurrency?.code && (
              <Text s={13} c={'grey4'} align={'right'}>
                {balance}
              </Text>
            )}
          </View>
        </View>
      </View>
    </Card>
  );

  return onPress ? (
    <CardActionArea
      disabled={disabled}
      className={classes.root}
      onClick={onPress}>
      {Content}
    </CardActionArea>
  ) : (
    Content
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    borderRadius: 20,
  },
  card: {
    border: '1px solid',
    borderColor: '#c4c4c4',
  },
}));
