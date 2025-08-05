import pages from '../pages';
import InvoiceModal from '../components/InvoiceModal';

const exportConfigs = {
  id: 'invoices',
  defaultPage: '',
  pages,
  variant: 'tabsNew',
  headerVariant: 'tabsNew',
  isBusiness: true,
  modals: {
    preview: InvoiceModal,
  },
};

export default exportConfigs;
