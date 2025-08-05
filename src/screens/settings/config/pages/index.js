import NotificationSettings from '../../components/NotificationSettings';

import externalAccounts from './externalAccounts';
import bank from './bank';
import bitcoin from './bitcoin';
import stellar from './stellar';
import ethereum from './ethereum';

import preferences from './preferences';
import mfa from './mfa';
import password from './password';
import devices from './devices';

import security from './security';
import displayCurrency from './displayCurrency';
import primaryCurrency from './primaryCurrency';
import LanguageSettings from '../../components/LanguageSettings';

const pages = {
  externalAccounts,
  bank,
  bitcoin,
  stellar,
  ethereum,

  preferences,
  notifications: {
    title: 'notifications',
    component: NotificationSettings,
    parent: 'preferences',
  },
  displayCurrency,
  primaryCurrency,

  security,
  mfa,
  password,
  devices,
  language: {
    title: 'language',
    component: LanguageSettings,
    parent: 'preferences',
  },
};

export default pages;
