import React from 'react';
import Text from 'components/outputs/Text';
import ResultPage from 'components/layout/page/ResultPage';

export default function InvoiceRefundError(props) {
  const { context, setState, refundAmountString, setModal, error } = props;
  const { invoice } = context;
  const { payer_email, payer_mobile } = invoice;
  const recipient = payer_email ? payer_email : payer_mobile;

  const text = (
    <Text align="center" component="div" paragraph>
      <Text id="you_failed_refunding_prefix" inline />{' '}
      <Text bold color="primary" inline>
        {refundAmountString}
      </Text>{' '}
      <Text id="you_failed_refunding_prefix" inline />{' '}
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
      result={{ status: 'failed', error }}
      setState={setState}
    />
  );
}
