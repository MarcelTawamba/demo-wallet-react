import accounts from './accounts';
// import auth from './auth'
// import home from './home'
import products from 'screens/products/_docs';
import invoices from 'screens/invoices/_docs';
// import profile from './profile';
// import rewards from './rewards'
import settings from 'screens/settings/_docs';
import customers from 'screens/customers/_docs';
import payments from 'screens/payments/_docs';
// import checkout from 'screens/checkout/_docs';

const exportConfigs = {
  title: 'Screens',
  subtitle: 'The different screens of the Rehive App',
  description:
    'This section covers the purpose of each screen and how it works',
  children: {
    // accounts,
    // auth,
    // home,
    products,
    // profile,
    // rewards,
    settings,
    invoices,
    customers,
    payments,
    // checkout,
  },
};

export default exportConfigs;
