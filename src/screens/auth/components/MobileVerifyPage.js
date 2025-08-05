import React, { useRef, useState, useEffect } from 'react';
import { get } from 'lodash';

import { submitOTP, resendVerification, getProfile } from 'util/rehive';
import { Toast } from 'native-base';
import { Spinner, View, Text, CodeInput, Button } from 'components';
import ErrorOutput from 'components/outputs/ErrorOutput';
import PostAuthLayout from './PostAuthLayout';

const MobileVerifyPage = props => {
  const {
    onSuccess,
    onBack,
    initialUser,
    company,
    authConfig,
    setLoading: setLoadingMain,
  } = props;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refPinInput = useRef();
  const [user, setUser] = useState(initialUser);
  const mobile = get(user, ['mobile'], '');
  const skip = Boolean(authConfig.mobile === 'optional');

  useEffect(() => {
    if (
      get(user, ['verification', 'mobile']) ||
      authConfig.identifier !== 'mobile'
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
    setLoading(true);
    const resp = await getProfile();
    setUser(resp);
    setLoading(false);
  }

  async function handleSubmitOTP(code) {
    setLoading(true);
    try {
      await submitOTP(code);
      Toast.show({
        text: 'Mobile number verified successfully',
      });
      handleGetProfile();
    } catch (e) {
      console.log(e);
      setError(e.message);
      setLoading(false);
      refPinInput.current.clear();
    }
  }

  async function handleResend() {
    try {
      await resendVerification('mobile', { number: mobile }, { id: company });
      Toast.show({
        text: 'An SMS containing an OTP has been sent to ' + mobile,
      });
    } catch (e) {
      console.log(e);
      setError(e.message);
      refPinInput.current.clear();
    }
  }

  return (
    <PostAuthLayout onBack={onBack} skip={skip} onSuccess={onSuccess}>
      {/* <View f={1} jC={'center'} p={1}> */}
      <View f={1} aI={'center'} jC={'center'} p={1}>
        <Text c="authScreenContrast" tA={'center'}>
          Please verify your mobile by following the instructions sent to{' '}
          {mobile ? mobile : ''}
        </Text>
      </View>
      {loading ? ( // TODO: move this to inside code input comp
        <Spinner />
      ) : (
        <CodeInput
          ref={refPinInput}
          secureTextEntry={false}
          activeColor="gray"
          autoFocus
          inactiveColor="lightgray"
          className="border-b"
          codeLength={5}
          space={7}
          size={30}
          inputPosition="center"
          onFulfill={code => handleSubmitOTP(code)}
        />
      )}
      <ErrorOutput>{error}</ErrorOutput>
      <View p={2}>
        <Button
          label={'RESEND SMS'}
          color="secondary"
          size="large"
          onPress={() => handleResend()}
          wide
        />
      </View>
    </PostAuthLayout>
  );
};

export default MobileVerifyPage;
