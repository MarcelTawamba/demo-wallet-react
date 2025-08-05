import { Machine } from 'xstate';
import { screen_variants, screen_privacies } from 'config/enums';

const invoiceMachine = Machine({
  // Machine identifier
  id: 'invoices',

  // Initial state
  initial: '',

  // Local context for entire machine
  context: {
    condition: {
      [screen_privacies.VERIFIED]: true,
      [screen_privacies.BUSINESS]: true,
    },
    variant: screen_variants.BUSINESS,
    id: '',
  },

  // State definitions
  states: {
    '': {
      /* ... */
    },
    edit: {
      /* ... */
    },
    view: {
      /* ... */
    },
  },
});

// async function fetchData() {
//   setLoading(true);
//   try {
//     const resp2 = await getBusinesses();
//     const tempBusiness = get(resp2, 'data.results.0');
//     setBusiness(tempBusiness);
//     const resp = await getBusinessInvoices(tempBusiness.id);
//     if (resp.status === 'success') {
//       setItems(resp?.data?.results);
//     }
//   } catch (e) {
//     console.log('fetchData -> e', e);
//   }
//   setLoading(false);
// }

// export default function invoices() {
//   return {

//     src: 'invoices', // business ext
//     // order:['']
//     states: {
//       default: {
//         variant: 'table',
//         config: {
//           actionsRight: ['new', 'export'],
//           filters: true,
//           search: true,
//         },
//       },
//       view: {
//         variant: 'widePanels',
//         config: {
//           order: [
//             'summary',
//             'details',
//             'payments',
//             'conversions',
//             'connections',
//           ],
//           items: {
//             summary: {
//               title: 'Summary',
//               items: [
//                 { variant: 'value', value: 'email', label: 'Billed to' },
//                 { variant: 'productInvoiceTable' },
//               ],
//             },
//           },
//           header: 'InvoiceHeader',
//           actionsRight: ['link', 'preview', 'send'],
//           actionsLeft: 'back',
//         },
//       },
//       edit: {
//         variant: 'form', // 'flow' ;)
//         title: 'Create invoice',
//         items: [
//           'invoiceReference',
//           'invoiceCustomer',
//           'invoiceItems',
//           'paymentMethod',
//           'metadata',
//         ],
//         actionsRight: ['save', 'preview', 'send'],
//         actionsLeft: 'back',
//         modals: ['preview', 'receipt'],
//       },
//     },
//   };
// }
