export function checkDocumentsStatus(documents) {
  const items = documents ?? [];

  const identityDocuments = items.filter(
    item => item?.document_category === 'proof_of_identity',
  );
  const addressDocuments = items.filter(
    item => item?.document_category === 'proof_of_address',
  );

  const hasVerifiedIdentity =
    identityDocuments?.filter(item => item?.status === 'verified')?.length > 0;
  const hasVerifiedAddress =
    addressDocuments?.filter(item => item?.status === 'verified')?.length > 0;

  const hasPendingIdentity =
    identityDocuments?.filter(item => item?.status === 'pending')?.length > 0;
  const hasPendingAddress =
    addressDocuments?.filter(item => item?.status === 'pending')?.length > 0;

  const isVerified = hasVerifiedIdentity && hasVerifiedAddress;
  const isPending = !isVerified && (hasPendingIdentity || hasPendingAddress);
  const isNone = !(isVerified || hasPendingIdentity || hasPendingAddress);

  return {
    hasVerifiedIdentity,
    hasPendingIdentity,
    hasVerifiedAddress,
    hasPendingAddress,
    isVerified,
    isPending,
    isNone,
  };
}
