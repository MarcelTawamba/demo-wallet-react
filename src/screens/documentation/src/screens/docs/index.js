import config from 'screens/products/_docs/_docs';
import components from './components';
import pages from './pages/pages';
import util from 'screens/products/_docs/docs';
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
  title: 'Products',
  subtitle: 'All things related to products',
  // description: `This screen has the primary function of listing the user's account and currency balances. It also handles all flows of funds such as sending, receiving, transferring, exchanging, etc`,
  children: { components, config, util, pages, features },
};

export default exportConfigs;
