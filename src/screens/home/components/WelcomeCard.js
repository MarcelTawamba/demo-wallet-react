import React from 'react';
import Text from 'components/outputs/Text';
import { View } from 'components/layout/View';
import WelcomeImage from './images/WelcomeImage';
import { useTheme } from 'components/app/context';

export default function WelcomeCard({ company }) {
  const { colors } = useTheme();
  return (
    <View w="100%" bC="#ffffff" bR={12} mb={1}>
      <View w="100%">
        <WelcomeImage
          width="100%"
          height="100%"
          style={{ borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
          primary={colors.primary}
          secondary={colors.secondary}
        />
      </View>
      <View pv={2} pt={0.5} w={'100%'}>
        <Text
          fontWeight={'700'}
          style={{ textAlign: 'center', fontSize: 16 }}
          id="welcome_card_title"
        />
        <View ph={2} pt={0.5} mb={0.5} w={'100%'}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 14,
            }}
            myColor={'grey4'}>
            {company?.description}
          </Text>
        </View>
      </View>
    </View>
  );
}
