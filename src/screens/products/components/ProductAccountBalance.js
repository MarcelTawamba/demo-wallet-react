import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { displayFormatDivisibility, getCurrencyCode } from 'util/general';
import CurrencySelector from '../../accounts/components/currency/CurrencySelector';
import Text from 'components/outputs/Text';
import { Hidden } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    width: '100%',
    // paddingBottom: theme.spacing(1),
  },
  title: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '100%',
    height: '100%',
  },
  selector: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: '100%',
    marginTop: 2,
  },
  balance: {
    paddingRight: theme.spacing(1),
    paddingBottom: 3,
  },
}));

const ProductAccountBalance = props => {
  const { primaryCurrencies, currency, switchCart } = props;
  const classes = useStyles();
  if (!currency || !currency.currency) {
    return null;
  }

  return (
    <div className={classes.container}>
      <Hidden xsDown>
        <Text align={'right'} variant="overline" style={{ lineHeight: 0.7 }}>
          Available balance
        </Text>
      </Hidden>

      <div className={classes.selector}>
        <Text
          className={classes.balance}
          variant="h4"
          color={'primary'}
          align={'right'}>
          {displayFormatDivisibility(
            currency.available_balance,
            currency.currency.divisibility,
          )}
        </Text>
        <CurrencySelector
          tooltip={'Change cart currency'}
          data={primaryCurrencies.items}
          currency={currency}
          handleChange={index => switchCart(primaryCurrencies.items[index])}
          renderDetailValue={item => getCurrencyCode(item?.currency)}
        />
      </div>
    </div>
  );
};

ProductAccountBalance.propTypes = {};

ProductAccountBalance.defaultProps = {};

export default ProductAccountBalance;
