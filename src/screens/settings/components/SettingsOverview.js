import React from 'react';

import SettingsOverviewSection from 'components/layout/SettingsOverviewSection';

export default function SettingsOverview(props) {
  const { reduxData, pageConfig } = props;

  const { sections } = pageConfig;

  return sections
    .filter(item => item.condition(reduxData))
    .map((item, index) => (
      <SettingsOverviewSection
        {...props}
        key={item?.id ?? item}
        index={index}
        last={index === sections.length - 1}
        item={item}
      />
    ));
}
