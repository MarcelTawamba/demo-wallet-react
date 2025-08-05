import React from 'react';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import Image from 'components/outputs/Image';

export default function ManualDepositAccountCard({ account, onAccountSelect }) {
  function handleAccountSelect() {
    onAccountSelect(account);
  }

  return (
    <View
      fD="row"
      w="100%"
      jC="space-between"
      aI="center"
      style={{ cursor: 'pointer' }}
      p={0.75}
      bR={8}>
      <View
        jC={'flex-start'}
        fD="row"
        aI={'center'}
        w="100%"
        onClick={handleAccountSelect}>
        <Image src="bank" width={32} height={32} style={{ borderRadius: 8 }} />
        <View style={{ marginLeft: 16 }} fD="column" aI="flex-end" w="100%">
          <Text style={{ fontSize: 12 }}>{account.name}</Text>
          <Text>
            <Text
              style={{
                fontSize: 14,
                marginTop: 2,
                wordWrap: 'break-word',
              }}>
              {account.bank_name}
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
}
