import React from 'react';
import { fetchData } from 'redux/rehive/actions';
import PageTitle from 'components/layout/page/PageTitle';
import PageContent from 'components/layout/page/PageContent';
import { cryptoType } from 'util/validation';
import { BankAccountForm } from 'screens/settings/components/BankAccountForm';
import CryptoAccountForm from 'screens/settings/components/CryptoAccountForm';

export default function AddWithdrawAccount(props) {
  const {
    currency,
    services,
    currencies,
    onBackToAccountSelection,
    isCrypto,
    editing,
    selectedAccount,
    withdrawCurrency,
    resetFormState,
    cryptoBankWithdrawAdd,
  } = props;

  const bankAdd = !isCrypto || cryptoBankWithdrawAdd;
  const item = editing ? selectedAccount : null;

  const handleAccountSave = () => {
    fetchData(bankAdd ? 'bankAccounts' : 'cryptoAccounts');
    resetFormState();
  };

  return (
    <>
      <PageTitle
        titleId={
          bankAdd
            ? editing
              ? 'edit_bank_account'
              : 'add_bank_account'
            : editing
            ? 'edit_crypto_account'
            : 'add_crypto_account'
        }
        titleVariant="h6"
        back
        handleBack={onBackToAccountSelection}
      />

      <PageContent>
        {bankAdd ? (
          <BankAccountForm
            accounts={currencies}
            noPadding
            initialCurrency={withdrawCurrency.code}
            type="bankAccounts"
            item={item}
            onDetailClose={onBackToAccountSelection}
            onSaveSuccess={handleAccountSave}
          />
        ) : (
          <CryptoAccountForm
            services={services}
            noPadding
            currency={currency}
            testnet={isCrypto && isCrypto[0] && isCrypto[0] === 'T'}
            crypto={isCrypto && cryptoType(currency)}
            type={'cryptoAccounts'}
            onDetailClose={resetFormState}
            onSaveSuccess={handleAccountSave}
          />
        )}
      </PageContent>
    </>
  );
}
