import React, { useState, useEffect, useMemo } from 'react';
import { makeStyles } from '@material-ui/styles';
import { formatAmountString } from 'util/general';
import { useTheme as useMuiTheme } from '@material-ui/core/styles';
import { useMediaQuery } from '@material-ui/core';
import moment from 'moment';
import { View } from 'components/layout/View';
import { Button } from 'components/inputs/Button';
import { useToast } from 'components/contexts/ToastContext';
import Hover from 'components/layout/Hover';
import Skeleton from '@material-ui/lab/Skeleton';
import Text from 'components/outputs/Text';
import PageContent from 'components/layout/page/PageContent';
import Icon from 'components/outputs/NewIcon';
import ResultModal from 'components/layout/ResultModal';
import EmptyListPlaceholderImage from 'components/outputs/PlaceholderImage/empty/EmptyListPlaceholderImage';
import {
  copyLink,
  remind,
  RenderConfirm,
} from '../../../common/paymentRequests';
import { concat, difference, isEmpty, orderBy } from 'lodash';
import Image from 'components/outputs/Image';

export default function RequestPaymentActivity(props) {
  const {
    loading,
    requests,
    profile,
    rates,
    currency,
    userLabel,
    services,
    getRequests,
    fetchingMoreRequests,
    hasMore,
    setPaymentResult,
    account: accountRef,
  } = props;

  const requestsOrdered = useMemo(() => {
    if (isEmpty(requests)) return [];

    const sortedRequests = orderBy(requests, ['updated'], ['desc']);
    const initiatedRequests = sortedRequests.filter(
      item => item.status === 'initiated',
    );
    const cancelledRequests = sortedRequests.filter(
      item => item.status === 'cancelled',
    );
    const endRequests = concat(
      initiatedRequests,
      difference(requests, [...initiatedRequests, ...cancelledRequests]),
      cancelledRequests,
    );
    return endRequests;
  }, [requests]);

  const [selected, setSelected] = useState();
  const [state, setState] = useState();
  const [action, setAction] = useState();
  const [processingAction, setProcessingAction] = useState(false);
  const { showToast } = useToast();

  const user = profile?.items;

  const theme = useMuiTheme();
  const smallDevice = useMediaQuery(theme.breakpoints.down(540));

  useEffect(() => {
    setSelected(null);
  }, [currency]);

  const RequestItemSkeleton = () => {
    const classes = useStyles(props);

    return (
      <View fD={'row'} aI={'center'} jC={'space-between'} mb={1}>
        <View fD={'row'} aI={'center'} style={{ minWidth: 0 }}>
          <Skeleton variant="circle" width={38} height={38} />
          <View ml={1} style={{ minWidth: 0 }}>
            <Skeleton width={160} height={20} />
            <Skeleton width={80} height={14} />
          </View>
        </View>
        <View fD={'row'} aI={'center'} jC={'flex-end'} ml={1} flexGrow>
          <Skeleton width={75} height={45} className={classes.rect} />
        </View>
      </View>
    );
  };

  async function sendReminder(request) {
    setProcessingAction(true);

    await remind({ request, showToast });

    setProcessingAction(false);
  }

  function renderConfirmation() {
    return (
      <RenderConfirm
        {...{
          request: selected,
          currency: currency.currency,
          action,
          services,
          rates,
          user,
          accountRef,
          showToast,
          onConfirm: () => {
            setState('action');
            setProcessingAction(true);
          },
          onCancel: () => {
            setState('');
            setProcessingAction(false);
          },
          onError: ({ error }) => {
            if (action === 'pay') setPaymentResult(error);
          },
          onSuccess: async ({
            response,
            requestIdForTransaction,
            ...others
          }) => {
            if (action === 'pay')
              setPaymentResult({
                status: 'success',
                data: {
                  response,
                  requestIdForTransaction,
                  user: response.transactions?.[0]?.partner?.user,
                  amount: response.transactions?.[0]?.amount * -1,
                  ...others,
                },
              });

            await getRequests({ getReceived: action === 'pay', refresh: true });

            setProcessingAction(false);
          },
        }}
      />
    );
  }

  function renderInsufficientBalance() {
    return (
      <ResultModal
        {...{
          visible: true,
          onCancel: () => setState(''),
          title: 'insufficient_funds',
        }}>
        <Text
          id="do_not_have_sufficient_funds"
          style={{ textAlign: 'center' }}
        />
      </ResultModal>
    );
  }

  const label = request => {
    const outgoing = request?.user?.id === user?.id;

    if (['draft', 'initiated', 'underpaid', 'late'].includes(request.status))
      return outgoing ? 'remind' : 'pay';
    if (['complete', 'paid', 'overpaid'].includes(request.status))
      // return outgoing ? 'RECEIVED' : 'PAID';
      return 'paid';
    return outgoing ? 'canceled' : 'declined';
  };

  async function handleActionClick(action) {
    // setAnchorEl(null);

    switch (action) {
      // case 'REMIND':
      //   sendReminder();
      //   break;
      case 'cancel':
        setAction('cancel');
        setState('confirm');
        break;
      // case 'COPY':
      //   copyLink({ request: selected });
      //   break;
      default:
        setAction('pay');
        setState('confirm');
        break;
    }
  }

  function getLabels(state, outgoing, contact, request) {
    let firstLabel = {};
    let secondLabel = {};

    const isInvoice = Boolean(request?.metadata?.service_business);

    switch (state) {
      case 'pending':
        firstLabel.text = outgoing
          ? 'You have requested'
          : isInvoice
          ? 'You have received an invoice'
          : `${contact} has`;
        firstLabel.color = outgoing || isInvoice ? 'primary' : 'font';
        secondLabel.text = outgoing
          ? `from ${contact}`
          : isInvoice
          ? `from ${contact}`
          : 'requested from you';
        secondLabel.color = outgoing || isInvoice ? 'font' : 'primary';
        break;
      case 'paid':
        firstLabel.text = outgoing ? `${contact} has` : 'You paid';
        firstLabel.color = outgoing ? 'font' : 'primary';
        secondLabel.text = outgoing ? 'paid you' : `${contact}`;
        secondLabel.color = outgoing ? 'primary' : 'font';
        break;
      case 'cancelled':
        firstLabel.text = `Request to ${contact}`;
        firstLabel.color = 'font';
        secondLabel.text = 'cancelled';
        secondLabel.color = 'font';
        break;
      default:
        break;
    }

    return { firstLabel, secondLabel };
  }

  function renderItem(request) {
    const showCancelButton = true;
    const state = ['draft', 'initiated', 'underpaid', 'late'].includes(
      request.status,
    )
      ? 'pending'
      : ['complete', 'paid', 'overpaid', 'processing'].includes(request.status)
      ? 'paid'
      : 'cancelled';

    const outgoing = request?.user?.id === user?.id;
    const contact = userLabel(request, outgoing ? 'payer_user' : 'user');

    const { firstLabel, secondLabel } = getLabels(
      state,
      outgoing,
      contact,
      request,
    );
    const userProfile = outgoing 
      ? request?.payer_user?.profile 
      : request?.user?.profile;

    return (
      <View mb={1.5} key={request?.id}>
        <View f={1} fD={'row'} w={'100%'}>
          <View mr={1}>
            <View
              bC={'#DDD'}
              bR={100}
              h={37}
              w={37}
              aI={'center'}
              jC={'center'}
              style={{ overflow: 'hidden' }}>
              {userProfile ? (
                <Image
                  style={{ height: 37, width: 37 }}
                  src={userProfile}
                  key={userProfile}
                  resizeMode={'cover'}
                />
              ) : (
                <Text bold myColor={'#9A9A9A'} width={'unset'}>
                  {contact?.charAt(0).toUpperCase()}
                </Text>
              )}
            </View>
          </View>
          <View flexGrow={1}>
            <Text fontWeight={'500'} myColor={firstLabel.color}>
              {firstLabel.text}{' '}
              <Text
                fontWeight={'500'}
                width={'unset'}
                myColor={secondLabel.color}
                inline>
                {secondLabel.text}
              </Text>
            </Text>
            <View w={'100%'} fD={'row'} jC={'space-between'} mb={0.25}>
              <Hover
                render={hover => (
                  <Text
                    width={'unset'}
                    myColor={'#848484'}
                    style={{ fontSize: 13 }}>
                    {hover
                      ? moment(request.created).format(
                          'MMMM Do YYYY, h:mm:ss a',
                        )
                      : moment(request.created).fromNow()}
                  </Text>
                )}
              />

              <Text
                width={'unset'}
                myColor={
                  state === 'paid' && outgoing
                    ? '#24A070'
                    : state === 'paid' && !outgoing
                    ? '#CC2538'
                    : '#848484'
                }
                style={{ fontSize: 13 }}>
                {outgoing || ['pending', 'cancelled'].includes(state)
                  ? ''
                  : '-'}
                {formatAmountString(
                  request.request_amount ?? 0,
                  request.request_currency,
                  true,
                )}
              </Text>
            </View>
            {request.description && (
              <View mt={0.25}>
                <Text>{request.description}</Text>
              </View>
            )}
          </View>
        </View>
        {state === 'pending' && (
          <View fD={'row'} jC={'flex-end'} aI={'center'} w={'100%'} mt={1}>
            {showCancelButton && (
              <Button
                id="cancel"
                capitalize
                thin
                variant={'outlined'}
                color={'primary'}
                size={'small'}
                width={smallDevice ? '85px' : '100px'}
                fontSize={smallDevice ? 11 : 14}
                noPadding
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                loading={
                  selected?.id === request.id &&
                  processingAction &&
                  action === 'cancel'
                }
                onPress={() => {
                  setSelected(request);
                  handleActionClick('cancel');
                }}
              />
            )}
            <View mh={1}>
              <Button
                id={label(request)}
                capitalize
                thin
                color={'primary'}
                size={'small'}
                width={smallDevice ? '85px' : '100px'}
                fontSize={smallDevice ? 11 : 14}
                noPadding
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                loading={
                  selected?.id === request.id &&
                  processingAction &&
                  action !== 'cancel'
                }
                onPress={() => {
                  setSelected(request);
                  if (label(request) === 'remind') return sendReminder(request);
                  handleActionClick(label(request));
                }}
              />
            </View>
            <Button
              variant={'link'}
              onPress={() => copyLink({ request, showToast })}>
              <View fD={'row'} aI={'center'}>
                <View mr={0.25}>
                  <Icon icon={'link'} circled={false} color={'font'} />
                </View>
                <Text
                  style={{ fontSize: smallDevice ? 11 : 14 }}
                  id="copy_link"
                />
              </View>
            </Button>
          </View>
        )}
      </View>
    );
  }

  const insufficientBalance =
    selected && currency.available_balance < (selected.request_amount ?? 0);

  return (
    <PageContent>
      {loading ? (
        <>
          <RequestItemSkeleton />
          <RequestItemSkeleton />
          <RequestItemSkeleton />
        </>
      ) : (
        <>
          {!requests?.length ? (
            <EmptyListPlaceholderImage
              name="transaction"
              id="no_payment_requests"
            />
          ) : (
            requestsOrdered?.map(request => renderItem(request))
          )}
          {hasMore && (
            <View w={'100%'} aI={'center'}>
              <Button
                variant={'text'}
                color={'primary'}
                loading={fetchingMoreRequests}
                onPress={() => getRequests({ getReceived: false })}
                id="show_more"
                capitalize
              />
            </View>
          )}
          {selected &&
            state === 'confirm' &&
            (action === 'cancel'
              ? renderConfirmation()
              : insufficientBalance
              ? renderInsufficientBalance()
              : renderConfirmation())}
        </>
      )}
    </PageContent>
  );
}

const useStyles = makeStyles(theme => ({
  rect: {
    borderRadius: '20px',
  },
}));
