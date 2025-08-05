import React from 'react';
import Box from '@material-ui/core/Box';

import Text from 'components/outputs/Text';

const ErrorOutput = ({ id, children, align = 'center', ...restProps }) => {
  if (!(children || id)) {
    return null;
  }
  return (
    <Box p={1} pv={0.5} width={'100%'} {...restProps}>
      <Text id={id} align={align} color={'error'}>
        {children}
      </Text>
    </Box>
  );
};

export default ErrorOutput;
