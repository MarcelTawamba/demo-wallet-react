import { get } from 'lodash';

function ellipseConcat(string1, string2) {
  if (!string2) {
    string2 = string1;
  }
  const string2length = string2.length;
  return (
    string1.substring(0, 4) +
    '...' +
    string2.substring(string2length - 4, string2length)
  );
}

const identifierFunc = (item, type = 'email', debit) => {
  if (item.first_name) {
    return `${item.first_name} ${item.last_name ?? ''}`;
  }
  switch (type) {
    case 'fiat':
      const accNumLength = item?.number?.length ?? 0;
      const displayName = item?.name || item?.bank_name || item?.metadata?.name || 'Bank Account';
      const string =
        displayName +
        (item?.number?.length
          ? '...' + item?.number?.substring(accNumLength - 4, accNumLength)
          : '');
      return string;
    case 'crypto':
      const address = item.address
        ? item.address
        : debit
        ? item.recipient_public_address
          ? item.recipient_public_address
          : item.native_context?.display_details?.destination?.value
          ? item.native_context.display_details.destination.value
          : item.native_context?.send_details?.destination // Backwards compatibility for Stellar
        : item.sender_public_address;
      return address ? ellipseConcat(address) : '';
    case 'account':
    case 'email':
    case 'mobile':
    default:
      return (
        item?.identifier ?? item?.name ?? item?.email ?? item?.mobile ?? ''
      );
  }
};

const en = {
  exchanged: 'Exchanged',
  exchange_pending: 'Pending exchange of',
  exchange_failed: 'Failed to exchange',
  for: 'for',
  bought: 'Bought',
  buy_pending: 'Pending buy of',
  buy_failed: 'Failed to buy',
  with: 'with',
  sold: 'Sold',
  sell_pending: 'Pending sell of',
  sell_failed: 'Failed to sell',
  purchase_complete: 'Made a purchase',
  purchase_pending: 'Pending purchase',
  purchase_failed: 'Failed purchase',
  purchase_app_complete: 'Made an in-app purchase',
  purchase_app_pending: 'Pending in-app purchase',
  purchase_app_failed: 'Failed in-app purchase',
  purchase_pos_complete: 'Made an in-store purchase',
  purchase_pos_pending: 'Pending in-store purchase',
  purchase_pos_failed: 'Failed in-store purchase',
  purchase_online_complete: 'Made an online sale',
  purchase_online_pending: 'Pending online sale',
  purchase_online_failed: 'Failed online sale',
  sale_complete: 'Made a sale',
  sale_pending: 'Pending sale',
  sale_failed: 'Failed sale',
  sale_app_complete: 'Made an in-app sale',
  sale_app_pending: 'Pending in-app sale',
  sale_app_failed: 'Failed in-app sale',
  sale_pos_complete: 'Made an in-store sale',
  sale_pos_pending: 'Pending in-store sale',
  sale_pos_failed: 'Failed in-store sale',
  sale_online_complete: 'Made an online sale',
  sale_online_pending: 'Pending online sale',
  sale_online_failed: 'Failed online sale',
  fund_complete: 'Funded account',
  fund_pending: 'Pending fund',
  fund_failed: 'Failed to fund',
  deposit_complete: 'Made a deposit',
  deposit_pending: 'Pending deposit',
  deposit_failed: 'Failed deposit',
  deposit_manual_complete: 'Made a deposit',
  deposit_manual_pending: 'Pending deposit',
  deposit_manual_failed: 'Failed deposit',
  deposit_ach_complete: 'Made an ACH deposit',
  deposit_ach_pending: 'Pending ACH deposit',
  deposit_ach_failed: 'Failed ACH deposit',
  reward_credit_successful: 'Received a reward',
  reward_debit_successful: 'A reward was claimed',
  reward_pending: 'Pending reward',
  reward_failed: 'Failed reward',
  withdraw_successful: 'Withdrawal to ',
  withdraw_pending: 'Pending withdrawal to ',
  withdraw_failed: 'Failed withdrawal to ',
  withdraw_manual_successful: 'Withdrawal to ',
  withdraw_manual_pending: 'Pending withdrawal to ',
  withdraw_manual_failed: 'Failed withdrawal to ',
  hotwallet_deposit_successful: 'Issued initial supply',
  hotwallet_deposit_pending: 'Pending initial supply issue',
  hotwallet_deposit_failed: 'Failed to issue initial supply',
  hotwallet_withdraw_successful: 'Withdrawal from hotwallet',
  hotwallet_withdraw_pending: 'Pending withdrawal from hotwallet',
  hotwallet_withdraw_failed: 'Failed withdrawal from hotwallet',
  receive_successful: 'Received from',
  receive_pending: 'Pending payment from',
  receive_failed: 'Failed receiving from',
  send_successful: 'Sent to',
  send_pending: 'Pending payment to',
  send_failed: 'Failed sending to',
  fee_credit_successful: 'Fee payment',
  fee_credit_pending: 'Pending fee payment',
  fee_credit_failed: 'Failed fee payment',
  fee_debit_successful: 'Fee charged',
  fee_debit_pending: 'Pending fee',
  fee_debit_failed: 'Fee failed',
  fee_received_successful: 'Fee payment',
  fee_received_pending: 'Pending fee payment',
  fee_received_failed: 'Failed fee payment',
  fee_charged_successful: 'Fee charged',
  fee_charged_pending: 'Pending fee',
  fee_charged_failed: 'Fee failed',
  transfer_debit_successful: 'Transfer to',
  transfer_debit_pending: 'Pending transfer to',
  transfer_debit_failed: 'Failed transfer to',
  transfer_credit_successful: 'Transfer from',
  transfer_credit_pending: 'Pending transfer from',
  transfer_credit_failed: 'Failed transfer from',
  tip_credit_successful: 'Received tip',
  tip_credit_pending: 'Pending tip receieve',
  tip_credit_failed: 'Failed receiving tip',
  tip_debit_successful: 'Paid tip',
  tip_debit_pending: 'Pending tip payment',
  tip_debit_failed: 'Failed tip payment',
  deposit_voucher_successful: 'Added funds using a voucher',
  deposit_voucher_pending: 'Pending funding by voucher',
  deposit_voucher_failed: 'Failed adding funds using a voucher',
  top_up_credit_successful: 'Top up from',
  top_up_credit_pending: 'Pending top up from',
  top_up_credit_failed: 'Failed top up from',
  top_up_debit_successful: 'Top up to',
  top_up_debit_pending: 'Pending top up to',
  top_up_debit_failed: 'Failed top up to',
  donate_credit_successful: 'Donation from',
  donate_credit_pending: 'Pending donation from',
  donate_credit_failed: 'Failed donation from',
  donate_debit_successful: 'Donation to',
  donate_debit_pending: 'Pending donation to',
  donate_debit_failed: 'Failed donation to',
  request_credit_successful: 'Received from request to',
  request_credit_pending: 'Request to',
  request_credit_failed: 'Cancelled request to',
  request_debit_successful: 'Paid request from',
  request_debit_pending: 'Request from',
  request_debit_failed: 'Declined request from',
  deposit_teller_successful: 'Loaded money at teller',
  deposit_teller_pending: 'Pending loading money at teller',
  deposit_teller_failed: 'Failed loading money at teller',
  withdraw_teller_successful: 'Loaded balance for',
  withdraw_teller_pending: 'Pending loading balance for',
  withdraw_teller_failed: 'Failed loading balance for',
  send_refund_successful: 'Sent refund',
  send_refund_pending: 'Pending refund send',
  send_refund_failed: 'Failed refund send',
  receive_refund_successful: 'Sent refund',
  receive_refund_pending: 'Pending refund receive',
  receive_refund_failed: 'Failed refund receive',
  invoice_credit_successful: 'Received payment from invoice to',
  invoice_credit_pending: 'Pending invoice to',
  invoice_credit_failed: 'Cancelled invoice to',
  invoice_debit_successful: 'Paid invoice from',
  invoice_debit_pending: 'Pending invoice from',
  invoice_debit_failed: 'Declined invoice from',
  receive_distribution_successful: 'Received distribution',
  receive_distribution_pending: 'Pending distribution receive',
  receive_distribution_failed: 'Failed distribution receive',
  send_otp_successful: 'OTP payment',
  send_otp_pending: 'Pending OTP payment',
  send_otp_failed: 'Failed OTP payment',
};

function exchangeIdentifier(item) {
  const key = get(item, ['service_conversion', 'conversion', 'key']);
  return key
    ? ' ' + key.split(':')[0] + ' ' + en.for + ' ' + key.split(':')[1]
    : '';
}

const SubtypeCopy = {
  buy: {
    both: {
      credit: {
        Complete: en.exchanged,
        Pending: en.exchange_pending,
        Failed: en.exchange_failed,
        identifier: item => exchangeIdentifier(item),
      },
    },
    icon: 'exchange',
  },
  buy_quick: {
    both: {
      credit: {
        Complete: en.bought,
        Pending: en.buy_pending,
        Failed: en.buy_failed,
        identifier: item => exchangeIdentifier(item),
      },
    },
    icon: 'exchange',
  },
  sell: {
    both: {
      debit: {
        Complete: en.exchanged,
        Pending: en.exchange_pending,
        Failed: en.exchange_failed,
        identifier: item => exchangeIdentifier(item),
      },
    },
    icon: 'exchange',
  },
  sell_quick: {
    both: {
      debit: {
        Complete: en.sold,
        Pending: en.sell_pending,
        Failed: en.sell_failed,
        identifier: item => exchangeIdentifier(item),
      },
    },
    icon: 'exchange',
  },
  purchase: {
    both: {
      debit: {
        Complete: en.purchase_complete,
        Pending: en.purchase_pending,
        Failed: en.purchase_failed,
      },
    },
    icon: 'product',
  },
  purchase_app: {
    both: {
      debit: {
        Complete: en.purchase_app_complete,
        Pending: en.purchase_app_pending,
        Failed: en.purchase_app_failed,
      },
    },
    icon: 'product',
  },
  purchase_pos: {
    both: {
      debit: {
        Complete: en.purchase_pos_complete,
        Pending: en.purchase_pos_pending,
        Failed: en.purchase_pos_failed,
        identifier: item => ' from ' + identifierFunc(item),
      },
    },
    icon: 'product',
  },
  sale: {
    both: {
      credit: {
        Complete: en.sale_complete,
        Pending: en.sale_pending,
        Failed: en.sale_failed,
      },
    },
    icon: 'product',
  },
  sale_app: {
    both: {
      credit: {
        Complete: en.sale_app_complete,
        Pending: en.sale_app_pending,
        Failed: en.sale_app_failed,
        identifier: item => ' to ' + identifierFunc(item),
      },
    },
    icon: 'product',
  },
  sale_pos: {
    both: {
      credit: {
        Complete: en.sale_pos_complete,
        Pending: en.sale_pos_pending,
        Failed: en.sale_pos_failed,
        identifier: item => ' to ' + identifierFunc(item),
      },
    },
    icon: 'product',
  },
  sale_online: {
    both: {
      credit: {
        Complete: en.sale_online_complete,
        Pending: en.sale_online_pending,
        Failed: en.sale_online_failed,
        identifier: item => ' to ' + identifierFunc(item),
      },
    },
    icon: 'product',
  },
  fund: {
    both: {
      credit: {
        Complete: en.fund_complete,
        Pending: en.fund_pending,
        Failed: en.fund_failed,
      },
    },
    icon: 'fund',
  },
  deposit_stripe: {
    both: {
      credit: {
        Complete: en.fund_complete,
        Pending: en.fund_pending,
        Failed: en.fund_failed,
      },
    },
    icon: 'fund',
  },
  deposit: {
    both: {
      credit: {
        Complete: en.deposit_complete,
        Pending: en.deposit_pending,
        Failed: en.deposit_failed,
      },
    },
  },
  deposit_ach: {
    both: {
      credit: {
        Complete: en.deposit_ach_complete,
        Pending: en.deposit_ach_pending,
        Failed: en.deposit_ach_failed,
      },
    },
  },
  deposit_fiat: {
    both: {
      credit: {
        Complete: en.deposit_complete,
        Pending: en.deposit_pending,
        Failed: en.deposit_failed,
      },
    },
  },
  send_otp: {
    both: {
      debit: {
        Complete: en.send_otp_successful,
        Pending: en.send_otp_pending,
        Failed: en.send_otp_failed,
        identifier: item => '',
      },
    },
  },
  deposit_manual: {
    both: {
      credit: {
        Complete: en.deposit_complete,
        Pending: en.deposit_pending,
        Failed: en.deposit_failed,
      },
    },
  },
  deposit_crypto: {
    both: {
      credit: {
        Complete: en.deposit_complete,
        Pending: en.deposit_pending,
        Failed: en.deposit_failed,
        // identifier: item => ' ' + identifierFunc(item, 'crypto', false),
      },
    },
  },
  reward: {
    both: {
      credit: {
        Complete: en.reward_credit_successful,
        Pending: en.reward_pending,
        Failed: en.reward_failed,
      },
      debit: {
        Complete: en.reward_debit_successful,
        Pending: en.reward_pending,
        Failed: en.reward_failed,
      },
    },
    icon: 'reward',
  },
  receive_reward: {
    both: {
      credit: {
        Complete: en.reward_credit_successful,
        Pending: en.reward_pending,
        Failed: en.reward_failed,
      },
    },
    icon: 'reward',
  },
  send_reward: {
    both: {
      debit: {
        Complete: en.reward_debit_successful,
        Pending: en.reward_pending,
        Failed: en.reward_failed,
      },
    },
    icon: 'reward',
  },
  withdraw: {
    both: {
      debit: {
        Complete: en.withdraw_successful,
        Pending: en.withdraw_pending,
        Failed: en.withdraw_failed,
        identifier: item => ' ' + identifierFunc(item, 'fiat', false),
      },
    },
  },
  withdraw_manual: {
    both: {
      debit: {
        Complete: en.withdraw_successful,
        Pending: en.withdraw_pending,
        Failed: en.withdraw_failed,
        identifier: item => ' ' + identifierFunc(item, 'fiat', false),
      },
    },
  },
  withdraw_crypto: {
    both: {
      debit: {
        Complete: en.withdraw_successful,
        Pending: en.withdraw_pending,
        Failed: en.withdraw_failed,
        identifier: item => ' ' + identifierFunc(item, 'crypto', false),
      },
    },
  },
  hotwallet_deposit: {
    both: {
      credit: {
        Complete: en.hotwallet_deposit_successful,
        Pending: en.hotwallet_deposit_pending,
        Failed: en.hotwallet_deposit_failed,
      },
    },
  },
  hotwallet_withdraw: {
    both: {
      debit: {
        Complete: en.hotwallet_withdraw_successful,
        Pending: en.hotwallet_withdraw_pending,
        Failed: en.hotwallet_withdraw_failed,
      },
    },
  },
  receive: {
    both: {
      credit: {
        Complete: en.receive_successful,
        Pending: en.receive_pending,
        Failed: en.receive_failed,
        identifier: item => ' ' + identifierFunc(item, 'email'),
      },
    },
  },
  receive_crypto: {
    both: {
      credit: {
        Complete: en.receive_successful,
        Pending: en.receive_pending,
        Failed: en.receive_failed,
        identifier: item => ' ' + identifierFunc(item, 'crypto', true),
      },
    },
  },
  receive_email: {
    both: {
      credit: {
        Complete: en.receive_successful,
        Pending: en.receive_pending,
        Failed: en.receive_failed,
        identifier: item => ' ' + identifierFunc(item, 'email'),
      },
    },
  },
  receive_payment: {
    both: {
      credit: {
        Complete: en.receive_successful,
        Pending: en.receive_pending,
        Failed: en.receive_failed,
        identifier: item => ' ' + identifierFunc(item, 'email'),
      },
    },
  },
  receive_mobile: {
    both: {
      credit: {
        Complete: en.receive_successful,
        Pending: en.receive_pending,
        Failed: en.receive_failed,
        identifier: item => ' ' + identifierFunc(item, 'mobile'),
      },
    },
  },
  receive_mass: {
    both: {
      credit: {
        Complete: en.receive_successful,
        Pending: en.receive_pending,
        Failed: en.receive_failed,
        identifier: item => ' ' + identifierFunc(item),
      },
    },
  },
  send: {
    both: {
      debit: {
        Complete: en.send_successful,
        Pending: en.send_pending,
        Failed: en.send_failed,
        identifier: item => ' ' + identifierFunc(item, 'email'),
      },
    },
  },
  deposit_teller: {
    both: {
      credit: {
        Complete: en.deposit_teller_successful,
        Pending: en.deposit_teller_pending,
        Failed: en.deposit_teller_failed,
        // identifier: item => ' ' + identifierFunc(item, 'email'),
      },
    },
  },
  withdraw_teller: {
    both: {
      debit: {
        Complete: en.withdraw_teller_successful,
        Pending: en.withdraw_teller_pending,
        Failed: en.withdraw_teller_failed,
        identifier: item => ' ' + identifierFunc(item, 'email'),
      },
    },
  },
  top_up: {
    both: {
      debit: {
        Complete: en.top_up_debit_successful,
        Pending: en.top_up_debit_pending,
        Failed: en.top_up_debit_failed,
        identifier: item => ' ' + identifierFunc(item, 'email'),
      },
      credit: {
        Complete: en.top_up_credit_successful,
        Pending: en.top_up_credit_pending,
        Failed: en.top_up_credit_failed,
        identifier: item => ' ' + identifierFunc(item, 'email'),
      },
    },
  },
  donate: {
    both: {
      debit: {
        Complete: en.donate_debit_successful,
        Pending: en.donate_debit_pending,
        Failed: en.donate_debit_failed,
        identifier: item => ' ' + identifierFunc(item, 'email'),
      },
      credit: {
        Complete: en.donate_credit_successful,
        Pending: en.donate_credit_pending,
        Failed: en.donate_credit_failed,
        identifier: item => ' ' + identifierFunc(item, 'email'),
      },
    },
  },
  // buy_credit: {
  //   both: {
  //     credit: {
  //       Complete: en.buy_credit_successful,
  //       Pending: en.buy_credit_pending,
  //       Failed: en.buy_credit_failed,
  //       identifier: item => ' ' + identifierFunc(item, 'email'),
  //     },
  //   },
  // },
  send_crypto: {
    both: {
      debit: {
        Complete: en.send_successful,
        Pending: en.send_pending,
        Failed: en.send_failed,
        identifier: item => ' ' + identifierFunc(item, 'crypto', true),
      },
    },
  },
  send_email: {
    both: {
      debit: {
        Complete: en.send_successful,
        Pending: en.send_pending,
        Failed: en.send_failed,
        identifier: item => ' ' + identifierFunc(item, 'email'),
      },
    },
  },
  send_account: {
    both: {
      debit: {
        Complete: en.send_successful,
        Pending: en.send_pending,
        Failed: en.send_failed,
        identifier: item => ' ' + identifierFunc(item, 'account'),
      },
    },
  },
  send_refund: {
    both: {
      debit: {
        Complete: en.send_refund_successful,
        Pending: en.send_refund_pending,
        Failed: en.send_refund_failed,
      },
    },
  },
  receive_refund: {
    both: {
      debit: {
        Complete: en.receive_refund_successful,
        Pending: en.receive_refund_pending,
        Failed: en.receive_refund_failed,
      },
    },
  },
  send_mobile: {
    both: {
      debit: {
        Complete: en.send_successful,
        Pending: en.send_pending,
        Failed: en.send_failed,
        identifier: item => ' ' + identifierFunc(item, 'mobile'),
      },
    },
  },
  send_mass: {
    both: {
      debit: {
        Complete: en.send_successful,
        Pending: en.send_pending,
        Failed: en.send_failed,
        identifier: item => ' ' + identifierFunc(item),
      },
    },
  },
  fee: {
    both: {
      debit: {
        Complete: en.fee_debit_successful,
        Pending: en.fee_debit_pending,
        Failed: en.fee_debit_failed,
      },
      credit: {
        Complete: en.fee_credit_successful,
        Pending: en.fee_credit_pending,
        Failed: en.fee_credit_failed,
      },
    },
  },
  fee_received: {
    both: {
      credit: {
        Complete: en.fee_credit_successful,
        Pending: en.fee_credit_pending,
        Failed: en.fee_credit_failed,
      },
    },
  },
  fee_charged: {
    both: {
      debit: {
        Complete: en.fee_debit_successful,
        Pending: en.fee_debit_pending,
        Failed: en.fee_debit_failed,
      },
    },
  },
  transfer: {
    both: {
      debit: {
        Complete: en.transfer_debit_successful,
        Pending: en.transfer_debit_pending,
        Failed: en.transfer_debit_failed,
        identifier: item =>
          ' ' + get(item, ['rehive_context', 'credit_account']),
      },
      credit: {
        Complete: en.transfer_credit_successful,
        Pending: en.transfer_credit_pending,
        Failed: en.transfer_credit_failed,
        identifier: item =>
          ' ' + get(item, ['rehive_context', 'debit_account']),
      },
    },
  },
  receive_transfer: {
    both: {
      credit: {
        Complete: en.transfer_credit_successful,
        Pending: en.transfer_credit_pending,
        Failed: en.transfer_credit_failed,
        identifier: item =>
          ' ' + get(item, ['rehive_context', 'debit_account']),
      },
    },
  },
  receive_distribution: {
    both: {
      credit: {
        Complete: en.receive_distribution_successful,
        Pending: en.receive_distribution_pending,
        Failed: en.receive_distribution_failed,
        // identifier: item => ' ' + identifierFunc(item, 'distribution'),
      },
    },
  },
  send_transfer: {
    both: {
      debit: {
        Complete: en.transfer_debit_successful,
        Pending: en.transfer_debit_pending,
        Failed: en.transfer_debit_failed,
        identifier: item => {
          return ' ' + get(item, ['rehive_context', 'credit_account']);
        },
      },
    },
  },
  tip: {
    both: {
      debit: {
        Complete: en.tip_debit_successful,
        Pending: en.tip_debit_pending,
        Failed: en.tip_debit_failed,
        identifier: item => ' to ' + identifierFunc(item),
      },
      credit: {
        Complete: en.tip_credit_successful,
        Pending: en.tip_credit_pending,
        Failed: en.tip_credit_failed,
        identifier: item => ' from ' + identifierFunc(item),
      },
    },
  },
  request: {
    both: {
      credit: {
        Complete: en.request_credit_successful,
        Pending: en.request_credit_pending,
        Failed: en.request_credit_failed,
        identifier: item => ' ' + identifierFunc(item, 'email'),
      },
      debit: {
        Complete: en.request_debit_successful,
        Pending: en.request_debit_pending,
        Failed: en.request_debit_failed,
        identifier: item => ' ' + identifierFunc(item, 'email'),
      },
    },
  },
  invoice: {
    both: {
      credit: {
        Complete: en.invoice_credit_successful,
        Pending: en.invoice_credit_pending,
        Failed: en.invoice_credit_failed,
        identifier: item => ' ' + identifierFunc(item, 'email'),
      },
      debit: {
        Complete: en.invoice_debit_successful,
        Pending: en.invoice_debit_pending,
        Failed: en.invoice_debit_failed,
        identifier: item => ' ' + identifierFunc(item, 'email'),
      },
    },
  },
  default: {
    both: {
      credit: {
        Complete: en.receive_successful,
        Pending: en.receive_pending,
        Failed: en.receive_failed,
        label: 'Sender',
        identifier: item => identifierFunc(item),
      },
      debit: {
        Complete: en.send_successful,
        Pending: en.send_pending,
        Failed: en.send_failed,
        label: 'Recipient',
        identifier: item => identifierFunc(item),
      },
    },
  },
};

/**
 * Generate dynamic SubtypeCopy configuration for custom withdraw subtypes
 * @param {string} subtype - The custom withdraw subtype (e.g., 'withdraw_ach')
 * @param {object} config - Optional configuration for custom labels
 * @returns {object} SubtypeCopy configuration object
 */
export function generateWithdrawSubtypeConfig(subtype, config = {}) {
  // Default to withdraw_manual behavior if no custom config provided
  const defaultLabels = {
    complete: config.completeLabel || 'Withdrawal to ',
    pending: config.pendingLabel || 'Pending withdrawal to ',
    failed: config.failedLabel || 'Failed withdrawal to ',
  };

  return {
    both: {
      debit: {
        Complete: defaultLabels.complete,
        Pending: defaultLabels.pending,
        Failed: defaultLabels.failed,
        identifier: item => ' ' + identifierFunc(item, 'fiat', false),
      },
    },
  };
}

/**
 * Get SubtypeCopy configuration with dynamic fallback for custom withdraw subtypes
 * @param {string} subtype - The transaction subtype
 * @param {object} appConfig - App configuration containing custom subtype definitions
 * @returns {object} SubtypeCopy configuration object
 */
export function getSubtypeCopyConfig(subtype, appConfig = {}) {
  // First try to get from static configuration
  if (SubtypeCopy[subtype]) {
    return SubtypeCopy[subtype];
  }

  // Check if this is a custom withdraw subtype
  if (subtype && subtype.startsWith('withdraw_') && subtype !== 'withdraw_crypto') {
    // Try to get custom configuration from app config
    const withdrawConfig = appConfig?.actions?.withdraw?.config;
    const customSubtypes = withdrawConfig?.subtypes || [];
    
    const customConfig = customSubtypes.find(s => s.id === subtype);
    const labels = customConfig ? {
      completeLabel: customConfig.completeLabel,
      pendingLabel: customConfig.pendingLabel,
      failedLabel: customConfig.failedLabel,
    } : {};

    return generateWithdrawSubtypeConfig(subtype, labels);
  }

  // Fallback to default configuration
  return SubtypeCopy.default;
}

export default SubtypeCopy;
