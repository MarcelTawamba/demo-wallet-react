import config from './config';
import components from './components';
import { pages } from '../config/screen';

const features = {
  list: {
    title: 'Account list',
    type: '',
    description: 'Lists invoices',
  },
  createInvoice: {
    title: 'Account pages and flows',
    type: '',
    description:
      'List transactions, send, receive, transfer flows, routing etc',
  },
};

const exportConfigs = {
  title: 'Invoices',
  subtitle: 'All things related to invoice generation',
  description: `This screen is used to list invoices, create new invoices and other invoice management`,
  children: { pages, components, config, features },
};

export default exportConfigs;
