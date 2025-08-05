import * as _inputs from 'config/inputs';

export const send = {
  amount: _inputs.amount,
  emailRecipient: _inputs.emailRecipient,
  mobileRecipient: _inputs.mobileRecipient,
  cryptoRecipient: _inputs.cryptoRecipient,
  note: _inputs.note,
  memo: _inputs.memo,
  currency: _inputs.currency,
};

export const receive = {
  amount: _inputs.amount,
  emailRecipient: _inputs.emailRecipient,
  mobileRecipient: _inputs.mobileRecipient,
  cryptoRecipient: _inputs.cryptoRecipient,
  note: _inputs.note,
  memo: _inputs.memo,
  currency: _inputs.currency,
};

const exportConfigs = { send, receive };

export default exportConfigs;
