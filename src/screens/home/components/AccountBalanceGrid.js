import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Grid, CardActionArea } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import Card from 'components/card/Card';
import CurrencyBadge from 'screens/accounts/components/currency/CurrencyBadge';
import { walletsSelector, conversionRatesSelector } from 'screens/accounts/redux/selectors';
import { addCommas, getCurrencyCode, displayFormatDivisibility } from 'util/general';
import { useConversion } from 'util/rates';
import Skeleton from '@material-ui/lab/Skeleton';

const useStyles = makeStyles(theme => ({
  container: {
    marginBottom: theme.spacing(2),
  },
  totalHeader: {
    paddingBottom: theme.spacing(1),
    marginBottom: theme.spacing(1),
    textAlign: 'center',
  },
  accountCard: {
    height: '100%',
    minHeight: '120px',
  },
  viewAllCard: {
    marginTop: theme.spacing(2),
  },
  gridItem: {
    display: 'flex',
  },
}));

export default function AccountBalanceGrid() {
  const classes = useStyles();
  const history = useHistory();
  const wallets = useSelector(walletsSelector);
  const rates = useSelector(conversionRatesSelector);

  // Get currencies from wallets object (this is what the accounts page actually shows)
  const currencies = wallets?.items || [];
  const { hasConversion } = rates;

  // Use the totalBalance from rates (same as accounts page)
  const totalBalance = rates.totalBalance
    ? parseFloat(rates.totalBalance).toFixed(rates.displayCurrency?.divisibility || 2)
    : '0.00';

  const totalBalanceString = addCommas(totalBalance) +
    (rates.displayCurrency
      ? ' ' + getCurrencyCode(rates?.displayCurrency)
      : '');

  if (!currencies || currencies.length === 0 || wallets?.loading) {
    return (
      <div className={classes.container}>
        <View className={classes.totalHeader}>
          <Text
            style={{
              fontSize: 12,
              lineHeight: 1.4,
              paddingBottom: 20,
              paddingTop: 4,
            }}
            variant="overline"
            id="total_available_balance"
          />
          <Skeleton variant="text" width="50%" height={32} />
        </View>
        <Grid container spacing={2}>
          {[1, 2, 3, 4].map(i => (
            <Grid item xs={12} sm={6} md={6} lg={6} key={i} className={classes.gridItem}>
              <Card className={classes.accountCard} style={{ width: '100%' }}>
                <View p={1.5} fD={'row'} jC={'flex-start'} aI={'center'} style={{ minHeight: '120px' }}>
                  <Skeleton variant="circle" width={32} height={32} />
                  <View w={'100%'} jC={'flex-start'} ml={1.5}>
                    <Skeleton variant="text" width="60%" height={16} />
                    <Skeleton variant="text" width="40%" height={14} />
                  </View>
                </View>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    );
  }

  const handleCurrencyClick = (currency) => {
    // Navigate to the specific currency page (same as accounts page behavior)
    history.push('/accounts');
  };

  const handleViewAllClick = () => {
    history.push('/accounts');
  };

  // Limit to 4 accounts for 2x2 grid on large screens
  const displayCurrencies = currencies.slice(0, 4);

  return (
    <div className={classes.container}>
      {/* Total Balance Header */}
      {hasConversion && (
        <div className={classes.totalHeader}>
          <Text
            style={{
              fontSize: 12,
              lineHeight: 1.4,
              paddingBottom: 4,
              paddingTop: 4,
            }}
            variant="overline"
            id="total_available_balance"
          />
          <Text
            variant={'h4'}
            color={'primary'}
            style={{ fontSize: 25, fontWeight: '600', paddingBottom: 10 }}>
            {totalBalanceString}
          </Text>
        </div>
      )}

      {/* Currency Cards Grid */}
      <Grid container spacing={2}>
        {displayCurrencies.map((currencyItem, index) => {
          const { currency = {}, available_balance } = currencyItem;
          const { description, code, divisibility } = currency;
          const { convAvailable } = useConversion(available_balance / (10 ** divisibility), rates, currency);

          // Calculate grid sizes - if it's the last item and odd number, make it full width
          const isLastItem = index === displayCurrencies.length - 1;
          const isOddCount = displayCurrencies.length % 2 === 1;
          const shouldStretch = isLastItem && isOddCount;

          return (
            <Grid 
              item 
              xs={12} 
              sm={shouldStretch ? 12 : 6} 
              md={shouldStretch ? 12 : 6} 
              lg={shouldStretch ? 12 : 6} 
              key={code || index} 
              className={classes.gridItem}
            >
              <Card className={classes.accountCard} style={{ width: '100%' }}>
                <CardActionArea 
                  onClick={() => handleCurrencyClick(currencyItem)}
                  style={{ height: '100%' }}
                >
                  <View
                    p={1.5}
                    fD={'row'}
                    jC={'flex-start'}
                    aI={'center'}
                    w={'100%'}
                    style={{ 
                      backgroundColor: 'transparent',
                      minHeight: '120px'
                    }}>
                    <View jC={'center'} mr={1.5}>
                      <CurrencyBadge
                        text={getCurrencyCode(currency)}
                        currency={currency}
                        radius={32}
                        style={{ padding: 0 }}
                      />
                    </View>

                    <View
                      w={'100%'}
                      jC={'center'}
                      aI={'flex-start'}>
                      <View>
                        <Text align={'left'} c={'font'} s={12}>
                          {description?.toUpperCase()}
                        </Text>
                        <Text
                          c={'primary'}
                          align={'left'}
                          s={16}
                          fontWeight={700}>
                          {addCommas(
                            displayFormatDivisibility(available_balance, divisibility),
                          ) +
                            ' ' +
                            getCurrencyCode(currency)}
                        </Text>
                        {Boolean(convAvailable) && code !== rates?.displayCurrency?.code && (
                          <Text
                            c={'grey4'}
                            align={'left'}
                            s={12}
                            variant={'body2'}>
                            {convAvailable}
                          </Text>
                        )}
                      </View>
                    </View>
                  </View>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* View All Button */}
      {currencies.length > 4 && (
        <Card className={classes.viewAllCard}>
          <CardActionArea onClick={handleViewAllClick}>
            <View p={1} style={{ textAlign: 'center' }}>
              <Text 
                color="primary" 
                style={{ fontSize: 12, fontWeight: 500 }}
                id="view_bank_accounts"
              />
            </View>
          </CardActionArea>
        </Card>
      )}
    </div>
  );
}