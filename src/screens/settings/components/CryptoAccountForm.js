import React, { Component, useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import _ from 'lodash';

import { EMPTY_CRYPTO } from 'config/empty';
import { cryptoAccounts } from '../config/inputs';

import { updateItem, getStellarKnownPublicAddresses } from 'util/rehive';
import { validateCrypto2 } from 'util/validation';

import Input from 'components/inputs/Input';
import { View } from 'components/layout/View';
import ButtonList from 'components/lists/ButtonList';
import ErrorOutput from 'components/outputs/Error';
import RadioSelector from 'components/inputs/RadioSelector';
import { standardizeString } from 'util/general';
import Info from 'components/outputs/Info';

export default function CryptoAccountForm(props) {
  const {
    type,
    onSaveSuccess,
    crypto,
    item,
    currency,

    onDetailClose,

    services,
    noPadding,
  } = props;

  async function handleSubmit(formikProps) {
    const { values, setSubmitting, setStatus } = formikProps;
    const { name, testnet, memo, memoSkip, address, stellarTransactionType } =
      values;

    setSubmitting(true);
    if (
      crypto.match(/stellar/) &&
      stellarTransactionType === 'public' &&
      !(memo || memoSkip)
    ) {
      setStatus({ error: 'Please include a memo or check no memo required' });
    } else {
      const data = {
        address,
        name,
        network: testnet ? 'testnet' : 'mainnet',
        crypto_type: crypto,
      };
      if (values.memo && stellarTransactionType === 'public') {
        data.metadata = { ...data.metadata, memo };
      }
      if (item) {
        data.id = item.id;
      }
      try {
        const resp = await updateItem(type, data);
        onSaveSuccess(type, resp);
      } catch (error) {
        setStatus({ error: error.message });
      }
    }
    setSubmitting(false);
  }

  function validation(values) {
    const { address, memo, memoSkip, stellarTransactionType, testnet } = values;

    const error = validateCrypto2(address, crypto, testnet);

    if (error) {
      return { address: error };
    }
    if (crypto.match(/stellar/)) {
      // if (
      //   (knownAddresses?.find(item => item.public_address === address)
      //     ?.requires_memo ??
      //     false) &&
      //   !memo
      // ) {
      //   return {
      //     memo:
      //       'This third party exchange wallet requires a memo, sometimes referred to as a tag or reference. Failing to include this could result in a delay of up to 10 days while we confirm your identity.',
      //   };
      // }
      if (
        stellarTransactionType === 'federation' &&
        address.indexOf('*') === -1
      ) {
        return { address: 'Not a valid federated stellar address' };
      }
    }
  }
  const isStellar = crypto === 'stellar';

  const [knownAddresses, setKnownAddresses] = useState([]);
  useEffect(() => {
    async function fetchData() {
      let resp = await getStellarKnownPublicAddresses();
      if (resp?.status === 'success') {
        setKnownAddresses(resp?.data);
      }
    }
    if (isStellar) {
      fetchData();
    }
  }, []);

  let initialValues = item
    ? {
        address: item.address,
        name: _.get(item, ['name']),
        memo: _.get(item, ['metadata', 'memo']),
      }
    : {
        ...EMPTY_CRYPTO,
      };
  let disabled = true;

  if (services) {
    if (crypto === 'stellar') {
      initialValues.stellarTransactionType =
        item && item.address.indexOf('*') !== -1 ? 'federation' : 'public';
    }

    initialValues.testnet = item
      ? _.get(item, ['network'], '') === 'testnet'
      : !services?.[crypto + '_service'];

    if (
      services?.[crypto + '_service'] &&
      services?.[crypto + '_testnet_service']
    ) {
      disabled = false;
    }
  } else if (currency && currency.crypto) {
    initialValues = {
      ...initialValues,
      testnet:
        (currency && currency.crypto?.network === 'testnet') ||
        services?.[crypto + '_testnet_service'],
      stellarTransactionType: 'public',
    };
  }

  return (
    <Formik
      initialValues={initialValues}
      validate={values => {
        const valid = validation(values);
        return valid;
      }}
      onSubmit={(values, formikBag) => handleSubmit({ values, ...formikBag })}>
      {formikProps => (
        <Form style={{ width: '100%' }}>
          <View ph={noPadding ? 0 : 1} w={'100%'}>
            {!disabled && (
              <RadioSelector
                responsive
                title="network"
                items={[
                  { value: 'mainnet', label: 'Mainnet' },
                  { value: 'testnet', label: 'Testnet' },
                ]}
                value={formikProps.values.testnet ? 'testnet' : 'mainnet'}
                handleChange={event =>
                  formikProps.setFieldValue(
                    'testnet',
                    event.target.value === 'testnet',
                  )
                }
              />
            )}
            {crypto === 'stellar' && (
              <RadioSelector
                responsive
                title="address_type"
                items={[
                  { value: 'public', label: 'public_address_memo' },
                  { value: 'federation', label: 'federation_address' },
                ]}
                handleChange={event =>
                  formikProps.setFieldValue(
                    'stellarTransactionType',
                    event.target.value,
                  )
                }
                value={formikProps.values.stellarTransactionType}
              />
            )}
            <Input field={cryptoAccounts.name} formikProps={formikProps} />
            <Input
              field={{
                ...cryptoAccounts.address,
                placeholder:
                  crypto.match(/stellar/) &&
                  formikProps.values.stellarTransactionType === 'federation'
                    ? 'e.g. username*domain.com'
                    : crypto.match(/bitcoin/)
                    ? 'e.g. 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'
                    : cryptoAccounts.address.placeholder,
              }}
              formikProps={formikProps}
            />
            {crypto === 'stellar' &&
              formikProps.values.stellarTransactionType === 'public' && (
                <View w={'100%'}>
                  {!(
                    knownAddresses?.find(
                      item =>
                        item.public_address === formikProps.values.address,
                    )?.requires_memo ?? false
                  ) ? (
                    <Input
                      field={cryptoAccounts.memoSkip}
                      formikProps={formikProps}
                    />
                  ) : (
                    <Info
                      variant="warning"
                      mb={1}
                      id="third_party_wallet_or_exchange_requires_info"
                    />
                  )}
                  <Input
                    field={cryptoAccounts.memo}
                    formikProps={formikProps}
                  />
                </View>
              )}

            <ErrorOutput>
              {formikProps.status && formikProps.status.error}
            </ErrorOutput>
          </View>
          <ButtonList
            items={[
              {
                id: 'cancel',
                capitalize: true,
                onPress: onDetailClose,
              },
              {
                id: 'save',
                capitalize: true,
                type: 'submit',
                onPress: () => handleSubmit(formikProps),
                disabled: !formikProps.isValid || formikProps.isSubmitting,
                loading: formikProps.isSubmitting,
              },
            ]}
            variant={'text'}
          />
        </Form>
      )}
    </Formik>
  );
}
