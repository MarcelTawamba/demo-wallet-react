import React from 'react';
import { makeStyles } from '@material-ui/styles';
import {
  formatDivisibility,
  addCommas,
  getCurrencyCode,
  displayFormatDivisibility,
} from 'util/general';
import CurrencyBadge from 'screens/accounts/components/currency/CurrencyBadge';
import Card from 'components/card/Card';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import { useConversion } from 'util/rates';

export default function AmountDisplayCard(props) {
  const { item = {}, amount = 0, rates, disabled } = props;

  const classes = useStyles();

  const { currency = {} } = item;

  const { description, code, divisibility } = currency;

  const amountFormatted = formatDivisibility(amount, divisibility);

  let { convAvailable, convRate } = useConversion(
    amountFormatted,
    rates,
    currency,
  );

  let cardProps = {};

  if (disabled) cardProps = { style: { backgroundColor: 'transparent' } };

  const amountString = `${addCommas(
    displayFormatDivisibility(amount, divisibility),
  )} ${getCurrencyCode(currency)}`;

  return (
    <Card noPadding className={classes.root} {...cardProps}>
      <View fD={'row'} aI={'center'} w={'100%'}>
        <CurrencyBadge
          text={getCurrencyCode(currency)}
          currency={currency}
          radius={20}
          style={{ padding: 0 }}
        />
        <View fD={'row'} aI={'center'} jC={'space-between'} ml={0.5} w={'100%'}>
          <View>
            <Text s={14} fontWeight={500}>
              {description}
            </Text>
            <Text s={12} c={'grey4'}>
              {code}
            </Text>
          </View>
          <View ml={1}>
            <Text s={14} fontWeight={500} align={'right'}>
              {convAvailable ? convAvailable.replace('~', '') : amountString}
            </Text>
            {Boolean(convRate) && code !== rates?.displayCurrency?.code && (
              <Text s={12} c={'grey4'} align={'right'}>
                {amountString}
              </Text>
            )}
          </View>
        </View>
      </View>
    </Card>
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    border: 0,
  },
}));
