import React, { useState, useEffect } from 'react';
import { get } from 'lodash';

import Selector from 'components/inputs/Selector';
import { Input } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import Text from 'components/outputs/Text';
import { amountFilterMap, parseFilters } from 'util/filters';
import { useHistory } from 'react-router-dom';
import { searchToObj } from 'util/general';

export default function AmountFilter(props) {
  const { config, currency, id } = props;

  const typeOptions =
    config && config.options
      ? config.options
      : [
          { value: 'equal', label: 'Is equal to' },
          { value: 'between', label: 'Is between' },
          { value: 'less', label: 'Is less than' },
          { value: 'more', label: 'Is more than' },
        ];

  const history = useHistory();
  const search = history?.location?.search;
  const filters = searchToObj(search);

  const urlValues = parseFilters(filters, id ?? 'number');

  const [type, setType] = useState(urlValues?.type ?? typeOptions?.[0]?.value);
  const [value, setValue] = useState(urlValues?.value ?? '');
  const [value2, setValue2] = useState(urlValues?.value2 ?? '');

  // const [type, setType] = useState(typeOptions?.[0]?.value);
  // const [value, setValue] = useState('');
  // const [value2, setValue2] = useState('');

  useEffect(() => {
    props.setValue(
      amountFilterMap({
        type,
        value,
        value2,
        currency: currency?.currency ?? currency,
      }),
    );
  }, [type, value, value2]);

  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Selector
        label={''}
        items={typeOptions}
        value={type}
        onValueChange={value => setType(value)}
      />
      <div className={classes.inputs}>
        <Input
          label={''}
          placeholder={'0.00'}
          value={value}
          onChange={({ target }) => setValue(target.value)}
          fullWidth
        />
        {type === 'between' && (
          <React.Fragment>
            <Text
              width={'auto'}
              style={{ paddingLeft: 8, paddingRight: 8, paddingBottom: 8 }}>
              and
            </Text>
            <Input
              label={''}
              placeholder={'0.00'}
              value={value2}
              onChange={({ target }) => setValue2(target.value)}
              fullWidth
            />
          </React.Fragment>
        )}
      </div>
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    paddingTop: 0,
    padding: theme.spacing(1),
  },
  inputs: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'flex-end',
  },
}));
