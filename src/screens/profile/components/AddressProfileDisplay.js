import React from 'react';
import { SettingsOverviewItem } from 'components/layout/SettingsOverviewSection';
import { standardizeString, concatAddress } from 'util/general';

const AddressProfileDisplay = props => {
  const { items, type, handleStateChange } = props;

  let addresses = [];
  let address = null;
  let status = 'incomplete';

  addresses = items.filter(
    item => item.type === type && item.status === 'verified',
  );
  if (addresses.length === 0) {
    addresses = items.filter(item => item.type === type);
  }
  if (addresses.length > 0) {
    address = addresses[0];
  }

  return (
    <SettingsOverviewItem
      responsive
      label={standardizeString(type + ' address')}
      value={concatAddress(address, true)}
      status={address && address.status ? address.status : status}
      onClick={() => handleStateChange('addresses', '', 0)}
    />
  );
};

export default AddressProfileDisplay;
