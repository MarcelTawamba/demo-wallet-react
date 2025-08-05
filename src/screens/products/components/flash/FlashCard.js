import React from 'react';
import { Card, View, Text, Button } from 'components';

import { Image, Dimensions, StyleSheet } from 'react-native';
import { useTheme } from 'components/app/context';
import ProductPlaceholderImage from '../ProductPlaceholderImage';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function FlashCard(props) {
  const { onPress } = props;
  const { design } = useTheme();

  return (
    <View pt={1}>
      <Button onPress={() => onPress('data')}>
        <View
          style={styles.card}
          p={1}
          fD={'row'}
          aI={'center'}
          jC={'space-around'}
          // w="100%"
        >
          <ProductPlaceholderImage name="data" height={100} width={100} />
          <View w="50%">
            <Text t="h3" fW="500" tA="center">
              Data
            </Text>
          </View>
        </View>
      </Button>

      <Button onPress={() => onPress('airtime')}>
        <View
          style={styles.card}
          p={1}
          fD={'row'}
          aI={'center'}
          jC={'space-around'}
          // w="100%"
        >
          <ProductPlaceholderImage name="airtime" height={100} width={100} />
          <View w="50%">
            <Text t="h3" fW="500" tA="center">
              Airtime
            </Text>
          </View>
        </View>
      </Button>

      <Button onPress={() => onPress('voucher')}>
        <View
          style={styles.card}
          p={1}
          fD={'row'}
          aI={'center'}
          jC={'space-around'}
          // w="100%"
        >
          <ProductPlaceholderImage name="flash" height={100} width={100} />
          <View w="50%">
            <Text t="h3" fW="500" tA="center">
              Gift vouchers
            </Text>
          </View>
        </View>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#EFEFEF',
    borderRadius: 20,
    margin: 8,
  },
});
