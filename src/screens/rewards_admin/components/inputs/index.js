import React from 'react';

import Input from 'components/inputs';
import * as inputs from '../../config/inputs';
import RewardsAccount from './RewardsAccount';
import RecipientAccount from './RecipientAccount';
import CompanyCurrencySelector from './CompanyCurrencySelector';

export default function Inputs(props) {
  const { variant, type, ...restProps } = props;
  const config = inputs[variant?.name ?? variant];

  switch (config?.type) {
    case 'rewards_account':
      return <RewardsAccount {...props} config={config} />;
    case 'recipient_account':
      return <RecipientAccount {...props} config={config} />;
    case 'campaign_currency':
      return <CompanyCurrencySelector {...props} config={config} />;

    default:
      return <Input {...restProps} config={config} />;
  }
}
