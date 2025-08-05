import React from 'react';

import { Box } from '@material-ui/core';
import PageTitle from 'components/layout/page/PageTitle';
import Icon from 'components/outputs/NewIcon';
import Text from 'components/outputs/Text';

export default function DocumentationItem(props) {
  const { item, setItem } = props;
  if (!item) return null;
  const { amount, description, variant, id, icon } = item;

  return (
    <Box
      // flexDirection="row"
      // display="flex"
      // justifyContent="space-between"
      // alignItems="flex-end"
      pt={2}
      width="100%">
      <PageTitle id={id} handleBack={() => setItem(null)} back />
      <Box flexDirection="row" display="flex">
        <Box>
          <Icon icon={icon} size={80} />
        </Box>
        <Box pl={4} width="100%">
          <Text variant="body1">{description}</Text>
        </Box>
      </Box>
    </Box>
  );
}
