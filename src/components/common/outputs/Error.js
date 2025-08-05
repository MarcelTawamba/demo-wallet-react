import React from 'react';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';

const ErrorOutput = ({ id, children, ...restProps }) => {
  if (!(id || children)) {
    return null;
  }
  return (
    <View p={1} pv={0.5} w={'100%'} {...restProps}>
      <Text id={id} align={'center'} color={'error'}>
        {children}
      </Text>
    </View>
  );
};

export default ErrorOutput;
