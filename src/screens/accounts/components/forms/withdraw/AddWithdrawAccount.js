import React from 'react';
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
    fetchData,
    onBackToAccountSelection,
    isCrypto,
    editing,
    selectedAccount,
    withdrawCurrency,
    resetFormState,
    cryptoBankWithdrawAdd,
    settingsConfig,
    actionsConfig,
  } = props;

  const bankAdd = !isCrypto || cryptoBankWithdrawAdd;
  const item = editing ? selectedAccount : null;

  const handleAccountSave = () => {
    fetchData(bankAdd ? 'bankAccounts' : 'cryptoAccounts');
    resetFormState();
  };

  console.log('AddWithdrawAccount - START');
  console.log('AddWithdrawAccount - Original settingsConfig:', JSON.stringify(settingsConfig, null, 2));
  console.log('AddWithdrawAccount - Bank fields from settings:', settingsConfig?.bank?.fields);

  // IMPORTANT: Do NOT modify the settingsConfig at all
  // Just pass it through as is
  
  console.log('AddWithdrawAccount - END');

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
            // Pass the original settingsConfig without modification
            settingsConfig={settingsConfig}
            // Pass other props that might be needed
            actionsConfig={actionsConfig}
            showComplexFields={true}
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
