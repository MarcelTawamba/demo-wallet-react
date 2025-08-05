import React from 'react';

export default function SectionList(props) {
  const { item = {}, child, id, component } = props;
  if (!item) return null;
  const keys = Object.keys(item);
  if (keys.length === 0) return null;
  if (!component) return null;
  const Component = component;

  return keys.map(key => (
    <Component {...props} key={key} child={child} id={key} item={item[key]} />
  ));
}
