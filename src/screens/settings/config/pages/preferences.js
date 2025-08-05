import IconButtonListPage from 'screens/settings/components/IconButtonListPage';
const configs = {
  displayCurrency: {
    id: 'displayCurrency',
    label: 'displayCurrency',
    icon: 'cash',
  },
  primaryCurrency: {
    id: 'primaryCurrency',
    label: 'primaryCurrency',
    icon: 'dollar',
    set: 'FontAwesome',
  },
  notifications: {
    id: 'notifications',
    label: 'notifications',
    icon: 'notifications',
  },
  language: {
    id: 'language',
    label: 'language',
    icon: 'language',
  },
};

const exportConfigs = {
  variant: 'list',
  id: 'preferences',
  options: props => {
    const { settingsConfig, services } = props?.context;
    let options = [];
    if (services?.conversion_service) options.push(configs.displayCurrency);
    if (!settingsConfig?.hidePrimaryCurrency)
      options.push(configs.primaryCurrency);
    if (!settingsConfig?.hideNotifications) options.push(configs.notifications);
    if (!settingsConfig?.hideLanguage) options.push(configs.language);

    return options;
  },
  component: IconButtonListPage,
  children: ['displayCurrency', 'primaryCurrency', 'notifications', 'language'],
  // redux: 'displayCurrency',
  // components: {
  //   form: formConfig,
  // },
};

export default exportConfigs;
