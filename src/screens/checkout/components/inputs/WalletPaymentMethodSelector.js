import React from 'react';
import { Controller } from 'react-hook-form';
import { walletMethod } from '../../config/inputs';
import makeStyles from '@material-ui/styles/makeStyles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import { hasProcessorType } from './PaymentMethodSelector';
import useI18Language from 'hooks/useI18Language';

const useStyles = makeStyles(theme => ({
  formControl: {
    marginTop: ({ noPadding, title }) =>
      theme.spacing(noPadding ? 0 : title ? 2 : 1),
    width: '100%',
  },
  group: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  groupResponsive: {
    display: 'flex',
    // flexDirection: 'row',
    width: '100%',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    // [theme.breakpoints.down(500)]: {
    flexDirection: 'column',
    // },
  },
  item: {
    flex: 1,
  },
}));

export default function WalletPaymentMethodSelector(props) {
  let options = [...walletMethod?.options];
  if (
    props?.context?.invoice &&
    hasProcessorType(props?.context?.invoice, 'native_otp')
  )
    options.push({ value: 'request', label: 'Pay with pin (SMS OTP)' });
  return <RadioSelector {...walletMethod} options={options} {...props} />;
}

const RadioSelector = props => {
  const { name, value, label = '', options, control } = props;
  const classes = useStyles(props);
  const { getI18Translation } = useI18Language();

  return (
    <div className={classes.formControl}>
      {Boolean(label) && <FormLabel component="legend">{label}</FormLabel>}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <RadioGroup
            aria-label={name}
            className={classes.groupResponsive}
            value={field.value}
            onChange={(e) => field.onChange(e.target.value)}>
            {options.map(item => (
              <FormControlLabel
                key={item.label}
                value={item.value}
                className={classes.item}
                control={<Radio color={'primary'} />}
                label={getI18Translation(item.label)}
              />
            ))}
          </RadioGroup>
        )}
      />
    </div>
  );
};
