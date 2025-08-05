import pages from '../pages';
import inputs from './inputs';
import locales from './locales';

const exportConfigs = {
  id: 'products_admin',
  title: 'Product management',
  defaultPage: 'products',
  variant: 'tabsNew',
  headerVariant: 'tabsNew',
  pages,
  isBusiness: true,
  configs: {
    inputs,
    locales,
  },
};

export default exportConfigs;
