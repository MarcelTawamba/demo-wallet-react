import React from 'react';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import Icon from 'components/outputs/NewIcon';

export default function UnablePreview({ message }) {
  return (
    <View h={150} jC="center" aI="center" gap={1.75} mb={1}>
      <Icon size={48} icon="image" color="#707070" backgroundColor="#E8E8E8" />
      <Text c="#707070" tA="center" id={message} />
    </View>
  );
}
