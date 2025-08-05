import React, { useState, useEffect } from 'react';
import * as yup from 'yup';
import { get } from 'lodash';
import * as authInputs from 'config/inputs';
import { validateMobile } from 'util/validation';
import { initWithoutToken, initWithToken, login } from 'util/rehive';
import FormikForm from 'components/inputs/FormikForm';
import { parseUrl } from 'util/general';
import { Box } from '@material-ui/core';
import { Button } from 'components/inputs/Button';
import { trackFlow } from 'util/tracking';

function useInputs(authConfig) {
  const { identifier } = authConfig;

  let inputs = [];
  inputs.push({
    name: identifier === 'mobile' ? identifier : 'email',
    edit: true,
  });
  inputs.push({ name: 'password', edit: true });

  const fields = inputs.map(input => {
    const temp = authInputs[input.name];
    return { ...temp, value: '' };
  });
  return { inputs, fields };
}

function validate(values, config) {
  try {
    let { mobile } = values;

    let schema = {
      password: yup
        .string()
        .min(8, 'Must be a minimum of 8 characters')
        .required('Password is required'),
    };

    if (config.identifier !== 'mobile')
      schema.email = yup
        .string()
        .email('Please enter a valid email')
        .required('Email is required');

    let errors = {};
    try {
      errors = yup.object().shape(schema).validateSync(values);
    } catch (e) {
      errors = e;
    }

    if (errors.path) {
      return {
        [errors.path]: errors.message,
      };
    }

    // turn this into a schema type
    if (config.identifier === 'mobile') {
      if (mobile?.indexOf('+') === -1) mobile = '+' + mobile;

      let validationResult = validateMobile(mobile);

      if (typeof validationResult === 'string')
        return { mobile: validationResult };
    }

    return {};
  } catch (e) {
    console.log('TCL: validation -> e', e);
  }
}

const LoginPage = props => {
  const {
    authConfig,
    company,
    onSuccess,
    onRegister,
    onForgot,
    setTempAuth,
    onGroup,
    location,
  } = props;
  const initialValues = parseUrl(location);
  const { inputs, fields } = useInputs(authConfig);
  const [authResponse, setAuthResponse] = useState(null);
  const [isAuthProcessing, setIsAuthProcessing] = useState(false);

  useEffect(() => {
    if (authResponse) {
      setIsAuthProcessing(true);
      setTempAuth(authResponse);
      initWithToken(authResponse.token);
      setAuthResponse(null);
    }
  }, [authResponse, setTempAuth]);

  // Use a callback approach to ensure tempAuth is set before calling success
  useEffect(() => {
    if (isAuthProcessing && authResponse === null) {
      // Auth processing is complete, safe to call onSuccess
      onSuccess();
      setIsAuthProcessing(false);
    }
  }, [isAuthProcessing, authResponse, onSuccess]);

  async function handleSubmit(formikBag) {
    const { setStatus, setFieldValue, setFieldTouched, values, setSubmitting, isSubmitting } =
      formikBag;
    
    if (isSubmitting) {
      return;
    }
    
    const { email, password, company: companyID, mobile } = values;
    setSubmitting(true);
    const allow_session_durations = get(
      company,
      ['settings', 'allow_session_durations'],
      false,
    );
    const session_duration =
      authConfig?.session_duration?.web ??
      authConfig?.session_duration ??
      86400;

    let success = false;

    try {
      let response;
      let data = {
        company: companyID,
        user: authConfig.identifier === 'mobile' ? mobile : email,
        password,
      };
      if (
        allow_session_durations &&
        session_duration &&
        typeof session_duration === 'number'
      ) {
        data.session_duration = session_duration;
      }

      initWithoutToken();
      response = await login(data);
      setAuthResponse(response);
      success = true;
    } catch (error) {
      setFieldValue('password', '');
      setFieldTouched('password', false);
      setStatus({ error: error.message });
    } finally {
      trackFlow('login', 'form', null, 'submitted', {
        success,
      });
      setSubmitting(false);
    }
  }

  function actions(formikProps) {
    let items = [
      {
        id: 'log_in',
        capitalize: true,
        type: 'submit',
        onPress: (e) => {
          e.preventDefault();
          if (!formikProps.isSubmitting) {
            handleSubmit(formikProps);
          }
        },
        disabled: !formikProps.isValid || formikProps.isSubmitting,
        loading: formikProps.isSubmitting,
      },
    ];
    if (!authConfig.disableRegister) {
      items.push({
        id: `register_link_on_login`,
        onPress: () => {
          trackFlow('login', 'form', ['register button'], 'clicked');
          authConfig.group ? onGroup() : onRegister();
        },
        variant: 'text',
        color: 'primary',
      });
    }
    return items;
  }

  return (
    <FormikForm
      content={
        <Box display="flex" width="100%" justifyContent="flex-end">
          <Button
            {...{
              label: 'forget_password',
              onPress: () => {
                trackFlow('login', 'form', ['forgot password'], 'clicked');
                onForgot();
              },
              wide: false,
              variant: 'text',
              color: 'primary',
              noPadding: true,
              size: 'small',
            }}
          />
        </Box>
      }
      editable
      noPadding
      fields={fields}
      initialValues={{ ...initialValues, company: company.id, password: '' }}
      validate={values => validate(values, authConfig)}
      onSubmit={formikProps => handleSubmit(formikProps)}
      actions={actions}
    />
  );
};

export default LoginPage;
