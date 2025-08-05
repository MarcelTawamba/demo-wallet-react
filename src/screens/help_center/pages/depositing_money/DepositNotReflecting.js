import React from 'react';

import { View } from 'components/layout/View';

import Markdown from 'components/outputs/Markdown';

const lang = {
  deposit_not_reflecting_text:
    'Deposits may take up to 5 business days to reflect once your deposit was successful.',
  deposit_not_reflecting_manual:
    'Once we’ve received your deposit and you’ve used the correct reference number, your deposit will reflect in your wallet after it has been processed.',
};

export default function DepositNotReflecting(props) {
  const { context } = props;

  const { companyBankAccounts, services } = context;
  const hasCompanyBankAccounts = companyBankAccounts?.items?.length > 0;

  return (
    <View pt={1}>
      <Markdown textColor="fontLight">
        {lang?.deposit_not_reflecting_text}
      </Markdown>
      {hasCompanyBankAccounts && (
        <Markdown textColor="fontLight">
          {lang?.deposit_not_reflecting_manual}
        </Markdown>
      )}
    </View>
  );
}
