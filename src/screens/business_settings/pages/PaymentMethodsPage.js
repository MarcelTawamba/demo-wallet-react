import React from 'react';
import { Formik } from 'formik';

import PageContent from 'components/layout/page/PageContent';
import Input from 'components/inputs/Input';
import PageButtons from 'components/layout/page/PageButtons';

export default function PaymentMethodsPage(props) {
  console.log('PaymentMethodsPage -> props', props);
  return (
    <Formik
      initialValues={{ percentage: '100' }}
      // onSubmit={(values, formikBag) => this.handleSubmit(values, formikBag)}
    >
      {formikProps => (
        <React.Fragment>
          {/* <PageContent horizontal={5}> */}
          <Input
            formikProps={formikProps}
            field={{
              label: 'Pay with bitcoin on checkout',
              icon: 'XBT',
              id: 'bitcoin',
              type: 'checkbox',
            }}
          />
          <Input
            formikProps={formikProps}
            field={{
              label: 'Pay with wallet on checkout',
              icon: 'wallet',
              id: 'wallet',
              type: 'checkbox',
            }}
          />
          {/* </PageContent> */}
          {/* <PageButtons
            items={[
              {
                label: 'SAVE',
                type: 'submit',
                onPress: () => this.handleSubmit(formikProps),
                disabled:
                  true || !formikProps.isValid || formikProps.isSubmitting,
                loading: formikProps.isSubmitting,
              },
            ]}
            layout={'vertical'}
          /> */}
        </React.Fragment>
      )}
    </Formik>
  );
}
