import React from 'react';
import { View } from 'components/layout/View';
import { Button } from 'components/inputs/Button';
import { useTheme } from 'components/app/context';
import Text from 'components/outputs/Text';

export default function OrderHeader(props) {
  const { options, activeIndex, setActiveIndex } = props;

  const { colors } = useTheme();

  return (
    <View grid gap={1} h={'fit-content'} w={'100%'}>
      <Text s={18} fontWeight={500} id="orders" />
      <View fD={'row'} aI={'center'} w={'100%'}>
        {options.map((x, index) => {
          const active = activeIndex === index;

          return (
            <View mr={2}>
              <Button
                fontSize={15}
                color={active ? 'primary' : 'font'}
                textStyle={{ fontWeight: active ? 700 : 400 }}
                fontWeight={active ? 700 : 400}
                variant={'link'}
                noHover
                style={{
                  width: 'fit-content',
                  whitespace: 'nowrap',
                  borderBottom: active ? `1px solid ${colors.primary}` : 'none',
                }}
                onPress={() => setActiveIndex(index)}
                id={x.label}
              />
            </View>
          );
        })}
      </View>
    </View>
  );
}
