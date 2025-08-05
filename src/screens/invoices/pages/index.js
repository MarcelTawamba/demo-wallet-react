import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Inputs from '../components/inputs';
import moment from 'moment';
import { sumBy } from 'lodash';
import {
  concatName,
  calculateInvoiceTotal,
  testRequiredFields,
  multiplyDivisibility,
  sum,
  toDivisibility,
} from 'util/general';
import InvoiceDetailHeader from '../components/InvoiceDetailHeader';
import InvoiceDetail from '../components/InvoiceDetail';
import InvoiceModal from '../components/InvoiceModal';
import ConversionsSection from '../components/ConversionsSection';

import ProductItemListFooter from '../components/ProductItemListFooter';
import {
  getPaymentRequestTransactions,
  createBusinessInvoice,
  updateBusinessInvoice,
  getBusinessInvoices,
  getBusinesses,
  getBusinessInvoice,
  createBusinessUser,
  notifyInvoice,
} from 'util/rehive';
import CustomerSection from '../components/CustomerSection';
import Big from 'big.js';

async function fetchData(props, page) {
  let { reduxContext } = props;
  let { business } = reduxContext;
  let businessId = business?.id;
  try {
    let resp = null;
    if (!businessId) {
      resp = await getBusinesses();
      business = resp?.data?.results[0] ?? {};
      businessId = business?.id;
    }
    if (businessId) {
      let { search } = window?.location ?? {};
      // if (search) search = search + '&page=' + page;
      // else if (page !== 1) search = '?page=' + page;
      return await getBusinessInvoices(businessId, search, true);
      // if (resp.status === 'success') {
      //   return resp?.data ?? {};
      // }
    }
  } catch (e) {
    // Error handling
  }
}

async function fetchItem(itemId, props) {
  let { reduxContext } = props;
  let { business } = reduxContext;
  let businessId = business?.id;
  return businessId ? await getBusinessInvoice(businessId, itemId, true) : null;
}

const defaultValues = {
  id: '',
  search: '',
  customer: '',
  request_reference: '',
  addCustomer: false,
  metadata: '',
  products: [],
  send_reminders: true,
  send_request_on: moment().format(),
  due_delay: 14,
};

function mapDefaultValues(values) {
  const {
    payer_email,
    metadata,
    request_reference,
    send_reminders,
    send_request_on,
    due_date,
  } = values;
  return {
    metadata: metadata?.service_business?.custom_metadata ?? null,
    products: metadata?.service_business?.items ?? [],
    customer: payer_email ?? 'matthew@rehive.com',
    request_reference,
    send_reminders,
    due_delay: parseInt((due_date - send_request_on) / (60 * 1000 * 24 * 60)),
    send_request_on,
  };
}

function onSubmitDraft(control, props) {
  const { getValues } = control;
  const values = getValues();
  return createData(values, control, props, 'draft');
}

async function createData(values, control, props = {}, status = 'initiated') {
  console.log('Invoice createData called:', { values, status });
  const {
    itemId,
    context = {},
    onSuccess,
    history,
    setItem,
    setSubmitting,
    showToast,
  } = props;
  
  try {

  const { business = {} } = context;
  let resp = null;
  const { setError } = control;
  let payer_email = '';
  if (typeof setSubmitting === 'function') setSubmitting(status);
  if (values === null) {
    resp = await updateBusinessInvoice(business?.id, itemId, { status });
  } else {
    const { currency = {}, id: businessId = '' } = business;
    let {
      products: items = [],
      customer,
      request_reference,
      invoiceReference,
      due_delay,
      send_request_on,
      send_reminders,
      metadata,
      addCustomer,
    } = values;
    
    // Use invoiceReference if request_reference is not available
    if (!request_reference && invoiceReference) {
      request_reference = invoiceReference;
    }
    payer_email =
      customer?.email ?? (typeof customer === 'string' ? customer : '');
    const due_date = moment(send_request_on).add(due_delay, 'days').valueOf();
    let request_amount = calculateInvoiceTotal(items, currency.divisibility);

    if (addCustomer && typeof customer === 'string') {
      const respCustomer = await createBusinessUser(businessId, {
        email: customer,
        roles: ['customer'],
      });
      if (respCustomer.status === 'success') {
        payer_email = respCustomer?.data?.email;
        showToast({ id: 'customer_add_success', variant: 'success' });
      } else {
        showToast({ id: 'customer_add_error', variant: 'error' });
        //error
      }
    }
    items = items.filter(item => item);

    // For drafts, ensure we have valid values for required fields
    if (status === 'draft') {
      // If request_reference is empty, set a default value
      if (!request_reference) {
        request_reference = 'DRAFT-' + Math.floor(Math.random() * 10000);
      }
      
      // Ensure we have a request_amount
      if (request_amount === 0) {
        // Set a minimal amount for drafts
        const minAmount = 0.01;
        // Convert to currency divisibility
        const draftAmount = multiplyDivisibility(minAmount, currency.divisibility);
        request_amount = draftAmount;
      }
    }

    let data = {
      request_reference,
      request_amount,
      status,
      send_reminders,
      due_date,
      send_request_on: moment(send_request_on).valueOf(),
      metadata: {
        service_business: { items },
      },
    };
    if (payer_email) data.payer_email = payer_email;

    if (metadata) data.metadata.service_business.custom_metadata = metadata;

    // Only remove request_amount for non-draft status
    if (request_amount === 0 && status !== 'draft') delete data.request_amount;

    if (itemId) {
      if (data.status === 'draft') {
        delete data.status;
      }
      resp = await updateBusinessInvoice(business?.id, itemId, data);
    } else {
      resp = await createBusinessInvoice(business?.id, data);
    }
  }
  if (resp?.status === 'success') {
    if (!values) {
      showToast({
        text: 'Invoice successfully resent',
        variant: 'success',
      });
    } else {
      showToast({
        text:
          status === 'initiated'
            ? 'Invoice successfully created and sent' +
              (payer_email ? ' to ' + payer_email : '')
            : 'Invoice draft saved',
        variant: 'success',
      });
    }

    setItem(resp?.data);
    onSuccess(resp?.data?.id ?? '');
    history.push('/invoices/' + resp?.data?.id + '/');
  } else {
    Object.keys(resp?.data ?? {}).forEach(setErrors);
    // setError('form', resp?.message)
    function setErrors(key) {
      const message = resp?.data?.[key];
      setError(key === 'payer_email' ? 'customer' : key, {
        type: 'manual',
        message,
      });
    }
  }
  } catch (error) {
    console.error('Invoice createData error:', error);
    if (typeof setSubmitting === 'function') setSubmitting(false);
    throw error;
  }
  if (typeof setSubmitting === 'function') setSubmitting(false);
}

function sendInvoice(props = {}) {
  const {
    inputPropsControl = {},
    isSubmitting,
    isLoading,
    itemId,
    item,
    stateId,
    context,
  } = props;
  const { business } = context;

  const { formState = {}, getValues } = inputPropsControl;

  const values = getValues();
  const isThisSubmitting = isSubmitting === 'initiated';

  const isVerified = business?.status === 'verified';

  const { isValid } = formState;

  const firstProduct =
    values?.products?.[0] ??
    item?.metadata?.service_business?.items?.filter(item => item)?.[0] ??
    null;
  const hasItems =
    firstProduct && testRequiredFields(firstProduct, ['quantity', 'price']);
  if (stateId === 'view' && !item?.status?.match(/draft|initiated/)) {
    return null;
  }

  return {
    id: 'sendInvoice',
    icon: 'export',
    loading: isThisSubmitting,
    disabled:
      ((isSubmitting || !isValid || !hasItems) && !itemId) ||
      isLoading ||
      !isVerified,
    onPress: () =>
      createData(stateId === 'view' ? null : values, inputPropsControl, props),
  };
}

function resendInvoice(props = {}) {
  const { isSubmitting, item } = props;

  if (item?.status === 'draft') {
    return sendInvoice(props);
  }

  if (item?.status === 'initiated') {
    return {
      id: 'resendInvoice',
      icon: 'export',
      loading: isSubmitting,
      disabled: isSubmitting,
      onPress: () => handleResend(props),
    };
  }

  return null;
}

async function handleResend(props = {}) {
  const { itemId, setSubmitting, showToast, setItem } = props;

  if (typeof setSubmitting === 'function') setSubmitting('resend');
  const resp = await notifyInvoice(itemId);
  if (resp?.status === 'success') {
    showToast({
      text: 'Invoice successfully resent',
      variant: 'success',
    });
  } else {
  }
  if (typeof setSubmitting === 'function') setSubmitting(false);
}

function refundInvoice(props = {}) {
  const { setModal, item, context } = props;
  const { refunds, invoice } = context;

  const quote = invoice?.payment_processor_quotes?.find(
    item => item?.total_paid > 0,
  );
  const totalRefunded = sum(
    (refunds?.results ?? []).filter(item =>
      item?.status?.match(/success|complete/),
    ),
    'amount',
  );
  const isFullyRefunded = totalRefunded >= quote?.total_paid;

  if (!isFullyRefunded && !item?.status?.match(/initiated|processing/)) {
    return {
      id: 'refundInvoice',
      icon: 'export',
      onPress: () => setModal('refund'),
    };
  }

  return null;
}

function showPreview(props = {}) {
  const { setModal, item } = props;
  const isComplete = Boolean(item?.status?.match(/paid|success/));

  if (!item) {
    return null;
  }

  if (isComplete) {
    return {
      id: 'receipt',
      onPress: () => setModal('receipt'),
    };
  }

  return {
    id: 'preview',
    onPress: () => setModal('preview'),
  };
}

const formConfig = props => {
  const { context = {} } = props;
  const { business = {} } = context;
  const { currency, status } = business;
  const isVerified = status === 'verified';

  return {
    title: 'create_invoice',
    defaultValues,
    // actions: [showPreview, sendInvoice],
    saveLabel: 'send_invoice',
    onSubmit: (values, inputPropsControl, formProps) => {
      return createData(values, inputPropsControl, formProps);
    },
    inputComponents: Inputs,
    validation: ({ values }) => {
      const total = sumBy(values?.products, x => parseFloat(x.price || 0));
      const hasValidProducts = values?.products?.length > 0 && total > 0;
      const hasValidCustomer = Boolean(values?.customer);
      const hasValidReference = Boolean(values?.request_reference || values?.invoiceReference);


      // For the "Save to drafts" button, we'll check this separately
      // This validation is for the main form submission
      return business?.id && isVerified && hasValidProducts && hasValidCustomer && hasValidReference;
    },
    skeleton: ['', '', ''],
    variant: 'tabs',
    warning: isVerified
      ? ''
      : !business?.id
      ? 'no_invoice_until_business_created'
      : 'no_invoice_until_business_verified',
    loading: false,
    submitLabel: '',
    onSubmit: createData,
    mapDefaultValues,
    actions: isVerified
      ? [
          (control, props) => {
            // Get current form values
            const values = control.getValues();
            // Check if at least one product has been added
            const hasProducts = values?.products?.length > 0;
            // Check if customer is provided
            const hasCustomer = Boolean(values?.customer);
            // Check if reference is provided
            const hasReference = Boolean(values?.request_reference);
            
            // For draft saves, we'll allow saving if ANY of the main fields have content
            const hasAnyContent = hasProducts || hasCustomer || hasReference;
            
            
            return {
              loading: props?.isSubmitting === 'draft',
              id: 'save_to_drafts',
              // Enable if we have ANY content and not submitting
              disabled: props?.isSubmitting || !hasAnyContent,
              // variant: 'link',
              onPress: () => onSubmitDraft(control, props),
            };
          },
        ]
      : [],
    // titleAction: isVerified
    //   ? {
    //       loading: formProps => formProps?.isSubmitting === 'draft',
    //       label: 'Save to drafts',
    //       onPress: onSubmitDraft,
    //     }
    //   : null,
    sections: [
      {
        id: 'reference',
        title: 'request_reference',
        fields: ['invoiceReference'],
        // actions: isVerified
        //   ? [
        //       {
        //         loading: formProps => formProps?.isSubmitting === 'draft',
        //         id: 'save_to_drafts',
        //         variant: 'link',
        //         onPress: onSubmitDraft,
        //       },
        //     ]
        //   : [],
      },
      {
        id: 'customer',
        title: 'customer',
        fields: ['customerSearch'],
        props: { businessId: business.id },
      },
      {
        id: 'items',
        title: 'items',
        fields: ['productList'],
        props: { currency },
      },
      {
        id: 'paymentMethods',
        title: 'payment_date',
        fields: ['paymentMethods'],
        // fields: ['send_request_on', 'due_delay', 'send_reminders']
      },
      {
        id: 'metadata',
        title: 'advanced_options',
        fields: ['metadata'],
      },
    ],
  };
};

const tableConfigs = {
  invoiceItemList: {
    columns: [
      {
        label: 'description',
        value: 'name',
        // variant: 'amount',
      },
      {
        label: 'qty',
        value: 'quantity',
        width: 50,
      },
      {
        label: 'unit_price',
        value: (item, props) =>
          toDivisibility(
            Big(item?.price ?? 0),
            props?.context?.business?.currency?.divisibility,
          ),
        variant: 'amount',
      },
      {
        label: 'amount',
        value: (item, props) => {
          const quantity = item?.quantity ?? 0;
          const price = item?.price ?? 0;
          return toDivisibility(
            Big(quantity).times(price),
            props?.context?.business?.currency?.divisibility ?? 2,
          );
        },
        variant: 'amount',
      },
    ],
    renderTableFooter: ProductItemListFooter,
  },
  payments: {
    fetchData: async ({ item }) => {
      if (!item || !item?.payer_email) {
        return [];
      }
      const resp = await getPaymentRequestTransactions(
        item?.id,
        '?payer_email=' + (item?.payer_email ?? ''),
      );
      if (resp.status === 'success') {
        return resp?.data?.results?.map(item => item.details) ?? [];
      }
      return [];
    },
    requires: ({ item }) => item && item?.payer_email,
    handleSelection: (item, { history }) =>
      history.push('/payments/' + (item?.id ?? '') + '/'),
    columns: [
      {
        label: 'amount',
        value: 'amount',
        variant: 'amount',
      },
      {
        label: 'id',
        value: 'id',
      },
      {
        label: 'status',
        value: 'status',
        variant: 'status',
      },
      {
        label: 'customer',
        value: 'metadata.service_payment_requests.payer_email',
      },
      {
        label: 'date',
        value: 'created',
        variant: 'date',
      },
    ],
  },
};

const detailConfig = ({ item }) => {
  const isDraft = item?.status === 'draft';

  return {
    id: 'summary',
    renderHeader: InvoiceDetailHeader,
    refetch: true,
    renderDetail: InvoiceDetail,
    title: 'invoice_with_reference',
    titleContext: { requestReference: item?.request_reference },
    actions: [showPreview, resendInvoice, refundInvoice],
    sections: [
      {
        id: 'summary',
        actions: isDraft
          ? [
              {
                link: 'edit/',
                label: 'edit_draft',
                variant: 'link',
                customIcon: 'edit',
                align: 'right',
              },
            ]
          : [],
        fields: [
          { label: 'id', value: 'id' },
          { label: 'invoice_number', value: 'request_reference' },
          { label: 'billed_to', value: 'payer_email', type: 'email' },
          { label: 'invoice_date', value: 'send_request_on', type: 'date' },
          { label: 'due_date', value: 'due_date', type: 'date' },
          { label: 'created', value: 'created', type: 'date' },
          {
            label: 'redirect_url',
            value: 'redirect_url',
            link: true,
            newTab: true,
            condition: ({ status }) => status !== 'draft',
          },
        ],
        table: {
          tableConfig: tableConfigs['invoiceItemList'],
          value: 'metadata.service_business.items',
        },
      },
      {
        id: 'customer',
        component: CustomerSection,
        fields: [
          { label: 'email', value: 'email', type: 'email' },
          { label: 'name', value: concatName },
          { label: 'phone', value: 'mobile' },
          { label: 'address', value: 'address' },
        ],
        actions: [
          {
            label: 'view_customer',
            link: item => '/customers/' + item?.id + '/',
          },
        ],
      },
      {
        id: 'payments',
        title: '',
        fields: [],
        table: {
          tableConfig: tableConfigs['payments'],
          value: 'metadata.service_business.items',
        },
      },
      // {
      //   id: 'conversions',
      //   component: ConversionsSection,
      // },
      {
        id: 'metadata',
        fields: [{ label: 'metadata', value: 'metadata', type: 'json' }],
      },
      // {
      //   id: 'conversions',
      //   title: '',
      //   fields: [],
      //   table: {
      //     variant: 'invoiceItemList',
      //     value: 'metadata.service_business.items',
      //   },
      // },
    ],
  };
};

function invoiceStatus(invoice = {}) {
  const { payment_processor_quotes: quotes = [] } = invoice;
  const quote = quotes.find(item => item?.status === 'overpaid');
  const isOverpaid = Boolean(quote);
  return invoice.refunded ? 'refunded' : invoice.status;
}
/// isOverpaid? 'overpaid & partially refunded':

const listConfig = {
  variant: 'table',

  pagination: true,
  columns: [
    { label: 'invoice_number', value: 'request_reference' },
    {
      label: 'amount',
      value: 'request_amount',
      variant: 'amount',
    },
    {
      label: 'status',
      value: invoiceStatus,
      variant: 'status',
    },
    {
      label: 'customer',
      value: item => item?.payer_email ?? item?.payer_mobile ?? '',
    },
    {
      label: 'due',
      value: 'due_date',
      variant: 'date',
    },
    {
      label: 'created',
      value: 'created',
      variant: 'date',
      width: 100,
    },
  ],
  // detailComponent: 'outputTable',
  // add: 'New',
  // export: true,
  // edit: true,
  // delete: true,
  // renderDetail: tableProps => <InvoiceDetail {...tableProps} />,
  // actions: [showPreview, sendInvoice],
  actions: [{ label: 'new_invoice', id: 'new' }],
  filterConfig: {
    type: {
      label: 'all_invoices',
      override: '',
    },
    paid: {
      override: 'status=paid',
    },
    processing: {
      override: 'status=processing',
    },
    draft: {
      override: 'status=draft',
    },
    underpaid: {
      urlValue: 'status=underpaid',
      override: 'status=underpaid&refunded=false',
    },
    overpaid: {
      urlValue: 'status=overpaid',
      override: 'status=overpaid&refunded=false',
    },
    expired: {
      override: 'status=expired',
    },
    refunded: {
      override: 'refunded=true',
    },
    payer_email: {
      label: 'customer',
      type: 'customer',
    },
    // date_created: {
    //   type: 'date',
    // },
    // amount: {
    //   // type: 'select',
    //   // options: ['customer', 'manager'],
    // },
    request_reference: {
      label: 'reference',
      // type: 'select',
      // options: ['customer', 'manager'],
    },
  },
  emptyListMessage: 'no_invoices_available',
  initialFilters: { page_size: { value: 15 } },
};

const pages = {
  '': {
    id: 'invoices',
    title: 'invoices',
    // variant: 'table',
    services: {
      fetchData,
      createData,
      fetchItem,
    },
    components: {
      detail: detailConfig,
      form: formConfig,
      list: listConfig,
    },
  },
};

export default pages;
