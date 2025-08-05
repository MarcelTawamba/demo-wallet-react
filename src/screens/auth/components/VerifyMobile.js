import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import { get } from 'lodash';
import { submitOTP, resendVerification, getProfile } from 'util/rehive';
import Text from 'components/outputs/Text';
import { View } from 'components/layout/View';

import ErrorOutput from 'components/outputs/Error';
import Input from 'components/inputs/Input';
import { otp } from 'config/inputs';
import PlaceholderImage from 'components/outputs/PlaceholderImage';
import ButtonList from 'components/lists/ButtonList';

const VerifyMobile = props => {
  const {
    initialUser,
    authConfig,
    company,
    showToast,
    onSuccess,
    setLoading: setLoadingMain,
    loading: loadingMain,
    tempAuth,
    setTempAuth,
  } = props;
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingResend, setLoadingResend] = useState(false);
  const [user, setUser] = useState(initialUser);
  const mobile = get(user, ['mobile'], '');
  const skip = Boolean(authConfig.mobile === 'optional');
  const verifyOff = Boolean(authConfig.mobile === ''); // when App extension > App config > Auth > Mobile verify is Off

  useEffect(() => {
    if (verifyOff) {
      onSuccess();
    } else {
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
    }
  }, [authConfig.identifier, onSuccess, setLoadingMain, user]);

  async function handleGetProfile() {
    setLoading(true);
    const resp = await getProfile();
    setTempAuth({ ...tempAuth, user: resp });
    setUser(resp);
    setLoading(false);
  }

  async function handleSubmitOTP(formikProps) {
    const { otp } = formikProps.values;
    formikProps.setSubmitting(true);
    try {
      await submitOTP(otp);
      showToast({
        text: 'Mobile number verified successfully',
        variant: 'success',
      });
      handleGetProfile();
    } catch (e) {
      console.log(e);
      setError(e.message);
      resetOTP(formikProps);
    }
    formikProps.setSubmitting(false);
  }

  function resetOTP(formikProps) {
    setLoading(false);
    formikProps.setFieldValue('otp', '');
  }

  async function handleResend() {
    setLoadingResend(true);
    try {
      await resendVerification('mobile', { number: mobile }, company?.id);
      showToast({
        text: 'An SMS containing an OTP has been sent to ' + mobile,
      });
    } catch (e) {
      console.log(e);
      setError(e.message);
    }
    setLoadingResend(false);
  }

  if (loadingMain) {
    return null;
  }

  function actions(formikProps) {
    let items = [
      {
        type: 'submit',
        onClick: () => handleSubmitOTP(formikProps),
        disabled: loading || loadingResend,
        loading,
        label: 'NEXT',
      },
      {
        variant: 'text',
        disabled: loading || loadingResend,
        loading: loadingResend,
        label: 'RESEND SMS',
        onClick: handleResend,
      },
    ];

    if (skip) {
      items.push({
        label: 'Skip',
        onClick: () => onSuccess(),
        variant: 'text',
      });
    }
    return items;
  }

  return (
    <Formik initialValues={{ otp: '' }}>
      {formikProps => (
        <React.Fragment>
          <View f={1} aI={'center'} jC={'center'} p={1}>
            <PlaceholderImage name={'otp'} width={110} />
            <View mt={1}>
              <Text align={'center'}>
                Please verify your mobile by following the instructions sent to{' '}
                {mobile ? mobile : ''}
              </Text>
            </View>
          </View>
          <View f={1} p={1}>
            <Input
              field={{ ...otp, autoFocus: true }}
              formikProps={formikProps}
            />
          </View>
          <ErrorOutput>{error}</ErrorOutput>

          <ButtonList items={actions(formikProps)} layout={'vertical'} />
        </React.Fragment>
      )}
    </Formik>
  );
};

export default VerifyMobile;
