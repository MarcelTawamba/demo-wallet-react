import React, { useMemo, useEffect } from 'react';
import { useModal } from 'hooks/general';
import { useRehive } from 'hooks/rehive';
import { checkDocumentsStatus } from 'util/documents';
import DepositBlocker from '../DepositBlocker';

function WithdrawBlocker({ setEnableWithdraw, ...restProps }) {
  const {
    context: { items: userDocuments = [] },
    refresh,
  } = useRehive('document', true);

  const { isPending, isVerified } = useMemo(
    () => checkDocumentsStatus(userDocuments),
    [userDocuments],
  );

  const {
    modalVisible: documentModalVisible,
    showModal: documentShowModal,
    hideModal: documentHideModal,
  } = useModal();

  useEffect(() => {
    if (isVerified) {
      setEnableWithdraw(true);
    } else if (isPending) {
      setEnableWithdraw(false);
      documentShowModal('pending');
    } else {
      setEnableWithdraw(false);
    }
  }, [isPending, isVerified]);

  function handleDocumentBlockerDismiss() {
    refresh();
    documentHideModal();
  }

  return (
    <DepositBlocker
      visible={documentModalVisible}
      hideModal={handleDocumentBlockerDismiss}
    />
  );
}

export default WithdrawBlocker;
