import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import { get } from 'lodash';
import {
  getChiplessCardLimits,
  updateChiplessCardLimit,
  createChiplessCardLimit,
} from 'util/rehive';
import { formatDivisibility, getCurrencyCode } from 'util/general';
import Spinner from 'components/outputs/Spinner';
import { View } from 'components/layout/View';
import Input from 'components/inputs/Input';
import OutputList from 'components/lists/OutputList';
import ErrorOutput from 'components/outputs/Error';
import { Button } from 'components/inputs/Button';
import ButtonList from 'components/lists/ButtonList';
import PageButtons from 'components/layout/page/PageButtons';

export default function ChiplessCardLimits(props) {
  const { currency, cards } = props;
  const cardId = get(cards, [0, 'id']);
  const [limits, setLimits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const [error, setError] = useState('');

  async function fetchData() {
    setLoading(true);
    const resp = await getChiplessCardLimits(cardId);
    if (resp.status === 'success') {
      setLimits(get(resp, ['data', 'results'], []));
    } else {
      setError('Unable to retrieve cards');
    }
    setLoading(false);
  }
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const limitTnx = limits.find(
    item =>
      item.type === 'max' && item.currency.code === currency?.currency?.code,
  );
  const limitDay = limits.find(
    item =>
      item.type === 'day_max' &&
      item.currency.code === currency?.currency?.code,
  );
  const limitMonth = limits.find(
    item =>
      item.type === 'month_max' &&
      item.currency.code === currency?.currency?.code,
  );

  const limitTnxAmount = formatDivisibility(
    limitTnx ? limitTnx.value : 0,
    currency.currency.divisibility,
  ).toString();
  const limitDayAmount = formatDivisibility(
    limitDay ? limitDay.value : 0,
    currency.currency.divisibility,
  ).toString();
  const limitMonthAmount = formatDivisibility(
    limitMonth ? limitMonth.value : 0,
    currency.currency.divisibility,
  ).toString();

  const outputs = [
    {
      label: 'Per transaction',
      value: limitTnxAmount + ' ' + getCurrencyCode(currency?.currency),
    },
    {
      label: 'Daily transactions',
      value: limitDayAmount + ' ' + getCurrencyCode(currency?.currency),
    },
    {
      label: 'Monthly transactions',
      value: limitMonthAmount + ' ' + getCurrencyCode(currency?.currency),
    },
  ];

  async function updateLimit(newLimit, oldLimit, type) {
    const value = parseFloat(newLimit) * 10 ** currency.currency.divisibility;
    let resp = null;
    let data = {
      type,
      value,
      subtype: 'withdraw_chipless_card',
      currency: currency?.currency?.code,
    };
    if (oldLimit && oldLimit.id) {
      resp = await updateChiplessCardLimit(cardId, oldLimit.id, data);
    } else {
      resp = await createChiplessCardLimit(cardId, data);
    }
    if (resp.status !== 'success') {
      setError('Unable to update limit');
    }
  }

  async function handleSubmit(formikProps) {
    const { setSubmitting, setFieldError, values } = formikProps;
    setSubmitting(true);
    const { limit, daily, monthly } = values;
    if (limit !== limitTnxAmount) {
      await updateLimit(limit, limitTnx, 'max');
    }
    if (daily !== limitDayAmount) {
      await updateLimit(daily, limitDay, 'day_max');
    }
    if (monthly !== limitMonthAmount) {
      await updateLimit(monthly, limitMonth, 'month_max');
    }
    fetchData();
    setEditing(false);
    setSubmitting(false);
  }

  let buttons = formikProps => {
    let temp = [
      {
        label: editing ? 'SAVE LIMITS' : 'EDIT LIMITS',
        color: 'primary',
        wide: true,
        loading: formikProps.isSubmitting,
        disabled: editing && (!formikProps.isValid || formikProps.isSubmitting),
        onPress: () => (editing ? handleSubmit(formikProps) : setEditing(true)),
      },
    ];
    if (editing) {
      temp.push({
        label: 'Cancel',
        variant: 'text',
        wide: true,
        onPress: () => setEditing(false),
      });
    }
    return temp;
  };

  return (
    <Formik
      initialValues={{
        limit: limitTnxAmount,
        daily: limitDayAmount,
        monthly: limitMonthAmount,
      }}
      enableReinitialize
      // validationSchema={schema}
    >
      {formikProps =>
        loading ? (
          <Spinner />
        ) : (
          <>
            {editing ? (
              <View ph={0.25}>
                <Input
                  formikProps={formikProps}
                  selectTextOnFocus
                  field={{
                    name: 'limit',
                    id: 'limit',
                    label: 'Per transaction',
                  }}
                />
                <Input
                  formikProps={formikProps}
                  selectTextOnFocus
                  field={{
                    name: 'daily',
                    id: 'daily',
                    label: 'Daily transactions',
                  }}
                />
                <Input
                  formikProps={formikProps}
                  selectTextOnFocus
                  field={{
                    name: 'monthly',
                    id: 'monthly',
                    label: 'Monthly transactions',
                  }}
                />
              </View>
            ) : (
              <OutputList items={outputs} />
            )}
            <ErrorOutput>{error}</ErrorOutput>
            <PageButtons items={buttons(formikProps)} layout="vertical" />
          </>
        )
      }
    </Formik>
  );
}
