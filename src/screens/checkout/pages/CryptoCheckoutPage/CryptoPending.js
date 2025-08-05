import React from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import Text from 'components/outputs/Text';

import { Button } from 'components/inputs/Button';
import Spinner from 'components/outputs/Spinner';
import OutputList from 'components/lists/OutputList';
import {
  formatDivisibility,
  formatAmountString,
  formatDecimals,
} from 'util/general';
import { choosePaymentRequestMethod } from 'screens/checkout/util/rehive';
import { Box } from '@material-ui/core';
import CryptoAmount from 'screens/checkout/components/CryptoAmount';
import { generateCryptoQR } from 'screens/checkout/util/crypto';
import QR from 'components/outputs/QR';
import Info from 'components/outputs/Info';

export default function CryptoPending(props) {
  const { context, onNext, config } = props;
  const { invoice, quote = {} } = context;
  const { amount, currency = {}, total_paid, deposit_details, payment_processor } = quote;

  const classes = useStyles(props);
  const amountOutstanding = amount - total_paid;
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

  const { qrString, outputItems } = generateCryptoQR({
    amount,
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
    <div className={classes.container}>
      <CryptoAmount {...props} />
      {config && config.cryptoInfoMessage && <Info>{config.cryptoInfoMessage}</Info>}
      <div className={classes.qrCode}>
        <div style={{ paddingTop: '2px' }}>
          <QR size={150}>{qrString}</QR>
        </div>
        <OutputList
          items={qrOutputs}
          outputProps={{ labelColor: true, copy: true }}
        />
      </div>

      {payment_processor && payment_processor.pending_processing_description && (
        <Box pb={3} width="100%" px={2}>
          <Info noMargin variant="warning">
            {payment_processor.pending_processing_description}
          </Info>
        </Box>
      )}

      <Box pb={3}>
        <Spinner pb={3} />
        <Text color="primary" variant={'h5'} align={'center'}>
          Awaiting payment
        </Text>
      </Box>
      <Button
        label="I HAVE MADE THE PAYMENT"
        wide
        color="primary"
        onClick={onNext}
      />
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    overflowX: 'scroll',
  },
  qrCode: {
    borderRadius: 10,
    border: '1px solid #EFEFEF',
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    marginBottom: theme.spacing(3),
    [theme.breakpoints.down(600)]: {
      flexDirection: 'column',
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      paddingTop: theme.spacing(0.5),
      padding: theme.spacing(1),
    },
  }
}));
