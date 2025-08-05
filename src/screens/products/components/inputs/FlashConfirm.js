import React, { useState } from 'react';
import { get } from 'lodash';
import { Formik } from 'formik';
import { View, Spinner, Text, ButtonList } from 'components';
import Header from 'components/layout/header';
import ResultPage from 'components/layout/ResultPage';
import ConfirmPage from 'components/layout/ConfirmPageNew';
import ErrorOutput from 'components/outputs/ErrorOutput';
import { Input } from '.';
import { standardizeString } from 'util/general';
import { formatAmountString } from 'util/rates';
import { InputGroup } from 'native-base';

export default function FlashConfirm(props) {
  let { handleConfirm, scenes, fields, order, actions, formikProps } = props;
  console.log('FlashConfirm -> fields', fields);
  console.log('FlashConfirm -> scenes', scenes);

  const B = props => (
    <Text style={{ fontWeight: 'bold' }} c="primary">
      {props.children}
    </Text>
  );

  const { values } = formikProps;
  let { bundle, provider } = values;
  console.log('FlashConfirm -> bundle', bundle);
  console.log('FlashConfirm -> provider', provider);
  if (!provider) {
    const providers = get(fields, ['provider', 'props', 'options']);
    provider = get(providers, 0, {});
  }
  console.log('FlashConfirm -> provider', provider);
  //  provider = provider ? provider : ;
  const price = get(bundle, ['prices', 0]);
  const amountString = formatAmountString(
    get(price, 'amount'),
    get(price, ['currency']),
    true,
  );

  let items = [
    {
      label: 'Provider',
      value: get(provider, ['name']),
    },
    {
      label: 'Amount',
      value: amountString,
    },
  ];
  const isVoucher = get(values, ['type'], '').includes('voucher');
  const recipient = get(formikProps, ['values', 'number'], '');
  if (!isVoucher) {
    items.push({
      label: 'Recipient',
      value: recipient,
    });
  }

  return (
    <ConfirmPage
      action={'flash'}
      onConfirm={() => handleConfirm(formikProps)}
      onBack={() =>
        formikProps.setStatus({
          scene: order.length ? order[order.length - 1] : '',
        })
      }
      items={items}
      formikProps={formikProps}>
      <Text tA={'center'} p={0.5}>
        You are about to purchase{' '}
        <B>
          {bundle ? get(bundle, ['label'], get(bundle, ['id'])) : amountString}
        </B>{' '}
        {isVoucher
          ? get(provider, ['name']) + ' voucher'
          : get(formikProps, ['values', 'type']) + ' for number '}
        {<B>{recipient}</B>}
      </Text>
    </ConfirmPage>
  );
}
