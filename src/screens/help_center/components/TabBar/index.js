import React from 'react';
import { View, Text } from 'components';
import { Pressable, FlatList } from 'react-native';

export default function TabBar(props) {
  const { items } = props;
  return (
    <FlatList
      data={items}
      renderItem={({ item, index }) => (
        <TabBarItem
          {...props}
          index={index}
          key={item?.id}
          item={item}
          length={items?.length}
        />
      )}
      horizontal
      keyExtractor={item => item?.id ?? item}
    />
  );
}

function TabBarItem(props) {
  const { selected, item, index, length, onSelect } = props;
  const { id, label = id } = typeof item === 'object' ? item : { id: item };
  const isSelected = selected === id;

  function handlePress() {
    onSelect(id);
  }

  return (
    <Pressable onPress={handlePress}>
      <View
        bC={isSelected ? 'primary' : 'transparent'}
        p={0.25}
        ph={1}
        bR={20}
        ml={index === 0 ? 1.5 : 0.5}
        mr={index === length - 1 ? 1.5 : 0.5}>
        <Text s={14} c={isSelected ? 'white' : '#A3A3A3'} id={label} />
      </View>
    </Pressable>
  );
}
