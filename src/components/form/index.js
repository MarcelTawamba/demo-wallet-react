import React from 'react';
import Basic from './Basic';
import Tabs from './Tabs';

export default function Form(props) {
  const variant = props?.formConfig?.variant;

  if (variant === 'tabs') return <Tabs {...props} />;

  return <Basic {...props} />;
}
