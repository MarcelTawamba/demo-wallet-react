import React from 'react';
import context from 'components/app/context';
import Icon from 'components/outputs/NewIcon';
import { SimpleImg } from 'react-simple-img';

const _IconBadge = ({ icon, name, size = 20, style }) => {
  const isUrl = icon.includes('http');

  return (
    <div
      style={{
        paddingRight: 8,
        paddingLeft: 8,
        ...style,
      }}>
      {isUrl ? (
        <SimpleImg
          style={{
            maxHeight: size * 2,
            maxWidth: size * 2,
            minHeight: size * 2,
            minWidth: size * 2,
            borderRadius: 200,
          }}
          imgStyle={{
            objectFit: 'cover',
            height: '100%',
            width: '100%',
          }}
          alt={name}
          src={icon}
        />
      ) : (
        <Icon size={size} icon={icon} noPadding />
      )}
    </div>
  );
};

export const IconBadge = context(_IconBadge);
