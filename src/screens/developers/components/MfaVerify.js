import React, { useEffect } from 'react';
import { Formik, Form } from 'formik';

import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import Input from 'components/inputs/Input';
import ErrorOutput from 'components/outputs/Error';
import * as inputs from 'config/inputs';
import { verifyMFA } from 'util/rehive';
import PlaceholderImage from 'components/outputs/PlaceholderImage';
import ButtonList from 'components/lists/ButtonList';

export default function MfaVerify(props) {
  const { onSuccess, onBack, mfa, token, noCancel, activeChallenge } = props;

  useEffect(() => {
    if (!mfa) {
      onSuccess();
    }
  }, [mfa]);

  if (!mfa) {
    return null;
  }

  async function handleSubmit(values, actions) {
    if (!actions) {
    } else {
      const { setStatus, setFieldValue, setSubmitting } = actions; // FormikProps
      const { otp } = values;
      try {
        const resp = await verifyMFA(
          {
            token: otp,
            challenge: activeChallenge?.id,
          },
          token,
        );
        if (resp?.status === 'success') {
          onSuccess();
        } else {
          setFieldValue('otp', '');
          setStatus({ error: resp?.message ?? 'Invalid token' });
          setSubmitting(false);
        }
      } catch (e) {
        setFieldValue('otp', '');
        setStatus({ error: e.message });
        setSubmitting(false);
      }
    }
  }

  const renderButtons = formikProps => {
    let buttons = [
      {
        id: 'submit',
        capitalize: true,
        type: 'submit',
        onPress: () => handleSubmit(formikProps),
        disabled: !formikProps.isValid || formikProps.isSubmitting,
        loading: formikProps.isSubmitting,
      },
      noCancel
        ? {}
        : {
            id: 'cancel',
            onPress: () => onBack(),
            variant: 'text',
          },
    ];

    return <ButtonList items={buttons} layout={'vertical'} />;
  };

  const renderInputs = props => {
    return (
      <View aI={'center'} jC={'space-around'} p={1}>
        <Input field={{ ...inputs.otp, autoFocus: true }} formikProps={props} />
        <ErrorOutput>{props.status && props.status.error}</ErrorOutput>
      </View>
    );
  };

  const renderContent = () => {
    return (
      <View ph={1} pb={1} aI={'center'}>
        <PlaceholderImage
          name={
            activeChallenge?.authenticator_types?.includes('totp')
              ? 'mfa'
              : 'otp'
          }
          width={110}
        />
        <View mt={1}>
          <Text
            align={'center'}
            id={
              activeChallenge?.authenticator_types?.includes('totp')
                ? 'please_enter_token_from_mfa_app'
                : 'please_enter_otp_from_mobile'
            }
          />
        </View>
      </View>
    );
  };

  return (
    <Formik
      initialValues={{ otp: '' }}
      onSubmit={(values, actions) => {
        return handleSubmit(values, actions);
      }}>
      {formikProps => (
        <Form>
          {renderContent(formikProps)}
          {renderInputs(formikProps)}
          {/* <ErrorMessage */}

          {renderButtons(formikProps)}
        </Form>
      )}
    </Formik>
  );
  // }
}
