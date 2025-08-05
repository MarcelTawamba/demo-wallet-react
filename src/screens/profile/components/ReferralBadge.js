import React from 'react';
import { ButtonBase } from '@material-ui/core';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import PlaceholderImage from 'components/outputs/PlaceholderImage';
import { useTheme } from 'components/app/context';

export default function ReferralBadge(props) {
  const { colors } = useTheme();
  const { onPress } = props;

  return (
    <ButtonBase
      onClick={onPress}
      style={{ width: '100%', marginBottom: 10, borderRadius: 10 }}>
      <View
        bC={'primary'}
        ph={2}
        bR={10}
        w={'100%'}
        fD={'row'}
        jC={'space-between'}
        aI={'center'}>
        <Text
          style={{ fontSize: 17, textAlign: 'left' }}
          myColor={'primaryContrast'}>
          <span style={{ fontWeight: 'bold' }}>Refer a friend</span> and earn
          rewards
        </Text>
        <PlaceholderImage name={'reward'} width={69} height={69} />
      </View>
    </ButtonBase>
  );
}
