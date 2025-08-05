import React from 'react';
import PageContent from 'components/layout/page/PageContent';
import Text from 'components/outputs/Text';
import ModalButtons from './ModalButtons';
import { View } from 'components/layout/View';

export default function InvoiceRefundDetails(props) {
  const {
    context,
    refundAmountString,
    onConfirm,
    onDismiss,
    isBalanceValid,
    isSubmitting,
  } = props;
  const { invoice } = context;
  const { request_reference, status } = invoice;

  return (
    <PageContent horizontal={5} pb={4} pt={4}>
      <Text
        variant="h6"
        paragraph
        align="center"
        id="refund_status_invoice"
        context={{ status }}
      />
      {/* <Text color="primary" paragraph align="center" bold>
        {'Invoice #' + request_reference}
      </Text> */}
      <Text component="div" paragraph align="center">
        <Text
          id="invoice_refund_details_prefix"
          context={{
            status,
            anExcessOf: status === 'overpaid' ? 'an excess of ' : '',
          }}
          inline
        />{' '}
        <Text bold color="primary" inline>
          {refundAmountString}
        </Text>{' '}
        <Text id="invoice_refund_details_postfix" inline />
      </Text>
      <View w="100%" pb={0.5}>
        <Text component="div" paragraph align="center">
          <Text id="you_can_refund_message_prefix" inline />{' '}
          <Text bold color="primary" inline>
            {refundAmountString}
          </Text>{' '}
          <Text id="you_can_refund_message_postfix" inline />
        </Text>
      </View>
      <ModalButtons
        isSubmitting={isSubmitting}
        isValid={isBalanceValid}
        onAccept={onConfirm}
        acceptLabel="confirm_refund"
        onCancel={onDismiss}
      />
      {/* <ButtonList layout="vertical" items={buttons} /> */}
    </PageContent>
  );
}
