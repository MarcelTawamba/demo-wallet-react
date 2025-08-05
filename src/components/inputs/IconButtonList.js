import React from 'react';
import { View } from 'components/layout/View';
import { ListItem } from '@material-ui/core';
import Text from 'components/outputs/Text';
import Icon from 'components/outputs/NewIcon';
import Image from 'components/outputs/Image';

export default function IconButtonList(props) {
  const { items, onClick, size = 22 } = props;
  const isRtl = document.dir === 'rtl';

  return (
    <ul style={{ padding: 0, margin: 0 }}>
      <View pv={0.5}>
        {items?.map((item, index) => (
          <ListItem
            key={index}
            onClick={() => onClick(item)}
            button
            selected={item?.selected}>
            <View fD={'row'} aI={'center'}>
              {item?.image ? (
                <Image
                  style={{
                    maxWidth: size * 2,
                    maxHeight: size * 2,
                    borderRadius: size * 2,
                    height: size * 2,
                    width: size * 2,
                  }}
                  src={item?.image}
                />
              ) : (
                <Icon
                  size={size}
                  icon={item?.icon ?? item?.id ?? item}
                  set={item?.set ?? 'MaterialIcons'}
                  fallbackIcon={item?.fallbackIcon}
                />
              )}
              <View {...{ [isRtl ? 'mr' : 'ml']: 1 }}>
                <Text id={item?.label ?? item?.id ?? item} />
              </View>
            </View>
          </ListItem>
        ))}
      </View>
    </ul>
  );
}
