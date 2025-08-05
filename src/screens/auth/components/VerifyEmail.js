import React, { useState, useEffect } from 'react';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import { getProfile, resendVerification } from 'util/rehive';
import ErrorOutput from 'components/outputs/Error';
import PlaceholderImage from 'components/outputs/PlaceholderImage';
import ButtonList from 'components/lists/ButtonList';

const VerifyEmail = props => {
  const {
    setLoading: setLoadingMain,
    loading: loadingMain,
    initialUser,
    company,
    authConfig,
    onSuccess,
    showToast,
  } = props;
  const [error, setError] = useState('');
  const skip = Boolean(authConfig.email === 'optional');
  const [user, setUser] = useState(initialUser);
  const [checkingVerification, setCheckingVerification] = useState(true);

  const [loading, setLoading] = useState(false);
  const [loadingResend, setLoadingResend] = useState(false);
  const email = user?.email;

  useEffect(() => {
    async function checkEmailVerification() {
      if (
        !authConfig.email ||
        authConfig.identifier !== 'email'
      ) {
        onSuccess();
        return;
      }

      // If we already have verification status, use it
      if (user?.verification?.email) {
        onSuccess();
        return;
      }

      // If we don't have verification status, fetch fresh profile
      if (user && !user.verification?.email) {
        try {
          const freshProfile = await getProfile();
          setUser(freshProfile);
          if (freshProfile?.verification?.email) {
            onSuccess();
          } else {
            setLoadingMain(false);
            setCheckingVerification(false);
          }
        } catch (e) {
          console.log('Error fetching profile:', e);
          setLoadingMain(false);
          setCheckingVerification(false);
        }
      } else {
        setLoadingMain(false);
        setCheckingVerification(false);
      }
    }

    checkEmailVerification();
  }, [
    authConfig.email,
    authConfig.identifier,
    onSuccess,
    setLoadingMain,
    user,
  ]);

  async function handleVerify() {
    if (loading) return; // Prevent multiple calls
    
    setLoading(true);
    try {
      const resp = await getProfile();
      setUser(resp);
      if (resp?.verification?.email) {
        onSuccess();
      } else {
        showToast({
          text: `Your email hasn't been verified, please check your inbox`,
          variant: 'warning',
        });
      }
    } catch (e) {
      console.log('TCL: handleVerify -> e', e);
      setError(e.message);
    }
    setLoading(false);
  }

  async function handleResend() {
    if (loadingResend) return; // Prevent multiple calls
    
    setLoadingResend(true);
    try {
      await resendVerification('email', { email }, company.id);
      showToast({
        text:
          'Instructions on how to verify your email have been sent to ' + email,
      });
    } catch (e) {
      console.log('TCL: handleResend -> e', e);
      setError(e.message);
    }
    setLoadingResend(false);
  }

  if (loadingMain || checkingVerification) {
    return null;
  }

  let actions = [
    {
      type: 'submit',
      onPress: handleVerify,
      disabled: loading || loadingResend,
      loading,
      id: 'next',
      capitalize: true,
    },
    {
      variant: 'text',
      id: 'resend_email',
      capitalize: true,
      loading: loadingResend,
      disabled: loadingResend || loading,
      onPress: handleResend,
    },
  ];

  if (skip) {
    actions.push({
      id: 'skip',
      onPress: onSuccess,
      variant: 'text',
    });
  }

  return (
    <React.Fragment>
      <View aI={'center'} pb={2}>
        <PlaceholderImage name={'emailVerify'} width={250} />
        <Text
          align="center"
          id="email_verify_helper"
          context={{ email: email ?? '' }}
        />
      </View>
      <ErrorOutput>{error}</ErrorOutput>
      <ButtonList items={actions} layout={'vertical'} />
    </React.Fragment>
  );
};

export default VerifyEmail;
