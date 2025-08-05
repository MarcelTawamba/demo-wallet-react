import React, { useEffect, useState } from 'react';
import { get, groupBy } from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import makeStyles from '@material-ui/styles/makeStyles';

import IconLabelButton from 'components/inputs/IconLabelButton';
import FormikForm from 'components/inputs/FormikForm';
import { Input } from '../inputs';
import { Formik } from 'formik';
import {
  createOrder,
  createOrderItemNew,
  createOrderPayment,
  getProducts,
} from 'util/rehive';
import { fetchData } from 'redux/rehive/actions';
import { walletsSelector } from 'screens/accounts/redux/selectors';
// import Form from 'components/form';

export default function PurchaseVoucherFlow(props) {
  const { item, onBack, showToast } = props;
  const classes = useStyles(props);

  const { name, id } = item;

  const type = name.toLowerCase();
  const isVoucher = type.includes('voucher');

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchData('mobiles'));
  }, [dispatch]);

  const [providers, setProviders] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const resp = await getProducts('categories=' + id);
      if (resp.status === 'success') {
        setProviders(get(resp, ['data', 'results']));
      } else {
        // setError
      }
      setLoading(false);
    }
    fetchData();
  }, [id]);

  const currencies = useSelector(walletsSelector);
  // console.log('currencies', currencies);

  const currency = currencies.items.find(
    item => get(item, ['currency', 'code']) === 'ZAR',
  );
  // console.log('currency', currency);
  if (!currency) {
    return null;
  }

  async function handleConfirm(formikProps) {
    const { values, setStatus } = formikProps;
    let { bundle, provider, number } = values;

    const resp = await createOrder('ZAR');
    const cart = get(resp, 'data', {});
    const cartID = get(cart, 'id', '');
    const data = {
      quantity: 1,
      variant: get(bundle, 'id'),
      product: get(provider ? provider : get(providers, 0), 'id'),
      metadata: { msisdn: number.replace('+', '') },
    };
    const resp2 = await createOrderItemNew(cartID, data);
    const resp3 = await createOrderPayment(cartID);

    if (resp3.status === 'success') {
      showToast({ text: 'Purchase complete', variant: 'success' });
      props.navigation.goBack();
    } else {
      setStatus({ error: resp3.message });
    }
  }

  function handleSuccess() {
    // setError('');
    // setVoucher('');
    // history.push('/redeem_voucher/');
    // const currency = currencies.data[currencyHook[0]];
    // props.navigation.navigate('Wallets', { currency });
  }

  const formConfig = {
    scenes: {
      recipient: { title: () => 'Buy ' + type, fields: ['recipient'] },
      voucher: {
        title: ({ number }) => 'Buy ' + type + (number ? ' for ' + number : ''),
        fields: ['currency', 'provider', 'amount'],
      },
      provider: {
        title: () => 'Gift voucher',
        fields: ['providerV'],
      },
    },
    order: isVoucher ? ['provider', 'voucher'] : ['recipient', 'voucher'],

    fields: {
      provider: {
        variant: 'voucherProviderSelector',
        props: { options: providers, loading },
        validation: { required: 'Provider is required' },
      },
      providerV: {
        variant: 'voucherProviderSelectorV',
        props: { options: providers, loading },
        validation: { required: 'Provider is required' },
      },
      recipient: {
        variant: 'voucherRecipient',
        validation: { required: 'Recipient is required' },
      },
      currency: {
        variant: 'currencySelector',
        props: { item: currency },
      },
      amount: {
        variant: 'voucherAmount',
        props: { providers },
        validation: { required: 'Amount/bundle is required' },
      },
    },
    initialValues: {
      search: '',
      number: '',
      type,
      provider: get(providers, 0, null),
      currency,
      bundle: '',
      recipientType: 'For me',
      amount: '',
    },
    actions: {
      // onConfirmLoad: fetchVoucher,
      onConfirm: handleConfirm,
      // onSubmit: handleSubmit,
      onSuccess: handleSuccess,
    },
  };

  // return <FormFlow />;

  return <FormikForm {...props} formConfig={formConfig} />;

  return (
    <>
      <IconLabelButton label="Back" onPress={onBack} />
      <div className={classes.container}>
        <div>{name}</div>
      </div>
      {/* <FormFlow /> */}

      <Formik>
        {formikProps => (
          <Input variant="voucherRecipient" formikProps={formikProps} />
        )}
      </Formik>
    </>
  );
}

const useStyles = makeStyles(theme => ({
  container: {
    padding: theme.spacing(2),
    // marginTop: theme.spacing(6),
    borderRadius: 30,
    minWidth: 350,
    border: '1px solid #EFEFEF',
    width: '100%',
    // height: '90%',
    backgroundColor: 'white',
    display: 'flex',
    overflow: 'scroll',

    alignItems: 'center',
  },
}));
