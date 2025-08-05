import React, { useRef, useState } from 'react';
import { SimpleImg } from 'react-simple-img';
import { useTheme as useMuiTheme } from '@material-ui/core/styles';
import { useMediaQuery } from '@material-ui/core';

import ReactToPrint from 'react-to-print';
import { Button } from 'components/inputs/Button';

import Layout from '../components/Layout';
import Output from 'components/outputs/Output';
import { Box } from '@material-ui/core';
import Text from 'components/outputs/Text';
import {
  formatAmountString,
  standardizeString,
  concatName,
} from 'util/general';
import OutputList from 'components/lists/OutputList';
import { renderRate } from 'util/rates';
import BitcoinTransactionList from '../components/CheckoutTransactionList';
import PageContent from 'components/layout/page/PageContent';
import PageTitle from 'components/layout/page/PageTitle';
import Status from 'components/outputs/Status';
import InvoiceList from 'components/layout/InvoiceList';
import OverpaidNotice from '../components/OverpaidNotice';
import PlaceholderImage from 'components/outputs/PlaceholderImage';
import UnderpaidNotice from '../components/UnderpaidNotice';
import RefundedNotice from '../components/RefundedNotice';

export default function ReceiptPage(props) {
  const { context } = props;
  const { invoice, business, items } = context;
  const refPrint = useRef(null);
  const [isPrinting, setPrinting] = useState(false);
  const theme = useMuiTheme();
  const matches = useMediaQuery(theme.breakpoints.down(540));

  if (!invoice) {
    return null;
  }
  const {
    available_payment_processors: processors = [],
    payment_processor_quotes: quotes,
    primary_payment_processor,
    request_currency,
    request_amount,
    request_reference,
    status,
    payer_email: email = '',
    updated,
    refunded,
    user,
  } = invoice;
  let icon = user?.profile;
  let name = concatName(user);
  if (business) {
    ({ icon, name } = business);
  }
  const isOverpaid = status === 'overpaid';
  const isUnderpaid = status === 'underpaid';

  const quote =
    quotes.find(
      item =>
        (item?.payment_processor?.unique_string_name ===
          (primary_payment_processor?.unique_string_name ??
            primary_payment_processor) &&
          item?.status.match(/paid|overpaid|received|processing/)) ||
        item.total_paid,
    ) ?? {};

  const {
    amount = request_amount,
    currency = request_currency,
    conversion_quote,
  } = quote;

  const paymentDetails = [
    {
      label: 'Payment method',
      value: standardizeString('This payment was made via your wallet'),
    },
    {
      label: 'Payment amount',
      value: formatAmountString(amount, currency, true),
      value2: conversion_quote
        ? renderRate({
            fromCurrency: currency,
            toCurrency: request_currency,
            rate: conversion_quote?.rate,
          })
        : '',
    },
  ];

  return (
    <Layout noPadding containerRef={refPrint} noLogo>
      <PageTitle
        titleVariant="h6"
        actions={matches && <Status>{refunded ? 'Refunded' : status}</Status>}>
        Payment receipt
      </PageTitle>
      <PageContent>
        <Box
          pb={3}
          display="flex"
          flexDirection="row"
          width="100%"
          justifyContent="space-between"
          alignItems="center">
          <Box display="flex" flexDirection="row" alignItems="center">
            <Box width={100}>
              {Boolean(icon) ? (
                <SimpleImg
                  height={100}
                  width={100}
                  src={icon}
                  style={{ borderRadius: 100 }}
                  imgStyle={{
                    objectFit: 'cover',
                    height: '100%',
                    width: '100%',
                  }}
                />
              ) : (
                <PlaceholderImage name="businessIcon" size={100} />
              )}
            </Box>
            <Box paddingLeft={4}>
              <Text padded variant="h4" bold>
                {name}
              </Text>
              <Text opacity={0.67}>{request_reference}</Text>
            </Box>
          </Box>
          <Box>
            {refunded && (
              <Box pb={1}>
                <Status>Refunded</Status>
              </Box>
            )}
            {!matches && <Status>{status}</Status>}
          </Box>
        </Box>
        <Box
          // pt={4}
          pb={3}
          display="flex"
          flexDirection="row"
          width="100%"
          alignItems="space-around">
          <Output
            // valueColor="primary"
            // valueBold
            label="Invoice amount"
            value={formatAmountString(request_amount, request_currency, true)}
          />
          <Output label="Paid on" value={updated} type="date" />
        </Box>

        <Output label="Billed to" value={email} />
        <Box pb={1} pt={3} width="100%">
          <Text variant="h6" color="primary">
            Payment details
          </Text>
        </Box>
        <OutputList pb={1} items={paymentDetails} />
        {isOverpaid && !refunded && <OverpaidNotice {...props} success />}
        {isUnderpaid && !refunded && <UnderpaidNotice {...props} />}
        {refunded && <RefundedNotice {...props} />}

        <BitcoinTransactionList align="left" {...props} />
        {Boolean(business) && (
          <Box pb={2} pt={3} width="100%">
            <Text variant="h6" color="primary">
              Invoice details
            </Text>
            <InvoiceList items={items} currency={request_currency} />
          </Box>
        )}
        <Box
          justifyContent="flex-end"
          width="100%"
          display={isPrinting ? 'none' : 'flex'}>
          <ReactToPrint
            trigger={() => (
              <Button
                {...{
                  variant: 'link',
                  onClick: () => {},
                  noPadding: true,
                }}>
                <Text bold color="primary">
                  Print/download PDF
                </Text>
              </Button>
            )}
            content={() => refPrint.current}
            onBeforeGetContent={() => setPrinting(true)}
            onAfterPrint={() => setPrinting(false)}
          />
        </Box>
      </PageContent>
    </Layout>
  );
}
