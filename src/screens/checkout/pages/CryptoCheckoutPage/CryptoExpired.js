import React, { useState } from 'react';

import PageContent from 'components/layout/page/PageContent';
import { Box } from '@material-ui/core';
import ErrorOutput from 'components/outputs/Error';
import PageButtons from 'components/layout/page/PageButtons';
import { choosePaymentRequestMethod } from 'screens/checkout/util/rehive';
import CryptoExpiredProcessing from './CryptoExpiredProcessing';

export default function CryptoExpired(props) {
  const { send, onBack, context, history } = props;
  const { invoice, quote } = context;

  const [isSubmitting, setSubmitting] = useState(false);

  const { id, payer_email = '', primary_payment_processor } = invoice;

  if (quote?.status === 'processing') {
    return <CryptoExpiredProcessing {...props} />;
  }

  async function handleNewQuote() {
    setSubmitting(true);
    const data = {
      payer_email,
      payment_processor_currency:
        primary_payment_processor?.currencies?.[0] ?? '',
      primary_payment_processor:
        primary_payment_processor?.unique_string_name ?? '',
    };

    const resp = await choosePaymentRequestMethod(id, data);
    if (resp.status === 'success') {
      send({
        type: 'NEW',
        payload: { ...context, invoice: resp.data },
      });
    } else {
      console.log('handleSubmit error -> resp', resp);
      // set error
    }

    setSubmitting(false);
  }

  const invoiceExpired =
    invoice?.payment_processor_quotes?.length > 0 &&
    invoice.payment_processor_quotes.findIndex(
      quote => quote.status !== 'expired',
    ) === -1;
  let buttons = invoiceExpired
    ? [
        {
          label: 'RELOAD',
          onPress: () => window.location.reload(),
        },
      ]
    : [
        {
          label: 'CREATE NEW QUOTE',
          onPress: handleNewQuote,
          loading: isSubmitting,
          disabled: isSubmitting,
        },
        {
          variant: 'text',
          label: 'Back',
          onPress: onBack,
        },
      ];
  return (
    <>
      <PageContent>
        <Box pt={2} p={0.5}>
          <ErrorOutput>
            {invoiceExpired
              ? 'This invoice has expired, please reload the page'
              : 'Unable to find quote or quote has expired'}
          </ErrorOutput>
        </Box>
      </PageContent>
      <PageButtons layout="vertical" items={buttons} />
    </>
  );
}
