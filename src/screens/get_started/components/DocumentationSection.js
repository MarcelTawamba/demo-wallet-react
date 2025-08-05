import React from 'react';

import { Box } from '@material-ui/core';
import Text from 'components/outputs/Text';
import DocumentSectionDefault from './DocumentSectionDefault';
import DocumentSectionIcon from './DocumentSectionIcon';

export default function DocumentationSection(props) {
  const { item } = props;
  if (!item) return null;
  const { variant, id } = item;

  return (
    <Box
      // flexDirection="row"
      // display="flex"
      // justifyContent="space-between"
      // alignItems="flex-end"
      pt={2}
      width="100%">
      <Box pb={1}>
        <Text width="auto" variant="h6" id={id} />
      </Box>
      {variant === 'icon' ? (
        <DocumentSectionIcon {...props} />
      ) : (
        <DocumentSectionDefault {...props} />
      )}
    </Box>
  );
}
