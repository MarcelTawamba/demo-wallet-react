import Documents from 'screens/profile/components/Documents';

const exportConfigs = {
  id: 'documents',
  icon: 'Description',
  imageSize: 80,
  component: Documents,
  condition: ({ context: { profileConfig } = {} }) => {
    return (
      !!profileConfig?.documents?.hide || profileConfig?.hideDocuments === true
    );
  },
  componentProps: {
    id: 'verification_documents',
    categories: [
      'proof_of_identity',
      'proof_of_address',
      'advanced_proof_of_identity',
    ],
  },
};

export default exportConfigs;
