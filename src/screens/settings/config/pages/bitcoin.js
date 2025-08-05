import { concatCryptoAccount } from 'util/general';
import { statusText } from 'screens/settings/util';
import { EMPTY_CRYPTO_MAINNET, EMPTY_CRYPTO_TESTNET } from 'config/empty';

import { updateItem, getBankAccounts, deleteItem } from 'util/rehive';
import FormList from 'screens/settings/components/FormList';

function mapFields(item, inputs) {
  let fields = Object.keys(item).map(key => inputs?.[key]);
  fields = fields.filter(item => item);
  return fields;
}

export const formConfig = props => {
  const services = props?.reduxContext?.services;
  let hasTestnetSelector = false;
  if (services?.bitcoin_service && services?.bitcoin_testnet_service) {
    hasTestnetSelector = true;
  }

  let fields = ['account_name'];
  if (hasTestnetSelector) {
    fields.push({
      id: 'testnetSelector',
    });
  }
  fields.push({
    id: 'bitcoinAddress',
    condition: ({ network }) => network === 'mainnet',
  });
  fields.push({
    id: 'bitcoinTestnetAddress',
    condition: ({ network }) => network !== 'mainnet',
  });

  if (services?.bitcoin_service) {
    return {
      defaultValues: EMPTY_CRYPTO_MAINNET,
      submitLabel: 'save',
      submitLabelCapitalize: true,
      onSubmit: createData,
      fields,
    };
  }
  return {
    defaultValues: EMPTY_CRYPTO_TESTNET,
    submitLabel: 'save',
    submitLabelCapitalize: true,
    onSubmit: createData,
    fields,
  };
};

async function createData(values, control, props) {
  const { itemId, onSuccess, showToast } = props;
  const { setSubmitting, setErrors } = control;

  try {
    let data = {
      ...values,
      crypto_type: 'bitcoin',
    };
    if (!values?.network) {
      data.network = props?.reduxData?.services?.bitcoin_service
        ? 'mainnet'
        : 'testnet';
    }

    if (itemId) {
      data.id = itemId;
    }

    const resp = await updateItem('cryptoAccounts', data);
    onSuccess(resp?.data?.id);
    showToast({
      id: `bitcoin_account_${itemId ? 'edit' : 'add'}_success`,
      variant: 'success',
    });
  } catch (e) {
    showToast({
      id: `bitcoin_account_${itemId ? 'edit' : 'add'}_error`,
      variant: 'error',
    });
  }

  if (typeof setSubmitting === 'function') setSubmitting(false);
}

// async function fetchData(cnt, event) {
//   try {
//     let resp = await getBankAccounts();
//     if (resp.status === 'success') {
//       return resp?.data;
//     }
//   } catch (e) {
//     console.log('fetchData -> e', e);
//   }
// }

async function deleteData(props) {
  const { itemId, onSuccess, showToast, setSubmitting } = props;
  if (typeof setSubmitting === 'function') setSubmitting(true);

  try {
    await deleteItem('cryptoAccounts', itemId);
    showToast({
      text: 'bitcoin_account_delete_success',
      variant: 'success',
    });
    onSuccess();
  } catch (error) {
    console.log(error);
    showToast({
      text: 'bitcoin_account_delete_failed',
      variant: 'error',
    });
  }
  if (typeof setSubmitting === 'function') setSubmitting(false);
}

const exportConfigs = {
  id: 'bitcoin',
  title: 'bitcoin_accounts',
  renderDetail: FormList,
  redux: 'cryptoAccounts',
  parent: 'externalAccounts',

  services: {
    // fetchData,
    createData,
    deleteData,
  },
  components: {
    list: {
      value: item => concatCryptoAccount(item, true)?.[1],
      label: item => concatCryptoAccount(item, true)?.[0],
      status: item => statusText(item),
      emptyListMessage: 'bitcoin_empty',
      actions: {
        delete: true,
        edit: true,
      },
    },
    form: formConfig,
  },
};

export default exportConfigs;
