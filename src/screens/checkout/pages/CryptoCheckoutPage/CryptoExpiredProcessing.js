import React, { useState, useEffect } from 'react';
import makeStyles from '@material-ui/styles/makeStyles';

import Text from 'components/outputs/Text';

import Spinner from 'components/outputs/Spinner';
import OutputList from 'components/lists/OutputList';
import {
  formatDivisibility,
  formatAmountString,
  formatDecimals,
} from 'util/general';
import { choosePaymentRequestMethod } from 'screens/checkout/util/rehive';
import { Box } from '@material-ui/core';
import BitcoinTransactionList from '../../components/CheckoutTransactionList';
import LottieImage from 'components/outputs/LottieImage';
import QR from 'components/outputs/QR';
import { generateCryptoQR } from 'screens/checkout/util/crypto';

const typeMap = {
  native_bitcoin: 'bitcoin',
  native_bitcoin_testnet: 'bitcoin',
  native_stellar: 'stellar',
  native_stellar_testnet: 'stellar',
};

export default function CryptoExpiredProcessing(props) {
  const { context, setInvoice } = props;
  const { invoice, quote = {} } = context;
  const classes = useStyles(props);
  if (!quote) {
    return null;
  }

  const {
    amount,
    currency,
    reference,
    total_paid,
    total_pending,
    status,
    deposit_details,
    payment_processor
  } = quote;

  const amountOutstanding = amount - total_paid - total_pending;
  const amountPaidString = formatAmountString(
    total_paid + total_pending,
    currency,
    true,
  );
  const amountOutstandingString = formatAmountString(
    amountOutstanding,
    currency,
    true,
  );
  const amountOutstandingAmount = formatDivisibility(
    amountOutstanding,
    currency?.divisibility,
    true,
  );

  const isUnderpaid = Boolean(
    status === 'underpaid' ||
      (total_paid && total_paid < amount) ||
      (total_pending && total_pending < amount),
  );

  const { outputItems } = generateCryptoQR({
    amount: amountOutstanding,
    currency,
    ...deposit_details,
    payment_processor
  });
  let qrOutputs = [
    {
      label: 'Send amount',
      value: amountOutstandingString,
      copy: amountOutstandingAmount,
    },
  ];
  qrOutputs = qrOutputs.concat(outputItems);

  return (
    <React.Fragment>
      <div className={classes.success}>
        <div className={classes.icon}>
          <LottieImage name="loading" loop />
        </div>
        <Text variant={'h6'} align={'center'} color="primary">
          Payment detected
        </Text>
        <Box pt={1} pb={3}>
          <Text variant={'subtitle2'} align={'center'} opacity={0.7}>
            Awaiting confirmation...
          </Text>
        </Box>
        <BitcoinTransactionList hideSpinner={isUnderpaid} {...props} />
        {isUnderpaid && (
          <Box pb={3} pt={3}>
            <Spinner pb={3} />
            <Text color="primary" variant={'h5'} align={'center'}>
              Awaiting payment
            </Text>
          </Box>
        )}
      </div>
    </React.Fragment>
  );
}

const useStyles = makeStyles(theme => ({
  success: {
    display: 'flex',
    flexDirection: 'column',
    // flex: 1,
    // height: '85%',
    width: '100%',
    alignItems: 'center',
    // justifyContent: 'space-around',
  },
  rate: {
    paddingBottom: theme.spacing(2),
    paddingTop: theme.spacing(1),
    width: '100%',
  },
  invoice: {
    paddingBottom: theme.spacing(2),
    paddingTop: theme.spacing(1),
    width: '100%',
  },
  qrCode: {
    borderRadius: 15,
    border: '1px solid #EFEFEF',
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    // marginTop: theme.spacing(1),
    marginBottom: theme.spacing(3),
    [theme.breakpoints.down(600)]: {
      flexDirection: 'column',
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      paddingTop: theme.spacing(0.5),
      padding: theme.spacing(1),
    },
  },
  error: {
    borderRadius: 15,
    border: '1px solid #E43',
    backgroundColor: '#FEF4F4',
    display: 'flex',
    flexDirection: 'row',
    padding: theme.spacing(2),
    marginBottom: theme.spacing(3),
    width: '100%',
    alignItems: 'center',
  },
  icon: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  qr: {
    paddingTop: theme.spacing(4),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    overflowX: 'scroll',
  },
}));
