import pages from '../pages';
import inputs from './inputs';

const exportConfigs = {
  id: 'payouts',
  defaultPage: '',
  pages,

  isBusiness: true,
  configs: {
    inputs,
  },
};

export default exportConfigs;
