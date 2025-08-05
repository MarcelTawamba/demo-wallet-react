import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import Spinner from 'components/outputs/Spinner';
import Input from 'components/inputs/Input';
import { Formik } from 'formik';
import { arrayToObject } from 'util/general';
import Output from 'components/outputs/Output';
import { View } from 'components/layout/View';

export default function SellerFilter(props) {
  const { context, initialValue } = props;
  const { sellers = [], loading } = context;
  const sellersObj = arrayToObject(sellers, 'id');

  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    props.setValue(value);
  }, [value]);

  const classes = useStyles();
  const options = sellers.map(item => ({ value: item?.id, label: item?.name }));

  return (
    <div className={classes.container}>
      {initialValue ? (
        <View pl={0.5}>
          <Output
            label=""
            value={sellersObj?.[initialValue]?.name ?? initialValue}
          />
        </View>
      ) : loading ? (
        <Spinner size={24} />
      ) : (
        <Formik initialValues={{ country: value?.[0] ?? '' }}>
          {props => (
            <Input
              // variant={'standard'}
              field={{
                type: 'autocomplete',
                label: 'seller_name',
                options,
                loading,
              }}
              formikProps={{
                ...props,
                setFieldValue: (name, value) => {
                  setValue(value);
                  props.setFieldValue(name, value);
                  // setIsOpen(true);
                  try {
                    setValue(value);
                  } catch (e) {}
                },
              }}
            />
          )}
        </Formik>
      )}
    </div>
  );
}
const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
  },
}));
