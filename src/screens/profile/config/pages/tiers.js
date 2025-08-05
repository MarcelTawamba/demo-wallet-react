import TierRequirementsPage from 'screens/profile/components/tierRequirements';

const exportConfigs = {
  id: 'tiers',
  icon: 'Trophy',
  image: ({ context }) =>
    'tier' + (context?.items?.[0]?.level ?? '0').toString(),
  imageSize: 80,
  type: 'tier',
  condition: ({ tiers, context }) =>
    !Boolean(tiers?.items?.length) ||
    context?.profileConfig?.hideTiers === true,
  component: TierRequirementsPage,
};

export default exportConfigs;
