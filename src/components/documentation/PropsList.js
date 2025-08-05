import React from 'react';
import { Typography, Box } from '@material-ui/core';
import Text from 'components/outputs/Text';
import { standardizeString } from 'util/general';

export default function PropsList(props) {
  const { item, variant = 'h3', title = 'Props' } = props;

  if (!item) return null;
  const keys = Object.keys(item);
  if (keys.length === 0) return null;

  return (
    <div style={{ paddingTop: 24 }}>
      <Text bold>{title}</Text>
      {keys.map(key => (
        <Prop key={key} id={key} item={item[key]} />
      ))}
    </div>
  );
}

function Prop(props) {
  const { item, id } = props;
  const { title, type = 'string', tags, description } = item;

  return (
    <div>
      <Box
        style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <Box pr={0.5}>
          <Text variant="body2" bold fontWeight="300">
            {title ?? standardizeString(id)}
          </Text>
        </Box>
        <Text variant="subtitle2" style={{ fontWeight: '400' }}>
          {type}
        </Text>
      </Box>
      {Boolean(description) && (
        <Typography variant="body2" paragraph>
          {description}
        </Typography>
      )}
    </div>
  );
}
