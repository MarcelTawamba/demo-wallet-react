import React from 'react';
import * as yup from 'yup';

import Form from 'components/layout/FormNew';
import PageTitle from 'components/layout/page/PageTitle';
import PageContent from 'components/layout/page/PageContent';
import PageButtons from 'components/layout/page/PageButtons';
import { useHistory } from 'react-router-dom';

import Input from 'components/inputs/Input';
import { Formik } from 'formik';
import { redeemVoucher } from '../../../products/config/inputs';

export default function ReedemVoucherInputPage(props) {
  const { setCode, setError } = props;
  const history = useHistory();

  const validationSchema = yup.object().shape({
    code: yup.string().required('Voucher code must be provided'),
  });

  function handleSubmit(formikProps) {
    const { values } = formikProps;
    const { code } = values;
    setError('');
    setCode(code);
    history.push('/pos/redeem_voucher/result/');
  }

  return (
    <Form center>
      <PageTitle
        handleBack={() => history.push('/pos/redeem_voucher/')}
        back
        align="center"
        titleId="redeem_voucher"
      />
      <Formik
        initialValues={{ code: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}>
        {formikProps => (
          <form>
            <PageContent>
              <Input formikProps={formikProps} field={redeemVoucher.code} />
            </PageContent>

            <PageButtons
              layout="vertical"
              items={[
                {
                  id: 'redeem',
                  type: 'submit',
                  onClick: () => handleSubmit(formikProps),
                  disabled: !formikProps.isValid || formikProps.isSubmitting,
                  loading: formikProps.isSubmitting,
                },
                {
                  id: 'scan_qr',
                  variant: 'text',
                  onClick: () => history.push('/pos/redeem_voucher/scan/'),
                },
              ]}
            />
          </form>
        )}
      </Formik>
    </Form>
  );
}
