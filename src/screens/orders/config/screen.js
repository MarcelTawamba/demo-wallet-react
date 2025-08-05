import pages from './pages';
// import inputs from './inputs';
import locales from './locales';

const exportConfigs = companyCurrencies => {
  return {
    id: 'orders',
    title: 'Orders',
    defaultPage: 'allOrders',
    variant: 'tabsNew',
    headerVariant: 'tabsNew',
    pages: pages(companyCurrencies),
    configs: {
      // inputs,
      locales,
    },
  };
};

export default exportConfigs;
