import React, { useState, useEffect } from 'react';

import { useSelector } from 'react-redux';
import { currentSessionsSelector } from 'redux/auth/selectors';
import { configAuthSelector } from 'redux/rehive/selectors';
import { get } from 'lodash';
import { login, resetPassword, verifyMFA } from 'screens/checkout/util/rehive';
import { initWithoutToken, initWithToken } from 'util/rehive';
import Form from 'components/form';
import { useForm } from 'react-hook-form';
import { Box } from '@material-ui/core';
import { Button } from 'components/inputs/Button';
import { isEmail } from 'util/validation';
import { useToast } from 'components/contexts/ToastContext';
import { View } from 'components/layout/View';
import PlaceholderImage from 'components/outputs/PlaceholderImage';
import Text from 'components/outputs/Text';
import { password } from 'config/inputs';


const defaultValues = {
  email: '',
  password: '',
};

const formConfig = values => {
  let fields = [
    values?.authConfig?.identifier ?? 'email',
    { ...password, validation: { required: true } }, // Remove minLength for login
    // {
    //   id: ,
    //   // condition: ({ forgot }) => !forgot,
    // },
  ];

  return {
    title: '',
    defaultValues: { ...defaultValues, email: values?.email },
    submitLabel: 'log_in',
    submitLabelCapitalize: true,
    fields,
  };
};

const mfaFormConfig = {
  title: '',
  defaultValues: { otp: '' },
  submitLabel: 'submit',
  submitLabelCapitalize: true,
  fields: ['otp'],
};

export default function LoginForm(props) {
  const { company, context, setUser, onBack } = props;
  const { invoice } = context;

  const { payer_email: email } = invoice;
  const authConfig = useSelector(configAuthSelector);

  const { showToast } = useToast();
  let { userID, companyID, token } = useSelector(currentSessionsSelector);

  const formConfigObj = formConfig ? formConfig({ email, authConfig }) : {};
  const { defaultValues, mapDefaultValues } = formConfigObj;

  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [response, setResponse] = useState(null);

  const formMethods = useForm({
    defaultValues,
    mode: 'onChange',
    // reValidateMode: 'onChange',
    onSubmit: handleLogin,
  });
  const { handleSubmit, getValues, setValue, setError } = formMethods;

  const values = getValues();

  async function handleSuccess(override) {
    initWithToken(override?.token ?? response?.token);
    setUser(override?.user ?? response?.user);
  }

  async function handleLogin(values, control, props = {}) {
    const { setValue = () => {}, setError } = control;
    const { email, password, mobile } = values;
    setLoading(true);
    const allow_session_durations = get(
      company,
      ['settings', 'allow_session_durations'],
      false,
    );
    const session_duration = get(authConfig, ['session_duration'], 86400);

    try {
      let response;
      let data = {
        company: company?.id,
        user: authConfig.identifier === 'mobile' ? '+' + mobile : email,
        password,
      };
      if (allow_session_durations && session_duration) {
        data.session_duration = session_duration;
      }

      initWithoutToken();
      response = await login(data);
      if (response?.challenges?.length) {
        setResponse(response);
      } else {
        handleSuccess(response);
      }

      setValue('password', '');
    } catch (error) {
      setValue('password', '');
      setError('password', { type: 'manual', message: error.message });
    }
    // setSubmitting(false);
    setLoading(false);
  }

  async function handleForgot() {
    const { email } = values;
    setLoading2(true);
    try {
      await resetPassword({
        user: email,
        company: company.id ?? props?.context?.company?.id ?? '',
      });
      showToast({
        text: 'Password reset email has been sent to ' + email,
      });
    } catch (error) {
      setValue('password', '');
      setError('email', { type: 'manual', message: error.message });
    }
    setLoading2(false);
  }

  async function handleMfa(values, control, props = {}) {
    const { setValue = () => {}, setError } = control;
    const { otp } = values;
    setLoading(true);

    try {
      const resp = await verifyMFA(
        {
          token: otp,
          challenge: response?.challenges?.[0]?.id,
        },
        response.token,
      );
      if (resp?.status === 'success') handleSuccess();
      else throw new Error(resp?.message ?? 'Invalid OTP');
    } catch (error) {
      setValue('otp', '');
      setError('otp', { type: 'manual', message: error.message });
    }
    setLoading(false);
  }

  const isAuthed = userID && companyID && token;

  useEffect(() => {
    if (!isAuthed) {
      setLoading(false);
    }
  }, [isAuthed]);

  return (
    <>
      {response?.challenges?.length > 0 ? (
        <Form
          header={
            <View ph={1} pb={1} aI={'center'}>
              <PlaceholderImage name={'mfa'} width={150} />
              <Text
                align={'center'}
                style={{ marginTop: 14 }}
                id={
                  response?.challenges?.[0]?.authenticator_types?.includes(
                    'totp',
                  )
                    ? 'please_enter_token_from_mfa_app'
                    : 'please_enter_otp_from_mobile'
                }
              />
            </View>
          }
          formConfig={{
            ...mfaFormConfig,
            onSubmit: handleMfa,
          }}
          handleSubmit={handleSubmit}
          noLayout
          onCancel={() => setResponse(null)}
          inputPropsControl={formMethods}
        />
      ) : (
        <Form
          formConfig={{ ...formConfigObj, onSubmit: handleLogin }}
          handleSubmit={handleSubmit}
          noLayout
          noPageButtonPadding={false}
          footer={
            <ForgotPasswordAction
              {...props}
              values={values}
              handleForgot={handleForgot}
              loading={loading}
              loading2={loading2}
            />
          }
          inputPropsControl={formMethods}
        />
      )}
      {/* <Toast /> */}
    </>
  );
}

function ForgotPasswordAction(props) {
  const { history, values, handleForgot, loading, loading2 } = props;
  const disabledForgot = !isEmail(values?.email);

  return (
    <Box
      width="100%"
      alignItems="space-between"
      display="flex"
      flexDirection="row"
      pr={3}
      pb={2}
      pl={3}>
      <Button
        label="Register"
        history={history}
        link={'/register/'}
        variant="text"
        color="primary"
        wide
      />
      <Button
        disabled={loading || loading2 || disabledForgot}
        loading={loading2}
        label="Forgot password?"
        variant="text"
        color="primary"
        wide
        onPress={handleForgot}
      />
    </Box>
  );
}
