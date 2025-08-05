import React from 'react';

import { Box } from '@material-ui/core';
import { standardizeString } from 'util/general';
import Text from 'components/outputs/Text';
import Status from 'components/outputs/Status';
import { formatAmountString } from 'util/general';
import { Button } from 'components/inputs/Button';
import en from '../config/locales';
import DocumentationSection from './DocumentationSection';
import Icon from 'components/outputs/NewIcon';

export default function DocumentSectionDefault(props) {
  const { item, setItem } = props;
  const { items } = item;
  if (!items) return null;
  return (
    <Box width="100%">
      {items.map(item => (
        <DocumentSectionDefaultItem item={item} setItem={setItem} />
      ))}
    </Box>
  );
}

function DocumentSectionDefaultItem(props) {
  const { item, setItem } = props;
  if (!item) return null;
  const { description, title, icon, id } = item;

  return (
    <Box
      flexDirection="row"
      style={{
        border: '1px solid #EFEFEF',
        borderRadius: 15,
      }}
      mt={1}
      display="flex"
      // justifyContent="space-between"
      alignItems="center"
      p={2}
      mb={3}
      pl={4}
      width="100%">
      <div>
        <Icon icon={icon} size={40} />
      </div>
      <Box pl={4} width="100%">
        <Text variant="h6" bold id={title ?? id} padded />
        <Text variant="body2">{description}</Text>
      </Box>
      <Button
        color="primary"
        label={'Learn more'}
        onClick={() => setItem(item)}
      />
    </Box>
  );
}
