import React, { useState } from 'react';
import { get } from 'lodash';
import { makeStyles } from '@material-ui/styles';
import Paper from '@material-ui/core/Paper';
import ErrorOutput from 'components/outputs/Error';
import Cart from '../cart/Cart';
import Text from 'components/outputs/Text';
import CheckoutRequired from './CheckoutRequired';
import ButtonList from 'components/lists/ButtonList';

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  innerContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
  title: { paddingBottom: theme.spacing(2), width: '100%' },
  top: {
    maxWidth: 450,
    width: '100%',
  },
  top2: {
    width: '100%',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  buttons: {
    width: '100%',
    paddingTop: theme.spacing(3),
  },
  paper: {
    margin: theme.spacing(2),
    padding: theme.spacing(5),
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    // alignItems: 'center',
    maxWidth: ({ wide }) => (wide ? 500 : 440),
    width: '100%',
    [theme.breakpoints.down(440)]: {
      width: '100%',
      margin: 0,
      marginTop: theme.spacing(2),
    },
    border: '1px solid #EFEFEF',
    backgroundColor: 'white',
    // cornerRadius: theme.
  },
}));

const CheckoutPage = props => {
  const {
    fetchOrders,
    currency,
    rates,
    services,
    cart,
    error,
    cartProps,
    loading,
    confirmPurchase,
    handleStateChange,
    profile,
    addresses,
    mobiles,
    emails,

    fetchData,
  } = props;
  const classes = useStyles(props);

  const {
    requires_billing_address,
    requires_contact_email,
    requires_contact_mobile,
    requires_shipping_address,
  } = cart;

  const insufficientFunds =
    cart && currency.available_balance < cart.total_price;

  const hasItems = Boolean(get(cartProps, ['items', 'length']) > 0);

  const { email, mobile, groups } = profile.items;
  // const isMerchant = Boolean(
  //   groups.findIndex(item => item.name === 'merchant') !== -1,
  // );
  let billingAddresses = [];
  let billingAddress = null;

  billingAddresses = addresses.items.filter(item => item.type === 'billing');
  if (billingAddresses.length > 0) {
    billingAddress = billingAddresses[0];
  }

  let shippingAddresses = [];
  let shippingAddress = null;

  shippingAddresses = addresses.items.filter(item => item.type === 'shipping');
  if (shippingAddresses.length > 0) {
    shippingAddress = shippingAddresses[0];
  }

  const [orderData, setOrderData] = useState({
    contact_email: requires_contact_email ? email : '',
    contact_mobile: requires_contact_mobile ? mobile : '',
    shipping_address: requires_shipping_address ? shippingAddress : null,
    billing_address: requires_billing_address ? billingAddress : null,
  });

  const showRequired =
    requires_billing_address ||
    requires_contact_email ||
    requires_contact_mobile ||
    requires_shipping_address;

  const isInvalid =
    (requires_billing_address && !orderData.billing_address) ||
    (requires_contact_email && !orderData.contact_email) ||
    (requires_contact_mobile && !orderData.contact_mobile) ||
    (requires_shipping_address && !orderData.shipping_address);

  return (
    <div className={classes.container}>
      <Paper className={classes.paper} elevation={0}>
        <div className={classes.innerContainer}>
          <div className={classes.top}>
            <div className={classes.top2}>
              <div className={classes.title}>
                <Text align="center" variant="h6">
                  Checkout
                </Text>
              </div>
              <div
                style={{
                  borderBottom: '1px solid #CECECE',
                  paddingBottom: 16,
                }}>
                <Text align={'center'} style={{ fontSize: 14 }}>
                  You are about to purchase the following
                </Text>
              </div>
            </div>
            <Cart
              noHeader
              {...cartProps}
              // fetchOrders={fetchOrders}
              profile={profile}
            />
          </div>
          <React.Fragment>
            {showRequired && (
              <CheckoutRequired
                cart={cart}
                fetchData={fetchData}
                profile={profile}
                addresses={addresses}
                mobiles={mobiles}
                emails={emails}
                orderDataHook={[orderData, setOrderData]}
                shippingAddresses={shippingAddresses}
                billingAddresses={billingAddresses}
              />
            )}
            <ErrorOutput>{error}</ErrorOutput>
            {insufficientFunds && <ErrorOutput>Insufficient funds</ErrorOutput>}
            <div className={classes.buttons}>
              <ButtonList
                layout={'vertical'}
                items={[
                  {
                    children: 'PAY',
                    type: 'submit',
                    disabled:
                      loading || insufficientFunds || isInvalid || !hasItems,
                    loading: loading,
                    onPress: () => confirmPurchase(orderData),
                  },
                  {
                    children: 'BACK',
                    onPress: () => handleStateChange(''),
                    variant: 'text',
                  },
                ]}
              />
            </div>
          </React.Fragment>
          {/* )} */}
        </div>
      </Paper>
    </div>
  );
};

CheckoutPage.propTypes = {};

CheckoutPage.defaultProps = {};

export default CheckoutPage;
