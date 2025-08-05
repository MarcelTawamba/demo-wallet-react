import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';

import { Formik, Form } from 'formik';
import * as yup from 'yup';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import Output from 'components/outputs/Output';
import { Button } from 'components/inputs/Button';
import Spinner from 'components/outputs/Spinner';
import * as Inputs from 'config/inputs';
import Input from 'components/inputs/Input';
import MobileInput from 'components/inputs/PhoneInput';
import {
  validateMobileOld as validateMobile,
  isValidMobile,
} from 'util/validation';
import {
  verifyMFA,
  deleteMfaAuthenticator,
  createMFAAuthenticator,
  getMFAAuthenticators,
} from 'util/rehive';
import ResponsiveFlexBox from 'components/layout/ResponsiveFlexBox';
import QR from 'components/outputs/QR';

class TwoFactorForm extends Component {
  state = {
    loading: false,
    state: '',
    token: null,
    sms: null,
    error: '',
    isMobileValid: false,
  };

  async componentDidMount() {
    const response = await getMFAAuthenticators('verified=0');
    const unverifiedAuthenticators = response?.data?.results;
    if (unverifiedAuthenticators?.length) {
      unverifiedAuthenticators.forEach(async item => {
        await deleteMfaAuthenticator(item.id);
      });
    }
  }

  getToken = async () => {
    if (!this.state.token) {
      try {
        const _token = await createMFAAuthenticator('totp');
        this.setState({ loading: false, token: _token, sms: null });
      } catch (e) {
        this.setState({ loading: false, error: e.message });
      }
    } else {
      this.setState({ loading: false });
    }
  };

  disableMFA = async ({ setSubmitting, setStatus }) => {
    const { refresh, context = {}, showToast } = this.props;
    const { items: mfaData } = context;
    const authenticator = mfaData?.data?.results?.find(item => item.verified);
    setSubmitting(true);
    try {
      await deleteMfaAuthenticator(authenticator.id);
      showToast({
        text: 'Multi-factor authentication successfully disabled',
        variant: 'success',
      });
      await refresh();
      this.setState({
        state: 'landing',
      });
    } catch (e) {
      setStatus('error', e.message);
    }
    setSubmitting(false);
  };

  sendSMS = async ({ setSubmitting, setFieldError, values }) => {
    setSubmitting(true);
    try {
      const sms = this.state.sms;
      const mobile = values.number;
      let statesToChange = { state: 'verifySMS', token: null };
      if (mobile !== sms?.details?.mobile) {
        if (sms) {
          await deleteMfaAuthenticator(sms.id);
        }
        const _sms = await createMFAAuthenticator('sms', { mobile });
        statesToChange['sms'] = _sms;
      }
      this.setState(statesToChange);
    } catch (e) {
      setFieldError('number', e.message);
    }
    setSubmitting(false);
  };

  enableAuth = async props => {
    const { setSubmitting, setFieldError, values, setFieldValue } = props;
    const { refresh, showToast } = this.props;
    const { sms, token } = this.state;
    
    // Prevent multiple submissions
    if (props.isSubmitting) {
      return;
    }
    
    setSubmitting(true);
    try {
      const verifyResponse = await verifyMFA({
        token: values.otp,
        authenticator: token?.id ?? sms?.id,
      });
      if (verifyResponse?.status === 'success') {
        showToast({
          text: 'Multi-factor authentication successfully enabled',
          variant: 'success',
        });
        await refresh();
      } else {
        setFieldValue('otp', '');
        showToast({
          text: 'Provide a valid OTP',
          variant: 'error',
        });
      }
    } catch (e) {
      setFieldError('otp', e.message);
    }
    setSubmitting(false);
  };

  handleMobileValidityChange = (isValid) => {
    this.setState({ isMobileValid: isValid });
  };

  handleButton = (type, formikProps) => {
    switch (type) {
      case 'sms':
        this.setState({ state: 'sms', isMobileValid: false });
        this.resetForm(formikProps);
        break;
      case 'token':
        this.setState({ state: 'token', loading: true });
        this.resetForm(formikProps);
        this.getToken();
        break;
      case 'back':
      default:
        this.setState({ state: 'landing' });
    }
  };

  resetForm = ({ setFieldValue, setFieldTouched }) => {
    setFieldValue('otp', '');
    setFieldTouched('otp', false);
    setFieldValue('number', '');
    setFieldTouched('number', false);
  };

  renderLanding = formikProps => {
    const { settingsConfig = {} } = this.props?.context;
    const { hideSmsMfa } = settingsConfig;

    return (
      <React.Fragment>
        <View p={1} ph={2}>
          <Text id="mfa_landing_description" />
        </View>
        <View p={1.5} pt={0.001} fD={'row'} flex aI={'space-around'} w={'100%'}>
          {!hideSmsMfa && (
            <Button
              id="sms"
              capitalize
              color="primary"
              variant="outlined"
              wide
              onPress={() => this.handleButton('sms', formikProps)}
            />
          )}
          <Button
            label="token"
            capitalize
            color="primary"
            wide
            onPress={() => {
              this.handleButton('token', formikProps);
            }}
          />
        </View>
      </React.Fragment>
    );
  };

  renderEnabled = ({ isSubmitting, setSubmitting }) => {
    const { items: mfaData } = this.props?.context ?? {};
    const authenticator = mfaData?.data?.results?.find(item => item.verified);

    return (
      <View ph={2} pt={1}>
        <Text tA={'center'} p={1} id="mfa_description" />
        <Text
          tA={'center'}
          p={1}
          id="mfa_enabled_message"
          context={{ mfaType: this.checkMFA(authenticator) }}
        />
        <View pt={2} pb={3} w={'100%'}>
          <Button
            id="disable"
            capitalize
            style={{ backgroundColor: '#E43', color: '#FFF' }}
            wide
            noPadding
            disabled={isSubmitting}
            loading={isSubmitting}
            onPress={() => this.disableMFA({ setSubmitting })}
          />
        </View>
      </View>
    );
  };

  checkMFA = authenticator => {
    let text = '';
    switch (authenticator.type) {
      case 'totp':
        text = 'Token';
        break;
      case 'sms':
        text = 'SMS';
        break;
      default:
        break;
    }
    return text;
  };

  renderToken = formikProps => {
    const { token, error } = this.state;
    if (!token) {
      return (
        <View ph={0.5} pb={2} w={'100%'}>
          <Text align="center" id="unable_to_use_mfa" />
        </View>
      );
    }
    const { issuer, account, key } = token.details;
    const url = `otpauth://totp/${issuer}:${account}?secret=${key}&digits=6&issuer=${issuer}`;
    // const encUrl = encodeURIComponent(url);

    return (
      <React.Fragment>
        <View ph={1} pt={0.5} w={'100%'}>
          <ResponsiveFlexBox
            left={
              <View pr={1} aI={'center'} jC={'center'}>
                <QR size={160} encodeUri={false}>
                  {url}
                </QR>
              </View>
            }
            right={
              <View w={'100%'} pv={1}>
                <Output label="issuer" value={issuer} copy />
                <Output label="account" value={account} copy />
                <Output label="key" value={key} copy />
              </View>
            }
          />
          <View w={'100%'} p={1}>
            <Text id="please_enter_otp_provided_message" />
          </View>
          {this.renderOTP(formikProps)}

          {error ? (
            <Text p={1} c={'error'} tA={'center'}>
              {error}
            </Text>
          ) : null}
        </View>
        <View w={'100%'} flex aI={'flex-end'}>
          <Button
            id="cancel"
            capitalize
            // color="font"
            variant="text"
            // wide
            onPress={() => this.handleButton('back')}
          />
        </View>
      </React.Fragment>
    );
  };

  renderOTP = formikProps => {
    const { values } = formikProps;
    return (
      <View ph={0.5} w={'100%'} fD={'row'}>
        <Input
          fullWidth
          field={Inputs.otp}
          value={values.otp}
          formikProps={formikProps}
        />
        <View style={{ paddingTop: 6 }} pl={0.5}>
          <Button
            id="submit"
            capitalize
            wide
            type="submit"
            // size="large"
            color="primary"
            disabled={formikProps.isSubmitting || !formikProps.isValid}
            loading={formikProps.isSubmitting}
            onPress={() => this.enableAuth(formikProps)}
          />
        </View>
      </View>
    );
  };

  renderSMS = formikProps => {
    const { values, errors, touched, isValid, isSubmitting, setFieldValue, setFieldTouched } = formikProps;
    const { t } = this.props;

    const helperTextString = t(Inputs.mobile_mfa.helper ?? 'mobile_helper');

    return (
      <View p={1} aI={'center'} w={'100%'}>
        <View pb={1} aI={'center'} w={'100%'}>
          <Text align={'center'} id="mfa_sms_description" />
        </View>
        <View ph={1} pb={0.5} w={'100%'} aI={'center'}>
          <View aI={'center'} w={'100%'}>
            <MobileInput
              existing={values.number}
              value={values.number}
              onChange={value => {
                setFieldValue('number', value);
              }}
              setFieldTouched={() => setFieldTouched('number', true)}
              setIsValidNumber={this.handleMobileValidityChange}
              error={Boolean(touched.number && errors.number)}
              helperText={touched.number && errors.number ? errors.number : helperTextString}
            />
          </View>
          <View aI={'center'} pv={1} w={'100%'}>
            <Button
              id="send_sms"
              capitalize
              color="primary"
              wide
              type="submit"
              disabled={isSubmitting || !this.state.isMobileValid}
              loading={isSubmitting}
              onPress={() => this.sendSMS(formikProps)}
            />
            <Button
              id="back"
              color="primary"
              variant="text"
              onPress={() => this.handleButton('back')}
            />
          </View>
        </View>
      </View>
    );
  };

  renderVerifySMS = formikProps => {
    const { values } = formikProps;
    return (
      <React.Fragment>
        <View p={1} aI={'center'} pb={0} w={'100%'}>
          <Text
            align={'center'}
            p={0.5}
            id="please_enter_number"
            context={{ number: values.number }}
          />

          <View p={0.5} w={'100%'} aI={'center'}>
            {this.renderOTP(formikProps)}
          </View>
        </View>
        <View aI={'flex-end'} jC={'flex-end'} w={'100%'}>
          <Button
            id="cancel"
            variant="text"
            onPress={() => this.handleButton('back')}
          />
        </View>
      </React.Fragment>
    );
  };

  renderRouter(formikProps) {
    let { state } = this.state;
    const { items: mfaData } = this.props?.context ?? {};
    const authenticator = mfaData?.data?.results?.find(item => item.verified);
    const enabled = Boolean(authenticator);
    if (enabled) {
      return this.renderEnabled(formikProps);
    }

    switch (state) {
      case 'token':
        return this.renderToken(formikProps);
      case 'sms':
        return this.renderSMS(formikProps);
      case 'verifySMS':
        return this.renderVerifySMS(formikProps);
      default:
        return this.renderLanding(formikProps);
    }
  }

  validation = values => {
    const { state } = this.state;
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
        return { number: 'Please include a country code starting with +' };
      }
      const isValid = isValidMobile(values.number);
      if (!isValid) {
        return { number: 'Please enter a valid mobile number' };
      }
    }
  };

  render() {
    const { loading, refresh } = this.props;
    const { loading: loading2 } = this.state;

    return (
      <Formik
        initialValues={{
          otp: '',
          number: '',
        }}
        validate={this.validation}
        validateOnChange={true}
        validateOnBlur={true}>
        {formikProps =>
          loading || loading2 ? (
            <Spinner />
          ) : (
            <Form style={{ width: '100%' }}>
              {this.renderRouter(formikProps)}
            </Form>
          )
        }
      </Formik>
    );
  }
}

export default withTranslation('common')(TwoFactorForm);
