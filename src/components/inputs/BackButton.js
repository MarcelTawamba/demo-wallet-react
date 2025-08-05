import React from 'react';
import { View } from 'components/layout/View';
import { Button } from 'components/inputs/Button';
import Text from 'components/outputs/Text';
import Icon from 'components/outputs/NewIcon';

export default function BackButton(props) {
  const { label = 'back', onPress } = props;
  const isRtl = document.dir === 'rtl';

  return (
    <Button
      variant={'link'}
      onPress={onPress}
      children={
        <View flex={1} fD={'row'} aI={'center'}>
          <Icon
            icon={isRtl ? 'arrowright' : 'arrowleft'}
            circled={false}
            color={'#707070'}
          />
          <Text
            id={label}
            style={{
              lineHeight: 0,
              paddingRight: '0.5rem',
              marginLeft: '0.5rem',
            }}
          />
        </View>
      }
    />
  );
}
