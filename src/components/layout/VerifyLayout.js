import React, { useState, useRef } from 'react';

import { resendVerification, fetchItem, submitOTP } from 'util/rehive';
// import { useToast } from 'util/contexts/toast';
// import CodeInput from 'components/inputs/CodeInput';
import { View } from './View';
import Text from 'components/outputs/Text';
import { Button } from 'components/inputs/Button';
import Spinner from 'components/outputs/Spinner';
import Input from 'components/inputs';
import ButtonList from 'components/lists/ButtonList';
import Content from 'components/content';
import { useForm } from 'react-hook-form';

// function useTimer(length){

//   const [loading, setLoading] = useState(true);
//   const [expired, setExpired] = useState(false);
//   const [data, setData] = useState(null);
//   const [remaining, setRemaining] = useState();

//   useEffect(() => {
//     let timer = null;
//     async function startTimer() {
//       timer = setTimeout(() => {
//         if (data && data.created) {
//           const CurrentDate = moment();
//           const ExpiredDate = moment(data.expires);
//           const diff = ExpiredDate.diff(CurrentDate, 'seconds');
//           const formatted = formatTime(diff);
//           setRemaining(formatted);
//           if (diff <= 0) {
//             setExpired(true);
//             return () => clearTimeout(timer);
//           }
//         }
//         startTimer();
//       }, 1000);
//     }
//     startTimer();
//     return () => clearTimeout(timer);
//   }, [data]);

// }

export default function VerifyLayout(props) {
  const {
    type,
    item = {},
    context = {},
    onCancel,
    onSuccess,
    showToast,
  } = props;
  const { company } = context;
  const isMobile = type === 'mobiles';
  const value = item?.[isMobile ? 'number' : 'email'] ?? '';
  // const { showToast } = useToast();
  const refPinInput = useRef();

  const [loading, setLoading] = useState(false);

  const formMethods = useForm({
    defaultValues: { otp: '' },
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  async function handleVerify() {
    setLoading('verify');
    const resp = await fetchItem(type, item?.id);
    if (resp?.verified) {
      showToast({
        variant: 'success',
        text: value + ' successfully verified',
      });
      onSuccess();
    } else {
      showToast({
        variant: 'error',
        text:
          'Email not verified, please see instructions to verify your email sent to ' +
          value,
      });
    }
    setLoading(false);
  }

  async function handleSubmitOTP() {
    setLoading('verify');
    try {
      await submitOTP(code);
      showToast({
        variant: 'success',
        text: value + ' verified',
      });
      onSuccess();
      // handleGetProfile();
    } catch (e) {
      showToast({
        variant: 'error',
        text: 'Unable to verify mobile number: ' + e?.message,
      });
      formMethods.setValue('otp', '');
      setLoading(false);
      // refPinInput.current.clear();
    }
  }

  async function handleResend() {
    try {
      setLoading('resend');
      resendVerification(type, value, company?.id);

      showToast({
        text:
          (type === 'mobile'
            ? 'An SMS containing an OTP has been sent to '
            : 'Instructions on how to verify your email have been sent to ') +
          value,
      });
    } catch (e) {
      console.log(e);
      showToast({
        text: 'Unable to resend email: ' + e?.message,
      });
      // setError(e.message);
      refPinInput.current.clear();
    }
    setLoading(false);
  }

  const code = formMethods.getValues('otp');

  const buttons = [
    {
      id: 'verify_later',
      onPress: onCancel,
      variant: 'text',
      color: 'primary',
    },
    {
      id: 'next',
      capitalize: true,
      color: 'primary',
      type: 'submit',
      onPress: isMobile ? handleSubmitOTP : handleVerify,
      disabled: loading === 'verify' || (isMobile && code?.length < 4),
      loading: loading === 'verify',
    },
  ];
  const isRtl = document.dir === 'rtl';

  return (
    <>
      <View p={2} pt={1} w="100%">
        {value ? (
          <>
            <Text
              pv={0.5}
              align={'center'}
              s={18}
              c="fontLight"
              id={
                isMobile
                  ? 'mobile_verification_helper'
                  : 'email_verification_helper'
              }
            />
            :
            <Text align={'center'} color={'primary'} s={18} fW="500">
              {value}
            </Text>
          </>
        ) : (
          <Text
            c="authScreenContrast"
            s={18}
            align={'center'}
            id={
              type === 'mobile'
                ? 'unable_to_find_mobile'
                : 'unable_to_find_email'
            }
          />
        )}
        {isMobile && (
          <View mt={1} w="100%">
            <Input name="otp" {...formMethods} />
          </View>
        )}
        <View
          w="100%"
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'flex-start',
          }}>
          <View mt={1} w="100%" fD="row" aI="center" jC="center">
            <Text
              variant="body2"
              color="fontLight"
              width="auto"
              style={{ fontSize: 14 }}
              id={isMobile ? 'did_not_receive_mobile' : 'did_not_receive_email'}
            />
            {/* {loading === 'resend' ? (
              <div>
                <Spinner
                  size="small"
                  containerStyle={{
                    paddingBottom: 0,
                    paddingTop: 11,
                    width: 'auto',
                  }}
                />
              </div>
            ) : ( */}
            <Button
              variant="link"
              color={'primary'}
              // width="auto"
              size="small"
              fontSize={14}
              style={{ [isRtl ? 'paddingRight' : 'paddingLeft']: 8 }}
              onPress={() => handleResend()}
              id="resend"
            />
            {/* )} */}
          </View>
        </View>
        {/* <ButtonList items={buttons} /> */}
      </View>
      <View fD="row" w="100%" ph={1.5} pb={1}>
        <Button {...buttons?.[0]} wide />
        <Button {...buttons?.[1]} wide />
      </View>
    </>
  );
}
