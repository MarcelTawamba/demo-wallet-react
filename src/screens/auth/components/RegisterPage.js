import React, { useEffect, useState } from 'react';
import * as authInputs from 'config/inputs';
import * as yup from 'yup';
import { get, isEmpty } from 'lodash';
import { trackFlow } from 'util/tracking';
import { useSelector } from 'react-redux';
import { validateMobile } from 'util/validation';
import {
  getPublicCompanyGroup,
  initWithoutToken,
  initWithToken,
  register,
  setRefereeCode,
} from 'util/rehive';
import FormikForm from 'components/inputs/FormikForm';
import TermsLabel from './TermsLabel';

import { useConfiguration } from 'components/contexts/ConfigurationContext';
import { paramsToObj, parseUrl } from 'util/general';
import { getCode } from 'country-list';
import { configProfileStateSelector } from 'redux/rehive/selectors';
import IconLabelButton from 'components/inputs/IconLabelButton';
import { useHistory } from 'react-router-dom';
import Spinner from 'components/outputs/Spinner';
import { useKYCLink } from 'hooks/bridgeAPI';
import { currentCompanyServicesSelector } from 'redux/auth/selectors';
import { SplashScreen } from 'components/rehive/SplashScreen';

function useInputs(authConfig, company) {
  const {
    identifier,
    username,
    first_name,
    last_name,
    nationality,
    residency,
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
  if (residency) {
    inputs.push({ name: 'residency' });
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

    if (authConfig.residency)
      schema.residency = yup.string().required('Country of residence is required');

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
    authConfig,
    company,
    onSuccess,
    onLogin,
    tempAuth,
    onBack,
    onGroup,
    setTempAuth,
    location,
  } = props;
  
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUniqueGroup, setIsUniqueGroup] = useState(false);
  const services = useSelector(currentCompanyServicesSelector);
  const { data: kycLinkResponse, isLoading: isKycLinkLoading } = useKYCLink(`${window.location.origin}/bridge-terms/`, services?.bridge_service);
  const [registrationComplete, setRegistrationComplete] = useState(false);

  const history = useHistory();
  function updateGroup(newGroup) {
    trackFlow('register', 'group selection', ['group'], 'clicked', {
      group: newGroup?.name?.toLowerCase(),
    });
    setTempAuth({ ...tempAuth, group: newGroup });
  }
  useEffect(() => {
    async function handleGetGroups() {
      let query = paramsToObj(location?.search);
      setLoading(true);
      if (query?.group) {
        setIsUniqueGroup(true);
        const response = await getPublicCompanyGroup(company.id, query?.group);
        if (response && response.status === 'success') {
          const results = get(response, ['data']);
          setGroups(results);
          updateGroup(results);
          if (results && results.length === 1) {
            setTempAuth({ ...tempAuth, noGroups: true });
            onSuccess();
          }
          setLoading(false);
        } else {
          setLoading(false);
        }
      }
    }
    history.replace(location.pathname);
    if (authConfig.group) {
      handleGetGroups();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [retryingRefereeCode, setRetryingRefereeCode] = useState(false);

  const { group = {}, noGroups } = tempAuth;
  const initialValues = parseUrl(location);

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
      residency,
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
      if (residency) {
        data.residency =
          residency?.length === 2 ? residency : getCode(residency);
      }

      if (!retryingRefereeCode) {
        initWithoutToken();
        response = await register(data);
        setTempAuth({ ...response, register: true });
        initWithToken(response.token);
      }

      if (referral) {
        attachRefereeCode({ code: referral, setStatus })
          .then(() => {
            // Proceed with onSuccess after referral code is attached
            console.log('Referral code attached, proceeding with onSuccess');
            onSuccess();
          })
          .catch(error => {
            console.log(error);
            setSubmitting(false);
          });
      } else {
        // Proceed with onSuccess directly
        console.log('No referral code, proceeding with onSuccess');
        onSuccess();
      }
      
      success = true;
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
        onLogin();
      },
      variant: 'text',
      color: 'primary',
    });
    return items;
  }
  const availableIcons = ['merchant', 'supplier', 'customer'];

  const { name, label, icon } = group;

  if (registrationComplete) {
    return <SplashScreen />;
  }

  if (loading && isUniqueGroup) {
    return <Spinner />;
  }

  return (
    <FormikForm
      onBack={
        group && !noGroups
          ? {
              onPress: onGroup,
              id: name,
              label: label,
              icon:
                icon ??
                (availableIcons.includes(name)
                  ? name
                  : name === 'business'
                  ? 'merchant'
                  : 'user'),
            }
          : {
              onPress: onBack,
              id: name,
              label: 'back',
            }
      }
      editable
      fields={fields}
      initialValues={{
        ...initialValues,
        nationality: authConfig?.defaultNationality,
        residency: authConfig?.defaultResidency,
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
