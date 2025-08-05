import React from 'react';

import { View } from 'components/layout/View';
import Markdown from 'components/outputs/Markdown';

const lang = {
  add_crypto_to_wallet: `
  To deposit crypto into your wallet you can either Exchange or Receive it from another wallet.
  
  To Exchange crypto follow the following steps:\n
  1. On the homescreen, swipe to the currency you wish to exchange and select the Exchange action. You may have to tap the More button if it is not 1 of the main actions
  2. Select the currency you wish to sell and the currency you wish to purchase. 
  3. Select the amount you wish to sell
  
  To Receive crypto from another wallet:\n
  1. On the homescreen, swipe to the currency you wish to exchange and select the Receive action.
  2. Scan the QR code from your other wallet to send funds across your wallets or copy your address to your clipboard. You can enter your address in a different wallet to send funds from one wallet to another.`,
};

export default function AddCryptoToWallet(props) {
  return (
    <View pt={1}>
      <Markdown textColor="fontLight">{lang?.add_crypto_to_wallet}</Markdown>
    </View>
  );
}
