import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { CardActionArea } from '@material-ui/core';
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
    display: 'flex',
    flexDirection: 'column',
  },
  totalHeader: {
    paddingBottom: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  accountCard: {
    marginBottom: theme.spacing(1),
    '&:last-child': {
      marginBottom: 0,
    },
  },
  viewAllCard: {
    marginTop: theme.spacing(1),
  },
}));

export default function AccountsSidebar() {
  const classes = useStyles();
  const history = useHistory();
  const wallets = useSelector(walletsSelector);
  const rates = useSelector(conversionRatesSelector);

  // Get currencies from wallets object (this is what the accounts page actually shows)
  const currencies = wallets?.items || [];
  const { hasConversion, empty } = rates;

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
              paddingBottom: 4,
              paddingTop: 4,
            }}
            variant="overline"
            id="total_available_balance"
          />
          <Skeleton variant="text" width="70%" height={32} />
        </View>
        {[1, 2, 3].map(i => (
          <Card key={i} className={classes.accountCard}>
            <View p={1.5} fD={'row'} jC={'space-between'} aI={'center'} style={{ minHeight: '100px' }}>
              <Skeleton variant="circle" width={24} height={24} />
              <View w={'100%'} jC={'flex-end'} ml={0.5}>
                <Skeleton variant="text" width="60%" height={16} />
                <Skeleton variant="text" width="40%" height={14} />
              </View>
            </View>
          </Card>
        ))}
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

  return (
    <div className={classes.container}>
      {/* Total Balance Header - matching AccountsHeader.js */}
      {hasConversion && (
        <View className={classes.totalHeader} w={'100%'} aI={'flex-start'} jC="center">
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
        </View>
      )}

      {/* Currency Cards - matching CurrencyCard.js */}
      {currencies.slice(0, 4).map((currencyItem, index) => {
        const { currency = {}, available_balance } = currencyItem;
        const { description, code, divisibility } = currency;
        const { convAvailable } = useConversion(available_balance / (10 ** divisibility), rates, currency);

        return (
          <Card key={code || index} className={classes.accountCard}>
            <CardActionArea onClick={() => handleCurrencyClick(currencyItem)}>
              <View
                p={1.5}
                fD={'row'}
                jC={'space-between'}
                aI={'unset'}
                w={'100%'}
                style={{ 
                  backgroundColor: 'transparent',
                  minHeight: '100px'
                }}>
                <View jC={'center'}>
                  <CurrencyBadge
                    text={getCurrencyCode(currency)}
                    currency={currency}
                    radius={24}
                    style={{ padding: 0 }}
                  />
                </View>

                <View
                  w={'100%'}
                  jC={'center'}
                  aI={'unset'}
                  ml={0.5}>
                  <View>
                    <Text align={'right'} c={'font'} s={12}>
                      {description?.toUpperCase()}
                    </Text>
                    <Text
                      c={'primary'}
                      align={'right'}
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
                        align={'right'}
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
        );
      })}

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