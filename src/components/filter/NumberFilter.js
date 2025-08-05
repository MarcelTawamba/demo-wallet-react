import React from 'react';
import { get } from 'lodash';

import Selector from 'components/inputs/Selector';
import { Input } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import Text from 'components/outputs/Text';

const NumberFilter = props => {
  const { id, tempFilters, setTempFilters, config } = props;

  let filter = get(tempFilters, [id, 'value'], {
    type: 'equal',
    value: '',
    value2: '',
  });
  const { type, value, value2 } = filter;

  const typeOptions =
    config && config.options
      ? config.options
      : [
          { value: 'equal', label: 'Is equal to' },
          { value: 'between', label: 'Is between' },
          { value: 'less', label: 'Is less than' },
          { value: 'more', label: 'Is more than' },
        ];

  const setType = type =>
    setTempFilters({
      ...tempFilters,
      [id]: {
        ...tempFilters[id],
        value: { ...get(tempFilters, [id, 'value'], {}), type },
      },
    });

  const setValue = value =>
    setTempFilters({
      ...tempFilters,
      [id]: {
        ...tempFilters[id],
        value: { ...get(tempFilters, [id, 'value'], {}), value },
      },
    });
  const setValue2 = value2 =>
    setTempFilters({
      ...tempFilters,
      [id]: {
        ...tempFilters[id],
        value: { ...get(tempFilters, [id, 'value'], {}), value2 },
      },
    });

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
};

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

export default NumberFilter;
