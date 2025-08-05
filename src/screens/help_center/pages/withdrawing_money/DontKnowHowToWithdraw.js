import React from 'react';

import { View } from 'components/layout/View';
import Markdown from 'components/outputs/Markdown';

const lang = {
  i_dont_know_how_to_deposit: "I don't know how to deposit",
  manual_withdrawal: `## Manual withdrawal\n\n
  After withdrawing funds, your withdrawal will go into a pending state. The administrator will attempt to manually add your account as a beneficiary and make the withdrawal.`,
};

export default function DontKnowHowToWithdraw(props) {
  const { context } = props;

  const { companyBankAccounts, services } = context;
  const hasCompanyBankAccounts = companyBankAccounts?.items?.length > 0;

  return <View>{hasCompanyBankAccounts && <ManualWithdraw />}</View>;
}
function ManualWithdraw(props) {
  return (
    <View pt={1}>
      <Markdown textColor="fontLight">{lang?.manual_withdrawal}</Markdown>
    </View>
  );
}
