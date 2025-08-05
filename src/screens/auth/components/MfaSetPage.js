import React, { useEffect } from 'react';
import MfaSetForm from 'components/forms/MfaSetForm';

export default function MfaSetPage(props) {
  const { onSuccess, setLoading, authConfig, tempAuth, setTempAuth } = props;

  useEffect(() => {
    if (authConfig?.mfa) setLoading(false);
  }, []);

  return (
    <MfaSetForm
      tempAuth={tempAuth}
      setTempAuth={setTempAuth}
      onSuccess={onSuccess}
      authConfig={authConfig}
    />
  );
}
