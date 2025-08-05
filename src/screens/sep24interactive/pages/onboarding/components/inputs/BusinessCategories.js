import React, { useState } from 'react';

import { useQuery } from 'react-query';
import { getBusinessCategories } from 'util/rehive';
import RadioMultiList from 'components/inputs/RadioMultiList';
import Spinner from 'components/outputs/Spinner';

export default function BusinessCategories(props) {
  const { formikProps } = props;
  const { setFieldValue, values } = formikProps;

  const [open, setOpen] = useState([]);
  const value = values?.categories ?? [];

  function setValue(newValue) {
    setFieldValue('categories', newValue);
  }

  const { data: businessCategories, isLoading } = useQuery(
    ['business-categories'],
    getBusinessCategories,
  );

  if (isLoading || !values?.categories) return <Spinner />;
  return (
    <RadioMultiList
      open={open}
      setOpen={setOpen}
      openable
      variant="sections"
      items={businessCategories?.results ?? []}
      parent={''}
      values={typeof value !== 'object' ? [] : value}
      setValue={setValue}
    />
  );
}
