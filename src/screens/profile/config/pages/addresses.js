import { concatAddress } from 'util/general';

import { deleteData } from 'util/api';
import { EMPTY_ADDRESS } from 'config/empty';
import * as Inputs from 'config/inputs';
import { getCode } from 'country-list';
import { createAddress, updateItem } from 'util/rehive';

export async function createData(values, control, props) {
  const { itemId, onSuccess, pageId, showToast, setSubmitting } = props;

  const type = 'addresses';
  // const { values, setSubmitting, setStatus } = props; // FormikProps

  try {
    const { types = ['permanent'], country } = values;

    let resp = null;
    let data = {
      ...values,
      country: getCode(country ? country : ''),
    };
    // add manipulate values
    if (types?.length > 0 && !itemId) {
      for (let i = 0; i < types.length; i++) {
        resp = await createAddress({ ...data, type: types[i] });
      }
    } else {
      resp = await updateItem(type, data);
    }

    onSuccess(resp?.data?.id);
    showToast({
      variant: 'success',
      id: `${pageId}_${itemId ? 'edit' : 'add'}_success`,
    });
  } catch (e) {
    showToast({
      variant: 'error',
      id: `${pageId}_${itemId ? 'edit' : 'add'}_error`,
    });
  }

  if (typeof setSubmitting === 'function') setSubmitting(false);
}

export const form = props => {
  return {
    title: 'Add new address',
    defaultValues: EMPTY_ADDRESS,
    submitLabel: 'update',
    submitLabelCapitalize: true,
    onSubmit: createData,
    fields: ['addressType'].concat(
      Object.keys(EMPTY_ADDRESS).map(key => Inputs[key]),
    ),
  };
};

const exportConfigs = {
  id: 'addresses',
  icon: 'AddLocation',
  image: 'address',
  imageSize: 80,
  services: {
    createData,
    deleteData,
  },
  components: {
    list: {
      value: concatAddress,
      label: item => item?.name ?? '',
      actions: {
        verify: false,
        primary: false,
        delete: item => !item?.primary,
        edit: true,
      },
    },
    form,
  },
  condition: ({ context }) => context?.profileConfig?.hideAddresses === true,
};

export default exportConfigs;
