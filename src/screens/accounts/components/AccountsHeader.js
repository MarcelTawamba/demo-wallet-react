import React from 'react';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import { addCommas, getCurrencyCode } from 'util/general';
import makeStyles from '@material-ui/styles/makeStyles';
import IconLabelButton from './IconLabelButton';
import AccountIcon from './account/AccountIcon';

const useStyles = makeStyles(theme => ({
  header: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

const AccountsHeader = props => {
  const classes = useStyles();
  const { rates, account, onBack, showAccount, totalBalance, title } = props;
  const { hasConversion } = rates;

  const balance = totalBalance
    ? parseFloat(totalBalance).toFixed(rates.displayCurrency.divisibility)
    : rates.totalBalance
    ? parseFloat(rates.totalBalance).toFixed(rates.displayCurrency.divisibility)
    : '0.00';

  const balanceString =
    addCommas(balance) +
    (rates.displayCurrency
      ? ' ' + getCurrencyCode(rates?.displayCurrency)
      : '');

  return (
    <div className={classes.header}>
      {account && showAccount ? (
        <IconLabelButton
          id="back_to_accounts"
          onPress={() => onBack()}
          variant={'caption'}
          show
          color={'primary'}
        />
      ) : null}

      <View w={'100%'} aI={'space-between'} fD={'row'} jC={'flex-end'} p={0.5}>
        {/* {title && (
          <View pt={0.5} pr={0.5}>
            <AccountIcon icon={title} radius={24} />
          </View>
        )} */}
        {hasConversion ? (
          <View w={'100%'} aI={'flex-start'} jC="center">
            <Text
              style={{
                fontSize: 12,
                lineHeight: 1.4,
                paddingBottom: 4,
                paddingTop: 4,
              }}
              variant="overline"
              id={
                title ? 'total_accountTitle_balance' : 'total_available_balance'
              }
              context={{ accountTitle: title }}
            />

            <Text
              variant={'h4'}
              color={'primary'}
              style={{ fontSize: 25, fontWeight: '600' }}>
              {balanceString}
            </Text>
          </View>
        ) : title ? (
          <View w={'100%'} aI={'center'} jC={'center'} pt={0.3}>
            <Text style={{ fontSize: 12 }} variant="overline">
              {title.toUpperCase()}
            </Text>
          </View>
        ) : null}
      </View>
    </div>
  );
};

export default AccountsHeader;
