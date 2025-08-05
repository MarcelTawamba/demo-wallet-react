const metadata = {
  label: 'Metadata',
  name: 'metadata',
  type: 'json',
  multiline: true,
  rows: 8,
};

const due_delay = {
  label: 'Payment due',
  name: 'due_delay',
  type: 'number',
};

const send_request_on = {
  name: 'send_request_on',
  label: 'send_invoice_on',
  // id: 'metadata',
  type: 'date',
};

const send_reminders = {
  name: 'send_reminders',
  label: 'send_reminders',
  type: 'switch',
};

const invoiceReference = {
  label: 'invoice_reference',
  name: 'request_reference',
  validation: { required: true },
};

export {
  metadata,
  due_delay,
  send_request_on,
  send_reminders,
  invoiceReference,
};
