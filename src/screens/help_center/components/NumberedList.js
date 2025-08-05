import React from 'react';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import HelpText from './HelpText';

export default function NumberedList(props) {
  let { items, length, id, title } = props;
  if (!items?.length && length)
    items = Array.apply(null, Array(length)).map(function (x, i) {
      return id + '_' + (i + 1);
    });

  return (
    <View>
      {!!title && <HelpText id={id + '_0'} paragraph />}
      {items?.map((item, index) => (
        <NumberedListItem key={item} id={item} index={index} />
      ))}
    </View>
  );
}

function NumberedListItem(props) {
  const { id, index } = props;

  return (
    <View ml={1.5}>
      <Text lH={26} paragraph>
        <Text fW="700" c="primary">
          {index + 1 + '. '}
        </Text>
        <HelpText id={id} />
      </Text>
    </View>
  );
}
