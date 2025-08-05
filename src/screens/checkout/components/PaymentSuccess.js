import React from 'react';
import { makeStyles, useTheme as useMuiTheme } from '@material-ui/core/styles';
import { useMediaQuery } from '@material-ui/core';

import PageButtons from 'components/layout/page/PageButtons';
import Text from 'components/outputs/Text';
import ErrorOutput from 'components/outputs/Error';
import CheckoutTransactionList from './CheckoutTransactionList';
import LottieImage from 'components/outputs/LottieImage';
import { Box } from '@material-ui/core';
import PageContent from 'components/layout/page/PageContent';
import OverpaidNotice from './OverpaidNotice';
import UnderpaidNotice from './UnderpaidNotice';

export default function PaymentSuccess(props) {
  const { result, history, onNext, initiated, context } = props;
  const { invoice, quote } = context;
  const { return_url, status } = invoice;
  const classes = useStyles();

  const isOverpaid = status === 'overpaid';
  const isUnderpaid = status === 'underpaid';

  const isSuccess = status === 'paid' || 'received' || isOverpaid;
  const hasReturn = Boolean(return_url);
  let buttons = [];
  if (hasReturn) {
    buttons.push({
      label: 'RETURN',
      disabled: !isSuccess,
      onPress: () => (window.location = return_url),
    });
  }
  buttons.push({
    label: 'VIEW RECEIPT',
    disabled: !isSuccess && !isUnderpaid,
    onPress: onNext,
  });

  buttons.push({
    label: 'Close',
    variant: 'text',
    onPress: () => history.push('/'),
  });

  const theme = useMuiTheme();
  const matches = useMediaQuery(theme.breakpoints.down(540));

  return (
    <div className={classes.success}>
      <div className={classes.icon}>
        <LottieImage
          name={initiated ? 'loading' : isSuccess ? 'success' : 'error'}
        />
      </div>
      <PageContent>
        <Text variant={'h6'} align={'center'} color="primary">
          {'Payment ' +
            (initiated ? 'initiated' : isSuccess ? 'successful!' : 'failed!')}
        </Text>
      </PageContent>

      <Box pl={matches ? 2 : 4} pr={matches ? 2 : 4}>
        {isUnderpaid && <UnderpaidNotice {...props} matches={matches} />}
        {isOverpaid && <OverpaidNotice {...props} success matches={matches} />}
      </Box>

      {!isSuccess && <ErrorOutput>{result}</ErrorOutput>}
      <PageContent horizontal={4}>
        <CheckoutTransactionList {...props} />
      </PageContent>
      {!initiated && (
        <div className={classes.buttons}>
          <PageButtons layout="vertical" items={buttons} />
        </div>
      )}
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  success: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    height: '85%',
    width: '100%',
    alignItems: 'center',
    // justifyContent: 'space-around',
  },
  buttons: {
    width: '100%',
  },
  icon: {
    // paddingTop: theme.spacing(3),
    // paddingBottom: theme.spacing(3),
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
}));
