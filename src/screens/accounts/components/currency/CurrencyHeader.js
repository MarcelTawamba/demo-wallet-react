import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';

import {
  formatDivisibility,
  addCommas,
  getCurrencyCode,
  objectToArray,
  displayFormatDivisibility,
} from 'util/general';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import { calculateRate } from 'util/rates';
import Hidden from 'components/layout/Hidden';

const CurrencyHeader = ({
  currency,
  classes,
  onClick,
  rates,
  wallets,
  layout,
}) => {
  const { accounts } = wallets;
  const data = objectToArray(accounts);
  const showAccount = layout && layout === 'accounts' && data.length > 1;
  let convBalance = '';
  const availableBalance = formatDivisibility(
    currency.available_balance,
    currency.currency.divisibility,
  );
  if (rates && rates.rates && rates.displayCurrency) {
    const convRate = calculateRate(
      currency?.currency?.code,
      rates.displayCurrency.code,
      rates.rates,
    );

    convBalance = (availableBalance * convRate).toFixed(
      rates.displayCurrency.divisibility,
    );
    // const diff =
    //   convBalance.toString().length - Math.floor(convBalance).toString().length;
    // if (diff < 3) {
    //   convBalance = convBalance.toFixed(2);
    // } else if (diff > rates.displayCurrency.divisibility) {
    //   convBalance = convBalance.toFixed(rates.displayCurrency.divisibility);
    // }
    convBalance =
      addCommas(convBalance.toString()) +
      ' ' +
      getCurrencyCode(rates.displayCurrency);
  }

  return (
    <View
      flex
      fD={'column'}
      w={'100%'}
      aI={'flex-end'}
      h={'100%'}
      pt={showAccount ? 1.3 : 0}>
      <View h={'100%'} jC={'flex-end'} w={'100%'}>
        <Text
          style={{
            fontSize: 12,
            lineHeight: 1.4,
            paddingBottom: 4,
            paddingTop: 4,
          }}
          align={'right'}
          variant="overline">
          {currency.currency.description
            ? currency.currency.description
            : getCurrencyCode(currency?.currency)}
        </Text>
      </View>
      {/* <Text align={'right'} variant="overline">
        Available balance
      </Text> */}
      <Text
        variant="h4"
        color={'primary'}
        align={'right'}
        style={{ fontSize: 25, fontWeight: '600' }}>
        {`${addCommas(
          displayFormatDivisibility(
            currency.available_balance,
            currency.currency.divisibility,
          ),
        )} ${getCurrencyCode(currency?.currency)}`}
      </Text>
      {convBalance && (
        <Hidden size="xs">
          <Text align={'right'}>{convBalance}</Text>
        </Hidden>
      )}
    </View>
  );
};
const styles = theme => ({
  paper: {
    height: 160,
    width: '100%',
    display: 'flex',
  },
});

CurrencyHeader.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CurrencyHeader);
