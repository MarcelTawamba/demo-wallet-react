import React from 'react';
import ListItem from 'components/outputs/ListItem';
import { standardizeString } from 'util/general';

const CurrentSessionsSectionListHeader = props => {
  const { item, onPress, onBack, ...restProps } = props;
  if (!item) {
    return null;
  }
  const { company } = item;
  if (!company) {
    return null;
  }
  const { name, icon, logo, id } = company;

  return (
    <ListItem
      key={id}
      button
      dense
      disableGutters
      // disabled={!onPress}
      // icon={onBack ? 'chevron-left' : ''}
      endIcon={onBack ? '' : 'ArrowRight'}
      onClick={() => (onBack ? onBack() : onPress(item))}
      title={name ?? standardizeString(id)}
      width={48}
      image={icon ? icon : logo}
      {...restProps}
    />
  );
};

export default CurrentSessionsSectionListHeader;
