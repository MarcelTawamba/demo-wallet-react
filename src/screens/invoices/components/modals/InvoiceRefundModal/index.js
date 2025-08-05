import React, { useState } from 'react';
import { formatAmountString, useConversion, renderRate } from 'util/rates';
import { useSelector } from 'react-redux';
import {
  conversionRatesSelector,
  walletsSelector,
} from 'screens/accounts/redux/selectors';
import { toDivisibility, sum, standardizeString } from 'util/general';
import { createInvoiceRefund, getBusinessInvoice } from 'util/rehive';
import InvoiceRefundError from './InvoiceRefundError';
import InvoiceRefundSuccess from './InvoiceRefundSuccess';
import InvoicePaidRefundForm from './InvoicePaidRefundForm';
import InvoiceRefundDetails from './InvoiceRefundDetails';
import { useForm } from 'react-hook-form';
import Big from 'big.js';
import Fallback from 'components/error/Fallback';

function mapTotal(products, items) {
  let total = 0;

  products.map(item => {
    total = total + parseFloat(items?.[item?.index]?.price);
    return total;
  });
  return isNaN(total) ? 0 : total;
}

export default function InvoiceRefundModal(props) {
  const { context, setItem } = props;
  const { invoice, refunds } = context;

  const {
    account,
    metadata,
    payment_processor_quotes,
    status,
    refunded,
    id: invoiceId,
    request_currency,
    // payment_processor_quotes: quotes
  } = invoice;
  const quotes = payment_processor_quotes.filter(item => item.total_paid > 0);
  const quote = quotes?.[0] ?? {};

  const { amount, currency, total_paid } = quote ?? {};

  const totalRefunded = sum(refunds?.results, 'amount');
  const isUnderOverPaid = status === 'underpaid' || status === 'overpaid';

  const form = useForm({
    defaultValues: {
      type: totalRefunded ? 'partial' : 'full',
      amount: '',
      products: [],
      reason: '',
      custom: false, //!!totalRefunded,
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
    shouldUnregister: false,
  });

  const [state, setState] = useState('');

  const rates = useSelector(conversionRatesSelector);
  const wallets = useSelector(walletsSelector);

  const [isSubmitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const businessId = metadata?.service_business?.business?.id ?? '';
  const items = invoice?.metadata?.service_business?.items ?? [];
  const refundCurrency = isUnderOverPaid ? currency : request_currency;
  const wallet =
    wallets?.accounts?.[account]?.currencies?.[refundCurrency?.code];

  let { convRate, convAmount } = useConversion(
    wallet?.available_balance,
    rates,
    refundCurrency,
    currency,
  );
  if (!currency) return <Fallback hideRefresh />;

  const values = form?.watch();
  const { products, amount: formAmount, custom } = values;

  const productTotal = mapTotal(products, items);

  const refundAmount = custom
    ? toDivisibility(formAmount, currency?.divisibility?.divisibility)
    : products?.length > 0
    ? toDivisibility(Big(productTotal).times(convRate), currency?.divisibility)
    : status === 'overpaid'
    ? refunded
      ? amount
      : total_paid - amount
    : total_paid;

  const refundAmountString = formatAmountString(refundAmount, currency, true);

  const isBalanceValid =
    refundAmount &&
    // totalRefunded + refundAmount <= total_paid &&
    refundAmount <=
      (refundCurrency?.code !== currency?.code
        ? toDivisibility(convAmount, currency?.divisibility)
        : wallet?.available_balance) &&
    !error;

  async function handleConfirm() {
    setSubmitting(true);
    const { reason } = values;
    const data = {
      currency: currency?.code,
      amount: refundAmount,
      type: 'native',
      reason: reason ? reason : standardizeString(status),
    };
    const resp = await createInvoiceRefund(businessId, invoiceId, data);
    if (resp.status === 'success') {
      // showToast({ text: 'Invoice successfully refunded' });
      const invoice = await getBusinessInvoice(businessId, invoiceId);
      if (invoice.status === 'success') {
        setItem(invoice?.data);
        setState('success');
      } else {
        setState('error');
      }
      // setModal('');
    } else {
      if (resp.data?.[0].includes('exceeds available balance'))
        setError('Insufficient balance');
      else setError(resp.message);
      setState('error');
    }

    setSubmitting(false);
  }

  const modalProps = {
    ...props,
    form,
    onConfirm: handleConfirm,
    quote,
    refundAmount,
    refundAmountString,
    values,
    totalRefunded,
    isBalanceValid,
    isSubmitting,
  };
  if (state === 'error') {
    return (
      <InvoiceRefundError {...modalProps} error={error} setState={setState} />
    );
  }
  if (state === 'success') {
    return <InvoiceRefundSuccess {...modalProps} setState={setState} />;
  }
  if (status === 'paid' || (status === 'overpaid' && refunded)) {
    return <InvoicePaidRefundForm {...modalProps} setState={setState} />;
  }

  return <InvoiceRefundDetails {...modalProps} setState={setState} />;
}
