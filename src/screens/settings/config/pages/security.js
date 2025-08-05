import IconButtonListPage from 'screens/settings/components/IconButtonListPage';
const configs = {
  mfa: {
    id: 'mfa',
    label: 'mfa',
    icon: 'AccountBalance',
  },
  password: { id: 'password', label: 'password', icon: 'password' },
  devices: {
    id: 'devices',
    label: 'devices',
    icon: 'phone',
  },
};

const exportConfigs = {
  variant: 'list',
  id: 'security',
  options: () => [configs.mfa, configs.password, configs.devices],
  children: ['mfa', 'password', 'devices'],
  component: IconButtonListPage,
};

export default exportConfigs;
