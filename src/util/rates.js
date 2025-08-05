import { useMemo } from 'react';
import { chunk, get } from 'lodash';
import moment from 'moment';
import { getConversionRate, getConversionRateSnapshots } from './rehive';
import {
  formatDecimals,
  formatDivisibility,
  formatAmountString,
  getCurrencyCode,
  addCommas,
} from './general';
import Big from 'big.js';
import { useQuery, useQueries } from 'react-query';

export { formatAmountString, formatDecimals };

export const calculateRate = (fromCurrency, toCurrency, rates) => {
  if (fromCurrency === toCurrency) {
    return 1;
  }
  try {
    const fromRate = fromCurrency === 'USD'
      ? Big(1)
      : Big(get(rates, ['USD:' + fromCurrency, 'rate'], 0));
    const toRate = toCurrency === 'USD'
      ? Big(1)
      : Big(get(rates, ['USD:' + toCurrency, 'rate'], 0));
    
    if (toRate.eq(0) || fromRate.eq(0)) {
      return 0;
    }
    return toRate.div(fromRate).toNumber();
  } catch (e) {
    return 0;
  }
};

export const renderRate = ({ fromCurrency, toCurrency, rate }) => {
  if (!rate) {
    return '';
  }
  const flip = rate > 1;

  if (toCurrency.currency) {
    toCurrency = toCurrency.currency;
  }
  if (fromCurrency.currency) {
    fromCurrency = fromCurrency.currency;
  }

  const fromCode = getCurrencyCode(fromCurrency);
  const toCode = getCurrencyCode(toCurrency);

  const fromString =
    formatDecimals(
      flip ? 1 : Big(1).div(rate).toString(),
      flip
        ? fromCurrency.divisibility
        : fromCurrency.divisibility > 4
        ? fromCurrency.divisibility
        : 4,
      false,
    ) +
    ' ' +
    fromCode;

  const toString =
    formatDecimals(
      flip ? rate : 1,
      flip
        ? toCurrency.divisibility > 4
          ? toCurrency.divisibility
          : 4
        : toCurrency.divisibility,
      false,
    ) +
    ' ' +
    toCode;

  return flip
    ? fromString + ' for ' + toString
    : toString + ' for ' + fromString;
};

export function useConversion(amount, rates, currency, withDivisibility) {
  const { hasConversion, displayCurrency } = rates ?? {};

  if (!currency) return {};

  let convRate = 1;
  let convAvailable = 0;
  let convAvailableString = '';

  if (hasConversion && currency.code !== displayCurrency.code) {
    if (!amount) {
      convAvailable = formatAmountString(0, displayCurrency);
    } else {
      convRate = calculateRate(
        currency.code,
        displayCurrency.code,
        rates.rates,
      );

      if (convRate) {
        // Convert to Big for precise calculations
        convAvailable = Big(amount)
          .div(withDivisibility ? Big(10).pow(currency.divisibility) : 1)
          .times(convRate);

        const diff = convAvailable.toString().length - 
                    Big(convAvailable).round(0, 0).toString().length;
                    
        if (diff < 3) {
          convAvailable = convAvailable.toFixed(2);
        } else if (diff > displayCurrency.divisibility) {
          convAvailable = convAvailable.toFixed(displayCurrency.divisibility);
        }

        convAvailableString =
          '~' +
          addCommas(convAvailable) +
          ' ' +
          getCurrencyCode(displayCurrency);
      } else convAvailableString = 'N/A ' + getCurrencyCode(displayCurrency);
    }
  }
  return {
    hasConversion,
    convAvailable: convAvailableString,
    convAvailableString,
    convAmount: convAvailable,
    convRate,
  };
}

export const convertAmount = ({ values, currency, rates, displayCurrency }) => {
  let { amount, display } = values;
  amount = Big(amount || 0);

  if (!displayCurrency) displayCurrency = rates?.displayCurrency;
  if (!displayCurrency?.code) displayCurrency = currency?.currency;

  const convRate = calculateRate(
    currency.currency.code,
    displayCurrency.code,
    rates.rates,
  );
  const toCurrency = display ? displayCurrency : currency?.currency;

  const formattedAmount = Big(amount ? amount : 0)
    .times(display ? Big(1).div(convRate) : convRate)
    .times(Big(10).pow(toCurrency.divisibility));

  const convBase = Big(formattedAmount).div(
    Big(10).pow(toCurrency.divisibility),
  );

  return convBase;
};

export const formatConvAmount = ({
  values,
  currency,
  rates,
  displayCurrency,
}) => {
  const { amount, display } = values;
  if (!displayCurrency) {
    displayCurrency = rates.displayCurrency;
  }
  const convRate = calculateRate(
    currency?.currency?.code,
    displayCurrency.code,
    rates.rates,
  );

  const toCurrency = display ? currency.currency : displayCurrency;

  const convBase =
    Math.floor(
      parseFloat(amount ? amount : 0) *
        (display ? 1 / convRate : convRate) *
        10 ** toCurrency.divisibility,
    ) /
    10 ** toCurrency.divisibility;

  let convAmount = formatDecimals(convBase, toCurrency.divisibility);

  return convAmount + ' ' + getCurrencyCode(toCurrency);
};

export const calculateFee = ({ amount, fee, currency }) => {
  return Big(fee.value || 0).plus(
    Big(amount || 0).times(fee.percentage).div(100)
  ).toNumber();
};

function handleConversionServicesCheck(services, rates, currency) {
  return Boolean(
    services?.conversion_service &&
      rates &&
      rates.rates &&
      rates.displayCurrency &&
      rates.displayCurrency.code !== currency?.code,
  );
}

export function handleConversion(services, rates, currency) {
  const hasConversion = handleConversionServicesCheck(
    services,
    rates,
    currency,
  );
  let convRate = 1;
  let rateOutput = null;
  if (hasConversion) {
    convRate = calculateRate(
      currency.code,
      rates.displayCurrency.code,
      rates.rates,
    );
    const rate = rates.rates['USD:' + currency.code];
    if (rate) {
      rateOutput = {
        label: 'rate',
        value: renderRate({
          fromCurrency: currency,
          toCurrency: rates.displayCurrency,
          rate: convRate,
        }),
        value2: 'Last updated ' + moment(rate.created).fromNow(),
      };
    }
  }
  return { hasConversion, convRate, rateOutput };
}

export function useConversionTransactionList(services, rates, currency, item) {
  const { amount, created } = item;

  const hasConversion = handleConversionServicesCheck(
    services,
    rates,
    currency,
  );
  const currencyCode = currency?.code;

  let tempConvRate = 0;
  let convAmountString = '';

  let key__in = '';
  if (currencyCode !== 'USD') {
    key__in = 'USD:' + currencyCode;
  }
  if (rates.displayCurrency.code !== 'USD') {
    key__in = key__in ? key__in + ',' : '';
    key__in = key__in + 'USD:' + rates.displayCurrency.code;
  }
  const { data, isLoading } = useQuery(
    ['rates', key__in, created],
    () => getConversionRate(key__in, created, true),
    { enabled: hasConversion, staleTime: 100000 },
  );
  const tempRates = data?.rates ?? rates.rates;

  if (hasConversion) {
    tempConvRate = calculateRate(
      currencyCode,
      rates.displayCurrency.code,
      tempRates,
    );
    convAmountString = rates.displayCurrency
      ? '~' +
        formatAmountString(
          formatDivisibility(amount, currency.divisibility).replace('-', '') *
            tempConvRate,
          rates.displayCurrency,
        )
      : '';
  }
  return { loading: isLoading, convAmountString, tempConvRate };
}

function mapChunks(chunks = []) {
  return chunks.map(chunk => mapSnapshots(chunk));
}

function mapSnapshots(items = []) {
  let string = '';
  items &&
    items.length &&
    items.forEach(item => {
      string =
        string +
        (string ? '&' : '?') +
        encodeURI(
          `snapshot={"key":"` + item?.key + `","date":` + item?.date + `}`,
        );
    });
  return string;
}

export function useConversionsTransactionList(
  services,
  rates,
  currency,
  items,
) {
  const hasConversion = handleConversionServicesCheck(
    services,
    rates,
    currency,
  );

  let tempConvRate = 0;
  let convAmountString = '';

  function buildSnapshots() {
    let snapshots = [];
    if (items?.length)
      items.forEach(item => {
        const { created, currency } = item;
        const currencyCode = currency?.code;
        if (currencyCode !== 'USD')
          snapshots.push({ key: 'USD:' + currencyCode, date: created });
        if (rates.displayCurrency.code !== 'USD')
          snapshots.push({
            key: 'USD:' + rates.displayCurrency.code,
            date: created,
          });
      });
    return snapshots;
  }
  let snapshots = useMemo(buildSnapshots, [items, rates.displayCurrency.code]);
  let chunks = chunk(snapshots, 20);
  const snapshotsChunksString = useMemo(() => mapChunks(chunks), [chunks]);

  const results = useQueries(
    snapshotsChunksString.map(item => ({
      queryKey: ['rates', item],
      queryFn: () => getConversionRateSnapshots(item),
      enabled: hasConversion,
      staleTime: Infinity,
      cacheTime: Infinity,
    })),
  );

  function mapConversionRates(data) {
    let rates = {};
    data.forEach(item => {
      const { key, rate, date } = item;
      if (!rates?.[key]) {
        rates[key] = {};
      }
      rates[key][date] = rate?.rate;
    });
    return rates;
  }
  const conversionRates = useMemo(
    () => mapConversionRates(results?.map(item => item?.data ?? []).flat()),
    [results],
  );
  return { loading: results?.[0]?.isLoading, conversionRates, tempConvRate };
}

export function useConversionRates(props) {
  const { fromCurrency, toCurrency } = props;

  if (toCurrency === fromCurrency) return {};

  const convRate = calculateRateSimple(props);

  const convAmountString = convRate
    ? calculateRateString({ ...props, convRate }) ?? ''
    : '';

  return { convAmountString, convRate };
}

export function calculateRateString({ rates, currency, amount, convRate }) {
  return rates?.displayCurrency
    ? '~' +
        formatAmountString(
          Big(
            parseFloat(
              formatDivisibility(amount, currency.divisibility).replace(
                '-',
                '',
              ),
            ),
          ).times(convRate),
          rates.displayCurrency,
        )
    : '';
}

function getRate(conversionRates, key, date) {
  return parseFloat(conversionRates?.[key]?.[date]);
}

export const calculateRateSimple = ({
  fromCurrency,
  toCurrency,
  conversionRates,
  date,
}) => {
  let fromRate = 0;
  let toRate = 0;
  if (fromCurrency === toCurrency) {
    return 1;
  }

  try {
    fromRate =
      fromCurrency === 'USD'
        ? Big(1)
        : Big(getRate(conversionRates, 'USD:' + fromCurrency, date) || 0);
    toRate =
      toCurrency === 'USD'
        ? Big(1)
        : Big(getRate(conversionRates, 'USD:' + toCurrency, date) || 0);
    if (toRate.eq(0) || fromRate.eq(0)) {
      return 0;
    }
    return toRate.div(fromRate).toNumber();
  } catch (e) {
    return 0;
  }
};
