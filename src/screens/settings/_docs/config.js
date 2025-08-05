import defaultValues from 'screens/settings/config';
import { types } from 'config/enums';

const exportConfigs = {
  defaultValues,
  descriptions: [
    {
      id: 'hideCryptoAccounts',
      description: 'Hide crypto accounts',
      type: types.BOOLEAN,
    },
    {
      id: 'hideBankAccounts',
      description: 'Hide bank accounts',
      type: types.BOOLEAN,
    },
    {
      id: 'hidePrimaryCurrency',
      description: 'Hide primary currency',
      type: types.BOOLEAN,
    },
    {
      id: 'hideNotifications',
      description: 'Hide notifications',
      type: types.BOOLEAN,
    },
    {
      id: 'businessGroups',
      description: 'Groups that fall under business',
      type: types.ARRAY,
    },
    {
      id: 'hideSmsMfa',
      description: 'Hide sms mfa',
      type: types.BOOLEAN,
    },
  ],
};

export default exportConfigs;
