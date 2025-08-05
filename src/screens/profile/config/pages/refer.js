import ReferralCodePage from 'screens/profile/components/ReferralCodePage';

//TODO: fetchData (referralCodes)

const exportConfigs = {
  id: 'refer',
  title: 'refer_a_friend',
  icon: 'accessibility',
  image: false,
  variant: 'button',
  condition: ({ context }) => !context?.profileConfig?.referral?.enabled,
  component: ReferralCodePage,
};

export default exportConfigs;
