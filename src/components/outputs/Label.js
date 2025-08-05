import React from 'react';
import Text from 'components/outputs/Text';

export default function Label(props) {
  const { id, children } = props;
  return (
    <Text s={12} fontWeight="500" padded id={id}>
      {children}
    </Text>
  );
}
