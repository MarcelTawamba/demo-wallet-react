import React from 'react';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import LottieImage from 'components/outputs/LottieImage';

export default function PaymentPending() {
  return (
    <View style={{ flex: 1 }} w="100%" aI="center" pb={4} ph={1.5}>
      <View aI="center" jC="center" pl={1}>
        <LottieImage
          loop
          name="payment"
          size={180}
          oldColor={[255, 255, 153]}
        />
      </View>
      <Text
        style={{ padding: 8 }}
        tA="center"
        s={20}
        fontWeight="500"
        id="payment_processing"
      />
      <Text
        style={{ padding: 16 }}
        tA="center"
        id="payment_processing_description"
      />
    </View>
  );
}
