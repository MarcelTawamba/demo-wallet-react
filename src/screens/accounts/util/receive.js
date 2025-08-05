import {
  stellarFederation,
  getBitcoinAddress,
  getStellarAddress,
  getEthereumAddress,
} from 'util/crypto';

import {
  formatAmountString,
  handleConversion,
  calculateRate,
} from 'util/rates';
import { get } from 'lodash';
import {
  generateUrl,
  generateQueryString,
  formatDivisibility,
} from 'util/general';

function actualAmount(amount, services, rates, currency, display) {
  let sentenceString = '';
  let amountActual = 0.0;
  const { hasConversion, convRate, rateOutput } = handleConversion(
    services,
    rates,
    currency,
  );
  if (amount) {
    let amountString = '';
    let amountConvString = '';
    let amountConv = 0.0;
    let rate = 0;
    if (hasConversion) {
      rate = calculateRate(rates?.displayCurrency?.code, currency?.code, rates);
      if (display) {
        amountConv = amount * 10 ** rate;
        amountActual = (amount / convRate) * 10 ** currency?.divisibility;
      } else {
        amountActual = amount * 10 ** currency?.divisibility;
        amountConv = amount * 10 ** rate * convRate;
      }
    } else {
      amountActual = amount * 10 ** currency?.divisibility;
    }
    amountString = formatAmountString(amountActual, currency, true);
    sentenceString = amountString;
    if (hasConversion && rate) {
      amountConvString = formatAmountString(
        amountConv,
        rates.displayCurrency,
        true,
      );
    }

    sentenceString =
      amountString + (amountConvString ? ' (~' + amountConvString + ')' : '');
  } else {
    // sentenceString = currency.code;
  }
  amountActual = formatDivisibility(amountActual, currency.divisibility);
  return { sentenceString, amountActual, rateOutput };
}

export function generateReceive({ services, rates, currency, values, crypto }) {
  const { recipientType, display, amount, stellarTransactionType, note } =
    values;
  const isCrypto = recipientType === 'crypto' && Boolean(currency.crypto);
  const code = currency?.currency?.code;

  let scheme = '';
  let address = '';
  let options = {};

  let outputItems = [];

  const { amountActual, sentenceString, rateOutput } = actualAmount(
    amount,
    services,
    rates,
    currency.currency,
    display,
  );

  if (amount && amountActual) {
    options.amount = amountActual;
  }
  let destination = '';

  if (isCrypto) {
    switch (currency.crypto?.blockchain) {
      case 'bitcoin':
        scheme = 'bitcoin';
        address = getBitcoinAddress(currency, crypto);
        outputItems = [
          {
            id: 'address',
            value: address,
            copy: true,
          },
        ];
        break;
      case 'stellar':
        scheme = 'web+stellar';
        address = 'pay';

        destination = getStellarAddress(
          currency,
          crypto,
          stellarTransactionType,
        );
        options.destination = destination;
        if (note) {
          options.msg = note;
        }

        const {
          isFederated,
          isStellar,
          federatedAddress,
          memo,
          federatedAddressLabel,
        } = stellarFederation(currency, crypto, isCrypto);
        if (memo) {
          options.memo_type = 'MEMO_TEXT';
        }

        if (isStellar && stellarTransactionType === 'public' && memo) {
          options.memo = memo;
          outputItems = [
            {
              id: 'address',
              value: destination,
              copy: true,
            },
            {
              id: 'memo',
              value: memo,
              copy: true,
            },
          ];
        } else if (isFederated && stellarTransactionType === 'federation') {
          outputItems = [
            {
              label: federatedAddressLabel,
              value: federatedAddress,
              copy: true,
            },
          ];
        }
        if (!code.match(/XLM/)) {
          options.asset_code = code;
        }
        break;
      case 'ethereum':
        scheme = 'ethereum';
        address = getEthereumAddress(currency, crypto);
        break;
      default:
    }
  } else {
    address = values[recipientType];
    if (amountActual) {
      options.currency = code;
    }
  }

  if (rateOutput && amountActual) {
    outputItems.push(rateOutput);
  }
  const receiveQRString = generateUrl(scheme, address, options);
  if (scheme) options.scheme = scheme;
  if (address) options.address = address;

  const receiveUrl = generateQueryString(options);

  return { receiveQRString, receiveUrl, sentenceString, outputItems, address };
}
