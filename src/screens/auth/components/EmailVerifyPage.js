import React, { useState, useEffect } from 'react';
import { get } from 'lodash';
import { trackFlow } from 'util/tracking';
import { View, Text, Button } from 'components';
import { resendVerification, getProfile } from 'util/rehive';
import { Toast } from 'native-base';

import ErrorOutput from 'components/outputs/ErrorOutput';
import PostAuthLayout from './PostAuthLayout';

const EmailVerifyPage = props => {
  const {
    setLoading: setLoadingMain,
    initialUser,
    company,
    authConfig,
    onSuccess,
    onBack,
  } = props;
  const [error, setError] = useState('');
  const skip = Boolean(authConfig.email === 'optional');
  const [user, setUser] = useState(initialUser);
  const [loading, setLoading] = useState(true);
  const email = get(user, ['email'], '');

  useEffect(() => {
    if (
      get(user, ['verification', 'email']) ||
      authConfig.identifier !== 'email'
    ) {
      onSuccess();
    } else {
      if (!user) {
        handleGetProfile();
      } else {
        setLoading(false);
      }
      setLoadingMain(false);
    }
  }, [authConfig.identifier, onSuccess, setLoadingMain, user]);

  async function handleGetProfile() {
    const resp = await getProfile();
    setUser(resp);
    setLoading(false);
  }

  async function handleVerify() {
    setLoading(true);
    try {
      handleGetProfile();
      trackFlow('register', 'email verification', 'completed');
    } catch (e) {
      console.log(e);
      setLoading(false);
      setError(e.message);
    }
  }

  async function handleResend() {
    setLoading(true);
    try {
      await resendVerification('email', { email }, { id: company });
      Toast.show({
        text:
          'Instructions on how to verify your email have been sent to ' + email,
      });
    } catch (e) {
      console.log(e);
      setError(e.message);
    }
    setLoading(false);
  }

  return (
    <PostAuthLayout onBack={onBack} skip={skip} onSuccess={onSuccess}>
      <View f={1} aI={'center'} jC={'center'} p={1}>
        {email ? (
          <Text
            c="authScreenContrast"
            tA={'center'}
            id="email_verify_helper"
            context={{ email: user.email ?? '' }}
          />
        ) : (
          <Text c="authScreenContrast" tA={'center'} id="no_email_error" />
        )}
        <ErrorOutput>{error}</ErrorOutput>
      </View>
      <View p={2}>
        <Button
          id={'next'}
          capitalize
          color="primary"
          size="large"
          onPress={() => handleVerify()}
          wide
          disabled={loading}
          loading={loading}
        />
        <Button
          label={'resend_email'}
          capitalize
          color="secondary"
          size="large"
          onPress={() => handleResend()}
          wide
        />
      </View>
    </PostAuthLayout>
  );
};

export default EmailVerifyPage;
