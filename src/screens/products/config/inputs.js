import * as _inputs from 'config/inputs';

export const customSale = {
  amount: _inputs.amountSimple,
  customerEmail: _inputs.customerEmail,
  description: _inputs.description,
};
export const redeemVoucher = {
  code: _inputs.voucher_code,
};

const exportConfigs = { customSale };

export default exportConfigs;
