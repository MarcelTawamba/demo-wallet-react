import { Machine, assign } from 'xstate';

function compareInvoiceStatus(context, event, status) {
  const invoiceStatus =
    event?.payload?.invoice?.status ??
    event?.data?.status ??
    context?.invoice?.status ??
    '';
  return Boolean(invoiceStatus === status);
}
export function calculateComplete(context, event) {
  const status =
    event?.payload?.invoice?.status ??
    event?.data?.status ??
    context?.invoice?.status ??
    '';

  const invoice =
    event?.payload?.invoice ?? event?.data ?? context?.invoice ?? {};
  const quotes = invoice?.payment_processor_quotes ?? [];

  return Boolean(
    invoice?.refunded ||
      (status && status.match(/overpaid|^paid|received|success/)) ||
      (status === 'underpaid' &&
        quotes.findIndex(quote => quote.status !== 'expired') === -1),
  );
}
function getRequestQuote(context, event) {
  const invoice =
    event?.payload?.invoice ?? event?.data ?? context?.invoice ?? {};

  const quotes = invoice?.payment_processor_quotes ?? [];
  const paymentMethod =
    event?.payload?.paymentMethod ?? context?.paymentMethod ?? '';

  const wallet_method =
    event?.payload?.wallet_method ?? context?.wallet_method ?? '';

  const paymentName = !paymentMethod
    ? invoice?.primary_payment_processor?.unique_string_name
    : wallet_method === 'request'
    ? 'native_otp'
    : paymentMethod;

  const quote = quotes.find(
    item =>
      item?.payment_processor?.unique_string_name === paymentName &&
      (item?.status ?? '').match(/pending|processing|underpaid/),
  );
  return quote;
}

function isCrypto(context, event) {
  const invoice =
    event?.payload?.invoice ?? event?.data ?? context?.invoice ?? {};
  const paymentName = invoice?.primary_payment_processor?.unique_string_name;
  const paymentType = invoice?.primary_payment_processor?.type;
  return !!(paymentName ?? '').match(/bitcoin|stellar/) || paymentType === 'crypto';
}

function isProcessingCrypto(context, event) {
  const invoice =
    event?.payload?.invoice ?? event?.data ?? context?.invoice ?? {};

  const paymentName = invoice?.primary_payment_processor?.unique_string_name;

  const quotes = invoice?.payment_processor_quotes ?? [];

  // if state is processing or underpaid and quote not expired
  if (compareInvoiceStatus(context, event, 'processing')) return true;

  if (compareInvoiceStatus(context, event, 'underpaid')) {
    const quote = quotes.find(
      item =>
        item?.payment_processor?.unique_string_name === paymentName &&
        (item?.status ?? '').match(/processing|underpaid/),
    );
    if (quote) return true;
  }

  return false;
}

export const checkoutMachine = Machine(
  {
    id: 'checkout',
    initial: 'init',
    context: {
      id: '',
      invoice: null,
      quote: null,
      message: '',
      monitoring: false,
      wallet_method: '',
      initiated: false,
      state: '',
    },
    states: {
      init: {
        always: [{ target: 'loading', cond: 'hasId' }, { target: 'error' }],
      },
      loading: {
        on: {
          NEXT: [
            {
              target: 'complete',
              cond: 'isComplete',
              actions: 'setRequest',
            },
            { target: 'error', cond: 'isError', actions: 'setMessage' },
            { target: 'running', actions: 'setRequest' },
          ],
        },
      },
      running: {
        initial: 'init',
        on: {
          NEXT: {
            target: 'success',
            cond: 'isComplete',
            actions: 'setRequest',
          },
        },
        states: {
          hist: { type: 'history' },
          init: {
            always: [
              { target: 'draft', cond: 'isDraft' },
              { target: 'crypto', cond: 'isProcessingCrypto' },
              { target: 'invoice', cond: 'isInvoice' },
              { target: 'paymentMethods', cond: 'isInitiated' },
            ],
          },
          draft: {},
          invoice: { on: { NEXT: { target: 'paymentMethods' } } },
          paymentMethods: {
            on: {
              BACK: { target: 'invoice', cond: 'isInvoice', actions: 'reset' },
              NEXT: [
                {
                  target: 'crypto',
                  cond: 'isCrypto',
                  actions: ['setPaymentMethod', 'setRequest'],
                },
                {
                  target: 'wallet',
                  cond: 'isWallet',
                  actions: ['setWalletMethod', 'setRequest'],
                },
                {
                  target: 'custom',
                  cond: 'isCustom',
                  actions: ['setPaymentMethod', 'setRequest'],
                },
              ],
            },
          },
          wallet: {
            on: {
              BACK: { target: 'paymentMethods' },
            }
          },
          custom: {
            on: {
              BACK: { target: 'paymentMethods' },
            },
            initial: 'init',
            states: {
              init: {
                always: [{target: 'pending'}]
              },
              pending: {
                on: {
                  NEXT: [
                    { target: 'monitoring', actions: 'setMonitoring' },
                  ],
                },
              },
              monitoring: {
                on: {
                  BACK: { target: 'pending' },
                  NEXT: [],
                },
              },
            }
          },
          crypto: {
            on: {
              BACK: {
                target: 'paymentMethods',
                cond: 'isInitiated',
                actions: 'setPaymentMethod',
              },
              UPDATE: {
                target: '.processing',
                cond: 'isProcessing',
                actions: 'setRequest',
              },
            },
            initial: 'init',
            states: {
              init: {
                always: [
                  { target: 'processing', cond: 'isProcessing' },
                  { target: 'processing', cond: 'isUnderpaid' },
                  { target: 'monitoring', cond: 'isMonitoring' },
                  { target: 'pending' },
                ],
              },
              pending: {
                on: {
                  NEXT: [
                    {
                      target: 'processing',
                      actions: 'setRequest',
                      cond: 'isProcessing',
                    },
                    {
                      target: 'processing',
                      actions: 'setRequest',
                      cond: 'isUnderpaid',
                    },
                    { target: 'monitoring', actions: 'setMonitoring' },
                  ],
                  EXPIRED: { target: 'expired' },
                },
              },
              monitoring: {
                on: {
                  BACK: { target: 'pending' },
                  NEXT: [
                    {
                      target: 'processing',
                      cond: 'isProcessing',
                      actions: 'setRequest',
                    },
                    {
                      target: 'processing',
                      actions: 'setRequest',
                      cond: 'isUnderpaid',
                    },
                  ],
                  EXPIRED: { target: 'expired' },
                },
              },
              processing: {
                on: {
                  EXPIRED: {
                    target: 'processing',
                    actions: 'setRequest',
                  },
                },
              },
              expired: {
                on: {
                  NEW: {
                    target: 'pending',
                    cond: 'isCrypto',
                    actions: ['setRequest'],
                  },
                },
              },
            },
          },
        },
      },
      success: {
        on: { NEXT: { target: 'complete', cond: 'isComplete' } },
      },
      complete: { type: 'final' },
      error: { type: 'final' },
    },
  },
  {
    actions: {
      setRequest: assign((ctx, event) => ({
        invoice: event?.payload?.invoice,
        quote: getRequestQuote(ctx, event),
        items: event?.payload?.invoice?.metadata?.service_business?.items ?? [],
        business: event?.payload?.invoice?.metadata?.service_business?.business,
      })),
      setMessage: assign((ctx, event) => ({
        message: event.message,
      })),
      setWalletMethod: assign((ctx, event) => ({
        wallet_method: event?.payload?.wallet_method ?? '',
        paymentMethod: 'wallet',
        paymentMethods: false,
        state: '',
      })),
      setPaymentMethod: assign((ctx, event) => ({
        invoice: event?.payload?.invoice ?? ctx?.invoice,
        quote: getRequestQuote(ctx, event),
        paymentMethod: event?.payload?.paymentMethod ?? '',
      })),
      setMonitoring: assign((ctx, event) => ({
        monitoring: true,
      })),
      setInitiated: assign((ctx, event) => ({
        initiated: true,
      })),
      reset: assign((ctx, event) => ({
        state: '',
      })),
    },
    guards: {
      isError: (context, event) => {
        return event?.payload?.status === 'error';
      },
      isDraft: (context, event) => {
        return compareInvoiceStatus(context, event, 'draft');
      },
      isInitiated: (context, event) => {
        return compareInvoiceStatus(context, event, 'initiated');
      },
      isProcessing: (context, event) => {
        return compareInvoiceStatus(context, event, 'processing');
      },
      isCrypto,
      isProcessingCrypto,
      isUnderpaid: (context, event) => {
        return compareInvoiceStatus(context, event, 'underpaid');
      },
      isComplete: (context, event) => {
        return calculateComplete(context, event);
      },
      isInvoice: (context, event) => {
        return (
          compareInvoiceStatus(context, event, 'initiated') &&
          context?.items?.length > 0
        );
      },
      hasId: (context, event) => {
        return Boolean(context?.id);
      },
      isWallet: (context, event) => {
        const paymentMethod =
          event?.payload?.paymentMethod ?? context?.paymentMethod ?? '';
        return Boolean(paymentMethod === 'native');
      },
      isCustom: (context, event) => {
        const invoice =
          event?.payload?.invoice ?? context?.paymentMethod ?? '';

        return Boolean(invoice?.primary_payment_processor?.type === 'custom' || invoice?.primary_payment_processor?.type === 'bank');
      },
      isMonitoring: (context, event) => {
        return context?.monitoring;
      },
      isPaymentMethods: (context, event) => {
        return context?.state === 'paymentMethods';
      },
      hasInitiated: (context, event) => {
        return Boolean(context?.initiated);
      },
    },
  },
);

export const walletMachine = Machine(
  {
    id: 'wallet',
    initial: 'init',
    states: {
      init: {
        // always: [
        //   { target: 'scan', cond: 'isDraft' },
        //   { target: 'request', cond: 'isProcessing' },
        //   { target: 'complete', cond: 'isComplete' },
        //   { target: 'invoice', cond: 'isInvoice' },
        //   { target: 'paymentMethods', cond: 'isInitiated' },
        // ],
      },
      // scan: {},
      // request: {},
      // login: {},
      initiated: {},
      success: { type: 'final' },
    },
  },
  {},
);

export const walletLoginMachine = Machine(
  {
    id: 'walletLogin',
    initial: 'init',
    states: {
      init: {
        // always: [
        //   { target: 'scan', cond: 'isDraft' },
        //   { target: 'request', cond: 'isProcessing' },
        //   { target: 'complete', cond: 'isComplete' },
        //   { target: 'invoice', cond: 'isInvoice' },
        //   { target: 'paymentMethods', cond: 'isInitiated' },
        // ],
      },
      notAuthed: {},
      authed: {},
      // login: {},
      initiated: {},
      success: { type: 'final' },
    },
  },
  {},
);
