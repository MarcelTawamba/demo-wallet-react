import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { uniq } from 'lodash';

import MultiSelect from 'components/inputs/MultiSelect';
import { useSelector } from 'react-redux';
import { walletsSelector } from 'screens/accounts/redux/selectors';

const useStyles = makeStyles(theme => ({
  text: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  edit: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    justifyContent: 'flex-end',
  },
}));

const AccountCurrencyList = props => {
  const { formikProps, field: { label = 'currencies' } = {} } = props;

  function setValue(value) {
    formikProps.setFieldValue('currencies', value);
  }
  const values = formikProps.values.currencies ?? [];
  const accounts = useSelector(walletsSelector);

  const codes = uniq(
    accounts.items.map(
      currency => !currency.crypto && currency?.currency?.code,
    ),
  );
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <MultiSelect
        items={codes}
        values={values}
        label={label}
        setValue={setValue}
      />
    </div>
  );
};

export default AccountCurrencyList;
