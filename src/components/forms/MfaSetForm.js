import React, { useState, useEffect, useMemo } from 'react';

import { Formik, Form } from 'formik';
import * as yup from 'yup';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import { Button } from 'components/inputs/Button';
import Spinner from 'components/outputs/Spinner';
import Image from 'components/outputs/Image';
import * as Inputs from 'config/inputs';
import Input from 'components/inputs/Input';
import MobileInput from 'components/inputs/PhoneInput';
import { validateMobileOld as validateMobile, isValidMobile } from 'util/validation';
import {
  createMFAAuthenticator,
  verifyMFA,
  getMFAAuthenticators,
  deleteMfaAuthenticator,
} from 'util/rehive';
import { useToast } from 'components/contexts/ToastContext';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { configSettingsSelector } from 'redux/rehive/selectors';
import OutputList from 'components/lists/OutputList';
import { useMfaSuccess } from 'hooks/useMfaSuccess';
import QRCode from 'qrcode';
import { useTranslation } from 'react-i18next';

export default function MfaSetForm(props) {
  const { onSuccess, tempAuth, setTempAuth, authConfig } = props;
  const { t } = useTranslation('common');
  const skip = authConfig?.mfa === 'optional';
  const { showToast } = useToast();
  const settingsConfig = useSelector(configSettingsSelector);
  const [imageSrc, setImageSrc] = useState();

  const [state, setState] = useState('');
  const [error, setError] = useState('');
  const [token, setToken] = useState(null);
  const [sms, setSms] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isMobileValid, setIsMobileValid] = useState(false);

  const { data, isLoading, refetch } = useQuery(
    ['mfa', tempAuth?.token],
    () => getMFAAuthenticators(),
    {
      enabled: Boolean(authConfig.mfa),
    },
  );
  const authenticators = data?.data;
  const verifiedAuthenticator = useMemo(
    () => authenticators?.results?.find(item => item.verified === true),
    [data],
  );
  const unverifiedAuthenticators = useMemo(
    () =>
      authenticators?.results?.filter(
        item => item.verified === false && item.id !== token?.id,
      ),
    [authenticators],
  );

  useEffect(() => {
    // removing unverified authenticators, otherwise new authenticator can't be set
    if (unverifiedAuthenticators?.length) {
      Promise.all(
        unverifiedAuthenticators.map(item => deleteMfaAuthenticator(item.id))
      ).catch(error => {
        console.error('Error deleting unverified authenticators:', error);
      });
    }
  }, [unverifiedAuthenticators]);

  const { setMfaStepCompleted } = useMfaSuccess({
    tempAuth,
    setTempAuth,
    onSuccess,
  });

  useEffect(() => {
    if (!authConfig?.mfa) setMfaStepCompleted(true);
  }, []);

  useEffect(() => {
    if (verifiedAuthenticator) setMfaStepCompleted(true);
  }, [verifiedAuthenticator]);

  async function getToken() {
    if (!token) {
      let _token = null;
      try {
        _token = await createMFAAuthenticator('totp');
        setToken(_token);
      } catch (e) {
        setError(e.message);
      }
    }
    setLoading(false);
  }


  async function sendSMS({ setSubmitting, setFieldError, values }) {
    setSubmitting(true);
    try {
      const mobile = values.number;
      if (mobile !== sms?.details?.mobile) {
        if (sms) {
          await deleteMfaAuthenticator(sms.id);
        }
        const _sms = await createMFAAuthenticator('sms', { mobile });
        setSms(_sms);
      }
      setState('verifySMS');
    } catch (e) {
      setFieldError('number', e.message);
    }
    setSubmitting(false);
  }

  async function enableAuth({ setSubmitting, setFieldError, values }) {
    setSubmitting(true);
    try {
      const resp = await verifyMFA({
        token: values.otp,
        authenticator: token?.id ?? sms?.id,
      });
      if (resp?.status === 'success') {
        showToast({
          text: 'mfa_successfully_enabled',
          variant: 'success',
        });
        await refetch();
      } else {
        throw new Error(resp?.message ?? 'Invalid OTP');
      }
    } catch (e) {
      setFieldError('otp', e.message);
    }
    setSubmitting(false);
  }

  const handleMobileValidityChange = (isValid) => {
    setIsMobileValid(isValid);
  };

  function handleButton(type, formikProps) {
    switch (type) {
      case 'sms':
        setState('sms');
        setIsMobileValid(false);
        resetForm(formikProps);
        break;
      case 'token':
        setState('token');
        setLoading(true);
        resetForm(formikProps);
        getToken();
        break;
      case 'back':
      default:
        setState('landing');
    }
  }

  function resetForm({ setFieldValue, setFieldTouched }) {
    setFieldValue('otp', '');
    setFieldTouched('otp', false);
    setFieldValue('number', '');
    setFieldTouched('number', false);
  }

  function renderLanding(formikProps) {
    const { hideSmsMfa } = settingsConfig;

    return (
      <React.Fragment>
        <View mb={1}>
          <Text align="center" id="mfa_landing_description" />
        </View>

        <Button
          label="token"
          capitalize
          noPadding
          color="primary"
          wide
          onPress={() => {
            handleButton('token', formikProps);
          }}
        />

        {!hideSmsMfa && (
          <View pt={1} w="100%">
            <Button
              label="sms"
              capitalize
              color="primary"
              variant="outlined"
              noPadding
              wide
              onPress={() => handleButton('sms', formikProps)}
            />
          </View>
        )}

        {skip && (
          <View w="100%" pt={1}>
            <Button
              label="skip"
              variant="text"
              noPadding
              color="primary"
              wide
              onPress={() => setMfaStepCompleted(true)}
            />
          </View>
        )}
      </React.Fragment>
    );
  }


  function renderToken(formikProps) {
    if (!token) {
      return (
        <View ph={0.5} pb={2} w={'100%'}>
          <Text align="center" id="unable_to_use_mfa" />
        </View>
      );
    }
    const { issuer, account, key } = token.details;
    const url =
      'otpauth://totp/' +
      issuer +
      ':' +
      account +
      '?secret=' +
      key +
      '&digits=6&issuer=' +
      issuer;
    QRCode.toDataURL(url)
      .then(res => {
        setImageSrc(res);
      })
      .catch(err => {
        console.error(err);
      });

    const outputs = [
      { label: 'issuer', value: issuer, copy: true },
      { label: 'account', value: account, copy: true },
      { label: 'key', value: key, copy: true },
    ];

    return (
      <React.Fragment>
        <View w={'100%'} pb={1}>
          <View aI={'center'} jC={'center'} w={'100%'} pb={0.5}>
            {imageSrc && (
              <Image
                alt={'mfa token'}
                width={220}
                height={220}
                src={imageSrc}
              />
            )}
          </View>
          <OutputList
            items={outputs}
            outputProps={{
              copy: true,
            }}
          />

          <View w={'100%'} pv={1}>
            <Text align="center" id="please_enter_otp_provided_message" />
          </View>
          {error ? (
            <Text p={1} c={'error'} tA={'center'}>
              {error}
            </Text>
          ) : null}
          {renderOTP(formikProps)}
        </View>
        <Button
          label="cancel"
          color="primary"
          variant="text"
          noPadding
          wide
          onPress={() => handleButton('back')}
        />
      </React.Fragment>
    );
  }

  function renderOTP(formikProps) {
    const { values } = formikProps;
    return (
      <View w={'100%'}>
        <Input
          fullWidth
          field={Inputs.otp}
          value={values.otp}
          formikProps={formikProps}
        />
        <View pt={1} pb={0.5} w="100%">
          <Button
            label="submit"
            capitalize
            wide
            type="submit"
            // size="large"
            noPadding
            color="primary"
            disabled={formikProps.isSubmitting || !formikProps.isValid}
            loading={formikProps.isSubmitting}
            onPress={() => enableAuth(formikProps)}
          />
        </View>
      </View>
    );
  }

  function renderSMS(formikProps) {
    const { values, errors, touched, isSubmitting, setFieldValue, setFieldTouched } = formikProps;
    const helperTextString = t(Inputs.mobile_mfa.helper ?? 'mobile_helper');

    return (
      <View aI={'center'} w={'100%'}>
        <View pb={1} aI={'center'} w={'100%'}>
          <Text align={'center'} id="mfa_sms_description" />
        </View>
        <View w={'100%'} aI={'center'}>
          <View aI={'center'} w={'100%'}>
            <MobileInput
              existing={values.number}
              value={values.number}
              onChange={value => {
                setFieldValue('number', value);
              }}
              setFieldTouched={() => setFieldTouched('number', true)}
              setIsValidNumber={handleMobileValidityChange}
              error={Boolean(touched.number && errors.number)}
              helperText={touched.number && errors.number ? errors.number : helperTextString}
            />
          </View>
          <View aI={'center'} pt={1} w={'100%'}>
            <Button
              label="send_sms"
              capitalize
              color="primary"
              wide
              type="submit"
              noPadding
              disabled={isSubmitting || !isMobileValid}
              loading={isSubmitting}
              onPress={() => sendSMS(formikProps)}
            />
            <View pt={1} w="100%">
              <Button
                noPadding
                label="back"
                color="primary"
                variant="text"
                wide
                onPress={() => handleButton('back')}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }

  function renderVerifySMS(formikProps) {
    const { values } = formikProps;
    return (
      <React.Fragment>
        <View aI={'center'} w={'100%'}>
          <Text
            align={'center'}
            p={0.5}
            id="please_enter_number"
            context={{ number: values.number }}
          />
          <View w={'100%'} aI={'center'}>
            {renderOTP(formikProps)}
          </View>
        </View>
        <Button
          wide
          noPadding
          color="primary"
          label="cancel"
          variant="text"
          onPress={() => handleButton('back')}
        />
      </React.Fragment>
    );
  }

  function renderRouter(formikProps) {
    // During auth flow, don't show the deletion screen - the useEffect will handle completion
    if (Boolean(verifiedAuthenticator)) {
      // Show a loading state while the useEffect processes the completion
      return <Spinner />;
    }

    switch (state) {
      case 'token':
        return renderToken(formikProps);
      case 'sms':
        return renderSMS(formikProps);
      case 'verifySMS':
        return renderVerifySMS(formikProps);
      default:
        return renderLanding(formikProps); // if no state is selected then renderLanding
    }
  }

  function validation(values) {
    if (state.match(/token|verifySMS/)) {
      const schema = yup.object().shape({
        otp: yup
          .string()
          .required('OTP is required')
          .matches(/^\d{5,6}$/, 'OTP must be 5 or 6 digits')
          .test(
            'len',
            'OTP must be 5 or 6 digits',
            val => val && (val.length === 5 || val.length === 6),
          ),
      });
      let errors = {};
      try {
        errors = schema.validateSync(values);
      } catch (e) {
        errors = e;
      }
      if (errors.path) {
        return {
          [errors.path]: errors.message,
        };
      }
    } else if (state === 'sms') {
      if (!values.number || values.number.indexOf('+') === -1) {
        return { number: t('include_country_code_error', 'Please include a country code starting with +') };
      }
      const isValid = isValidMobile(values.number);
      if (!isValid) {
        return { number: t('valid_mobile_number_error', 'Please enter a valid mobile number') };
      }
    }
  }

  return (
    <Formik
      initialValues={{
        otp: '',
        number: '',
      }}
      validate={validation}
      validateOnChange={true}
      validateOnBlur={true}
      >
      {formikProps =>
        isLoading || loading ? (
          <Spinner />
        ) : (
          <>
            {authConfig?.mfa === '' ? (
              <div></div>
            ) : (
              <Form style={{ width: '100%' }}>{renderRouter(formikProps)}</Form>
            )}
          </>
        )
      }
    </Formik>
  );
}
