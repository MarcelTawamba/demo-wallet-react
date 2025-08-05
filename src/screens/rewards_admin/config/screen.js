import pages from './pages';
import inputs from './inputs';

const exportConfigs = {
  id: 'rewards_admin',
  title: 'Rewards admin',
  defaultPage: 'campaigns',
  variant: 'tabs', // TODO: add isBusiness logic here
  pages,
  configs: {
    inputs,
  },
};

export default exportConfigs;
