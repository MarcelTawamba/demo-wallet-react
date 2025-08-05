import Big from 'big.js';

import { formatAmountString } from './general';

const creditType = [
  'issue',
  'fund',
  'hotwallet_deposit',
  'warmstorage_deposit',
  'coldstorage_deposit',
  'fee_received',
  'deposit_manual',
  'deposit_bank',
  'deposit_crypto',
  'deposit_ach_push',
  'deposit_teller',
  'deposit_transfer',
  'receive_email',
  'receive_mobile',
  'receive_tip',
  'sale_pos',
  'sale_online',
  'receive_transfer',
];
const debitType = [
  'burn',
  'defund',
  'hotwallet_withdraw',
  'warmstorage_withdraw',
  'coldstorage_withdraw',
  'fee_charged',
  'fee_hotwallet',
  'withdraw_transfer',
  'withdraw_crypto',
  'withdraw_manual',
  'withdraw_ach',
  'withdraw_teller',
  'send_email',
  'send_mobile',
  'send_crypto',
  'send_tip',
  'purchase_pos',
  'purchase_online',
  'send_transfer',
];

export const getFees = (
  tierFees = [],
  subtype,
  currency,
  accountFees = [],
  groupFees = [],
) => {
  // Return empty array if currency is undefined
  if (!currency) {
    return [];
  }
  
  // Fee rules -> https://github.com/rehive/wallet-react/issues/785
  // Need to remove all fees from the above combined list that don't apply to the current transaction:
  // Exclude all fees with incorrect currency (applies to group and tier fees).
  // Exclude all fees with incorrect tx_type.
  // Exclude all fees with incorrect account definitions unless the account definition is null.
  // Exclude all fees with incorrect subtypes unless the subtype is null.
  // Finally, need to remove fees with duplicate names in the order below:
  // Exclude any group or tier fees that have the same name as an account fee.
  // Exclude any group fees that have the same name as a tier fee.
  // Note: this results in a fee hierarchy of account fee -> tier fees -> group fees.

  const code = currency?.currency?.code;
  const accountName = currency?.account_name;
  // const tierFees = get(tier, ['items', 0, 'fees'], []);
  const subtypeTxType = creditType.includes(subtype)
    ? 'credit'
    : debitType.includes(subtype)
    ? 'debit'
    : null;
  const filteredAccountFees = accountFees.filter(fee => {
    let isApplicable = true;
    if (fee.tx_type === subtypeTxType) {
      if (fee.subtype && fee.subtype !== subtype) {
        isApplicable = false;
      }
    } else {
      isApplicable = false;
    }
    return isApplicable;
  });
  const filteredTierFees = tierFees.filter(fee => {
    let isApplicable = true;
    if (fee.currency === code && fee.tx_type === subtypeTxType) {
      if (fee.account_definition && fee.account_definition !== accountName) {
        isApplicable = false;
      }
      if (fee.subtype && fee.subtype !== subtype) {
        isApplicable = false;
      }
    } else {
      isApplicable = false;
    }
    if (
      isApplicable &&
      filteredAccountFees.some(aFee => aFee.name === fee.name)
    ) {
      isApplicable = false;
    }
    return isApplicable;
  });
  const filteredGroupFees = groupFees.filter(fee => {
    let isApplicable = true;
    if (fee.currency === code && fee.tx_type === subtypeTxType) {
      if (fee.account_definition && fee.account_definition !== accountName) {
        isApplicable = false;
      }
      if (fee.subtype && fee.subtype !== subtype) {
        isApplicable = false;
      }
    } else {
      isApplicable = false;
    }
    if (
      isApplicable &&
      (filteredAccountFees.some(aFee => aFee.name === fee.name) ||
        filteredTierFees.some(tFee => tFee.name === fee.name))
    ) {
      isApplicable = false;
    }
    return isApplicable;
  });
  const combinedFees = [
    ...filteredAccountFees,
    ...filteredTierFees,
    ...filteredGroupFees,
  ];

  return combinedFees;
};

export const getLimits = (tierLimits = [], subtype, currency) => {
  const code = currency?.currency?.code;
  const accountName = currency?.account_name;
  const limits = tierLimits;
  const subtypeTxType = creditType.includes(subtype)
    ? 'credit'
    : debitType.includes(subtype)
    ? 'debit'
    : null;

  const filterdLimits = limits.filter(limit => {
    let isApplicable = true;
    if (limit.currency === code && limit.tx_type === subtypeTxType) {
      if (
        limit.account_definition &&
        limit.account_definition !== accountName
      ) {
        isApplicable = false;
      }

      if (limit.subtype && limit.subtype !== subtype) {
        isApplicable = false;
      }
    } else {
      isApplicable = false;
    }

    return isApplicable;
  });

  return filterdLimits;
};

export const calculateFee = (amount, fee, divisibility) => {
  return (
    fee.value + (parseFloat(amount) * 10 ** divisibility * fee.percentage) / 100
  );
};

export const calculateMultipleFees = (
  amount,
  valueOnly,
  fees,
  divisibility,
  currency,
) => {
  let totalFee = 0;
  for (let index = 0; index < fees.length; index++) {
    const fee = fees[index];
    const feeAmount = calculateFee(
      valueOnly && fee.value && !fee.percentage ? 1 : amount || 0,
      fee,
      divisibility,
    );
    totalFee += feeAmount;
    fee.feeAmount = feeAmount;
    fee.feeString = formatAmountString(feeAmount, currency?.currency, true);
  }
  return totalFee;
};

export function useFee(
  amount,
  tierFees,
  currency,
  accountFees,
  groupFees,
  subtype,
  noDiv,
  valueOnly,
) {
  let feeAmount = new Big(0.0);
  const divisibility = currency?.currency?.divisibility;
  let totalAmount = new Big(amount || 0).times(10 ** divisibility);
  let feeString = '';
  let totalString = '';

  const fees = getFees(tierFees, subtype, currency, accountFees, groupFees);

  if (fees.length > 0) {
    feeAmount =
      calculateMultipleFees(amount, valueOnly, fees, divisibility, currency) *
      (subtype.match(/buy/) ? -1 : 1);

    feeString = formatAmountString(feeAmount, currency?.currency, true);
    totalAmount = new Big(amount || 0)
      .times(noDiv ? 1 : 10 ** divisibility)
      .add(feeAmount);

    totalString = formatAmountString(totalAmount, currency?.currency, true);
  }

  return {
    feeAmount,
    feeString,
    totalAmount,
    totalString,
    fees,
  };
}

// export function useLimit(amount, tier, currency, type, noDiv) {
//   let feeAmount = 0.0;
//   let totalAmount = amount;
//   let feeString = '';
//   let totalString = '';

//   return { feeAmount, feeString, totalAmount, totalString, fee };
// }

export function useFeeWithConversion(
  amount,
  tierFees,
  currency,
  type,
  rate,
  displayCurrency,
  accountFees,
  groupFees,
  valueOnly = false,
) {
  const { totalAmount, totalString, feeAmount, feeString, fees } = useFee(
    amount,
    tierFees,
    currency,
    accountFees,
    groupFees,
    type,
    false,
    valueOnly,
  );

  let feeConvString = '';
  let totalConvString = '';
  if (rate && currency?.currency?.code !== displayCurrency?.code) {
    const divisibility = currency?.currency?.divisibility;
    feeConvString =
      '~' +
      formatAmountString(
        (feeAmount / 10 ** divisibility) * rate,
        displayCurrency,
      );
    totalConvString =
      '~' +
      formatAmountString(
        (totalAmount / 10 ** divisibility) * rate,
        displayCurrency,
      );

    fees.forEach(fee => {
      fee.feeConvString =
        '~' +
        formatAmountString(
          (fee.feeAmount / 10 ** divisibility) * rate,
          displayCurrency,
        );
    });
  }
  return {
    feeAmount,
    feeString,
    totalAmount,
    totalString,
    fees,
    feeConvString,
    totalConvString,
  };
}

export function useLimitValidation(
  amount,
  allTierLimits = [],
  currency,
  type,
  accountLimits,
) {
  const tierLimits = getLimits(allTierLimits, type, currency);

  accountLimits = accountLimits.filter(
    accountLimit =>
      accountLimit.subtype === null || accountLimit.subtype === type,
  );

  if (tierLimits.length > 0 || accountLimits.length > 0) {
    let minimum = null;
    let maximum = null;
    const divisibility = currency.currency.divisibility;
    const minimumAccountLimitValue = getLimitValueByType(accountLimits, 'min');
    const maximumAccountLimitValue = getLimitValueByType(accountLimits, 'max');

    const accountLimitMinimum = accountLimits.find(
      limit => limit.type === 'min' && limit.value === minimumAccountLimitValue,
    );

    const accountLimitMaximum = accountLimits.find(
      limit => limit.type === 'max' && limit.value === maximumAccountLimitValue,
    );

    let limitMinimum = null;
    let limitMaximum = null;

    if (accountLimitMinimum) {
      limitMinimum = accountLimitMinimum;
    } else if (tierLimits.length > 0) {
      const minimumTierLimitValue = getLimitValueByType(tierLimits, 'min');
      const tierLimitMinimum = tierLimits.find(
        limit => limit.type === 'min' && limit.value === minimumTierLimitValue,
      );
      if (tierLimitMinimum) {
        limitMinimum = tierLimitMinimum;
      }
    }

    if (accountLimitMaximum) {
      limitMaximum = accountLimitMaximum;
    } else if (tierLimits.length > 0) {
      const maximumTierLimitValue = getLimitValueByType(tierLimits, 'max');
      const tierLimitMaximum = tierLimits.find(
        limit => limit.type === 'max' && limit.value === maximumTierLimitValue,
      );
      if (tierLimitMaximum) {
        limitMaximum = tierLimitMaximum;
      }
    }

    if (limitMinimum) {
      minimum = parseFloat(limitMinimum.value / 10 ** divisibility);
    }
    if (limitMaximum) {
      maximum = parseFloat(limitMaximum.value / 10 ** divisibility);
    }

    if (maximum && amount > maximum) {
      return {
        amount:
          'Maximum limit exceeded: ' +
          formatAmountString(maximum, currency.currency),
      };
    } else if (amount < minimum) {
      return {
        amount:
          'Minimum limit not met: ' +
          formatAmountString(minimum, currency.currency),
      };
    }
  }

  return null;
}

const getLimitValueByType = (limits, type) => {
  let initialResult = 0;

  if (type === 'max') {
    initialResult = limits.reduce((result, limit) => {
      if (limit.value > result) {
        result = limit.value;
      }
      return result;
    }, 0);
  }

  const limitValue = limits.reduce((result, limit) => {
    if (limit.type === type) {
      result =
        type === 'min'
          ? Math.max(result, limit.value)
          : Math.min(result, limit.value);
    }
    return result;
  }, initialResult);

  return limitValue;
};
