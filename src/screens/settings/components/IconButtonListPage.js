import React from 'react';
import IconButtonList from 'components/inputs/IconButtonList';

export default function IconButtonListPage(props) {
  const { onClick, pageConfig, screenId, history } = props;
  const { options = [] } = pageConfig;
  const items = (typeof options === 'function'
    ? options(props)
    : options
  ).filter(
    item =>
      (typeof item?.condition === 'function'
        ? item?.condition(props)
        : item?.condition) ?? true,
  );

  function handleClick(item) {
    history.push('/' + screenId + '/' + item?.id + '/');
  }
  return <IconButtonList items={items} onClick={handleClick} />;
}
