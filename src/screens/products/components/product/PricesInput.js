import React from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import Selector from 'components/inputs/Selector';
import { mapOptions } from 'util/general';
import Input from 'components/inputs/Input';

export default function PricesInput(props) {
  const { formikProps, companyCurrencies } = props;
  const classes = useStyles();

  return (
    // <Formik initialValues={{ amount: '', currency: companyCurrencies[0] }}>
    //   {formikProps => (
    <div className={classes.container}>
      <div className={classes.row}>
        <Selector
          label={'Currency'}
          items={mapOptions(companyCurrencies, 'code')}
          value={formikProps.values.currency}
          onValueChange={value => formikProps.setFieldValue('currency', value)}
        />

        <Input
          formikProps={formikProps}
          field={{
            name: 'amount',
            label: 'Amount',
          }}
        />
      </div>
    </div>
    //   )}
    // </Formik>
  );
}
//
const useStyles = makeStyles(theme => ({
  container: {
    paddingTop: theme.spacing(1),
    // marginTop: theme.spacing(6),
    // borderRadius: 30,
    // minWidth: 350,
    // border: '1px solid #EFEFEF',
    width: '100%',
    // height: '90%',
    // backgroundColor: 'white',
    // display: 'flex',
    // flexDirection: 'column',

    // alignItems: 'center',
  },
  row: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
  },
}));
