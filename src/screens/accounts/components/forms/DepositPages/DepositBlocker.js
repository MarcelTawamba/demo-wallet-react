import React from 'react';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import Modal from 'components/layout/Modal';
import { useHistory } from 'react-router-dom';
import { Button } from 'components/inputs/Button';
import Icon from 'components/outputs/Icon';
import colors from 'config/config/defaults/colors.json';

const configs = {
  pending: {
    color: 'primary',
    title: 'documents_pending',
    description: 'documents_pending_description',
    actionLabel: 'go_to_documents',
  },
  failed: {
    color: 'error',
    title: 'documents_failed',
    description: 'documents_failed_description',
    actionLabel: 'go_to_documents',
  },
  kyc: {
    color: 'warning',
    title: 'kyc_pending',
    description: 'kyc_pending_description',
    actionLabel: 'go_to_kyc',
  },
  pendingBankAccount: {
    color: 'warning',
    title: 'pending_bank_account_title',
    description: 'pending_bank_account_description',
    actionLabel: 'close',
  },
};

export default function DocumentUploadBlocker(props) {
  const { visible, hideModal } = props;
  const config = configs?.[visible];
  const history = useHistory();
  function handleRedirect() {
    hideModal();
    if (visible === 'kyc') {
      history.push('/kyc/');
    } else if (visible === 'pendingBankAccount') {
      //
    } else {
      history.push('/profile/documents/');
    }
  }

  if (!config) return null;
  const { title, description, color, actionLabel } = config;

  return (
    <Modal close={false} maxWidth={480} open={!!visible} onDismiss={hideModal}>
      <View
        ph={1}
        pt={1}
        w="100%"
        aI="center"
        jC="center"
        style={{ textAlign: 'center' }}
        mv={0.5}>
        <View aI="center" jC="center" h={90}>
          <View
            h={90}
            w={90}
            bR={90}
            style={{ opacity: '0.2', position: 'absolute' }}
            bC={color}
            pos="absolute"></View>
          <Icon
            name="AccountBalance"
            size={42}
            inverted
            transparent
            iconColor={color}
            // style={{
            //   color: '#FF4C6F',
            //   fontSize: 42,
            // }}
          />
        </View>
        <Text
          c={colors?.[color]}
          fontWeight="500"
          s={18}
          style={{ marginTop: 20 }}
          uppercase
          id={title}
        />
        <Text style={{ marginTop: 20, marginBottom: 20 }} id={description} />
        <Button
          id={actionLabel}
          capitalize
          wide
          onClick={handleRedirect}
          style={{ backgroundColor: colors?.[color], color: 'white' }}
        />
      </View>
    </Modal>
  );
}
