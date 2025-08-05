import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { country } from 'config/inputs';
import Input from 'components/inputs/Input';
import { Formik } from 'formik';
import { getName } from 'country-list';
import { countriesFilterMap } from 'util/filters';

export default function CountriesFilter(props) {
  const { initialValue = '' } = props;

  const [value, setValue] = useState(
    initialValue
      .split(',')
      .map(getName)
      .filter(item => item) ?? [],
  );
  useEffect(() => {
    props.setValue(
      countriesFilterMap({
        value,
      }),
    );
  }, [value]);

  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Formik initialValues={{ country: value?.[0] ?? '' }}>
        {props => (
          <Input
            variant={'standard'}
            field={{ ...country, variant: 'standard', label: '' }}
            formikProps={{
              ...props,
              setFieldValue: (name, value) => {
                props.setFieldValue(name, value);
                // setIsOpen(true);
                try {
                  // const code = getCode(value);
                  // if (code) {
                  setValue([value]);
                  // setIsOpen(false);
                  // }
                } catch (e) {}
              },
            }}
          />
        )}
      </Formik>

      {/* <div className={classes.inputs} /> */}
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    height: isOpen => 'auto',
    paddingLeft: theme.spacing(0.5),
    paddingRight: theme.spacing(0.5),
  },
  inputs: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'flex-end',
  },
}));
