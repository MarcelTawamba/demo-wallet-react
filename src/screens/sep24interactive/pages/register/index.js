import React, { useEffect, useState } from 'react';
import * as authInputs from 'config/inputs';
import * as yup from 'yup';
import { get } from 'lodash';
import { trackFlow } from 'util/tracking';
import { useSelector, useDispatch } from 'react-redux';
import { configAuthSelector } from 'redux/rehive/selectors';
import { onAuthSuccess } from 'redux/auth/actions';
import { validateMobile } from 'util/validation';
import {
  initWithoutToken,
  initWithToken,
  register,
  setRefereeCode,
} from 'util/rehive';
import FormikForm from 'components/inputs/FormikForm';
import TermsLabel from 'screens/auth/components/TermsLabel';

import { useConfiguration } from 'components/contexts/ConfigurationContext';
import { parseUrl } from 'util/general';
import { getCode } from 'country-list';
import { currentCompanyServicesSelector } from 'redux/auth/selectors';
import { configProfileStateSelector } from 'redux/rehive/selectors';
import IconLabelButton from 'components/inputs/IconLabelButton';

function useInputs(authConfig, company) {
  const {
    identifier,
    username,
    first_name,
    last_name,
    nationality,
    terms,
    confirm_password,
  } = authConfig;

  const services = useSelector(currentCompanyServicesSelector);
  const profileConfig = useSelector(configProfileStateSelector);

  let { config: client } = useConfiguration();

  let { privacy_policy_url, terms_and_conditions_url } = client;
  if (company) {
    const { settings } = company;

    const overridePrivacyPolicyUrl = get(
      settings,
      'privacy_policy_url',
      privacy_policy_url,
    );
    if (overridePrivacyPolicyUrl) privacy_policy_url = overridePrivacyPolicyUrl;
    const overrideTermsAndConditionsUrl = get(
      settings,
      'terms_and_conditions_url',
      terms_and_conditions_url,
    );
    if (overrideTermsAndConditionsUrl)
      terms_and_conditions_url = overrideTermsAndConditionsUrl;
  }

  let inputs = [];
  inputs.push({ name: identifier === 'mobile' ? identifier : 'email' });

  if (username) {
    inputs.push({ name: 'username' });
  }
  if (first_name) {
    inputs.push({ name: 'first_name' });
  }
  if (last_name) {
    inputs.push({ name: 'last_name' });
  }
  if (nationality) {
    inputs.push({ name: 'nationality' });
  }
  inputs.push({ name: 'password' });
  if (confirm_password) {
    inputs.push({ name: 'confirm_password' });
  }

  if (services?.rewards_service && profileConfig?.referral?.enabled)
    inputs.push({ name: 'referral' });

  let fields = inputs.map(input => {
    const temp = authInputs[input.name];
    return { ...temp, value: '' };
  });
  // fields.push({ id: 'terms', type: 'terms', ...termsConfig });
  fields.push({
    ...authInputs['terms'],
    label: (
      <TermsLabel
        privacy_policy_url={privacy_policy_url}
        terms_and_conditions_url={terms_and_conditions_url}
      />
    ),
  });
  return { inputs, fields };
}

function validate(values, authConfig) {
  try {
    let { mobile } = values;
    let schema = {
      password: yup
        .string()
        .min(8, 'Must be a minimum of 8 characters')
        .required('Password is required'),
      terms: yup
        .boolean()
        .required('Please accept terms')
        .oneOf([true], 'Please accept terms'),
    };

    if (authConfig.identifier !== 'mobile')
      schema.email = yup
        .string()
        .email('Please enter a valid email')
        .required('Email is required');

    if (authConfig.first_name)
      schema.first_name = yup.string().required('First name is required');

    if (authConfig.last_name)
      schema.last_name = yup.string().required('Last name is required');

    if (authConfig.username)
      schema.username = yup.string().required('Username is required');

    if (authConfig.nationality)
      schema.nationality = yup.string().required('Nationality is required');

    if (authConfig.terms)
      schema.terms = yup
        .string()
        .required('Please check the terms & conditions');

    if (authConfig.confirm_password)
      schema.confirm_password = yup
        .string()
        .min(8, 'Must be a minimum of 8 characters')
        .required('Confirm password is required')
        .oneOf([yup.ref('password'), null], 'Passwords must match'); // Validate password match

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
    if (authConfig.identifier === 'mobile') {
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

const availableIcons = ['merchant', 'supplier', 'customer'];

const RegisterPage = props => {
  const {
    company,
    onRegisterSuccess,
    onLogin,
    tempAuth,
    onBack,
    onGroup,
    setTempAuth,
    location,
    setUser,
    setSession,
    authConfig,
    history
  } = props;

  const [retryingRefereeCode, setRetryingRefereeCode] = useState(false);

  const { group = {}, noGroups } = tempAuth;
  const dispatch = useDispatch();
  let { inputs, fields } = useInputs(authConfig, company);

  fields = fields.map(x => {
    return { ...x, disabled: retryingRefereeCode && x.name !== 'referral' };
  });

  useEffect(() => {
    if (authConfig.disableRegister) {
      onBack();
    }
  }, [authConfig.disableRegister, onBack]);

  function attachRefereeCode({ code, setStatus }) {
    return new Promise((resolve, reject) => {
      setRefereeCode(code).then(resp => {
        if (resp.status === 'error') {
          setStatus({
            error:
              resp.message === 'Invalid referee code.'
                ? 'Invalid referral code'
                : resp.message,
          });
          setRetryingRefereeCode(true);
          reject();
        }
        resolve();
      });
    });
  }

  async function handleSubmit(formikProps) {
    const { setStatus, setFieldValue, setFieldTouched, values, setSubmitting } =
      formikProps;
    setSubmitting(true);
    const {
      email,
      password,
      confirm_password,
      terms,
      company,
      first_name,
      last_name,
      username,
      mobile,
      group: groupUrl,
      nationality,
      referral,
    } = values;

    const allow_session_durations = get(
      company,
      ['settings', 'allow_session_durations'],
      false,
    );
    const session_duration = get(authConfig, ['session_duration'], 86400);

    let success = false;

    try {
      let response;
      let data = {
        company,
        email,
        mobile,
        first_name,
        last_name,
        username,
        password: password,
        terms_and_conditions: terms,
        privacy_policy: terms,
      };
      if (group?.name || groupUrl) {
        data.groups = [group ? group?.name : groupUrl ? groupUrl : ''];
      }
      if (allow_session_durations && session_duration) {
        data.session_duration = session_duration;
      }
      if (nationality) {
        data.nationality =
          nationality?.length === 2 ? nationality : getCode(nationality);
      }

      const token = response?.token;
      const user = response?.user;
      if (!retryingRefereeCode) {
        initWithoutToken();
        response = await register(data);
        setTempAuth({ ...response, register: true });
        initWithToken(response.token);
        setSession(response.token);
        // dispatch(onAuthSuccess({ user: response?.user, token }));
        setUser(response?.user);
      }

      if (referral)
        attachRefereeCode({ code: referral, setStatus })
          .then(() => onRegisterSuccess(response?.user, response?.token))
          .catch(error => {
            console.log(error);
            setSubmitting(false);
          });
      // .finally(() => );
      else onRegisterSuccess(response?.user, response?.token);
    } catch (error) {
      console.log('handleSubmit', error);
      setFieldValue('password', '');
      setFieldTouched('password', false);
      setFieldValue('confirm_password', '');
      setFieldTouched('confirm_password', false);
      setStatus({ error: error.message });
      setSubmitting(false);
    } finally {
      trackFlow('register', 'form', null, 'submitted', {
        success,
      });
    }
  }

  function actions(formikProps) {
    let items = [
      {
        id: retryingRefereeCode
          ? formikProps.values.referral
            ? 'retry'
            : 'continue'
          : 'register',
        capitalize: true,
        type: 'submit',
        onPress: () => handleSubmit(formikProps),
        disabled: !formikProps.isValid || formikProps.isSubmitting,
        loading: formikProps.isSubmitting,
      },
    ];
    items.push({
      id: `login_link_on_register`,
      type: 'button',
      onPress: () => {
        trackFlow('register', 'form', ['login button'], 'clicked');
        history.goBack();
      },
      variant: 'text',
      color: 'primary',
    });
    return items;
  }
  const availableIcons = ['merchant', 'supplier', 'customer'];

  const { name, label, icon } = group;

  return (
    <FormikForm
      editable
      fields={fields}
      initialValues={{
        nationality: authConfig?.defaultNationality,
        company: company.id,
        password: '',
        confirm_password: '',
      }}
      validate={values => validate(values, authConfig)}
      onSubmit={formikProps => handleSubmit(formikProps)}
      actions={actions}
    />
  );
};

export default RegisterPage;
