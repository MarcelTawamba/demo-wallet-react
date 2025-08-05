import React from 'react';
import Text from 'components/outputs/Text';
import Image from 'components/outputs/Image';
import PlaceholderImage from 'components/outputs/PlaceholderImage';
import { View } from 'components/layout/View';
import { formatAmountString, standardizeString } from 'util/general';

export default function OrderItem(props) {
  const {
    item: { name, quantity, variant, total_price, image },
    currency,
  } = props;
  const isRtl = document.dir === 'rtl';

  return (
    <View grid columns={3} gap={2} aI={'center'} w={'100%'}>
      <View fD={'row'} aI={'center'}>
        {image ? (
          <Image src={image} width={70} height={70} />
        ) : (
          <PlaceholderImage name="product" height={70} width={70} />
        )}
        <View {...{ [isRtl ? 'mr' : 'ml']: 1 }}>
          <Text s={14}>{name}</Text>
          {variant && (
            <Text s={12} c={'grey4'}>
              {standardizeString(variant?.label)}
            </Text>
          )}
        </View>
      </View>
      <Text s={14} tA={'center'}>
        {quantity}
      </Text>
      <Text s={14} tA={'center'}>
        {formatAmountString(total_price, currency, true)}
      </Text>
    </View>
  );
}
