import { EMPTY_MOBILE } from 'config/empty';
import { createData, deleteData } from 'util/api';

export const form = props => {
  return {
    title: 'Add new mobile number',
    defaultValues: EMPTY_MOBILE,
    submitLabel: 'update',
    submitLabelCapitalize: true,
    onSubmit: createData,
    fields: ['mobile_number'],
  };
};

const exportConfigs = {
  id: 'mobiles',
  icon: 'Phone',
  imageSize: 80,
  services: {
    createData,
    deleteData,
  },
  components: {
    list: {
      value: item => item?.number,
      label: item => item?.name ?? '',
      actions: {
        verify: true,
        primary: true,
        delete: item => !item?.primary,
        edit: false,
      },
    },
    form,
    verify: {
      title: 'Verify mobile',
      variant: 'mobile',
    },
  },
  condition: ({ context }) => context?.profileConfig?.hideMobiles === true,
};

export default exportConfigs;
