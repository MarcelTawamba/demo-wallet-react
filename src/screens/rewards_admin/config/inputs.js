export const campaign_name = {
  name: 'name',
  label: 'Campaign name',
  validation: { required: true },
};
export const campaign_description = {
  name: 'description',
  label: 'Campaign description',
  multiline: true,
  rows: 4,
};
export const timeframe = {
  name: 'timeframe',
  label: 'Timeframe',
  variant: 'select',
  options: [
    { value: 'none', label: 'None' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
  ],
};

export const start_date = {
  name: 'start_date',
  label: 'Start date',
  variant: 'date',
};

export const end_date = {
  name: 'end_date',
  label: 'End date',
  variant: 'date',
};
export const reward_total = {
  name: 'total',
  label: 'Reward total',
  type: 'number',
  validation: { required: true },
};
export const campaign_type = {
  name: 'claim',
  label: 'Campaign type',
  variant: 'select',
  options: [
    { value: true, label: 'Claim' },
    { value: false, label: 'Event' },
  ],
};
export const event = {
  name: 'event',
  label: 'Event',
  variant: 'select',
  options: [
    { value: 'user.create', label: 'User create' },
    { value: 'user.update', label: 'User update' },
  ],
};
export const event_user = {
  name: 'event_user',
  label: 'Event user',
  defaultValue: '{{ user.id }}',
};
export const event_amount = {
  name: 'event_amount',
  label: 'Event amount',
  type: 'number',
};
export const expression = {
  name: 'expression',
  label: 'Expression',
  type: 'json',
};

export const default_status = {
  name: 'default_status',
  label: 'Default reward status',
  variant: 'select',
  options: ['accepted', 'pending', 'rejected'],
};
export const status = {
  name: 'status',
  label: 'Status',
  variant: 'select',
  options: ['accepted', 'pending', 'rejected'],
};
export const amount_type_event = {
  name: 'type',
  label: 'Amount type',
  variant: 'select',
  options: [
    { value: 'fixed', label: 'Fixed' },
    { value: 'percentage', label: 'Percentage' },
    { value: 'fixedpercentage', label: 'Both' },
  ],
};
// export const amount_type_claim = {
//   name: 'amount_type',
//   label: 'Amount type',
//   variant: 'select',
//   options: [{ value: 'fixed', label: 'Fixed' }],
// };
export const max_per_user = {
  name: 'max_per_user',
  label: 'Max per user',
  type: 'number',
};
export const reward_amount = {
  name: 'reward_amount',
  label: 'Reward amount',
  type: 'number',
};
export const active = {
  name: 'active',
  label: 'Active',
  variant: 'boolean',
};
export const visible = {
  name: 'visible',
  label: 'Visible',
  variant: 'boolean',
};
export const currency = {
  name: 'currency',
  label: 'Currency',
  type: 'select',
  placeholder: 'Choose a currency',
};

export const campaign_currency = {
  ...currency,
  type: 'campaign_currency',
  validation: { required: true },
};

export const rewards_account = {
  name: 'currency',
  label: 'Rewards account',
  type: 'rewards_account',
};
export const recipient_account = {
  name: 'currency',
  label: 'Recipient account',
  type: 'recipient_account',
};
export const user = {
  name: 'user',
  label: 'User',
  // type: 'rewards_account',
};
export const amount = {
  name: 'amount',
  label: 'Amount',
  type: 'number',
};
export const reward_type = {
  name: 'type',
  label: 'Type',
  type: 'select',
  options: ['request', 'manual', 'external'],
};

const exportConfigs = {
  currency,
  campaign_name,
  campaign_description,
  campaign_currency,
  timeframe,
  start_date,
  end_date,
  reward_total,
  campaign_type,
  reward_amount,
  visible,
  active,
  max_per_user,
  amount_type_event,
  // amount_type_claim,
  default_status,
  status,
  event,
  event_user,
  event_amount,
  expression,
  rewards_account,
  recipient_account,
  user,
  amount,
  reward_type,
};

export default exportConfigs;
