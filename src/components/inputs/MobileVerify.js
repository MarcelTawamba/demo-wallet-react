import React, { useEffect, useState } from 'react';
import { View } from 'components/layout/View';
import { Button } from './Button';
import { FormHelperText } from '@material-ui/core';
import Text from 'components/outputs/Text';
import Modal from 'components/layout/Modal';
import ButtonList from 'components/lists/ButtonList';
import Image from 'components/outputs/Image';
import { createMobile, resendVerification, submitOTP } from 'util/rehive';
import { useToast } from 'components/contexts/ToastContext';
import MobileInput from './PhoneInput';
import OTPInput from './OTPInput';
import { isEmpty } from 'lodash/fp';
import Status from 'components/outputs/Status';

export default function MobileVerify(props) {
  let {
    setFieldValue,
    setFieldTouched,
    values,
    error,
    helperText,
    context: { user, company, refreshUser },
    ...restProps
  } = props;
  const { showToast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [sentFirstOTP, setSentFirstOTP] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingResend, setLoadingResend] = useState(false);
  const [isVerifyTried, setIsVerifyTried] = useState(false);
  const [tempMobile, setTempMobile] = useState(null); // used for new mobile number creation
  const [customError, setCustomError] = useState(null); // used for mobile verification error message
  const [isValidNumber, setIsValidNumber] = useState(false);
  const mobile = values.mobile;
  const isMobileVerified = values.mobile_verification;
  const isEmailVerified = values.email_verification;
  let verifyXtranslate = '371px';
  if (!isMobileVerified && !isEmailVerified) verifyXtranslate = '371px';
  if (!isMobileVerified && isEmailVerified) verifyXtranslate = '380px';
  if (isMobileVerified && !isEmailVerified) verifyXtranslate = '-24px';

  const openModal = async () => {
    setCustomError('');
    if (!user.mobile && mobile && tempMobile !== mobile) {
      // preventing createMobile for same mobile number by comparing with the tempMobile value
      setLoading(true);
      try {
        await createMobile({
          number: mobile,
          primary: true,
        });

        setTempMobile(mobile);
        setShowModal(true);
      } catch (e) {
        console.log(e);
        setCustomError(e.message);
      }
      setLoading(false);
    } else {
      if (user.mobile && !sentFirstOTP) {
        handleResend();
        setSentFirstOTP(true);
      }
      setShowModal(true);
    }
  };
  const closeModal = () => {
    setIsVerifyTried(false);
    setShowModal(false);
  };

  useEffect(() => {
    if (!isMobileVerified && user?.verification?.mobile) {
      setFieldValue('mobile_verification', true);
      closeModal();
    }
  }, [user]);

  async function handleResend() {
    setLoadingResend(true);
    try {
      await resendVerification('mobile', { number: mobile }, company?.id);
      showToast({
        variant: 'success',
        text: 'OTP is sent to your mobile ' + mobile,
      });
    } catch (e) {
      console.log(e);
    }
    setLoadingResend(false);
  }

  async function handleVerify(otp) {
    setLoading(true);
    try {
      await submitOTP(otp);
      showToast({
        variant: 'success',
        text: 'Phone is verified',
      });
      if (typeof refreshUser === 'function') {
        await refreshUser();
      }
    } catch (e) {
      console.log(e);
    }
    setIsVerifyTried(true);
    setLoading(false);
  }
  return (
    <>
      {/* <View fD="row" aI="center"> */}
      <View w="100%" style={{ position: 'relative' }}>
        <MobileInput
          setIsValidNumber={setIsValidNumber}
          setFieldTouched={() => setFieldTouched('mobile')}
          onChange={value => setFieldValue('mobile', value)}
          error={Boolean(customError) || error}
          helperText={customError || helperText}
          existing={user.mobile}
          disabled={Boolean(user.verification.mobile)}
        />
        <View
          style={{
            position: 'absolute',
            right: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            marginRight: 8
          }}
        >
      {isMobileVerified ? (
          <Status noWrap={false} style={{marginTop: 8, marginRight: 5}} uppercase>Verified</Status>
      ) : (
        <Button
          disabled={!isValidNumber}
          // disabled={Boolean(customError) || error || !isValidNumber}
          id="Verify"
          color="primary"
          style={{
            color: 'primary',
            borderRadius: 20,
            minWidth: 70,
            maxWidth: 120,
            height: 24,
            fontSize: 16,
            fontWeight: 500,
            padding: '3px 16px',
            marginTop: 8
          }}
          variant={'text'}
          capitalize={false}
          onClick={openModal}
        />
      )}
      </View>
      </View>

      <MobileVerifyModal
        mobile={mobile}
        showModal={showModal}
        closeModal={closeModal}
        loading={loading}
        handleResend={handleResend}
        handleVerify={handleVerify}
        isVerifyTried={isVerifyTried}
        loadingResend={loadingResend}
      />
    </>
  );
}

function MobileVerifyModal(props) {
  const {
    showModal,
    closeModal,
    mobile,
    handleResend,
    loading,
    handleVerify,
    isVerifyTried,
    loadingResend,
  } = props;
  const [otp, setOtp] = useState();

  const handleOTPComplete = value => setOtp(value);

  const handleOTPVerify = () => {
    if (!otp) return;
    handleVerify(otp);
  };

  return (
    <Modal maxWidth={415} open={showModal} disableBackdropClick>
      <View ph={1} pb={0.5} w={'100%'} aI={'center'} mt={1}>
        <View mb={2} flex={1} aI={'center'}>
          <View mr={2} ml={0}>
            <Image width={100} src="phone" />
          </View>
          <Text s={15} tA="center">
            Verification code sent to{' '}
            <Text c="primary" inline>
              {mobile}
            </Text>
          </Text>
          <OTPInput length={5} onComplete={handleOTPComplete} />
        </View>
        {isVerifyTried && (
          <Text s={14} c="#FF3939" tA="center" style={{ marginBottom: 8 }}>
            Incorrect code
          </Text>
        )}
        <ButtonList
          layout={'vertical'}
          items={[
            {
              id: 'verify',
              onPress: handleOTPVerify,
              capitalize: true,
              wide: true,
              loading,
            },
            {
              id: 'close',
              variant: 'text',
              onPress: closeModal,
              disabled: loading,
            },
          ]}
        />
        <View fD="row" aI="center">
          <Text s={14} c="#9D9D9D">
            Did not receive the code?
          </Text>
          <Button
            onClick={handleResend}
            id="resend"
            variant="text"
            color="primary"
            loading={loadingResend}
          />
        </View>
      </View>
    </Modal>
  );
}
