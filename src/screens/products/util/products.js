import {
  formatDivisibility,
  formatAmountString,
  getCurrencyCode,
} from 'util/general';

// Local implementation to avoid circular import
function formatVariantsString(options) {
  if (!options || !options.length) return '';
  
  let valueString = '';
  for (const [key, value] of Object.entries(options)) {
    valueString = valueString + `${key}: ${value}, `;
  }
  return valueString.substring(0, valueString.length - 2);
}

export function formatPriceString(item, currency) {
  const {
    type,
    description,
    name,
    quantity,
    prices,
    id,
    images,
    options,
    variants,
    short_description,
    id: productId,
  } = item;
  // console.log('formatPriceString -> item', item);

  const matchPrice = price => price.currency.code === currency?.code;
  const price = prices.find(matchPrice);
  // if (!price) {
  //   return null;
  // // }
  // const priceString = price
  //   ? (price.amount
  //       ? formatDivisibility(price.amount, price.currency.divisibility)
  //       : 'N/A'
  //     ).toString() +
  //     ' ' +
  //     getCurrencyCode(currency)
  //   : priceMin && priceMax
  //   ? formatDivisibility(priceMin, currency.divisibility) +
  //     ' - ' +
  //     formatAmountString(priceMax, currency, true)
  //   : '';

  // console.log('formatPriceString -> variants', variants);
  const filteredVariants = variants.filter(
    item => item.prices.findIndex(matchPrice) !== -1,
  );
  const variantOptions = filteredVariants
    .map(item => {
      const { label, id, prices, options, variant } = item;
      const { amount } =
        prices.find(item => item?.currency?.code === currency?.code) ??
        prices?.[0] ??
        {};
      return {
        label:
          (label ? label : formatVariantsString(options)) +
          (amount ? ' @ ' + formatAmountString(amount, currency, true) : ''),
        amount,
        value: item.id,
      };
    })
    .sort(function (a, b) {
      return a.amount - b.amount;
    });

  const priceMax = Math.max.apply(
    Math,
    variantOptions.map(function (o) {
      return o.amount;
    }),
  );
  const priceMin = Math.min.apply(
    Math,
    variantOptions.map(function (o) {
      return o.amount;
    }),
  );

  const priceString =
    filteredVariants.length > 0 && (priceMin || priceMax)
      ? `${
          priceMin !== priceMax
            ? formatDivisibility(priceMin, currency?.divisibility) +
              ' - ' +
              formatDivisibility(priceMax, currency?.divisibility, true)
            : formatDivisibility(
                priceMin ? priceMin : priceMax,
                currency?.divisibility,
                true,
              )
        } ${getCurrencyCode(currency)}`
      : price
      ? `${
          price?.amount
            ? formatDivisibility(price?.amount, price.currency?.divisibility)
            : 'N/A'
        } ${getCurrencyCode(price?.currency)}`
      : '';

  return priceString;
}
