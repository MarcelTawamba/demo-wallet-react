import React from 'react';
import { get } from 'lodash';
import RadioSelector from 'components/inputs/RadioSelector';

const BooleanFilter = props => {
  let { id, tempFilters, setTempFilters, config } = props;
  let trueLabel = 'Yes';
  let falseLabel = 'No';

  if (config) {
    ({ trueLabel = 'Yes', falseLabel = 'No' } = config);
  }

  let value = get(tempFilters, [id, 'value'], null);

  function handleValueChange(value) {
    setTempFilters({
      ...tempFilters,
      [id]: {
        ...tempFilters[id],
        value: get(value, ['target', 'value']),
      },
    });
  }

  const options = [
    { label: trueLabel, value: 'true' },
    { label: falseLabel, value: 'false' },
  ];

  return (
    <RadioSelector
      // responsive
      items={options}
      value={value}
      noPadding
      handleChange={handleValueChange}
    />
  );
};

export default BooleanFilter;
