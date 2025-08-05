import React, { useState, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { throttle } from 'lodash';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Controller, useFormContext } from 'react-hook-form';
import { getBusinessUsers } from 'util/rehive';
import { useEffect } from 'react';
import { Box } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import { emailPattern, validateEmail, validateMobile } from 'util/validation';
import Inputs from 'components/inputs';
import useI18Language from 'hooks/useI18Language';

const useStyles = makeStyles(theme => ({
  paper: {
    margin: 0,
    padding: 0,
    paddingInlineStart: 0,
    width: '100%',
    paddingInlineEnd: 0,
  },
  listbox: {
    margin: 0,
    padding: 0,
    paddingInlineStart: 0,
    width: '100%',
    paddingInlineEnd: 0,
  },
  groupUl: {
    margin: 0,
    padding: 0,
    paddingInlineStart: 0,
    width: '100%',
    paddingInlineEnd: 0,
  },
}));

const useStyles2 = makeStyles(theme => ({
  avatar: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1.5),
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
    maxHeight: theme.spacing(4),
    maxWidth: theme.spacing(4),
  },
}));

export default function CustomerSearchInput(props) {
  const { getI18Translation } = useI18Language();
  const { businessId } = props;
  
  // Use form context instead of props
  const methods = useFormContext();
  
  if (!methods) {
    console.error('CustomerSearchInput must be wrapped in a FormProvider');
    return null;
  }
  
  const { control, formState: { errors }, register, getValues } = methods;

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    fetchData();
  }, [businessId]);

  const fetchData = useMemo(
    () =>
      throttle(request => {
        setLoading(true);

        getBusinessUsers(
          businessId,
          `?email__contains=${
            encodeURIComponent(request?.substring) ?? ''
          }&page_size=25`,
        )
          .then(resp => {
            if (resp.status === 'success');
            setData(resp?.data?.results);
          })
          .catch(e => console.log('fetchData -> e', e))
          .finally(() => setLoading(false));
      }, 1500),
    [],
  );

  const helperText = errors?.customer?.message ?? '';

  const value = getValues('customer');

  const showAddCustomer =
    data?.findIndex(customer => customer?.email === (value?.email ?? value)) ===
    -1;

  return (
    <Box pt={0.5} w={'100%'} pb={showAddCustomer ? 0 : 0.75}>
      <Controller
        render={({ field }) => (
          <Autocomplete
            value={field.value}
            onChange={(_, data) => field.onChange(data)}
            id="customer"
            options={data ?? []}
            freeSolo
            // autoComplete
            ListboxProps={{ padding: 0, margin: 0, width: '100%' }}
            loading={loading}
            classes={classes}
            getOptionSelected={(option, value) =>
              value?.email ?? value === option.email
            }
            getOptionLabel={option =>
              typeof option === 'string' ? option : option.email ?? ''
            }
            renderOption={option => <Option item={option} />}
            renderInput={params => (
              <TextField
                {...params}
                label={getI18Translation('customer')}
                helperText={helperText}
                error={Boolean(helperText)}
                margin="dense"
                variant="outlined"
                name={field.name}
                onChange={event => {
                  // Don't call field.onChange here, as it would override the Autocomplete value
                  // Just fetch data based on the input
                  fetchData({ substring: event.target.value });
                }}
                inputRef={field.ref}
              />
            )}
          />
        )}
        name="customer"
        control={control}
        rules={{
          required: true,
          validate: item => {
            const isValidEmail = validateEmail(item?.email ?? item);
            const isValidMobile = validateMobile(item?.email ?? item);

            return (
              !isValidEmail ||
              (typeof isValidMobile === 'boolean' && isValidMobile) ||
              'Please enter a valid email or mobile number'
            );
          },
          // pattern: {
          //   value: emailPattern,
          //   message: 'Please enter a valid email',
          // },
        }}
      />
      {showAddCustomer && (
        <Inputs
          name={'addCustomer'}
          form={methods} // Pass the form methods object instead of control and register
          config={{
            label: 'add_customer_on_invoice_create',
            variant: 'checkbox',
            noPadding: true,
          }}
        />
      )}
    </Box>
  );
}

function Option(props) {
  const { item } = props;
  const { email = '' } = item;
  const { first_name, last_name, profile, id } = item.user;
  const classes = useStyles2();
  const name = first_name + (last_name ? ' ' + last_name : '');

  const image = profile;
  const title = name ? name : email;
  const subtitle = name && email;
  return (
    <View fD={'row'} w={'100%'} jC={'flex-start'} aI={'center'}>
      {image ? (
        <Avatar
          alt={title}
          src={image}
          className={classes.avatar}
          imgProps={{ style: { objectFit: 'contain' } }}
        />
      ) : (
        <Avatar className={classes.avatar}>{title?.slice(0, 1)}</Avatar>
      )}
      <View fD={'column'} jC={'flex-end'} w={'100%'}>
        {title && <Text align={'left'}>{title}</Text>}
        {subtitle && (
          <Text variant="subtitle2" align={'left'}>
            {subtitle}
          </Text>
        )}
      </View>
    </View>
  );
}
