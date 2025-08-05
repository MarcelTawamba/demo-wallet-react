import React from 'react';

import { View } from 'components/layout/View';
import Markdown from 'components/outputs/Markdown';
import Info from 'components/outputs/Info';

const lang = {
  i_dont_know_how_to_deposit: "I don't know how to deposit",
  manual_deposit: `## Manual deposit\n\n
  A manual deposit is depositing funds from your bank via EFT. Follow the steps below to deposit funds to your wallet:\n\n
  1. On the homescreen, swipe to the currency you wish to deposit to and select the Deposit action. You may have to tap the More button if Deposit is not 1 of the main actions
  2. Open your banking app or online banking to create an EFT to the account details provided`,

  manual_deposit_warning:
    'Be sure to include the exact reference code by tapping to copy the code.',
};

export default function DontKnowHowToDeposit(props) {
  const { context } = props;

  const { companyBankAccounts, services } = context;
  const hasCompanyBankAccounts = companyBankAccounts?.items?.length === 0;

  return <View>{hasCompanyBankAccounts && <ManualDeposit />}</View>;
}
function ManualDeposit(props) {
  return (
    <View pt={1}>
      <Markdown textColor="fontLight">{lang?.manual_deposit}</Markdown>
      <Info m={0} mv={1} variant="warning">
        {lang.manual_deposit_warning}
      </Info>
    </View>
  );
}
