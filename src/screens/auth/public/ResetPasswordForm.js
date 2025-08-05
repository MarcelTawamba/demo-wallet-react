import React, { useState } from 'react';
import * as yup from 'yup';
import { Link, useLocation } from 'react-router-dom';

import { Formik, Form } from 'formik';
import { Button } from 'components/inputs/Button';
import { View } from 'components/layout/View';
import Input from 'components/inputs/Input';
import ErrorOutput from 'components/outputs/Error';
import { paramsToObj } from 'util/general';
import * as _inputs from 'config/inputs';
import Text from 'components/outputs/Text';
import Logo from 'components/rehive/Logo';
import {
  resetPasswordConfirm,
  getPublicCompany,
  getCompanyAppConfig,
  resetPassword,
} from 'util/rehive';
import AuthForm from 'components/layout/AuthForm';
import { SplashScreen } from 'components/rehive/SplashScreen';
import { MuiThemeProvider, createTheme } from '@material-ui/core';
import { useTheme, ThemeProvider } from 'components/app/context';
import { useQuery } from 'react-query';
import muiConfig from 'config/config/mui';

import { useConfiguration } from 'components/contexts/ConfigurationContext';
import { useToast } from 'components/contexts/ToastContext';

export default function ResetPasswordForm() {
  const location = useLocation();
  const { showToast } = useToast();

  const params = paramsToObj(location?.search ?? '');
  const [showResendButton, setShowResendButton] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showResendSuccess, setShowResendSuccess] = useState(false);
  let { config: client } = useConfiguration();

  const companyId = client?.company ? client?.company : params?.company ?? '';
  const { email, token, uid } = params;
  const emailWithPlus = email?.includes(' ')
    ? email?.replace(/ /g, '+')
    : email;
  const queryCompany = useQuery(
    ['company', companyId],
    () => getPublicCompany(companyId, true),
    {
      enabled: Boolean(companyId),
    },
  );
  const queryCompanyConfig = useQuery(
    ['companyConfig', companyId],
    () => getCompanyAppConfig(companyId),
    { enabled: Boolean(companyId) },
  );

  const company = queryCompany?.data;

  async function handleSubmit(values, props) {
    const { password, confirm_password } = values;
    const { setStatus, setFieldTouched, setFieldValue, setSubmitting } = props;
    try {
      const data = {
        new_password: password,
        token,
        uid,
      };
      await resetPasswordConfirm(data);
      setStatus({ success: true, error: '' });
    } catch (error) {
      setShowResendButton(true);
      setStatus({ error: error.message, success: false });
    }
    setFieldValue('password', '');
    setFieldValue('confirm_password', '');
    setFieldTouched('password', false);
    setFieldTouched('confirm_password', false);
    setSubmitting(false);
  }
  async function handleResendLink() {
    setLoading(true);
    try {
      await resetPassword({
        user: emailWithPlus,
        company: company.id,
      });
      setLoading(false);
      setShowResendSuccess(true);
    } catch (e) {
      setLoading(false);
      console.log('resetPassword', e);
    }
  }

  const schema = yup.object().shape({
    password: yup
      .string()
      .min(8, 'Must be a minimum of 8 characters')
      .required('Password is required'),
    confirm_password: yup
      .string()
      .min(8, 'Must be a minimum of 8 characters')
      .required('Confirm password is required')
      .oneOf([yup.ref('password'), null], 'Passwords must match'), // Validate password match
  }); // automate this?
  const { colors: baseColors, design } = useTheme();
  const { colors = baseColors } = queryCompanyConfig?.data?.config ?? {};
  const { primary } = colors;
  const newTheme = createTheme({
    ...muiConfig,
    palette: { primary: { main: primary, contrastText: '#FFF' } },
  });

  return companyId && !company ? (
    <SplashScreen />
  ) : (
    <AuthForm
      header={
        <Logo
          noBorder
          type="rehive-icon"
          height={100}
          width={100}
          image={company?.icon ?? ''}
        />
      }
      title={'Set password'}
      footer={
        <Link to={'/'}>
          <Button variant="text">
            <Text variant={'body2'} align={'center'} id="go_to_wallet" />
          </Button>
        </Link>
      }>
      <Formik
        initialValues={{
          email: '',
        }}
        // isInitialValid={type === 'forgot' && email}
        validationSchema={schema}
        onSubmit={(values, formikBag) => handleSubmit(values, formikBag)}>
        {formikProps => (
          <MuiThemeProvider theme={newTheme}>
            <ThemeProvider value={{ colors, design }}>
              <Form>
                <View aI={'center'} jC={'space-around'} ph={0.5}>
                  {formikProps.status && formikProps.status.success ? (
                    <Text align="center">Password successfully set</Text>
                  ) : (
                    <React.Fragment>
                      <Text align="center">Please enter your new password</Text>
                      <Input
                        field={_inputs.password}
                        formikProps={formikProps}
                      />
                      <Input
                        field={_inputs.confirm_password}
                        formikProps={formikProps}
                      />
                      <ErrorOutput>
                        {formikProps.status && formikProps.status.error}
                      </ErrorOutput>
                      <View ph={2} pt={1} aI={'center'} w={'100%'}>
                        <Button
                          type="submit"
                          color="primary"
                          variant={'contained'}
                          size="large"
                          wide
                          disabled={
                            !formikProps.isValid || formikProps.isSubmitting
                          }
                          loading={formikProps.isSubmitting}>
                          {'SET PASSWORD'}
                        </Button>
                      </View>
                    </React.Fragment>
                  )}
                </View>
              </Form>
            </ThemeProvider>
          </MuiThemeProvider>
        )}
      </Formik>
      {showResendButton && (
        <View ph={2.5} pt={0.75} aI={'center'} w={'100%'}>
          {!showResendSuccess ? (
            <Button
              type="submit"
              color="primary"
              variant={'outlined'}
              size="large"
              onClick={handleResendLink}
              wide
              loading={loading}>
              {'RESEND LINK'}
            </Button>
          ) : (
            <Text align="center" id={'pass_word_reset_email'} />
          )}
        </View>
      )}
    </AuthForm>
  );
}
