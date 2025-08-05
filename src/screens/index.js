// import Accounts from './accounts';
// import Auth from './auth';

import { screen_variants } from 'config/enums';

const checkout = {
  privacy: 'public',
  variant: screen_variants.SIMPLE,
  // order: ['paymentMethod', 'bitcoin', 'wallet'],
  default: 'paymentMethod',
  layout: 'panel',
  states: {
    paymentMethod: {
      // captures some form data and passes it along
      layout: 'panel',
      variant: 'form',
      content: 'paymentMethodForm',
    },
    bitcoin: {
      states: ['pending', 'expired', 'underpaid', 'initiated', 'successful'],
      layout: 'panel',
      onEnter: 'show modal',
      polling: 'check tnx / request', // dependant on the state?
    },
    wallet: {
      states: ['scan', 'wallet', 'request'],
      configs: {
        scan: {
          polling: 'checks for tnx',
          toDo: ['document qr generation function'],
        },
        wallet: {
          // entire auth flow!?
          states: ['login', 'register'],
        },
        request: {
          states: ['pin'],
        },
      },
    },
  },
  onLoad: 'pull request info and navigate?!',
};

const invoices = {
  privacy: 'private',
  variant: screen_variants.MERCHANT,
  src: 'invoices', // business ext
  // order:['']
  states: {
    default: {
      layout: 'table',
      config: {
        actionsRight: ['new', 'export'],
        filters: true,
        search: true,
      },
    },
    view: {
      variant: 'widePanels',
      config: {
        order: ['summary', 'details', 'payments', 'conversions', 'connections'],
        items: {
          summary: {
            title: 'Summary',
            items: [
              { variant: 'value', value: 'email', label: 'Billed to' },
              { variant: 'productInvoiceTable' },
            ],
          },
        },
        header: 'InvoiceHeader',
        actionsRight: ['link', 'preview', 'send'],
        actionsLeft: 'back',
      },
    },
    edit: {
      variant: 'form', // 'flow' ;)
      title: 'Create invoice',
      items: [
        'invoiceReference',
        'invoiceCustomer',
        'invoiceItems',
        'paymentMethod',
        'metadata',
      ],
      actionsRight: ['save', 'preview', 'send'],
      actionsLeft: 'back',
      modals: ['preview', 'receipt'],
    },
  },
};

const payments = {
  title: 'Payments',
  variant: 'merchant',
  src: 'tnx',
  filters: {
    items: {
      customer: {
        variant: 'search',
      },
      amount: '',
      date: '',
      status: '',
      tx_type: { variant: 'fixed', value: 'credit' }, // provide overrides as needed
      account_name: { variant: 'fixed', value: 'sales' },
    },
  },
};

const sep24 = {
  privacy: 'public',
  variant: screen_variants.SIMPLE,
  layout: 'panel',
  states: {
    default: {
      layout: 'table',
    },
  },
};

const states = {
  checkout: 'checkout',
  auth: 'auth',
  home: 'home',
  accounts: 'accounts',
  payments: 'payments',
  customers: 'customers',
  products: 'products',
  invoices: 'invoices',
  rewards: 'rewards',
  developers: 'developers',
  profile: 'profile',
  settings: 'settings',
  sep24: 'sep24'
};

export default function Screens() {
  // let screenOrder = [
  //   'checkout',
  //   'auth',
  //   'home',
  //   'accounts',
  //   'home',
  //   'payments',
  //   'customers',
  //   'products',
  //   'invoices',
  //   'rewards',
  //   'developers',
  //   'profile',
  //   'settings',
  // ];
  return { checkout, invoices, sep24 };
}

// export const Screens =  { checkout, invoices };
