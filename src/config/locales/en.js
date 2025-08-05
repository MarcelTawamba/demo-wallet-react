import settings from 'screens/settings/config/locales/en';
import invoices from 'screens/invoices/config/locales/en';

import developers from 'screens/developers/config/locales/en';
import products_admin from 'screens/products_admin/config/locales/en';
import get_started from 'screens/get_started/config/locales/en';
import onboarding from 'screens/onboarding/config/locales/en';
import profile from 'screens/profile/config/locales/en';

const messages = {
  ...settings,
  ...invoices,
  ...products_admin,
  ...developers,
  ...get_started,
  ...onboarding,
  ...profile,
  created: 'Date created',
  status: 'Status',
  currency: 'Currency',
  amount: 'Amount',
  customer: 'Customer',
  due: 'Due',
  date: 'Date',
  first_name: 'First name',
  last_name: 'Last name',
  name: 'Name',
  email: 'Email',
  phone: 'Phone',
  id: 'ID',
  origin: 'Origin',
  address: 'Address',
  description: 'Description',
  error_title: 'Something went wrong',
  error_description:
    'Sorry about that, an error report has been sent to our developers.',
  set_password: 'SET PASSWORD',
  minLength: 'Minimum character length',
  required: 'Required',
};

export default messages;
