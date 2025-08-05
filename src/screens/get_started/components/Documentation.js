import React, { useState } from 'react';

import { Box } from '@material-ui/core';
import DocumentationSection from './DocumentationSection';
import DocumentationItem from './DocumentationItem';

export default function Documentation(props) {
  const { items } = props;
  const [item, setItem] = useState(null);
  if (!items) return null;

  if (item) {
    return <DocumentationItem item={item} setItem={setItem} />;
  }

  return (
    <Box
      flexDirection="column"
      display="flex"
      // justifyContent="space-between"
      // alignItems="flex-end"
      // p={2}
      width="100%">
      {items.map(item => (
        <DocumentationSection item={item} setItem={setItem} />
      ))}
    </Box>
  );
}
