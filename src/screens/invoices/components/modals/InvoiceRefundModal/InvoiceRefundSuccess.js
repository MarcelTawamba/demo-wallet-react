import React from 'react';
import Text from 'components/outputs/Text';
import ResultPage from 'components/layout/page/ResultPage';

export default function InvoiceRefundSuccess(props) {
  const { context, setState, refundAmountString, setModal } = props;
  const { invoice } = context;
  const { payer_email, payer_mobile } = invoice;
  const recipient = payer_email ? payer_email : payer_mobile;

  const text = (
    <Text align="center" component="div">
      <Text id="you_refunded_prefix" inline />{' '}
      <Text bold color="primary" inline>
        {refundAmountString}
      </Text>{' '}
      <Text id="you_refunded_postfix" inline />{' '}
      <Text bold color="primary" inline>
        {recipient}
      </Text>
    </Text>
  );

  return (
    <ResultPage
      nextLabel="Close"
      onNext={() => setModal('')}
      text={text}
      result={{ status: 'success' }}
      setState={setState}
    />
  );
}
