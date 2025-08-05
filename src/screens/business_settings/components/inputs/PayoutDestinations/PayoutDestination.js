import React, { useState, useEffect, useMemo } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Box } from '@material-ui/core';
import IconButton from 'components/inputs/IconButton';
import Selector from 'components/inputs/Selector';
import TextField from 'components/inputs/TextField';

const payoutTypes = [
  {
    value: 'native',
    label: 'Account',
  },
  {
    value: 'bank',
    label: 'Bank account',
  },
  {
    value: 'bitcoin',
    label: 'Bitcoin',
  },
];

export default function PayoutDestination(props) {
  const { data, onItemChange, onItemRemove, setModal, value } = props;
  const [type, setType] = useState(value?.type ?? payoutTypes?.[0]?.value);
  const [percentage, setPercentage] = useState(value?.percentage ?? '100');
  const classes = useStyles();
  const destinationOptions = useMemo(() => data?.[type], [type]);

  const [destination, setDestination] = useState(
    value?.account
      ? value?.account
      : value?.bank_account
      ? value?.bank_account
      : value?.bitcoin_account
      ? value?.bitcoin_account
      : destinationOptions?.[0]?.value ?? '',
  );

  const currencies = useMemo(
    () =>
      (
        destinationOptions.find(
          item => item.value.toString() === destination.toString(),
        )?.currencies ?? []
      ).map(item => ({
        value: item?.code ?? item,
        label: item?.display_code ?? item?.code ?? item,
      })),
    [destinationOptions],
  );
  const [currency, setCurrency] = useState(
    value?.currency ?? currencies?.[0]?.value ?? '',
  );

  useEffect(() => {
    setCurrency(currencies?.[0]?.value ?? '');
  }, [currencies]);

  useEffect(() => {
    if (value?.currency) {
      setCurrency(value?.currency);
    }
  }, [value]);

  function handleTypeChange(value) {
    setType(value);
    const newDestination = data?.[value]?.[0];
    setDestination(newDestination?.value ?? '');
    const tempCurrency = newDestination?.currencies?.[0];
    setCurrency(tempCurrency?.code ?? tempCurrency ?? '');
  }

  useEffect(() => {
    let newDestination = {
      account: '',
      bitcoin_account: '',
      bank_account: '',
      type,
      percentage: parseFloat(percentage),
      currency,
    };
    if (type === 'bank') {
      newDestination.bank_account = destination;
    } else if (type === 'bitcoin') {
      newDestination.bitcoin_account = destination;
    } else if (type === 'native') {
      newDestination.account = destination;
    }
    onItemChange(newDestination);
  }, [destination, type, percentage, currency]);

  return (
    <div className={classes.item}>
      <div className={classes.row}>
        <Selector
          items={payoutTypes}
          value={type}
          label={'Payout type'}
          onValueChange={handleTypeChange}
        />
        <div className={classes.right}>
          <TextField
            margin="dense"
            autoComplete="off"
            variant="standard"
            label="Percentage"
            value={percentage}
            onChange={e => setPercentage(e.target.value)}
            type="number"
          />
          <Box style={{ right: -4, position: 'relative' }}>
            <IconButton
              icon={'minus'}
              noPadding
              inverted
              color="error"
              size={14}
              onPress={onItemRemove}
            />
          </Box>
        </div>
      </div>

      <div className={classes.row}>
        <div className={classes.left}>
          <Selector
            items={destinationOptions}
            value={destination}
            label={'Destination'}
            onValueChange={setDestination}
            emptyListMessage={'No ' + type + ' accounts'}
          />
        </div>

        <div className={classes.right}>
          {type !== 'bitcoin' && (
            <Selector
              items={currencies}
              value={currency}
              label={'Currency'}
              onValueChange={setCurrency}
              emptyListMessage={'No currencies'}
            />
          )}
        </div>
      </div>
      {/* {type !== 'native' && (
        <Button
          id={'add_' + type + '_account'}
          noPadding
          variant="link"
          color="primary"
          onPress={() => setModal(type)}
        />
      )} */}
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  item: {
    borderRadius: 10,
    padding: theme.spacing(2),
    paddingTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(2),
    border: '1px solid #EFEFEF',
    width: '100%',
    boxSizing: 'border-box',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    height: 64,
  },
  left: {
    width: '100%',
    maxWidth: 251,
  },
  right: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    paddingLeft: theme.spacing(2),
    maxWidth: 160,
  },
}));
