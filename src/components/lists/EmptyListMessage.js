import React from 'react';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';

const EmptyListMessage = ({ id, text, children, ...restProps }) => {
  return (
    <View p={1} w={'100%'} aI={'center'} jC={'center'} {...restProps}>
      <Text
        align="center"
        id={id ? id : text ? text : children}
        width={'100%'}
        c={'grey3'}
        noWrap={false}
        style={{ flexWrap: 'wrap' }}></Text>
    </View>
  );
};

export default EmptyListMessage;
