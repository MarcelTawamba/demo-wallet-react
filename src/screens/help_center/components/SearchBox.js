import React from 'react';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import { StyleSheet } from 'react-native';
import { Icon } from 'components/outputs/Icon';

export default function SearchBox(props) {
  return (
    <View style={styles.container} ph={1} mv={1} mh={1.5}>
      <Text s={15} c="#A3A3A3" id="search_placeholder" />
      <Icon name="search" color="primary" size={20} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#EBEBEB',
    borderRadius: 20,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
