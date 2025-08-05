import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchData } from 'redux/rehive/actions';
import { companyBankAccountsSelector } from 'screens/accounts/redux/selectors';
import EmptyListMessage from 'components/lists/EmptyListMessage';
import Spinner from 'components/outputs/Spinner';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import AccountReference from 'screens/settings/components/AccountReference';
import CompanyBankAccountsSelector from '../../selectors/CompanyBankAccountSelector';
import OutputList from 'components/lists/OutputList';
import { concatAddress } from 'util/general';

const CompanyBankAccountDeposit = props => {
  const { currency, TextComponent } = props;
  const companyBankAccounts = useSelector(companyBankAccountsSelector);
  const [index, setIndex] = useState(0);
  const dispatch = useDispatch();

  const accounts = companyBankAccounts.items.filter(
    acc =>
      acc.currencies.findIndex(
        curr => curr.code === currency?.currency?.code,
      ) !== -1,
  );

  useEffect(() => {
    dispatch(fetchData('companyBankAccounts'));
  }, [dispatch]);

  useEffect(() => {
    if (!accounts[index]) {
      setIndex(0);
    }
  }, [accounts, index]);

  const bankAcc = accounts[index];
  if (!bankAcc) {
    if (companyBankAccounts.loading) {
      return <Spinner />;
    }
    return (
      <EmptyListMessage id="wallet_has_no_bank_accounts_to_deposit" />
    );
  }

  const {
    name,
    type,
    number,
    bank_name,
    bank_code,
    branch_code,
    swift,
    iban,
    bic,
    branch_address,
    routing_number,
  } = bankAcc;
  const address = concatAddress(branch_address);

  const bankDetails = [
    { label: 'Name', value: name },
    type ? { label: 'Type', value: type } : null,
    number ? { label: 'Number', value: number } : null,
    bank_name ? { label: 'Bank name', value: bank_name } : null,
    bank_code ? { label: 'Bank code', value: bank_code } : null,
    branch_code ? { label: 'Branch code', value: branch_code } : null,
    address ? { label: 'Branch address', value: address } : null,
    routing_number ? { label: 'Routing number', value: routing_number } : null,
    swift ? { label: 'Switft', value: swift } : null,
    iban ? { label: 'IBAN', value: iban } : null,
    bic ? { label: 'BIC', value: bic } : null,
  ];

  return (
    <View>
      {TextComponent ? (
        TextComponent
      ) : (
        <Text p={0.5} tA={'center'} id="deposit_form_message" />
      )}
      <AccountReference>{currency.account}</AccountReference>

      {accounts.length > 1 && (
        <View pt={0.75} w={'100%'}>
          <CompanyBankAccountsSelector
            data={accounts}
            index={index}
            handleChange={index => setIndex(index)}
          />
        </View>
      )}
      <OutputList items={bankDetails} outputProps={{ copy: true }} pb={2} />
    </View>
  );
};

export default CompanyBankAccountDeposit;
