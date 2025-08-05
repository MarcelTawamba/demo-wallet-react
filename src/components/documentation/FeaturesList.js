import React from 'react';

import SectionList from './SectionList';
import Feature from './FeatureItem';

export default function FeaturesList(props) {
  return <SectionList {...props} component={Feature} />;
}
