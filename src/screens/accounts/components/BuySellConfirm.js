import React, { useState, useEffect } from 'react';
import { pick } from 'lodash';
import { View } from 'components/layout/View';
import { AmountDisplayCard } from 'components/cards';
import {
  standardizeString,
  formatAmountString,
  formatDecimals,
} from 'util/general';
import { updateConversion } from 'util/rehive';
import moment from 'moment';
import Text from 'components/outputs/Text';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import PageButtons from 'components/layout/page/PageButtons';
import { getCountryFormattedDate } from 'util/date';

const useStyles = makeStyles(theme => ({
  pageWrapperPadding: {
    padding: '0 40px !important',
    [theme.breakpoints.down('md')]: {
      padding: '0 20px !important',
    },
  },
  timerWrapper: {
    position: 'absolute',
    right: 0,
    margin: '36px 32px 0 0 !important',
    [theme.breakpoints.down('md')]: {
      margin: '36px 22px 0 0 !important',
    },
  },
  timerTitle: {
    color: theme.palette.primary.main,
    textTransform: 'uppercase',
    fontSize: 16,
    textAlign: 'right',
    width: 'initial !important',
  },
}));

export default function BuySellConfirm(props) {
  const {
    conversionQuote,
    currency,
    buySellCurrency,
    rates,
    onConfirm,
    onCancel,
    selling,
    profile,
    confirmMessageId,
    confirmMessageStyle,
  } = props;

  const classes = useStyles(props);
  const [loading, setLoading] = useState(false);
  const [expiryTimeout, setExpiryTimeout] = useState();

  const [expiryInterval, setExpiryInterval] = useState();

  useEffect(() => {
    setExpiryInterval(
      setInterval(
        () =>
          setExpiryTimeout(
            moment.duration(moment(conversionQuote?.expires).diff(moment())),
          ),
        1000,
      ),
    );

    return () => {
      clearInterval(expiryInterval);
      setExpiryInterval(null);
      setExpiryTimeout(null);
    };
  }, [conversionQuote]);

  const expired = moment(conversionQuote?.expires) < moment();

  function handleConfirm() {
    setLoading(true);
    updateConversion(conversionQuote?.id, 'complete')
      .then(resp => onConfirm(resp))
      .catch(() => setLoading(false));
  }

  function mapOutput({ key, value }) {
    switch (key) {
      case 'created':
        // return { key: 'date', value: moment(value).format('DD-MM-YYYY') };
        return {
          key: 'date',
          value: getCountryFormattedDate(
            value,
            profile?.items?.nationality,
            true,
          ),
        };
      case 'rate':
        return {
          key,
          value: `1 ${currency?.currency?.code} for ${formatDecimals(
            selling ? value : 1 / value,
            buySellCurrency?.currency?.divisibility,
          )} ${buySellCurrency?.currency?.code}`,
        };
      case 'to_amount':
        return {
          key: selling ? 'base_cost' : 'buying',
          value: formatAmountString(
            value,
            selling ? buySellCurrency?.currency : currency?.currency,
            true,
          ),
        };
      case 'to_fee':
        return {
          key: 'service_fee',
          value: formatAmountString(
            value,
            selling ? buySellCurrency?.currency : currency?.currency,
            true,
          ),
        };
      case 'from_amount':
        return {
          key: selling ? 'selling' : 'base_cost',
          value: formatAmountString(
            value,
            selling ? currency?.currency : buySellCurrency?.currency,
            true,
          ),
        };
      case 'from_fee':
        return {
          key: 'service_fee',
          value: formatAmountString(
            value,
            selling ? currency?.currency : buySellCurrency?.currency,
            true,
          ),
        };
      case 'from_total_amount':
      case 'to_total_amount':
        return {
          key: 'total_cost',
          value: formatAmountString(value, buySellCurrency?.currency, true),
        };
      default:
        return { key: standardizeString(key), value };
    }
  }

  const outputFields = Object.keys(
    pick(conversionQuote, [
      'created',
      'rate',
      selling ? 'from_amount' : 'to_amount',
      selling ? 'from_fee' : 'to_fee',
      selling ? 'to_amount' : 'from_amount',
      selling ? 'to_fee' : 'from_fee',
      selling ? 'to_total_amount' : 'from_total_amount',
    ]),
  ).map(key => {
    return mapOutput({ key, value: conversionQuote[key] });
  });

  return (
    <>
      <View className={classes.timerWrapper}>
        {expiryTimeout && expired ? (
          <Text id="expired" bold={true} c={'red'} uppercase />
        ) : (
          <Text variant="h5" className={classes.timerTitle}>
            {moment.utc(expiryTimeout?.as('milliseconds'))?.format('mm:ss')}
          </Text>
        )}
      </View>
      <View
        w={'100%'}
        ph={2}
        grid
        gap={1.5}
        mt={1}
        className={classes.pageWrapperPadding}>
        <Grid container spacing={4}>
          <Grid item md={6} xs={12}>
            <View grid gap={0.5}>
              <Text
                id={selling ? 'selling' : 'buying'}
                c={'primary'}
                bold
              />
              <AmountDisplayCard
                {...{
                  item: currency,
                  amount:
                    conversionQuote?.[selling ? 'from_amount' : 'to_amount'],
                  rates,
                }}
              />
            </View>
          </Grid>
          <Grid item md={6} xs={12}>
            <View grid gap={0.5} style={{ marginBottom: 12 }}>
              <Text
                id={selling ? 'receiving' : 'spending'}
                c={'primary'}
                bold
              />
              <AmountDisplayCard
                {...{
                  item: buySellCurrency,
                  amount:
                    conversionQuote?.[
                      [selling ? 'to_total_amount' : 'from_total_amount']
                    ],
                  rates,
                }}
              />
            </View>
          </Grid>
        </Grid>

        {confirmMessageId && (
          <View mt={1} aI={'center'}>
            <Text
              id={confirmMessageId}
              style={{ ...confirmMessageStyle, textAlign: 'center' }}
              myColor={'primary'}
            />
          </View>
        )}
        <View
          grid
          gap={0.75}
          w={'100%'}
          p={1}
          ph={1.5}
          bR={15}
          border
          borderColor={'grey3'}>
          <Text
            id="details"
            variant="h6"
            style={{ marginBottom: 8 }}
          />
          {outputFields?.map(item => (
            <View fD={'row'} jC={'space-between'} aI={'center'}>
              <Text id={item?.key} s={13} />
              <Text s={13} tA={'right'} c={'primary'}>
                {item?.value}
              </Text>
            </View>
          ))}
        </View>
        <PageButtons
          items={[
            {
              id: 'cancel',
              onPress: onCancel,
              variant: 'outlined',
              wide: true,
              capitalize: true,
            },
            {
              id: 'confirm',
              type: 'submit',
              onPress: handleConfirm,
              disabled: loading || expired,
              loading: loading,
              wide: true,
              capitalize: true,
            },
          ]}
        />
      </View>
    </>
  );
}
