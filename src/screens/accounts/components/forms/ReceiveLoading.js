import React from 'react';
import LottieImage from 'components/outputs/LottieImage';
import { View } from 'components/layout/View';

export default function ReceiveLoading() {
  return (
    <View aI="center" w="100%">
      <LottieImage loop name="loading-qr" size={250} oldColor={[0, 0, 0]} />
    </View>
  );
}
