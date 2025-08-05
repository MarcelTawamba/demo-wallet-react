import React from 'react';
import * as yup from 'yup';
import { get } from 'lodash';
import { Formik } from 'formik';

import PageTitle from 'components/layout/page/PageTitle';
import PageContent from 'components/layout/page/PageContent';
import PageButtons from 'components/layout/page/PageButtons';

import * as Inputs from 'config/inputs';
import Input from 'components/inputs/Input';
import { setStellarUsername } from 'util/rehive';

async function submitUsername(
  formikProps,
  showToast,
  fetchCrypto,
  currency,
  handleBack,
) {
  const { setSubmitting, values, setFieldError } = formikProps;
  const { crypto } = currency;
  setSubmitting(true);

  try {
    const response = await setStellarUsername(
      { username: values.federationAddress },
      crypto?.network === 'testnet',
    );
    if (response.status === 'success') {
      fetchCrypto(crypto?.code);
      showToast({ text: 'Username set', variant: 'success' });
      handleBack();
    } else {
      setFieldError(
        'federationAddress',
        get(response, ['data', 'username', 'error'], 'Unable to set username'),
      );
    }
  } catch (error) {
    console.log('TCL: ReceiveForm -> submitUsername -> error', error);
    setFieldError('federationAddress', error.message);
  }
  setSubmitting(false);
}

const SetFederationUsername = props => {
  const { handleBack, showToast, fetchCrypto, currency } = props;
  const initialValues = {
    federationAddress: '',
  };
  const schema = {
    federationAddress: yup.string().required('Address is required'),
  };

  const validationSchema = yup.object().shape(schema); // automate this?

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema}>
      {formikProps => (
        <React.Fragment>
          <PageTitle
            back
            titleId="set_federation_address"
            handleBack={handleBack}
          />
          <PageContent>
            <Input
              field={get(Inputs, ['federationAddress'])}
              formikProps={formikProps}
            />
          </PageContent>
          <PageButtons
            layout={'material'}
            items={[
              {
                id: 'cancel',
                variant: 'text',
                disabled: formikProps.isSubmitting,
                onPress: handleBack,
                capitalize: true,
              },
              {
                id: 'save',
                type: 'submit',
                variant: 'text',
                disabled: formikProps.isSubmitting || !formikProps.isValid,
                loading: formikProps.isSubmitting,
                onPress: () =>
                  submitUsername(
                    formikProps,
                    showToast,
                    fetchCrypto,
                    currency,
                    handleBack,
                  ),
                capitalize: true,
              },
            ]}
          />
        </React.Fragment>
      )}
    </Formik>
  );
};

export default SetFederationUsername;
