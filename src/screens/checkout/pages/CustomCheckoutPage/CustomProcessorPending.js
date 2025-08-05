import React, { useState, useEffect } from 'react';
import Layout from 'screens/checkout/components/Layout';
import { Button } from 'components/inputs/Button';
import CheckoutHeader from 'screens/checkout/components/CheckoutHeader';
import OutputList from 'components/lists/OutputList';
import makeStyles from '@material-ui/styles/makeStyles';
import PaymentSuccess from 'screens/checkout/components/PaymentSuccess';
import ExpiredTimerQuote from 'screens/checkout/components/ExpiredTimerQuote';
import Text from 'components/outputs/Text';
import { currentSessionsSelector } from 'redux/auth/selectors';
import { useSelector } from 'react-redux';
import { initWithoutToken, initWithToken } from 'util/rehive';
import {
  formatDivisibility,
  formatAmountString,
  formatDecimals,
} from 'util/general';

export default function CustomProcessorPending(props) {
  const { context, company, onNext } = props;
  const { wallet_method } = context;
  const [initiated, setInitiated] = useState(false);
  const classes = useStyles(props);

  const { invoice } = context;
  const { request_currency, payment_processor_quotes, primary_payment_processor } = invoice;

  const [quotes, setQuotes] = useState(payment_processor_quotes);

  const quote =
    quotes.find(
      item =>
        item?.payment_processor?.unique_string_name === primary_payment_processor.unique_string_name &&
        item?.status.match(/pending|processing/)
    ) ?? null;
  const { amount, currency = {}, total_paid, deposit_details } = quote;

  const amountOutstandingAmount = formatDivisibility(
    amount,
    currency?.divisibility,
    true,
  );

  const [expired, setExpired] = useState(quote?.status === 'expired');

  const sessions = useSelector(currentSessionsSelector);
  const userID = context?.invoice?.payer_user?.id;
  const initialAuth = sessions?.items?.[company?.id]?.[userID];
  const [user, setUser] = useState();

  async function init() {
    initWithoutToken();
    await initWithToken(initialAuth?.token);
    setUser(initialAuth?.user);
  }

  useEffect(() => {
    if (initialAuth?.token) {
      init();
    }
  }, [initialAuth]);


  const hooks = {
    quotes,
    setQuotes,
    initiated,
    setInitiated,
    quote,
    expired,
    setExpired,
    user,
    setUser,
  };

  const isAuthed = Boolean(user?.id);

  function formatDepositDetails(details) {
    if (details.display_details) {
      // Setup a list of quote details to display
      let display_details = Object.keys(details.display_details).map((key, i) => (
        details.display_details[key]
      ))
      // Add the amount
      display_details.unshift(
        {
          'value': amountOutstandingAmount + ' ' + currency.code,
          'label': 'Amount'
        }
      )
      return display_details
    } else {
      // If no display details we try to build it from the deposit details
      let display_details = []
      // Build display details from the deposit details object
      if (details) {
        Object.keys(details).forEach(key => {
          // Skip display_details if it exists in the object
          if (key !== 'display_details' && key !== 'amount' && key !== 'currency' && key !== 'payment_rail') {
            display_details.push({
              'label': key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '), // Convert snake_case to Title Case
              'value': details[key]
            });
          }
        });
        
        // Add the amount at the beginning
        display_details.unshift({
          'value': amountOutstandingAmount + ' ' + currency.display_code,
          'label': 'Amount'
        });
      }
      
      return display_details;
    }
  }

  return (
    <div>
      {initiated ? (
        <PaymentSuccess {...props} initiated />
      ) : (
        <>
          <div>
            <Text style={{ fontSize: 18 }} align="center">
              Please make a payment using the following details
            </Text>
          </div>
          <div className={classes.outputList}>
            <OutputList
              items={formatDepositDetails(deposit_details)}
              outputProps={{ labelColor: true, copy: true }}
            />
          </div>
          <Button
            label="I HAVE MADE THE PAYMENT"
            wide
            color="primary"
            onClick={onNext}
          />
        </>
      )}
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  amount: {
    paddingBottom: ({ pb }) => theme.spacing(pb ? pb : 3),
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
  text: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(2),
  },
  outputList: {
    padding: theme.spacing(3),
    width: '100%'
  },
}));
