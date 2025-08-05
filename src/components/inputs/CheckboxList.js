import React from 'react';
import { makeStyles } from '@material-ui/styles';
import Checkbox from './Checkbox';
import Text from 'components/outputs/Text';

const CheckboxList = props => {
  const { items, label, setValue } = props;
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Text variant={'caption'} id={label} />
      {items.map(({ value, label, checked, disabled }) => (
        <Checkbox
          disabled={disabled}
          label={label}
          name={value}
          key={value}
          value={checked}
          setValue={(name, value) => setValue(name, value)}
        />
      ))}
    </div>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(0.5),
  },
  label: {
    display: 'flex',
    flexDirection: 'row',
  },
}));

export default CheckboxList;
