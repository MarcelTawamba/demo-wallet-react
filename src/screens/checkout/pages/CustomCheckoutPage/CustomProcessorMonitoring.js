import React, { useState, useEffect } from 'react';
import Text from 'components/outputs/Text';
import Spinner from 'components/outputs/Spinner';
import { Box } from '@material-ui/core';
// import CryptoAmount from 'screens/checkout/components/CryptoAmount';
import { Button } from 'components/inputs/Button';

export default function CustomProcessorMonitoring(props) {
  const { onBack, context } = props;
  const { invoice, message, quote } = context;

  return (
    <React.Fragment>
      <Box pb={3}>
        <Spinner pb={3} />
        <Text color="primary" variant={'h5'} align={'center'}>
          {'We are monitoring for your payment.'}
        </Text>
        <Text align={'center'} opacity={0.67} style={{paddingTop: '10px'}}>
            {quote?.payment_processor?.pending_processing_description ? quote?.payment_processor?.pending_processing_description : 'Your payment may take a while to be detected.'}
        </Text>
      </Box>

      <Box
      height={90}
      display="flex"
      alignItems="center"
      justifyContent="flex-end"
      flexDirection="column">
        <Box pt={3} pb={1}>
          <Text align={'center'} opacity={0.67}>
            Did not make the payment?
          </Text>
        </Box>
        <Button
          wide
          color="primary"
          label="Go back"
          variant="link"
          onPress={onBack}
        />
      </Box>
    </React.Fragment>
  );
}
