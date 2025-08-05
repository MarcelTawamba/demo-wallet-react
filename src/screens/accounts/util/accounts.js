import { calculateRate } from 'util/rates';

export const calculateAccountTotal = (account, rates) => {
  if (!account) {
    return 0.0;
  }
  const { keys, currencies } = account;
  const { displayCurrency, hasConversion } = rates;

  let totalBalance = 0.0;
  if (hasConversion) {
    try {
      keys.forEach(key => {
        const { currency, available_balance } = currencies[key];
        const fromCode = currency.code;
        const toCode = displayCurrency.code;
        const rate = calculateRate(fromCode, toCode, rates.rates);

        totalBalance =
          totalBalance +
          (available_balance / 10 ** currency.divisibility) * rate;
      });

      const diff =
        totalBalance.toString().length -
        Math.floor(totalBalance).toString().length;
      if (diff < 3) {
        totalBalance = totalBalance.toFixed(2);
      } else if (diff > displayCurrency.divisibility) {
        totalBalance = totalBalance.toFixed(displayCurrency.divisibility);
      }
    } catch (e) {
      // console.log('totalBalance error', e);
    }
  }

  return totalBalance;
};
