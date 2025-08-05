import React, { useState, useMemo } from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import { Controller } from 'react-hook-form';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import { walletsSelector } from 'screens/accounts/redux/selectors';
import { useSelector } from 'react-redux';

import Autocomplete from '@material-ui/lab/Autocomplete';
import { getBusinessUsers } from 'util/rehive';
import { useEffect } from 'react';
import { Box } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import { throttle } from 'lodash';

const useStyles = makeStyles(theme => ({
  // formControl: {
  //   marginTop: ({ noPadding, label }) =>
  //     theme.spacing(noPadding ? 0 : label ? 1 : 0),
  //   width: '100%',
  //   border: '1px solid rgba(0, 0, 0, 0.25)',
  //   borderRadius: 10,
  //   '&:focus': {
  //     border: '2px solid #ab2323',
  //   },
  //   '&:hover': {
  //     border: '1px solid rgba(0, 0, 0, 0.87)',
  //   },
  //   margin: ({ noPadding, label }) => theme.spacing(1),
  //   position: 'relative',
  //   left: -theme.spacing(1),

  //   padding: theme.spacing(1.5),
  // },
  // label: {
  //   backgroundColor: 'white',
  //   left: -theme.spacing(0.5),
  //   top: -theme.spacing(0.5),
  //   padding: theme.spacing(0.5),
  //   paddingRight: theme.spacing(1),
  //   paddingBottom: theme.spacing(0),
  // },
  root: {
    paddingBottom: theme.spacing(2),
  },
}));

export default function RewardsAccount(props) {
  const { businessId, control, errors, register, getValues } = props;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const classes = useStyles(props);

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

  const wallets = useSelector(walletsSelector);

  return (
    <Controller
      render={props => (
        <Autocomplete
          {...props}
          id="rewards_account"
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
              label="Rewards account"
              helperText={helperText}
              error={Boolean(helperText)}
              margin="dense"
              variant="outlined"
              name={props.name}
              onChange={event => {
                props.onChange(event.target.value);
                fetchData({ substring: event.target.value });
              }}
            />
          )}
          onChange={(_, data) => props.onChange(data)}
        />
      )}
      name="rewards_account"
      control={control}
      rules={{
        required: true,
        // validate: item => validateEmail(item?.email ?? item),
        // pattern: {
        //   value: emailPattern,
        //   message: 'Please enter a valid email',
        // },
      }}
    />
  );
}

function Option(props) {
  const { item } = props;
  const { email } = item;
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
