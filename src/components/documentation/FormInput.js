import React from 'react';
import { Typography, Box } from '@material-ui/core';
import FeaturesList from './FeaturesList';
import PropsList from './PropsList';
import Text from 'components/outputs/Text';
import { standardizeString } from 'util/general';

import Components from 'components';
import EmptyListMessage from 'components/lists/EmptyListMessage';

export default function ComponentVariant(props) {
  const { item, id, component } = props;
  console.log('ComponentVariant -> props', props);
  const {
    title,
    subtitle,
    description,
    features,
    tags,
    children,
    variants,
    props: compProps,
    id: compId,
  } = item;
  console.log('Component -> item', item);
  console.log('Component -> children', children);
  const Component = component;
  console.log('ComponentVariant -> Component', Component);
  return (
    <Box
      p={2}
      mb={2}
      style={{
        border: '1px solid #EFEFEF',
        borderRadius: 15,
      }}>
      <Box
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Typography variant="h6" color="primary">
          {title ?? standardizeString(id)}
        </Typography>
        {tags &&
          Object.keys(tags).map(key => (
            <Box pt={0} p={1} key={key}>
              <Typography
                variant="subtitle2"
                // color="positive"
                style={{ fontWeight: '400' }}>
                {tags[key]}
              </Typography>
            </Box>
          ))}
      </Box>
      <Typography variant="h6" paragraph>
        {subtitle}
      </Typography>
      <Typography paragraph style={{ fontStyle: 'italic', fontSize: 14 }}>
        {description}
      </Typography>
      {Boolean(Component) && (
        <Box
          p={1}
          style={{
            border: '1px solid #EFEFEF',
            borderRadius: 15,
          }}>
          <Text variant="subtitle2">Example:</Text>
          {Boolean(Component) ? (
            <Component variant={compId}>Dummy</Component>
          ) : (
            <EmptyListMessage>Unable to find component</EmptyListMessage>
          )}
        </Box>
      )}
      <FeaturesList variant="h6" featureVariant="h6" item={features} />

      <PropsList variant="body" item={compProps} title="Props" />
      {/* {components && <ComponentsList items={components} baseUrl={"/components/"+id+"/components/"}/>} */}
    </Box>
  );
}
