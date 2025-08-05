import React from 'react';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import { Button } from 'components/inputs/Button';

export default function Links(props) {
  const { items } = props;

  return (
    <View pt={1.5}>
      <Text fW="500" s={16} c="fontDark" id="links" paragraph />
      {items?.length > 0 &&
        items.map(item => <LinksItem {...props} key={item?.id} item={item} />)}
    </View>
  );
}

function LinksItem(props) {
  const { setSectionId, setTabId, item } = props;
  const { id, tab, section } = item;
  function handlePress() {
    setTabId(tab);
    setSectionId(section);
  }

  return (
    <View mv={0.5}>
      <Button onPress={handlePress}>
        <Text
          id={id}
          c="primary"
          style={{ textDecorationLine: 'underline' }}
          paragraph
        />
      </Button>
    </View>
  );
}
