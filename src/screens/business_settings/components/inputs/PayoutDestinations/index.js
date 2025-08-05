import React, { useState, useEffect, useMemo } from 'react';
import { Form } from 'formik';
import { Box } from '@material-ui/core';
import { useSelector } from 'react-redux';
import {
  userBankAccountsSelector,
  cryptoAccountsSelector,
} from 'redux/rehive/selectors';
import { walletsSelector } from 'screens/accounts/redux/selectors';
import {
  concatBankAccount,
  standardizeString,
  concatCryptoAccount,
  objectToArray,
  sum,
} from 'util/general';
import EmptyListMessage from 'components/lists/EmptyListMessage';
import IconButton from 'components/inputs/IconButton';
import Info from 'components/outputs/Info';
import PayoutDestination from './PayoutDestination';

const defaultDestination = {
  type: 'bank',
  percentage: 100,
  destination: '',
  currency: '',
};

export default function PayoutDestinations(props) {
  const { activeSection, formikProps } = props;
  const { initialValues, setFieldValue } = formikProps;
  const { destinations = [] } = initialValues;
  const temp = destinations.map(item => ({
    ...item,
    currency: item?.currency?.code ?? item?.currency ?? '',
  }));
  const [items, setItems] = useState(temp);
  const [index, setIndex] = useState(destinations?.length ?? 0);

  const [modal, setModal] = useState('');

  const bankAccounts = useSelector(userBankAccountsSelector);
  const cryptoAccounts = useSelector(cryptoAccountsSelector);
  const accounts = useSelector(walletsSelector);

  const data = {
    bank: bankAccounts?.items?.map(item => ({
      value: item?.id,
      label: concatBankAccount(item),
      currencies: item?.currencies,
    })),
    bitcoin: cryptoAccounts?.items
      ?.filter(item => item.crypto_type === 'bitcoin')
      ?.map(item => ({
        value: item?.id,
        label: concatCryptoAccount(item),
        currencies: [item?.network === 'testnet' ? 'TXBT' : 'XBT'],
      })),
    native: objectToArray(accounts?.accounts)
      ?.filter(item => item.name !== 'sales')
      ?.map(item => ({
        value: item?.reference,
        label: item.label ?? standardizeString(item?.name),
        currencies: item?.keys,
      })),
  };

  function handleItem(i, item) {
    let newItems = [...items];
    if (i > newItems.length) {
      newItems.push(item);
    } else {
      newItems[i] = item;
    }
    setItems(newItems);
  }

  function handleRemove(i) {
    let newItems = [...items];
    delete newItems.splice(i, 1);
    setIndex(index - 1);
    setItems(newItems);
  }

  useEffect(() => {
    setFieldValue('destinations', items);
  }, [items]);

  useEffect(() => {
    if (items?.length !== destinations?.length) {
      const temp = destinations.map(item => ({
        ...item,
        currency: item?.currency?.code ?? item?.currency ?? '',
      }));
      setItems(temp);
      setIndex(destinations?.length ?? 0);
    }
  }, [destinations]);

  const percentageTotal = useMemo(() => sum(items, 'percentage'), [items]);
  const percentageValid = items?.length > 0 && percentageTotal !== 100;

  return (
    <Form>
      {items.length > 0 ? (
        items.map((destination, i) => (
          <PayoutDestination
            value={destination}
            key={`destinations.${i}`}
            name={`destinations.${i}`}
            formikProps={formikProps}
            onItemChange={item => handleItem(i, item, formikProps)}
            onItemRemove={() => handleRemove(i)}
            data={data}
            setModal={setModal}
          />
        ))
      ) : (
        <EmptyListMessage>No destinations added</EmptyListMessage>
      )}
      {percentageValid && (
        <Info mt={2} noMargin variant="warning">
          Sum of percentages must be equal to 100, current total:{' '}
          {percentageTotal}
        </Info>
      )}

      <Box pt={percentageValid ? 2 : 1} style={{ textAlign: 'right' }}>
        <IconButton
          icon={'plus'}
          noPadding
          // onPress={() => setIndex(index + 1)}
          onPress={() => handleItem(items.length, defaultDestination)}
        />
      </Box>
      {/* <Modal
        close
        title={'Add' + modalConfig?.[modal]?.title}
        maxWidth={500}
        open={Boolean(modal)}
        onDismiss={() => {
          setModal('');
        }}>
        <AccountForm type={modal} />
      </Modal> */}
    </Form>
  );
}
