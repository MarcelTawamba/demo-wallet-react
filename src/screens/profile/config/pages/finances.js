import Documents from 'screens/profile/components/Documents';

const exportConfigs = {
  id: 'finances',
  icon: 'Description',
  image: 'documents',
  imageSize: 80,
  condition: ({ tiers, context: { profileConfig } = {} }) => {
    if (!tiers) return false;
    return (
      !!profileConfig?.documents?.hide ||
      !Boolean(
        tiers?.items?.find(x =>
          Boolean(
            x.requirements?.find(y => y.requirement === 'proof_of_income'),
          ),
        ),
      ) ||
      profileConfig?.hideFinance === true
    );
  },
  component: Documents,
  componentProps: {
    id: 'finance_documents',
    categories: ['proof_of_income'],
  },
};

export default exportConfigs;
