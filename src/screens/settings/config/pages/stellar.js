import { concatCryptoAccount, concatCryptoAccountNoName } from 'util/general';
import { statusText } from 'screens/settings/util';
import { EMPTY_STELLAR_MAINNET, EMPTY_STELLAR_TESTNET } from 'config/empty';

import {
  updateItem,
  deleteItem,
  getStellarKnownPublicAddresses,
} from 'util/rehive';
import FormList from 'screens/settings/components/FormList';

function mapDefaultValues(values) {
  const { name, address, metadata } = values;
  return {
    name,
    address,
    memo: metadata?.memo,
    stellarAddressType: address.includes('*') ? 'federation' : 'public',
    memoSkip: false,
  };
}

const formConfig = props => {
  const services = props?.reduxContext?.services;
  const knownPublicAddresses = props?.context?.results ?? [];

  let hasTestnetSelector = false;
  if (services?.stellar_service && services?.stellar_testnet_service) {
    hasTestnetSelector = true;
  }
  const isMainnet =
    services?.stellar_service && !services?.stellar_testnet_service;

  let fields = ['account_name'];

  fields.push({
    id: 'testnetSelector',
    condition: () => hasTestnetSelector,
  });
  fields.push('stellarAddressType');
  fields.push({
    id: 'stellarAddress',
    condition: ({ network, stellarAddressType }) => {
      return (
        (stellarAddressType === 'public' && network === 'mainnet') || isMainnet
      );
    },
  });
  fields.push({
    id: 'stellarTestnetAddress',
    condition: ({ network, stellarAddressType }) =>
      stellarAddressType === 'public' && network !== 'mainnet' && !isMainnet,
  });
  fields.push({
    id: 'stellarFederationAddress',
    condition: ({ stellarAddressType }) => stellarAddressType !== 'public',
  });
  fields.push({
    id: 'memoSkipAccount',
    condition: ({ stellarAddressType, address }) =>
      stellarAddressType === 'public' &&
      knownPublicAddresses &&
      !(
        knownPublicAddresses?.find(item => item.public_address === address)
          ?.requires_memo ?? false
      ),
  });
  fields.push({
    id: 'memoSkipInfo',
    condition: ({ stellarAddressType, address }) =>
      stellarAddressType === 'public' &&
      knownPublicAddresses &&
      (knownPublicAddresses?.find(item => item.public_address === address)
        ?.requires_memo ??
        false),
  });
  fields.push({
    id: 'memo',
    condition: ({ stellarAddressType, memoSkip }) =>
      stellarAddressType === 'public' && !memoSkip,
  });

  if (services?.stellar_service) {
    return {
      defaultValues: EMPTY_STELLAR_MAINNET,
      mapDefaultValues,
      submitLabel: 'save',
      submitLabelCapitalize: true,
      onSubmit: createData,
      fields,
    };
  }
  return {
    defaultValues: EMPTY_STELLAR_TESTNET,
    mapDefaultValues,
    submitLabel: 'save',
    submitLabelCapitalize: true,
    onSubmit: createData,
    fields,
  };
};

async function createData(values, control, props) {
  const { itemId, onSuccess, showToast } = props;
  const { setSubmitting, setErrors, setError } = control;
  const { memo, stellarAddressType } = values;

  try {
    let data = {
      ...values,
      crypto_type: 'stellar',
    };
    if (!values?.network) {
      data.network = props?.reduxData?.services?.stellar_service
        ? 'mainnet'
        : 'testnet';
    }

    if (memo && stellarAddressType === 'public') {
      data.metadata = { memo };
    }

    if (itemId) {
      data.id = itemId;
    }

    const resp = await updateItem('cryptoAccounts', data);
    onSuccess(resp?.data?.id);
    showToast({
      id: `stellar_account_${itemId ? 'edit' : 'add'}_success`,
      variant: 'success',
    });
  } catch (e) {
    setError(e?.message);
    showToast({
      id: `stellar_account_${itemId ? 'edit' : 'add'}_error`,
      variant: 'error',
    });
  }

  if (typeof setSubmitting === 'function') setSubmitting(false);
}

async function fetchData(cnt, event) {
  try {
    let resp = await getStellarKnownPublicAddresses();
    if (resp.status === 'success') {
      return resp?.data;
    }
  } catch (e) {
    console.log('fetchData -> e', e);
  }
}

async function deleteData(props) {
  const { itemId, onSuccess, showToast, setSubmitting } = props;
  if (typeof setSubmitting === 'function') setSubmitting(true);

  try {
    await deleteItem('cryptoAccounts', itemId);
    showToast({
      text: 'stellar_account_delete_success',
      variant: 'success',
    });
    onSuccess();
  } catch (error) {
    console.log(error);
    showToast({
      text: 'stellar_account_delete_failed',
      variant: 'error',
    });
  }
  if (typeof setSubmitting === 'function') setSubmitting(false);
}

const exportConfigs = {
  id: 'stellar',
  title: 'Stellar accounts',
  renderDetail: FormList,
  parent: 'externalAccounts',

  services: {
    fetchData,
    createData,
    deleteData,
  },
  components: {
    list: {
      value: item => concatCryptoAccount(item, true, true),
      multiline: true,
      label: item => item?.name,
      status: item => statusText(item),
      emptyListMessage: 'stellar_empty',
      actions: {
        delete: true,
        edit: true,
      },
    },
    form: formConfig,
  },
};

export default exportConfigs;
