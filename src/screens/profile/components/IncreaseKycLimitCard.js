import { useRehiveContext } from 'contexts';
import React from 'react';
import { useHistory } from 'react-router-dom';
import PromptCard from 'screens/home/components/PromptCard';

export default function IncreaseKycLimitCard(props) {
  const { backgroundColor } = props;
  const history = useHistory();
  const { user } = useRehiveContext();
  if (user?.status === 'verified') return null;
  const cardConfig = {
    id: 'kyc',
    title: 'Increase deposit limit',
    description: 'Complete KYC to increase your deposit limit',
    variant: 'kyc',
    enable: true,
    type: 'prompt',
    onPress: () => history.push(`/kyc/`),
    image: 'userVerify',
    backgroundColor,
  };

  return <PromptCard {...cardConfig} />;
}
