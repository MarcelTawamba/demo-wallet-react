import React from 'react';
import { Dimensions, Image } from 'react-native';
import { View, Text } from 'components';
import { get } from 'lodash';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function ProductProviderImage(props) {
  const {
    selected,
    width = SCREEN_WIDTH - 32,
    height = SCREEN_WIDTH / 2,
    name,
    showSelected,
    item,
  } = props;

  const imageProps = { width, height };

  const uriSelected = get(item, ['images', 0, 'file']);
  const uriUnselected = get(item, ['images', 1, 'file']);

  return (
    <View style={styles.container}>
      <img
        alt={name}
        style={styles.image}
        src={!selected && uriUnselected ? uriUnselected : uriSelected}
      />
    </View>
  );
}

const styles = {
  container: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  image: {
    width: '100%',
    maxWidth: SCREEN_WIDTH / 2,
    height: 120,
    borderRadius: 15,
  },
};
