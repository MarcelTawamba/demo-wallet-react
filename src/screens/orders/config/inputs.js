export const campaign_name = {
  name: 'campaign_name',
  label: 'Campaign name',
  validation: { required: true },
};
export const campaign_description = {
  name: 'campaign_description',
  label: 'Campaign description',
  multiline: true,
};
export const timeframe = {
  name: 'timeframe',
  label: 'Timeframe',
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
  name: 'reward_total',
  label: 'Timeframe',
  type: 'number',
};
export const campaign_type = {
  name: 'campaign_type',
  label: 'Campaign type',
  variant: 'select',
  options: [
    { value: 'claim', label: 'Claim' },
    { value: 'event', label: 'Event' },
  ],
};
export const default_status = {
  name: 'default_status',
  label: 'Default status',
  variant: 'select',
  options: ['accepted', 'pending', 'rejected'],
};
export const amount_type = {
  name: 'amount_type',
  label: 'Amount type',
  // variant: 'reward_amount_type',
};
export const max_per_user = {
  name: 'reward_total',
  label: 'Max per user',
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
export const virtual_format = {
  name: 'virtual_format',
  label: 'Virtual format',
  variant: 'select',
  options: ['raw', { value: 'qr', label: 'QR' }, 'barcode'],
};
export const virtual_redemption = {
  name: 'virtual_redemption',
  label: 'Virtual redemption',
  variant: 'select',
  options: [{ value: '', label: 'User and admin' }, 'admin'],
};
export const virtual_type = {
  name: 'virtual_type',
  label: 'Virtual type',
  variant: 'select',
  options: ['internal', 'external'],
};

const exportConfigs = {
  campaign_name,
  campaign_description,
  timeframe,
  start_date,
  end_date,
  reward_total,
  campaign_type,
  visible,
  active,
  max_per_user,
  amount_type,
  default_status,
  virtual_type,
  virtual_redemption,
  virtual_format,
};

export default exportConfigs;
