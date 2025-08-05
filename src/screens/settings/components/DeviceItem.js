import React from 'react';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import moment from 'moment';
import Icon from 'components/outputs/NewIcon';

export default function DeviceItem(props) {
  const { item = {} } = props;

  return (
    <View fD={'row'} mb={1} mt={1}>
      <View jC={'center'} style={{ paddingRight: 16 }}>
        <Icon name={item?.metadata?.osName?.toLowerCase()} size={24} padded />
      </View>
      <View
        fD={'column'}
        aI={'flex-start'}
        jC={'center'}
        style={{
          flex: 1,
          width: '100%',
        }}>
        <Text t={'h4'}>
          {item?.name ??
            item?.metadata?.brand + ' ' + item?.metadata?.modelName}
        </Text>

        <Text
          o={0.8}
          t="s1"
          id="last_updated_datetime"
          context={{ value: moment(item.updated).format('ll') }}
        />
      </View>
    </View>
  );
}
