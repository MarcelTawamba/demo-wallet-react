import React, { useEffect, useState } from 'react';

import { useBusiness } from 'contexts';
import IconButtonList from 'components/inputs/IconButtonList';
import BackButton from 'components/inputs/BackButton';
import PageContent from 'components/layout/page/PageContent';
import { View } from 'components/layout/View';
import OutputList from 'components/lists/OutputList';
import { formatTime, standardizeString } from 'util/general';
import { Button } from 'components/inputs/Button';

export default function Businesses(props) {
  const {
    context: { setHideButtons },
  } = props;
  const { businesses, business, bussinessById, setBusinessId } = useBusiness();

  useEffect(() => {
    if (typeof setHideButtons === 'function') setHideButtons(true);
    return () => {
      if (typeof setHideButtons === 'function') setHideButtons(false);
    };
  }, []);

  const [tempBusinessId, setTempBusinessId] = useState('');

  const options = businesses.map(item => ({
    image: item?.icon,
    icon: item?.icon ? '' : 'Store',
    label: item?.name,
    id: item?.id,
    selected: item?.id === business?.id,
  }));

  const tempBusiness = bussinessById?.[tempBusinessId];

  function handleClick(item) {
    setTempBusinessId(item?.id ?? null);
  }

  if (tempBusiness) {
    return (
      <BusinessDetail
        item={tempBusiness}
        businessId={business?.id}
        onBack={handleClick}
        setBusinessId={setBusinessId}
      />
    );
  }

  return <IconButtonList items={options} onClick={handleClick} size={18} />;
}

function BusinessDetail(props) {
  const { onBack, item, setBusinessId, businessId } = props;

  const outputItems = [
    { id: 'id', value: item?.id },
    { id: 'name', value: item?.name },
    { id: 'timezone', value: item?.timezone },
    { id: 'status', value: standardizeString(item?.status) },
    { id: 'updated', value: formatTime(item?.updated) },
  ];

  function handleSelect() {
    setBusinessId(item?.id);
  }
  return (
    <View p={1}>
      <BackButton onPress={onBack} />
      <View p={0.5}>
        <OutputList items={outputItems} />
      </View>
      {businessId !== item?.id && (
        <Button onPress={handleSelect} wide id="manage" color="primary" />
      )}
    </View>
  );
}
