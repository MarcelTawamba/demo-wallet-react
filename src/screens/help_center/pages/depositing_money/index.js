import DontKnowHowToDeposit from './DontKnowHowToDeposit';
import DepositNotReflecting from './DepositNotReflecting';
import AddCryptoToWallet from './AddCryptoToWallet';

const exportConfigs = {
  sections: [
    {
      id: 'i_dont_know_how_to_deposit',
      component: DontKnowHowToDeposit,
    },
    {
      id: 'deposit_not_reflecting',
      component: DepositNotReflecting,
    },
    {
      id: 'how_do_i_add_crypto_to_my_wallet',
      component: AddCryptoToWallet,
    },
  ],
};

export default exportConfigs;
