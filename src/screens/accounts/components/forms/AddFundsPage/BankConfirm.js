import React from 'react';

import Text from 'components/outputs/Text';
import CompanyBankAccountDeposit from './CompanyBankAccountDeposit';
import { formatAmountString } from 'util/general';
import { get } from 'lodash';

export default function BankConfirm(props) {
  const { formikProps, config, currency } = props;
  const { values } = formikProps;
  const { amount } = values;

  const amountValue = get(config, ['fixed', 'options', amount, 'amount'], 0);

  const amountString = formatAmountString(amountValue, currency.currency, true);

  return (
    <CompanyBankAccountDeposit
      currency={currency}
      account={currency.account}
      TextComponent={
        <Text p={1} align={'center'}>
          {'Transfer exactly '}
          <Text color="primary" bold component="span" display="inline">
            {amountString}
          </Text>
          {
            ' to the bank details below. Make sure to use the correct reference number.'
          }
        </Text>
      }
    />
  );
}
