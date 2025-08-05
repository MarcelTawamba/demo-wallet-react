import React, { useEffect, useState } from 'react';
import { get } from 'lodash';
import { View } from 'components/layout/View';
import { Button } from 'components/inputs/Button';
import OutputList from 'components/lists/OutputList';
import { formatAmountString, renderRate } from 'util/rates';
import Text from 'components/outputs/Text';
import makeStyles from '@material-ui/styles/makeStyles';
import TransactionListDetails from './TransactionListCryptoDetails';
import { getCampaign, getTransactionMessages } from 'util/rehive';
import Spinner from 'components/outputs/Spinner';
import ErrorOutput from 'components/outputs/Error';
import Status from 'components/outputs/Status';
import CampaignCard from 'screens/rewards/components/CampaignCard';
import { useHistory } from 'react-router-dom';
import { useToast } from 'components/contexts/ToastContext';
import QuickActionConfig from '../../config/quickActions';
import { useTheme } from '@material-ui/core';
import { useQuery } from 'react-query';
import moment from 'moment';
import Icon from 'components/outputs/Icon';
import Hover from 'components/layout/Hover';
import { formatTime } from 'util/general';

const config = {
  send: {
    amountLabel: 'Amount sent',
    feeLabel: 'Service fee',
    totalLabel: 'Total transaction amount',
  },
  withdraw: {
    amountLabel: 'Withdrawal amount',
    feeLabel: 'Withdrawal fee',
    totalLabel: 'Total transaction amount',
  },
  buy: {
    amountLabel: 'Bought',
    feeLabel: 'Buy fee',
    totalLabel: 'Total transaction amount',
  },
  sell: {
    amountLabel: 'Sold',
    feeLabel: 'Sell fee',
    totalLabel: 'Total transaction amount',
  },
  default: {
    amountLabel: 'Amount',
    feeLabel: 'Service fee',
    totalLabel: 'Total amount',
  },
};

const messageColorConfig = {
  info: { icon: 'infoOutline', color: '#4C83FF' }, // object key is same as API] message data `level` value
  warning: { icon: 'warningOutline', color: '#F0975C' },
  error: { icon: 'errorOutline', color: '#FF4C6F' },
};

function TransactionListItemDetail(props) {
  const { open, item, rates, convRate, currency, services, profile, refresh } =
    props;

  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loadingAction, setLoadingAction] = useState();
  const [actionContentVisible, setActionContentVisible] = useState();
  const history = useHistory();
  const { showToast } = useToast();
  const theme = useTheme();
  const isRtl = theme.direction === 'rtl';

  const mainTransaction = item; // = getMainTransaction(item);
  const {
    id,
    amount,
    total_amount,
    fee,
    balance,
    metadata,
    note,
    subtype,
    description,
    status,
    partner,
    tx_type,
  } = mainTransaction;
  // if (open) console.log('mainTransaction', mainTransaction);
  const campaignId = get(metadata, ['service_reward', 'campaign_id']);
  const hasReward = Boolean(campaignId);
  const isRequest = subtype === 'request';
  const order = get(metadata, ['service_product', 'order']);
  const hasOrder = Boolean(order);
  const hideEmail = Boolean(
    metadata && (metadata.service_reward || metadata.service_crypto),
  );

  const { data: transactionMessages } = useQuery(
    ['transaction', 'messages', id],
    () => getTransactionMessages(id),
    {
      enabled: open && status !== 'Pending',
      staleTime: 300 * 1000,
    },
  );

  useEffect(() => {
    async function fetchData() {
      const resp = await getCampaign(campaignId);
      if (resp.status === 'success') {
        setData(resp.data);
      } else {
        setError(resp.message);
      }
      setLoading(false);
    }
    if (open && hasReward) {
      fetchData();
    }
  }, [hasReward, campaignId, open]);

  if (!open) {
    return null;
  }

  const horizontal = true;

  let items = [];

  let labelConfig = config[subtype];
  if (!labelConfig) {
    labelConfig = config.default;
  }

  const amountLabel = labelConfig.amountLabel;
  let amountValue = amount / 10 ** currency.divisibility;
  let amountString = '';
  let amountConvString = '';
  amountString = formatAmountString(amountValue, currency);
  if (convRate && convRate !== 1) {
    amountConvString =
      '~' + formatAmountString(amountValue * convRate, rates.displayCurrency);
  }
  items.push({
    label: amountLabel,
    value: amountString,
    value2: amountConvString,
    horizontal,
  });

  if (fee) {
    const feeLabel = labelConfig.feeLabel;
    let feeValue = fee / 10 ** currency.divisibility;
    let feeString = '';
    let feeConvString = '';
    feeString = formatAmountString(feeValue, currency);
    if (convRate && convRate !== 1) {
      feeConvString =
        '~' + formatAmountString(feeValue * convRate, rates.displayCurrency);
    }
    items.push({
      id: 'fee_' + id,
      label: feeLabel,
      value: feeString,
      value2: feeConvString,
      horizontal,
    });
  }

  if (amount !== total_amount) {
    const totalLabel = labelConfig.totalLabel;
    let totalValue = total_amount / 10 ** currency.divisibility;
    let totalString = '';
    let totalConvString = '';
    totalString = formatAmountString(totalValue, currency);
    if (convRate && convRate !== 1) {
      totalConvString =
        '~' + formatAmountString(totalValue * convRate, rates.displayCurrency);
    }
    items.push({
      id: 'total_' + id,
      label: totalLabel,
      value: totalString,
      value2: totalConvString,
      horizontal,
    });
  }
  const itemsExtra = [];

  if (subtype && subtype.match(/buy|sell/)) {
    const conversion = get(metadata, ['service_conversion', 'conversion']);
    if (conversion && conversion.rate) {
      const rateString = renderRate({
        toCurrency: conversion.to_currency,
        fromCurrency: conversion.from_currency,
        rate: conversion.rate,
      });
      itemsExtra.push({
        id: 'rate',
        label: 'Rate',
        value: rateString,
        horizontal,
      });
    }
  }

  if (balance) {
    let balanceString = '';
    let balanceValue = balance / 10 ** currency.divisibility;
    let balanceConvString = '';
    balanceString = formatAmountString(balanceValue, currency);
    if (convRate && convRate !== 1) {
      balanceConvString =
        '~' +
        formatAmountString(balanceValue * convRate, rates.displayCurrency);
    }
    itemsExtra.push({
      id: 'account_balance',
      label: 'Account balance',
      value: balanceString,
      value2: balanceConvString,
      horizontal,
    });
  }

  let itemsExtra2 = [];
  if (note) {
    itemsExtra2.push({
      id: 'note',
      label: 'Note',
      value: note,
      horizontal,
    });
  }

  if (partner && partner.user) {
    let partnerUser;
    if (subtype === 'send_email') {
      partnerUser =
        metadata?.service_payment_requests?.request?.requestor_identifier;
    } else if (
      subtype === 'receive_email' ||
      subtype === 'receive_payment'
    ) {
      partnerUser =
        metadata?.service_payment_requests?.request?.payer_identifier;
    }
    if (!partnerUser) partnerUser = partner?.user ?? {};

    const { email, mobile, first_name, last_name } = partnerUser;

    if (email && !hideEmail) {
      itemsExtra2.push({
        id: 'email',
        label: 'Email',
        value: email,
        horizontal,
      });
    }
    if (mobile) {
      itemsExtra2.push({
        id: 'mobile',
        label: 'Mobile',
        value: mobile,
        horizontal,
      });
    }
    if (first_name || last_name) {
      itemsExtra2.push({
        id: 'name',
        label: 'Name',
        value: first_name + (last_name ? ' ' + last_name : ''),
        horizontal,
      });
    }
  }
  if (metadata?.service_payment_requests?.request_id) {
    itemsExtra2.push({
      id: subtype === '"sale_online"' ? 'invoice_id' : 'request_id',
      label: subtype === '"sale_online"' ? 'Invoice ID' : 'Request ID',
      value: metadata?.service_payment_requests?.request_id,
      horizontal,
      // newTab:true, localLink: ''
    });
  }
  if (metadata?.send_context) {
    Object.keys(metadata?.send_context).forEach(itemKey => {
      itemsExtra2.push({
        id: itemKey,
        label: metadata?.send_context[itemKey]?.label ?? itemKey,
        value: metadata?.send_context[itemKey]?.value,
        horizontal,
      });
    });
  }

  function renderQuickActions() {
    let actions = get(
      QuickActionConfig({
        request: item,
        currency,
        setLoading: setLoadingAction,
        setActionContentVisible,
        services,
        rates,
        user: profile?.items ?? {},
        accountRef: profile?.items?.account,
        getTransactions: refresh,
        showToast,
      }),
      [subtype, 'actions'],
    );

    if (!actions) return null;

    try {
      actions = [...(actions?.[tx_type] ?? {}), ...(actions?.['both'] ?? {})];
    } catch (e) {}

    if (!actions.length) return null;

    return (
      <View
        fD={'row'}
        aI={'center'}
        mb={1}
        mt={-0.5}
        style={{ flexWrap: 'wrap' }}>
        {actions.map((x, actionIndex) => (
          <View mr={1} key={actionIndex}>
            <Button
              variant={'outlined'}
              label={x.label}
              color={'primary'}
              size={'small'}
              fontSize={'0.8rem'}
              wrapperStyle={{ minWidth: '100px' }}
              width={'100%'}
              noPadding
              thin
              onPress={x.onPress}
              disabled={Boolean(loadingAction)}
              loading={x.id && loadingAction === x.id}
            />
            {x.renderedOutput &&
              x.renderedOutput({ visible: actionContentVisible === x.id })}
          </View>
        ))}
      </View>
    );
  }

  return (
    <View w={'100%'} pl={isRtl ? 0.5 : 3.5} pr={isRtl ? 3.5 : 0.5}>
      {renderQuickActions()}
      {isRequest && description && (
        <View fD={'row'} w={'100%'} jC={'space-between'} aI={'center'} mb={1}>
          <View fD={'column'}>
            <Text id="note" s={12} myColor={'grey4'} />
            <Text myColor={'grey4'}>{description}</Text>
          </View>
        </View>
      )}
      <View
        fD={'row'}
        w={'100%'}
        jC={'space-between'}
        aI={'center'}
        pb={1}
        mb={1}
        className={classes.transactionID}>
        <View fD={'column'}>
          <Text id="transaction_id" s={12} myColor={'grey4'} />
          <Text myColor={'grey4'}>{id}</Text>
        </View>
        <Status>{status}</Status>
      </View>
      {hasReward &&
        (loading ? (
          <Spinner />
        ) : error ? (
          <ErrorOutput>{error}</ErrorOutput>
        ) : (
          <div
            className={classes.card}
            onClick={() =>
              history.push(
                '/rewards/history/?id=' +
                  get(metadata, ['service_reward', 'reward_id']),
              )
            }>
            <CampaignCard item={data} returnContent />
          </div>
        ))}
      {hasOrder && (
        <div className={classes.card2}>
          <Text id="order_id_orderId" context={{ orderId: order?.id }} />
          <div className={classes.orderItems}>
            {order?.items?.length > 0 &&
              order.items.map(item => (
                <Text>
                  {isRtl
                    ? `${item.name} x ${item.quantity}`
                    : `${item.quantity} x ${item.name}`}
                </Text>
              ))}
          </div>
        </div>
      )}
      <TransactionListDetails item={mainTransaction} />
      <OutputList items={items} outputProps={{ align: 'right' }} />
      {itemsExtra.length > 0 ? (
        <div className={classes.itemsExtra}>
          <OutputList items={itemsExtra} outputProps={{ align: 'right' }} />
        </div>
      ) : null}
      {itemsExtra2.length > 0 ? (
        <div className={classes.itemsExtra}>
          <OutputList items={itemsExtra2} outputProps={{ align: 'right' }} />
        </div>
      ) : null}
      {transactionMessages?.data?.results?.length > 0 > 0 ? (
        <div style={{ marginTop: 8, width: '100%' }}>
          <Text bold id="messages" />
          {transactionMessages.data.results.map(messageItem => (
            <View key={messageItem.id} fD="row" mv={1}>
              <Text>
                <Hover
                  render={hover => (
                    <Text variant={'subtitle2'} opacity={0.87}>
                      {hover
                        ? formatTime(
                            messageItem.created,
                            'MMMM Do YYYY, h:mm:ss a',
                            profile,
                          )
                        : moment(messageItem.created).fromNow()}
                    </Text>
                  )}
                />
              </Text>
              <Text style={{ display: 'flex', alignItems: 'center' }}>
                <Icon
                  inverted
                  icon={
                    messageColorConfig?.[messageItem?.level]?.icon ?? 'info'
                  }
                  iconColor={
                    messageColorConfig?.[messageItem?.level]?.color ?? 'info'
                  }
                  size={16}
                />
                <Text style={{ marginLeft: 8 }} id={messageItem.level} />
              </Text>
              <Text>{messageItem.message}</Text>
            </View>
          ))}
        </div>
      ) : null}
    </View>
  );
}

export default TransactionListItemDetail;

const useStyles = makeStyles(theme => ({
  itemsExtra: {
    borderTop: '1px solid lightgray',
    // paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1),
    marginTop: theme.spacing(1),
    width: '100%',
  },
  card: {
    // paddingLeft: theme.spacing(1.5),
    marginBottom: theme.spacing(1),
    width: '100%',
    borderRadius: 15,

    cursor: 'pointer',
    overflow: 'hidden',
  },
  orderItems: {
    paddingTop: theme.spacing(1),
  },
  card2: {
    padding: theme.spacing(1),
    marginBottom: theme.spacing(1),
    width: '100%',
    border: '1px solid #EFEFEF',
    borderRadius: 15,
    overflow: 'hidden',
  },
  padded: {
    paddingTop: theme.spacing(0.5),
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  column: {
    paddingLeft: theme.spacing(1),
  },
  chip: {
    color: '#fafafa',
    fontSize: '14px',
    fontWeight: 500,
  },
  transactionID: {
    borderBottom: '1px solid lightgray',
  },
}));
