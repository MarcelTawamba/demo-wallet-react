import { concatCryptoAccount } from 'util/general';
import { statusText } from 'screens/settings/util';
import { EMPTY_CRYPTO_MAINNET, EMPTY_CRYPTO_TESTNET } from 'config/empty';

import { updateItem } from 'util/rehive';
import FormList from 'screens/settings/components/FormList';

export const formConfig = props => {
  const services = props?.reduxContext?.services;
  let hasTestnetSelector = false;
  if (
    services?.ethereum_service &&
    services?.ethereum_testnet_service
  ) {
    hasTestnetSelector = true;
  }

  let fields = ['account_name'];
  if (hasTestnetSelector) {
    fields.push({
      id: 'testnetSelector',
    });
  }
  fields.push({
    id: 'ethereumAddress',
    condition: ({ network }) => network === 'mainnet',
  });
  fields.push({
    id: 'ethereumTestnetAddress',
    condition: ({ network }) => network !== 'mainnet',
  });

  if (services?.ethereum_service) {
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
      crypto_type: 'ethereum',
    };
    if (!values?.network) {
      data.network = props?.reduxData?.services?.ethereum_service
        ? 'mainnet'
        : 'testnet';
    }

    if (itemId) {
      data.id = itemId;
    }

    const resp = await updateItem('cryptoAccounts', data);
    onSuccess(resp?.data?.id);
    showToast({
      id: `ethereum_account_${itemId ? 'edit' : 'add'}_success`,
      variant: 'success',
    });
  } catch (e) {
    showToast({
      id: `ethereum_account_${itemId ? 'edit' : 'add'}_error`,
      variant: 'error',
    });
  }

  if (typeof setSubmitting === 'function') setSubmitting(false);
}

const exportConfigs = {
  id: 'ethereum',
  title: 'ethereum_accounts',
  renderDetail: FormList,
  redux: 'cryptoAccounts',
  parent: 'externalAccounts',

  services: {
    // fetchData,
    createData,
    deleteData: true,
  },
  components: {
    list: {
      value: item => concatCryptoAccount(item, true)?.[1],
      label: item => concatCryptoAccount(item, true)?.[0],
      status: item => statusText(item),
      emptyListMessage: 'ethereum_empty',
      actions: {
        delete: true,
        edit: true,
      },
    },
    form: formConfig,
  },
};

export default exportConfigs;
