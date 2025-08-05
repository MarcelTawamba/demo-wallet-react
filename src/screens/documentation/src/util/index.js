import crypto from './crypto';
import currency from './currency';
import general from './general';

const exportConfigs = {
  title: 'Util',
  subtitle: 'The different utility functions of the Rehive App',
  description: 'This section covers the purpose of each function',
  children: {
    crypto,
    currency,
    general,
  },
};

export default exportConfigs;
