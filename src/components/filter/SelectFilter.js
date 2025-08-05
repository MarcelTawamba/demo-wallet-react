import React from 'react';
import { get } from 'lodash';
import Selector from 'components/inputs/Selector';
import { makeStyles } from '@material-ui/styles';
import RadioSelector from 'components/inputs/RadioSelector';

const SelectFilter = props => {
  let { label = '', options, value, setValue } = props;
  const classes = useStyles();

  function handleValueChange(value) {
    setValue(value?.target?.value ?? value);
  }

  let items = options?.[0]?.value
    ? options
    : options.map(value => {
        return { label: value, value };
      });

  if (options.length < 4) {
    return (
      <RadioSelector
        responsive
        options={items}
        value={value}
        noPadding
        handleChange={handleValueChange}
      />
    );
  }
  if (!value) {
    value = get(options, [0, 'value']);
  }

  return (
    <div className={classes.container}>
      <Selector
        label={label}
        options={items}
        items={items}
        value={value}
        onValueChange={handleValueChange}
      />
    </div>
  );
};
const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  inputs: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'flex-end',
  },
}));

export default SelectFilter;
