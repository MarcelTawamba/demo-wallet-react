import React, { useState, useRef, useMemo } from 'react';
import { Formik } from 'formik';
import { makeStyles, Box } from '@material-ui/core';
import PageTitle from 'components/layout/page/PageTitle';
import PageContent from 'components/layout/page/PageContent';
import PageButtons from 'components/layout/page/PageButtons';
import { View } from 'components/layout/View';

import RecipientButtons from '../RecipientButtons';
import AmountInput from '../AmountInput';
import StellarAddressType from 'components/inputs/StellarAddressType';

import { stellarFederation, checkIfStellar } from 'util/crypto';
import SetFederationUsername from './SetFederationUsername';
import IconButton from 'components/inputs/IconButton';

import Icon from 'components/outputs/Icon';
import ReceiveQR from './ReceiveQR';
import Modal from 'components/layout/Modal';
import { MyCheckbox } from 'components/inputs/Input';
import { getWallet } from 'util/wallet';
import ReceiveLoading from './ReceiveLoading';
import { useTranslation } from 'react-i18next';

export default function ReceiveForm(props) {
  const {
    currency,
    services,
    crypto,
    profile,
    actionsConfig,
    showToast,
    fetchCrypto,
  } = props;
  const { t } = useTranslation(['common']);
  const refPrint = useRef(null);

  let config = actionsConfig?.receive?.config;

  let {
    recipient: recipientConfig = [],
    initialPage = 'qr',
    showCryptoDefault,
  } = config;

  if (recipientConfig?.length === 0) {
    recipientConfig = ['email', 'mobile', 'crypto'];
  }
  const [isLoading, setLoading] = useState(false);
  const [formState, setFormState] = useState(initialPage);

  const isStellar = checkIfStellar(currency);
  const [showMemoAcknowledge, setShowMemoAcknowledge] = useState(false);

  const isCrypto = useMemo(() => {
    const _isCrypto =
      recipientConfig?.toString().includes('crypto') &&
      Boolean(currency.crypto);

    setShowMemoAcknowledge(
      !!(_isCrypto && checkIfStellar(currency) && showCryptoDefault),
    );
    return _isCrypto;
  }, [currency]);

  function handleRecipientButtonPress(type, formikProps) {
    if (type === 'crypto' && checkIfStellar(currency)) {
      formikProps.setFieldValue('memo1', false);
      formikProps.setFieldValue('memo2', false);
    }
    formikProps.setFieldValue('recipientType', type);
  }

  const { isFederated } = stellarFederation(currency, crypto, isCrypto);

  function renderReceive(formikProps) {
    const { values } = formikProps;

    const amountInputProps = {
      services,
      formikProps,
      currency,
      subtype: `receive_${values.recipientType}`,
    };
    const actions = [
      {
        id: 'qr',
        icon: 'scan',
        onPress: () => setFormState('qr'),
      },
    ];

    return (
      <React.Fragment>
        <PageTitle titleId="receive" actions={<ActionList items={actions} />} />
        {isLoading ? (
          <ReceiveLoading />
        ) : (
          <>
            <PageContent>
              <Box pb={0.5}>
                <RecipientButtons
                  showMobile={profile.items.mobile}
                  handleRecipientButtonPress={handleRecipientButtonPress}
                  formikProps={formikProps}
                  action={'receive'}
                  actionsConfig={actionsConfig}
                  currency={currency}
                  crypto={crypto}
                  reducePadding
                  isCrypto={isCrypto}
                />
              </Box>
              {isStellar && isFederated && (
                <StellarAddressType
                  handleChange={event =>
                    formikProps.setFieldValue(
                      'stellarTransactionType',
                      event.target.value,
                    )
                  }
                  value={values.stellarTransactionType}
                />
              )}
              <AmountInput {...amountInputProps} />
            </PageContent>
            <PageButtons
              layout={'vertical'}
              items={[
                {
                  color: 'primary',
                  onPress: () => setFormState('qr'),
                  id: 'view_' + (isCrypto ? 'address' : 'qr_code'),
                  capitalize: true,
                },
              ]}
            />
          </>
        )}
      </React.Fragment>
    );
  }

  return (
    <Formik
      enableReinitialize
      initialValues={{
        recipient: '',
        recipientType:
          isCrypto && showCryptoDefault
            ? 'crypto'
            : profile?.items?.email && recipientConfig.includes('email')
            ? 'email'
            : 'mobile',
        email: profile?.items?.email,
        mobile: profile?.items?.mobile,
        amount: '',
        note: '',
        memo: '',
        display: false,
        stellarTransactionType: 'public',
        memo1: false,
        memo2: false,
      }}>
      {formikProps => (
        <>
          {formState === 'federation' ? (
            <SetFederationUsername
              handleBack={() => setFormState('')}
              showToast={showToast}
              fetchCrypto={fetchCrypto}
              currency={currency}
            />
          ) : formState === 'qr' ? null : (
            renderReceive(formikProps)
          )}
          <div
            style={{
              display: formState !== 'qr' ? 'none' : '',
            }}>
            <ReceiveQR
              handleRecipientButtonPress={handleRecipientButtonPress}
              formikProps={formikProps}
              formState={formState}
              isLoading={isLoading}
              refPrint={refPrint}
              isCrypto={isCrypto}
              setFormState={setFormState}
              {...props}
            />
          </div>
          <Modal
            maxWidth={400}
            id="long-menu"
            title={'Important'}
            open={showMemoAcknowledge}
            // onDismiss={setShowMemoAcknowledge}
          >
            <>
              <PageContent horizontal={0}>
                <MyCheckbox
                  {...{
                    setFieldValue: formikProps?.setFieldValue,
                    value: formikProps?.values?.memo1,
                    name: 'memo1',
                    label: t(
                      isStellar
                        ? 'funding_wallet_requires_memo_message_for_stellar'
                        : 'funding_wallet_requires_memo_message_for_non_stellar',
                      {
                        currencyCode: currency?.currency?.code,
                      },
                    ),
                  }}
                />
                <View mt={0.5} />
                <MyCheckbox
                  {...{
                    setFieldValue: formikProps?.setFieldValue,
                    value: formikProps?.values?.memo2,
                    name: 'memo2',
                    label: t(
                      isStellar
                        ? 'receive_failed_delay_message_for_stellar'
                        : 'receive_failed_delay_message_for_non_stellar',
                    ),
                  }}
                />
              </PageContent>
              <PageButtons
                layout="vertical"
                noPadding
                items={[
                  {
                    id: 'acknowledge',
                    capitalize: true,
                    onPress: () => setShowMemoAcknowledge(false),
                    disabled:
                      !formikProps?.values?.memo1 ||
                      !formikProps?.values?.memo2,
                  },
                ]}
              />
            </>
          </Modal>
        </>
      )}
    </Formik>
  );
}

function ActionList(props) {
  const { items } = props;
  const classes = useStyles(props);
  return (
    <div className={classes.row}>
      {items.map(({ id, icon, onPress }) => (
        <IconButton
          key={id}
          style={{ padding: 4, margin: 4 }}
          // tooltip={standardizeString(id)}
          onClick={onPress}>
          <Icon icon={icon} color={'primary'} inverted size={20} />
        </IconButton>
      ))}
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  row: {
    display: 'flex',
    flexDirection: 'row',
    // position: 'absolute',
    // right: 30,
  },
}));
