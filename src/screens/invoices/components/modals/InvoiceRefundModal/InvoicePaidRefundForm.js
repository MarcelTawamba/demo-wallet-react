import React from 'react';
import PageContent from 'components/layout/page/PageContent';
import Text from 'components/outputs/Text';
import { View } from 'components/layout/View';
// import RadioSelector from 'components/inputs/RadioSelectorNew';
// import { Button } from 'components/inputs/Button';
// import RefundItemListInput from '../../inputs/RefundItemList';
import ModalButtons from './ModalButtons';
import Input from 'components/inputs';

export default function InvoicePaidRefundForm(props) {
  const {
    onDismiss,
    context,
    onConfirm,
    form,
    values,
    isBalanceValid,
    isSubmitting,
    totalRefunded,
    refundAmountString,
  } = props;
  // const { invoice } = context;
  // const items = invoice?.metadata?.service_business?.items ?? [];
  // const currency = invoice?.request_currency;
  const { setValue, register, formState, control } = form;

  // const { type, custom, products } = values;
  const { isValid } = formState;

  function handleSubmit() {
    onConfirm(values);
  }

  let refundOptions = [];

  if (!totalRefunded) {
    refundOptions.push({ value: 'full', label: 'Full' });
  }
  refundOptions.push({ value: 'partial', label: 'Partial' });

  return (
    <PageContent horizontal={5} pb={4} pt={4}>
      <Text variant="h6" paragraph align="center" id="refundInvoice" />
      {/* <View fD="row" aI="center" pb={0.5}>
        <View pr={1}>
          <Text myColor="font" width="auto">
            Is this a <b>full</b> or <b>partial</b> refund
          </Text>
        </View>
        <RadioSelector
          variant="simple"
          options={refundOptions}
          name="type"
          {...form}
          // handleChange={setRefundType}
        />
      </View> */}
      <View pb={1} w="100%">
        <Text component="div" width="100%" align="center">
          <Text id="refund_confirmation_prefix" inline />{' '}
          <Text bold color="primary" inline>
            {refundAmountString}
          </Text>
          {'. '}
          <Text id="refund_confirmation_postfix" inline />
        </Text>
      </View>
      {/* {type === 'partial' && (
        <View pb={1}>
          <View w="100%" fD="row" display="flex" jC="space-between">
            <Text padded variant="h6" myColor="font">
              Partial refund
            </Text>
            {!totalRefunded && (
              <Button
                variant="link"
                noPadding
                color="primary"
                id={custom ? 'items' : 'custom'}
                onPress={() => setValue('custom', !custom)}
              />
            )}
          </View>
          {custom ? (
            <Input
              config={{
                name: 'amount',
                placeholder: 'Custom amount',
                type: 'amount',
              }}
              register={register}
              control={control}
            />
          ) : (
            <RefundItemListInput {...form} currency={currency} items={items} />
          )}
        </View>
      )} */}
      <View pb={1}>
        <Input
          config={{
            name: 'reason',
            placeholder: 'refund_reason_placeholder',
          }}
          register={register}
          control={control}
        />
      </View>
      <ModalButtons
        isSubmitting={isSubmitting}
        isValid={isValid && isBalanceValid}
        onAccept={handleSubmit}
        acceptLabel="confirm_refund"
        onCance={onDismiss}
      />
    </PageContent>
  );
}
