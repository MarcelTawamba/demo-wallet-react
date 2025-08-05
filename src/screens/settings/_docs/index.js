import config from './config';
import components from './components';
import pages from './pages';
import util from './util';
const features = {
  list: {
    title: 'Account list',
    type: '',
    description: 'Lists the users accounts - Link to component',
  },
  pages: {
    title: 'Account pages and flows',
    type: '',
    description:
      'List transactions, send, receive, transfer flows, routing etc',
  },
  balance: {
    title: 'Account balance',
    type: '',
    description: 'Lists the users account balance',
  },
};

const exportConfigs = {
  title: 'Settings',
  subtitle: 'All things related to application settings',
  description: 'This section covers application settings, configurations, and preferences',
  children: {}
};

export default exportConfigs;
