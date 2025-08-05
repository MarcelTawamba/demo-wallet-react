import React, { useMemo } from 'react';
import makeStyles from '@material-ui/styles/makeStyles';

import ReceivePaymentQR from 'screens/accounts/components/forms/ReceivePaymentQR';
import { getPaymentRequest } from 'util/rehive';
import Text from 'components/outputs/Text';
import { View } from 'components/layout/View';
import Spinner from 'components/outputs/Spinner';
import {
  calculateRate,
  calculateRateString,
  formatAmountString,
} from 'util/rates';
import { Button } from 'components/inputs/Button';
import { useHistory } from 'react-router-dom';
import LottieImage from 'components/outputs/LottieImage';
import { useQuery } from 'react-query';

export default function SaleQR(props) {
  const {
    currency,
    profile,
    amount,
    business,
    simpleLayout,
    item: initialItem,
    services,
    rates,
  } = props;
  const request_id = initialItem?.id;

  const classes = useStyles(props);
  const history = useHistory();

  const { data, isLoading, refetch } = useQuery(
    ['request', initialItem?.id],
    () => getPaymentRequest(request_id, true),
    { enabled: !!initialItem?.id, refetchInterval: 3000 },
  );
  const item = data ?? initialItem ?? {};
  const { id, request_amount, status } = item;

  const amountString = formatAmountString(amount, currency?.currency, true);
  const conversionAmountString = useMemo(() => {
    if (
      services?.conversion_service &&
      rates?.rates &&
      rates?.displayCurrency?.code &&
      currency?.currency?.code !== rates.displayCurrency.code
    ) {
      const convRate = calculateRate(
        currency?.currency?.code,
        rates.displayCurrency.code,
        rates.rates,
      );
      return calculateRateString({
        rates,
        currency: currency?.currency || currency,
        amount: amount,
        convRate,
      });
    }
  });

  const qrProps = {
    id,
    currency,
    business,
    formikProps: {
      values: {
        profile: profile.items,
        request_id,
        account: currency?.currency?.account,
      },
    },
    size: simpleLayout ? 320 : 350,
    showAmount: false,
    type: 'pos',
    width: 'auto',
    subtype: 'sale_pos',
    subtype_debit: 'purchase_pos',
  };

  return (
    <React.Fragment>
      {status === 'success' || status === 'overpaid' || status === 'paid' ? (
        <div className={classes.success}>
          <Text
            variant={'h5'}
            align={'center'}
            color="primary"
            id="payment_successful"
          />
          <div className={classes.icon}>
            <LottieImage name={'success'} size={250} />
          </div>
          <div style={{ width: '50%' }}>
            <Button
              noPadding
              wide
              id="new_sale"
              color="primary"
              onPress={() => history.push('/pos/sales/')}
            />
          </div>
        </div>
      ) : status === 'underpaid' ? (
        <div className={classes.success}>
          <Text variant={'h6'} align={'center'} id="payment_failed" />
          <Text
            align={'center'}
            style={{ paddingTop: 12 }}
            id="transaction_amount_too_low"
          />
          <div className={classes.icon}>
            <LottieImage name={'error'} size={250} />
          </div>
        </div>
      ) : (
        <div className={classes.qr}>
          <div className={amount ? classes.logos : classes.noAmount}>
            {Boolean(amount) && (
              <>
                <Text
                  color="primary"
                  variant={'h3'}
                  align={'center'}
                  style={{ paddingBottom: 4 }}
                  className={classes.amount}>
                  {amountString}
                </Text>
                {conversionAmountString && (
                  <Text style={{ textAlign: 'center' }}>
                    {conversionAmountString}
                  </Text>
                )}
              </>
            )}
            <View mt={1}>
              <ReceivePaymentQR {...qrProps} />
            </View>
          </div>

          {simpleLayout && (
            <Text
              align={'center'}
              variant="h5"
              className={classes.scanMessage}
              id="scan_qr_helper"
            />
          )}

          {Boolean(amount) && (
            <>
              <Spinner p={2} pt={simpleLayout ? 4 : 3} />
              <Text
                color="primary"
                variant={'h5'}
                align={'center'}
                id="awaiting_payment"
              />
            </>
          )}
        </div>
      )}
    </React.Fragment>
  );
}

const useStyles = makeStyles(theme => ({
  success: {
    margin: theme.spacing(3),
    marginBottom: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    height: '70%',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  icon: {
    // paddingTop: theme.spacing(4),
    // paddingBottom: theme.spacing(2),
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  scanMessage: {
    paddingTop: theme.spacing(3),
    // paddingBottom: theme.spacing(1),
    fontSize: 20,
  },
  amount: {
    paddingBottom: theme.spacing(2),
    paddingTop: 4,
    fontSize: 25,
    fontWeight: '600',
  },
  qr: {
    padding: theme.spacing(4),
    paddingTop: theme.spacing(1),
    width: '100%',
    // height: '100%',
    display: 'flex',
    // flex: 1,
    flexDirection: 'column',
    // justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    paddingBottom: theme.spacing(2),
  },
  logos: {
    width: '100%',
    display: 'flex',
    flexDirection: props => (props.responsive ? 'column' : 'row'),
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: theme.spacing(1),
  },
  noAmount: {
    width: '100%',
    display: 'flex',
    flexDirection: props => (props.responsive ? 'column' : 'row'),
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(1),
  },
}));
