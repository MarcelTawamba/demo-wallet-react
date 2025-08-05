import React, { useState } from 'react';
import * as yup from 'yup';
import { Formik } from 'formik';
import { get } from 'lodash';
import Info from 'components/outputs/Info';
import Form from 'components/layout/FormNew';
import PageTitle from 'components/layout/page/PageTitle';
import PageContent from 'components/layout/page/PageContent';
import PageButtons from 'components/layout/page/PageButtons';
import Input from 'components/inputs/Input';
import { customSale } from 'screens/products/config/inputs';
import AmountInput from 'screens/accounts/components/AmountInput';
import moment from 'moment';
import { createBusinessInvoice } from 'util/rehive';
import { toDivisibility } from 'util/general';
import ErrorOutput from 'components/common/outputs/Error';

export default function CustomSalePage(props) {
  const { setItems, history, context } = props;

  const [isSubmitting, setSubmitting] = useState(false);
  const [responseError, setResponseError] = useState('');

  const { currency, business } = context;

  if (!currency) return null;

  const verified = business?.status === 'verified';

  const validationSchema = yup.object().shape({
    amount: yup
      .number('Amount must be a number')
      .positive('Amount must be more than 0')
      .required('Amount must be provided'),
  });

  function handleSubmit(formikProps) {
    const { values } = formikProps;
    const resp = onSubmit(
      values,
      {},
      { ...props, setSubmitting, context, history },
    );
  }

  async function onSubmit(values, control, props = {}, status = 'initiated') {
    setResponseError('');
    const { history, setItem, setSubmitting, context } = props;
    let resp = null;
    const { business = {} } = context;
    if (typeof setSubmitting === 'function') setSubmitting(status);

    const { currency = {} } = business;
    const { description, amount, baseAmount } = values;
    const request_amount = toDivisibility(baseAmount, currency.divisibility);
    const items = [{ name: description, price: baseAmount, quantity: 1 }];

    let data = {
      request_reference: description ? description : 'Point of sale invoice',
      request_amount,
      status,
      send_request_on: moment(new Date()).valueOf(),
      metadata: {
        service_business: { items },
      },
    };

    if (request_amount === 0) delete data.request_amount;

    resp = await createBusinessInvoice(business?.id, data);

    if (resp?.status === 'success') {
      setItem(resp?.data);

      history.push('/pos/sales/qr/');
    } else {
      setResponseError(resp?.message ?? 'something_went_wrong');
    }
    if (typeof setSubmitting === 'function') setSubmitting(false);
    return resp;
  }

  return (
    <Form center>
      <PageTitle
        titleId="new_sale"
        handleBack={() => {
          setItems({});
          history.push('/pos/');
        }}
        back
        align="center"
      />
      <Formik
        initialValues={{
          amount: '',
          description: '',
          currency: get(currency, ['code']),
        }}
        validationSchema={validationSchema}>
        {formikProps => (
          <form>
            <PageContent>
              {!verified && (
                <Info mb={2} id="verified_business_required_for_custom_sale" />
              )}
              <AmountInput
                {...{
                  formikProps,
                  enableCurrency: false,
                  disabled: !verified,
                  currency: business,
                }}
              />
              <Input
                formikProps={formikProps}
                field={{ ...customSale.description, disabled: !verified }}
              />
            </PageContent>
            {responseError && <ErrorOutput id={responseError} />}
            <PageButtons
              layout="vertical"
              items={[
                {
                  id: 'continue',
                  onClick: () => handleSubmit(formikProps),
                  disabled:
                    !verified ||
                    !formikProps.isValid ||
                    formikProps.isSubmitting ||
                    isSubmitting,
                  loading: formikProps.isSubmitting,
                },
              ]}
            />
          </form>
        )}
      </Formik>
    </Form>
  );
}
