import React from 'react';
import RadioSelector from 'components/inputs/RadioSelector';

const StellarAddressType = props => {
  const { handleChange, value } = props;

  return (
    <RadioSelector
      title="address_type"
      responsive
      items={[
        { value: 'public', label: 'public_address_memo' },
        { value: 'federation', label: 'federation_address' },
      ]}
      value={value}
      handleChange={handleChange}
    />
  );
};

export default StellarAddressType;
