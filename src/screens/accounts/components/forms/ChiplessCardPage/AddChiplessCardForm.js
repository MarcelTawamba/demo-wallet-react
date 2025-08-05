import React from 'react';
import * as yup from 'yup';
import { Formik } from 'formik';

import { createChiplessCard, updateChiplessCard } from 'util/rehive';
import Input from 'components/inputs/Input';
import PageButtons from 'components/layout/page/PageButtons';

export default function AddChiplessCardForm(props) {
  const { currency, fetchData, setState, item, config } = props;
  const schema = yup.object().shape({
    pin: yup
      .string()
      .min(4, 'Must be minimum 4 characters')
      .max(5, 'Must be maximum 5 characters')
      .required('Pin is required'),
  });

  async function handleSubmit(formikProps) {
    const { setSubmitting, setFieldError, values } = formikProps;
    setSubmitting(true);
    const { pin } = values;
    let data = {
      pin,
    };
    let resp = null;
    if (item && item.id) {
      resp = await updateChiplessCard(item.id, data);
    } else {
      data.account = currency.account;
      resp = await createChiplessCard(data);
    }
    if (resp.status === 'success') {
      fetchData();
      setState('');
    } else {
      setFieldError('pin', resp.message);
    }

    setSubmitting(false);
  }

  let buttons = formikProps => [
    {
      label: item ? 'CHANGE PIN' : 'ADD CARD',
      color: 'primary',
      wide: true,
      loading: formikProps.isSubmitting,
      disabled: !formikProps.isValid || formikProps.isSubmitting,
      onPress: () => handleSubmit(formikProps),
    },
  ];

  return (
    <Formik initialValues={{ pin: '' }} validationSchema={schema}>
      {formikProps => (
        <>
          <Input
            formikProps={formikProps}
            field={{
              name: 'pin',
              id: 'pin',
              label: 'Card pin',
              helper: 'Must be 4 or 5 characters',
              type: 'password',
            }}
          />
          <PageButtons items={buttons(formikProps)} layout="vertical" />
        </>
      )}
    </Formik>
  );
}
