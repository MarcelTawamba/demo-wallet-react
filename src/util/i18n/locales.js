import common from 'config/locales';
import auth from 'screens/auth/config/locales';
import settings from 'screens/settings/config/locales';
import invoices from 'screens/invoices/config/locales';
import developers from 'screens/developers/config/locales';
import products_admin from 'screens/products_admin/config/locales';
import get_started from 'screens/get_started/config/locales';
import onboarding from 'screens/onboarding/config/locales';
import profile from 'screens/profile/config/locales';
import help from 'screens/help/config/locales';
import homeScreen from 'screens/home/config/locales';
import accountScreen from 'screens/accounts/config/locales';
import posScreen from 'screens/pos/config/locales';
import productsScreen from 'screens/products/config/locales';
import rewardsScreen from 'screens/rewards/config/locales';
import paymentsScreen from 'screens/payments/config/locales';
import customersScreen from 'screens/customers/config/locales';
import payoutsScreen from 'screens/payouts/config/locales';
import reportingScreen from 'screens/reporting/config/locales';
import businessSettingsScreen from 'screens/business_settings/config/locales';
import helpCenter from 'screens/help_center/config/locales';
import team from 'screens/team/config/locales';
import checkoutScreen from 'screens/checkout/config/locales';
import ordersScreen from 'screens/orders/config/locales';

const resources = {
  en: {
    common: {
      ...(common?.en ?? {}),
      ...(auth?.en ?? {}),
      ...(settings?.en ?? {}),
      ...(invoices?.en ?? {}),
      ...(developers?.en ?? {}),
      ...(products_admin?.en ?? {}),
      ...(get_started?.en ?? {}),
      ...(onboarding?.en ?? {}),
      ...(profile?.en ?? {}),
      ...(help?.en ?? {}),
      ...(homeScreen?.en ?? {}),
      ...(accountScreen?.en ?? {}),
      ...(posScreen?.en ?? {}),
      ...(productsScreen?.en ?? {}),
      ...(rewardsScreen?.en ?? {}),
      ...(paymentsScreen?.en ?? {}),
      ...(customersScreen?.en ?? {}),
      ...(payoutsScreen?.en ?? {}),
      ...(reportingScreen?.en ?? {}),
      ...(businessSettingsScreen?.en ?? {}),
      ...(helpCenter?.en ?? {}),
      ...(team?.en ?? {}),
      ...(checkoutScreen?.en ?? {}),
      ...(ordersScreen?.en ?? {}),
    },
  },
};

const localeKeys = Object.keys(resources);
const nsKeys = ['common'];

export default resources;
export { nsKeys, localeKeys };
