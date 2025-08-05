import React from 'react';
import * as authInputs from 'config/inputs';
import * as yup from 'yup';
import { resetPassword } from 'util/rehive';
import FormikForm from 'components/inputs/FormikForm';
import { validateEmail } from 'util/validation';

function validate(values, config) {
  try {
    let schema = {};
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

    return {};
  } catch (e) {
    console.log('TCL: validation -> e', e);
  }
}

const ForgotPasswordPage = props => {
  const { onBack, company, authConfig, email, showToast } = props;

  async function handleSubmit(formikProps) {
    const { setSubmitting, values } = formikProps;
    const { email } = values;
    setSubmitting(true);
    try {
      await resetPassword({
        user: email,
        company: company.id,
      });
      showToast({
        text:
          'Instructions on how to reset your password have been sent to ' +
          email,
        duration: 3000,
      });
      onBack();
    } catch (e) {
      console.log('resetPassword', e);
      formikProps.setFieldError('email', e.message);
    }
    setSubmitting(false);
  }

  function actions(formikProps) {
    let items = [
      {
        label: 'Send recovery email',
        type: 'submit',
        onPress: () => handleSubmit(formikProps),
        disabled: !formikProps.isValid || formikProps.isSubmitting,
        loading: formikProps.isSubmitting,
      },
      {
        label: 'Back',
        variant: 'text',
        onPress: () => onBack(),
      },
    ];
    return items;
  }
  const isInitialValid = !Boolean(validateEmail(email));

  return (
    <FormikForm
      editable
      fields={[authInputs.email]}
      initialValues={{
        email: email ? email : '',
        mobile: '',
        company: company.id,
        password: '',
      }}
      validate={values => validate(values, authConfig)}
      isInitialValid={isInitialValid}
      onSubmit={formikProps => handleSubmit(formikProps)}
      actions={actions}
    />
  );
};

export default ForgotPasswordPage;
