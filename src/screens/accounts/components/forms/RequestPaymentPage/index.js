import React, { useState, useEffect } from 'react';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import { makeStyles } from '@material-ui/core/styles';
import {
  getPaymentRequests,
  getReceivedPaymentRequests,
  getNextPaymentRequests,
} from 'util/rehive';
import { copyToClipboard } from 'util/general';
import { useToast } from 'components/contexts/ToastContext';
import { calculateRate } from 'util/rates';
import PageTitle from 'components/layout/page/PageTitle';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import SwipeableViews from 'react-swipeable-views';
import RequestPaymentForm from './RequestPaymentForm';
import RequestPaymentActivity from './RequestPaymentActivity';
import SuccessPage from 'components/layout/page/SuccessPageNew';
import moment from 'moment';
import Icon from 'components/outputs/NewIcon';
import FailedPage from 'components/layout/page/FailedPageNew';
import { useTranslation } from 'react-i18next';
import PaymentRequestPending from './PaymentRequestPending';
import PageContent from 'components/layout/page/PageContent';

export default function RequestPaymentPage(props) {
  const { currency, services, rates, handleStateChange, tier } = props;

  const { t } = useTranslation(['common']);
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [fetchingMoreRequests, setFetchingMoreRequests] = useState(false);
  const [requests, setRequests] = useState([]); //Requests made BY the user
  const [nextRequests, setNextRequests] = useState();
  const [receivedRequests, setReceivedRequests] = useState([]); //Requests made TO the user
  const [nextReceivedRequests, setNextReceivedRequests] = useState();
  const [requestResult, setRequestResult] = useState();
  const [paymentResult, setPaymentResult] = useState();
  const classes = useStyles();
  const { showToast } = useToast();
  const [viewState, setViewState] = useState(''); // '' -> default, 'result' -> action result page

  useEffect(() => {
    setRequests([]);
    setRequestResult(null);
    setPaymentResult(null);
    setViewState('');
    getRequests({ getReceived: true, refresh: true });
  }, [currency]);

  const handleSetRequestResult = payload => {
    setRequestResult(payload);
    setViewState('result');
  };

  const handleSetPaymentResult = payload => {
    setPaymentResult(payload);
    setViewState('result');
  };

  let conversionRate = 1;

  const hasConversion =
    services?.conversion_service &&
    rates.rates &&
    rates.displayCurrency?.code &&
    rates.displayCurrency?.code !== currency?.currency?.code;

  if (hasConversion) {
    conversionRate = calculateRate(
      currency?.currency?.code,
      rates.displayCurrency?.code,
      rates.rates,
    );
  }

  async function getRequests({ getReceived, refresh }) {
    setLoading(refresh || !Boolean(nextRequests || nextReceivedRequests));
    setFetchingMoreRequests(
      !refresh && Boolean(nextRequests || nextReceivedRequests),
    );

    const resp =
      nextRequests && !refresh
        ? await getNextPaymentRequests(nextRequests)
        : await getPaymentRequests({
            request_currency: currency?.currency?.code,
          });

    setRequests([...(refresh ? [] : requests), ...(resp?.data?.results ?? [])]);
    setNextRequests(resp?.data?.next);

    if (getReceived) {
      const resp =
        nextReceivedRequests && !refresh
          ? await getNextPaymentRequests(nextReceivedRequests)
          : await getReceivedPaymentRequests({
              currency: currency?.currency?.code,
            });

      setReceivedRequests([
        ...(refresh ? [] : receivedRequests),
        ...(resp?.data?.results ?? []),
      ]);
      setNextReceivedRequests(resp?.data?.next);
    }

    setLoading(false);
    setFetchingMoreRequests(false);
  }

  function renderResult() {
    const result = requestResult ?? paymentResult;
    console.log('result', result);

    const secondaryAction = null;

    if (result?.status === 'success' && result?.data?.requestIdForTransaction) {
      return (
        <PageContent>
          <PaymentRequestPending setResult={setPaymentResult} result={result} />
        </PageContent>
      );
    } else if (result.status === 'success') {
      let items = [
        {
          id: 'amount',
          labelId: requestResult ? 'requesting' : 'paid',
          value: result.data.amountValueString,
          value2: result.data.amountValueConvString,
        },
        {
          id: 'recipient',
          labelId: requestResult ? 'from' : 'to',
          value: result.data.user.first_name,
          value2: result.data.user.email || result.data.user.mobile || '',
        },
      ];
      if (result.data.description) {
        items.push({
          id: 'note',
          labelId: 'for',
          value: result.data.description,
        });
      }

      // Custom button actions for request vs payment context
      const customButtons = requestResult ? [
        {
          id: 'view_requests',
          onPress: () => {
            setTab(0); // Go to Activity tab
            setViewState('');
            setRequestResult(null);
            setPaymentResult(null);
          },
          variant: 'outlined',
          wide: true,
          capitalize: true,
        },
        {
          id: 'new_request',
          onPress: () => {
            setTab(1); // Go to New Request tab
            setViewState('');
            setRequestResult(null);
            setPaymentResult(null);
          },
          wide: true,
          capitalize: true,
        },
      ] : [
        {
          id: 'view_transaction',
          onPress: () => {
            handleStateChange({ state: '' }); // redirects to transactions list
            setViewState('');
            setRequestResult(null);
            setPaymentResult(null);
          },
          variant: 'outlined',
          wide: true,
          capitalize: true,
        },
        {
          id: 'new_transaction',
          onPress: () => {
            setTab(requestResult ? 1 : 0);
            setViewState('');
            setRequestResult(null);
            setPaymentResult(null);
          },
          wide: true,
          capitalize: true,
        },
      ];

      // Add request link to itemsExtra if this is a request result
      const itemsExtra = requestResult && result.data?.redirect_url ? [
        {
          id: 'request_link',
          labelId: 'request_link',
          value: result.data.redirect_url,
          textTransform: 'none',
          copyable: true
        }
      ] : [];

      return (
        <SuccessPage
          pageStyle={{ marginTop: 32 }}
          result={result}
          customButtons={customButtons}
          formikProps={props}
          items={items}
          itemsExtra={itemsExtra}
          performedDate={moment().format('h.mm A, D MMMM YYYY')}
          secondaryAction={secondaryAction}
        />
      );
    } else {
      return (
        <FailedPage
          failedMessageId="request_failed"
          pageStyle={{ marginTop: 32 }}
          result={result}
          handleButtonPress={() => {
            setTab(requestResult ? 1 : 0);
            setViewState('');
            setRequestResult(null);
            setPaymentResult(null);
          }}
          formikProps={props}
          items={[]}
          itemsExtra={[]}
          performedDate={moment().format('h.mm A, D MMMM YYYY')}
        />
      );
    }
  }

  const userLabel = (request, user = 'user', contactOnly = false) => {
    const userObj = request[user];

    if (!userObj) return request?.payer_email ?? request.payer_mobile_number;

    return !contactOnly && (userObj?.first_name || userObj?.last_name)
      ? `${userObj?.first_name} ${userObj?.last_name ?? ''}`
      : userObj?.email ?? userObj?.mobile_number;
  };


  return (
    <View>
      {viewState === 'result' && renderResult()}
      {viewState === '' && (
        <>
          <PageTitle titleId={'request_payment'} />
          <Tabs
            value={tab}
            onChange={(e, value) => setTab(value)}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            className={classes.root}
            centered>
            {['activity', 'new_request'].map(labelId => (
              <Tab
                key={labelId}
                label={t(labelId)}
                className={classes.labelIcon}
              />
            ))}
          </Tabs>
          <View pt={1} w={'100%'}>
            <SwipeableViews
              axis={'x'}
              index={tab}
              style={{ width: '100%' }}
              onChangeIndex={value => setTab(value)}>
              <RequestPaymentActivity
                {...{
                  loading: loading || (tab !== 0 && requests?.length),
                  hasMore: Boolean(nextRequests),
                  fetchingMoreRequests,
                  requests,
                  userLabel,
                  receivedRequests,
                  getRequests,
                  setPaymentResult: handleSetPaymentResult,
                  ...props,
                }}
              />
              <RequestPaymentForm
                {...{
                  getRequests,
                  setRequestResult: handleSetRequestResult,
                  hasConversion,
                  conversionRate,
                  ...props,
                }}
              />
            </SwipeableViews>
          </View>
        </>
      )}
    </View>
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  labelIcon: {
    textTransform: 'initial',
    fontSize: 16,
  },
}));
