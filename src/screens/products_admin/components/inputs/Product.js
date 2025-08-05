import React, { useState, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
// import { throttle } from 'lodash';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Controller } from 'react-hook-form';

import { useEffect } from 'react';
import { Box } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import { getProducts } from 'screens/products_admin/util/rehive';
import { standardizeString } from 'util/general';
import { useTranslation } from 'react-i18next';

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

export default function ProductSearchInput(props) {
  const { t } = useTranslation(['common']);
  const { control, errors, register, getValues, context } = props;
  const { sellers } = context;

  const sellerId = sellers?.[0]?.id ?? '';
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const classes = useStyles();
  const value = getValues('product');

  useEffect(() => {
    if (sellerId) {
      fetchData();
    }
  }, [sellerId]);

  const fetchData =
    // useMemo(
    request =>
      // throttle(request =>
      {
        setLoading(true);

        getProducts(
          sellerId,
          `?name__contains=${
            encodeURIComponent(request?.substring ?? '') ?? ''
          }&page_size=10&type=virtual`,
        )
          .then(resp => {
            if (resp.status === 'success');
            setData(resp?.data?.results);
          })
          .catch(e => console.log('fetchData -> e', e))
          .finally(() => setLoading(false));
      };
  //   , 1500),
  // [],
  // );

  const helperText = errors?.product?.message ?? '';

  return (
    <Box pt={0.5} w={'100%'} pb={0.75}>
      <Controller
        render={({ field }) => (
          <Autocomplete
            {...field}
            id="product"
            options={data ?? []}
            freeSolo
            // autoComplete
            ListboxProps={{ padding: 0, margin: 0, width: '100%' }}
            loading={loading}
            classes={classes}
            getOptionSelected={(option, value) => value?.id === option.id}
            getOptionLabel={option =>
              typeof option === 'string' ? option : option.name ?? ''
            }
            renderOption={option => <Option item={option} />}
            renderInput={params => (
              <TextField
                {...params}
                label={t('virtual_product')}
                helperText={helperText}
                error={Boolean(helperText)}
                margin="dense"
                variant="outlined"
                name={field.name}
                onChange={event => {
                  field.onChange(event.target.value);
                  fetchData({ substring: event.target.value });
                }}
              />
            )}
            onChange={(_, data) => field.onChange(data)}
          />
        )}
        name="product"
        control={control}
        defaultValue=""
        rules={{
          required: true,
          // validate: item => validateEmail(item?.email ?? item),
          // pattern: {
          //   value: emailPattern,
          //   message: 'Please enter a valid email',
          // },
        }}
      />

      {/* {Boolean(value) && (
        <Box pt={1} style={{ maxWidth: 240 }}>
          <Text>{'Format: ' + standardizeString(value?.virtual_format)}</Text>
        </Box>
      )} */}
    </Box>
  );
}

function Option(props) {
  const { item } = props;
  const { name, id, images = [], short_description } = item;
  const classes = useStyles2();

  const image = images?.[0]?.file ?? '';
  const title = name;
  const subtitle = short_description;
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
