import React from 'react';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import { STATUS_COLORS } from './OnboardingDocumentUpload';
export default function OnboardingUserStatus(props) {
  const { user } = props;

  return (
    <View>
      <View mb={1} w={'100%'} fD={'row'}>
        <Text bold s={18}>
          Status
        </Text>
        <label
          className="MuiButton-root"
          style={{
            color:
              user.status === 'pending'
                ? '#a2a2a2'
                : `${STATUS_COLORS[user.status]}`,
            border: `2px solid ${
              user.status === 'pending'
                ? '#a2a2a2'
                : `${STATUS_COLORS[user.status]}`
            }`,
            padding: '4px 14px',
            borderRadius: 100,
            width: 124,
            fontSize: 12,
            textAlign: 'center',
          }}>
          {user.status}
        </label>
      </View>
      <Text s={14} id="status_info_text" />

      <Text
        s={14}
        id="please_be_patient"
        style={{
          marginTop: 16,
          marginBottom: 16,
        }}
      />
    </View>
  );
}
