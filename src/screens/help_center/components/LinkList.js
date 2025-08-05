import React from 'react';
import { Button } from 'components/inputs/Button';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';

export default function LinkList(props) {
  const { config, id } = props;
  const { title = id, sections = [] } = config;

  return (
    <View>
      <Text fontWeight="500" s={20} c="fontDark" id={title} paragraph />
      {sections?.length > 0 &&
        sections.map(item => (
          <LinkListItem {...props} key={item?.id} {...item} />
        ))}
    </View>
  );
}

function LinkListItem(props) {
  const { id, onSelect, condition, context } = props;
  function handlePress() {
    onSelect(id);
  }
  if (typeof condition === 'function' && !condition(context)) return false;

  return (
    <View mv={0.5}>
      <Button onPress={handlePress} variant="link" id={id} color="primary" />
    </View>
  );
}
