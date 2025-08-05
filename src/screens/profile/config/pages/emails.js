import { EMPTY_EMAIL } from 'config/empty';

import { createData, deleteData } from 'util/api';

export const formConfig = props => {
  return {
    title: 'Add new email address',
    defaultValues: EMPTY_EMAIL,
    submitLabel: 'update',
    submitLabelCapitalize: true,
    onSubmit: createData,
    fields: ['email'],
  };
};

const exportConfigs = {
  id: 'emails',
  icon: 'Email',
  imageSize: 80,
  services: {
    createData,
    deleteData,
  },
  components: {
    list: {
      value: item => item?.email,
      label: item => item?.name ?? '',
      actions: {
        verify: true,
        primary: true,
        delete: true,
        edit: false,
      },
    },
    form: formConfig,
    verify: {
      title: 'Verify email',
      variant: 'email',
    },
  },
  condition: ({ context }) => context?.profileConfig?.hideEmails === true,
};

export default exportConfigs;
