import config from './config';
import components from './components';
import screens from './screens';
import util from './util';

const exportConfigs = {
  title: 'Rehive App Docs',
  subtitle: 'Documentation for the Rehive Apps',
  description:
    'The purpose of this documentation is to help you set up your Rehive application and customising the components',
  children: {
    components,
    screens,
    config,
    util,
  },
};

export default exportConfigs;
