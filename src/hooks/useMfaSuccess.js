import { useEffect, useState, useCallback } from 'react';
import { useGetProfile } from 'hooks/rehive';

export function useMfaSuccess({ tempAuth, setTempAuth, onSuccess }) {
  const [mfaStepCompleted, setMfaStepCompleted] = useState(false);
  const [hasCalledSuccess, setHasCalledSuccess] = useState(false);

  const { data: userProfile } = useGetProfile(
    tempAuth?.token,
    mfaStepCompleted,
  );

  const handleSuccess = useCallback(() => {
    if (userProfile && !hasCalledSuccess) {
      setTempAuth({ ...tempAuth, user: userProfile });
      setHasCalledSuccess(true);
      onSuccess();
    }
  }, [userProfile, tempAuth, setTempAuth, onSuccess, hasCalledSuccess]);

  useEffect(() => {
    handleSuccess();
  }, [handleSuccess]);

  return { setMfaStepCompleted };
}
