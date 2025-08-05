import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Card, CardContent, CardActionArea, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import { walletsSelector, conversionRatesSelector } from 'screens/accounts/redux/selectors';
import { calculateAccountTotal } from 'screens/accounts/util/accounts';
import { addCommas, getCurrencyCode } from 'util/general';
import Skeleton from '@material-ui/lab/Skeleton';

const useStyles = makeStyles(theme => ({
  summaryCard: {
    marginBottom: theme.spacing(3),
    borderRadius: 12,
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
    border: '1px solid rgba(0, 0, 0, 0.04)',
  },
  totalBalanceSection: {
    textAlign: 'center',
    paddingBottom: theme.spacing(2),
    borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
  },
  accountItem: {
    padding: theme.spacing(1.5),
    borderRadius: 8,
    transition: 'background-color 0.2s ease',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
  },
  accountGrid: {
    paddingTop: theme.spacing(2),
  },
  balanceText: {
    fontWeight: 600,
    fontSize: '1.5rem',
    color: theme.palette.text.primary,
  },
  currencyCode: {
    fontSize: '0.9rem',
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing(0.5),
  },
  accountName: {
    fontSize: '0.9rem',
    fontWeight: 500,
    color: theme.palette.text.primary,
  },
  accountBalance: {
    fontSize: '1.1rem',
    fontWeight: 600,
    color: theme.palette.text.primary,
  },
}));

export default function AccountBalanceSummary() {
  const classes = useStyles();
  const history = useHistory();
  const wallets = useSelector(walletsSelector);
  const rates = useSelector(conversionRatesSelector);

  // Get accounts from wallets object
  const accounts = wallets?.accounts ? Object.values(wallets.accounts) : [];

  if (!accounts || accounts.length === 0 || wallets?.loading) {
    return (
      <Card className={classes.summaryCard}>
        <CardContent>
          <View className={classes.totalBalanceSection}>
            <Text variant="h6" id="account_balances" style={{ marginBottom: 8 }} />
          </View>
          <Grid container spacing={1} className={classes.accountGrid}>
            {[1, 2, 3].map(i => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <View className={classes.accountItem}>
                  <Skeleton variant="text" width="80%" height={20} />
                  <Skeleton variant="text" width="60%" height={16} />
                </View>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    );
  }

  const handleAccountClick = (account) => {
    const accountName = account.name || standardizeString(account.reference);
    history.push(`/accounts/${accountName}`);
  };

  const handleTotalBalanceClick = () => {
    history.push('/accounts');
  };

  return (
    <Card className={classes.summaryCard}>
      <CardContent>
        <View className={classes.totalBalanceSection}>
          <Text variant="h6" id="total_available_balance" style={{ marginBottom: 8 }} />
        </View>

        <Grid container spacing={1} className={classes.accountGrid}>
          {accounts.slice(0, 6).map((account, index) => {
            const accountName = account.name;
            const totalBalance = calculateAccountTotal(account, rates);
            
            const balance = totalBalance
              ? parseFloat(totalBalance).toFixed(rates.displayCurrency?.divisibility || 2)
              : '0.00';

            const balanceString = addCommas(balance) +
              (rates.displayCurrency
                ? ' ' + getCurrencyCode(rates?.displayCurrency)
                : '');

            return (
              <Grid item xs={12} sm={6} md={4} key={account.reference || index}>
                <CardActionArea 
                  className={classes.accountItem}
                  onClick={() => handleAccountClick(account)}
                >
                  <Text className={classes.accountName}>
                    {accountName}
                  </Text>
                  <Text className={classes.accountBalance}>
                    {balanceString}
                  </Text>
                </CardActionArea>
              </Grid>
            );
          })}
        </Grid>

        {accounts.length > 6 && (
          <View style={{ textAlign: 'center', paddingTop: 16 }}>
            <CardActionArea
              onClick={handleTotalBalanceClick}
              style={{ 
                display: 'inline-block',
                padding: '8px 16px',
                borderRadius: 6,
              }}
            >
              <Text 
                color="primary" 
                style={{ fontSize: '0.9rem', fontWeight: 500 }}
                id="see_all"
              />
            </CardActionArea>
          </View>
        )}
      </CardContent>
    </Card>
  );
}