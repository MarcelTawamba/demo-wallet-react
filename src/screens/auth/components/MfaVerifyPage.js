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
import { useMfaSuccess } from 'hooks/useMfaSuccess';

export default function MfaVerifyPage(props) {
  const {
    onSuccess,
    onBack,
    setLoading,
    tempAuth,
    setTempAuth,
    loading,
    authConfig,
    send,
  } = props;
  const { challenges } = tempAuth;
  const activeChallenge = challenges?.[0];
  const { setMfaStepCompleted } = useMfaSuccess({
    tempAuth,
    setTempAuth,
    onSuccess,
  });

  useEffect(() => {
    if (!activeChallenge) {
      if (authConfig?.mfa) send('MFA_SET');
      else setMfaStepCompleted(true);
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeChallenge]);

  if (loading || !activeChallenge) {
    return null;
  }

  async function handleSubmit(values, actions) {
    if (!actions || actions.isSubmitting) {
      return;
    }
    
    actions.setSubmitting(true);
    const { otp } = values;
    try {
      const resp = await verifyMFA({
        token: otp,
        challenge: activeChallenge?.id,
      });
      if (resp?.status === 'success') setMfaStepCompleted(true);
      else handleError(resp, actions);
    } catch (e) {
      handleError(e, actions);
    }
  }

  function handleError(e, actions) {
    const { setStatus, setFieldValue, setSubmitting } = actions; // FormikProps
    setFieldValue('otp', '');
    setStatus({ error: e.message });
    setSubmitting(false);
  }

  const renderButtons = formikProps => {
    let buttons = [
      {
        label: 'submit',
        capitalize: true,
        type: 'submit',
        onPress: (e) => {
          e.preventDefault();
          if (!formikProps.isSubmitting) {
            handleSubmit(formikProps.values, formikProps);
          }
        },
        disabled: !formikProps.isValid || formikProps.isSubmitting,
        loading: formikProps.isSubmitting,
      },
      {
        label: 'cancel',
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
          {renderButtons(formikProps)}
        </Form>
      )}
    </Formik>
  );
  // }
}
