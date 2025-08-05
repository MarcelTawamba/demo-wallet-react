import React from 'react';
import { makeStyles } from '@material-ui/styles';
import Text from 'components/outputs/Text';
import { Button } from 'components/inputs/Button';
import Output from 'components/outputs/OutputNew';
import { useCart } from 'screens/products/util/contexts/CartContext';
import { useSelector } from 'react-redux';
import { conversionRatesSelector } from 'screens/accounts/redux/selectors';
import { walletsSelector } from 'screens/accounts/redux/selectors';
import { formatAmountString, useConversion } from 'util/rates';
import { objectToArray } from 'util/general';
import ErrorOutput from 'components/outputs/Error';

export default function OrderSummary(props) {
  const { steps, step, onSuccess, orderData } = props;

  const classes = useStyles(props);
  const { cart, currency: cartCurrency, cartLoading, items } = useCart();

  const rates = useSelector(conversionRatesSelector);
  const wallets = useSelector(walletsSelector);

  const currency = objectToArray(wallets?.accounts ?? {})?.find(x => x.primary)
    ?.currencies?.[cartCurrency?.code];

  const {
    total_price,
    requires_billing_address,
    requires_contact_email,
    requires_contact_mobile,
    requires_shipping_address,
  } = cart ?? {};

  const priceString = formatAmountString(total_price, currency?.currency, true);

  const insufficientFunds =
    cart && currency.available_balance < cart.total_price;

  const { convAvailable } = useConversion(
    total_price,
    rates,
    currency?.currency,
    true,
  );

  const actionLabel =
    steps?.map(x => x?.id ?? x).includes('details') && step === 'cart'
      ? 'next'
      : 'checkout';

  const isValid =
    step === 'cart'
      ? items?.length && !insufficientFunds
      : step === 'details'
      ? (!requires_billing_address || orderData?.billing_address) &&
        (!requires_shipping_address || orderData?.shipping_address) &&
        (!requires_contact_email || orderData?.contact_email) &&
        (!requires_contact_mobile || orderData?.contact_mobile)
      : true;

  const error =
    step === 'cart' && insufficientFunds
      ? 'insufficient_balance_warning'
      : null;
  console.log(error);

  return (
    <div className={classes.container}>
      <Text className={classes.title} id="order_summary" />
      <Output
        id="total"
        value={priceString}
        horizontal
        align="right"
        value2={convAvailable}
        valueColor
        labelColor="#848484"
        valueBold
      />
      <div className={classes.button}>
        <Button
          noPadding
          wide
          disabled={cartLoading || !isValid}
          color={'primary'}
          id={actionLabel}
          capitalize
          onPress={onSuccess}
        />
      </div>
      {error && <ErrorOutput id={error} />}
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  container: {
    padding: theme.spacing(3),
  },
  button: { paddingTop: theme.spacing(3) },
  title: { fontSize: 18, paddingBottom: theme.spacing(1) },
}));
