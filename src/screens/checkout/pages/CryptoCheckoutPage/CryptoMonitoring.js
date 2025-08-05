import React, { useState, useEffect } from 'react';
import Text from 'components/outputs/Text';
import Spinner from 'components/outputs/Spinner';
import { Box } from '@material-ui/core';
import CryptoAmount from 'screens/checkout/components/CryptoAmount';
import { Button } from 'components/inputs/Button';

export default function CryptoMonitoring(props) {
  const { onBack } = props;
  const [time, setTime] = useState(59);
  useEffect(() => {
    let timer = null;
    async function startTimer() {
      timer = setTimeout(() => {
        if (time > 0) {
          setTime(time - 1);
          startTimer();
        }
      }, 800);
    }
    startTimer();
    return () => clearTimeout(timer);
  }, [time]);

  const timedOut = time < 1;

  return (
    <React.Fragment>
      <CryptoAmount {...props} />
      <Box pb={3}>
        <Spinner pb={3} />
        <Text color="primary" variant={'h5'} align={'center'}>
          {'Monitoring blockchain for payment.'}
        </Text>
      </Box>

      <Box
        pt={timedOut ? 1 : 3}
        height={134}
        display="flex"
        alignItems="center"
        justifyContent="flex-end"
        flexDirection="column">
        <Text align={'center'} opacity={0.67}>
          {!timedOut
            ? 'This could take a while... (00:' +
              time.toString().padStart(2, '0') +
              ')'
            : 'Made a payment that is not being detected? Please contact support.'}
        </Text>

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
