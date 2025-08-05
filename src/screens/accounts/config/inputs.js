const metadata = {
  label: 'metadata',
  name: 'metadata',
  type: 'json',
  multiline: true,
  rows: 8,
};

const due_delay = {
  label: 'payment_due',
  name: 'due_delay',
  type: 'number',
};

const send_request_on = {
  name: 'send_request_on',
  label: 'Send invoice on',
  // id: 'metadata',
  type: 'date',
};

const send_reminders = {
  name: 'send_reminders',
  label: 'Send reminders',
  type: 'switch',
};

const invoiceReference = {
  label: 'invoice_reference',
  name: 'request_reference',
};

export {
  metadata,
  due_delay,
  send_request_on,
  send_reminders,
  invoiceReference,
};
