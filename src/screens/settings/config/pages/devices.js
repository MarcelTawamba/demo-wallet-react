import { statusText } from 'screens/settings/util';
import { getDevices, deleteDevice } from 'util/rehive';
import FormList from 'screens/settings/components/FormList';
import DeviceItem from 'screens/settings/components/DeviceItem';

async function fetchData(cnt, event) {
  try {
    let resp = await getDevices();
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
    const resp = await deleteDevice(itemId);
    showToast({
      text: 'device_delete_success',
      variant: 'success',
    });
    onSuccess();
  } catch (error) {
    console.log(error);
    showToast({
      text: 'device_delete_failed',
      variant: 'error',
    });
  }
  if (typeof setSubmitting === 'function') setSubmitting(false);
}

const exportConfigs = {
  id: 'devices',
  title: 'devices',
  renderDetail: FormList,
  parent: 'security',

  services: {
    fetchData,
    // createData,
    deleteData,
  },
  components: {
    list: {
      value: item => item?.name ?? '',
      label: item => item?.metadata?.osName ?? '',
      status: item => statusText(item),
      emptyListMessage: 'devices_empty',
      renderItem: DeviceItem,
    },
    // form: formConfig,
  },
};

export default exportConfigs;
