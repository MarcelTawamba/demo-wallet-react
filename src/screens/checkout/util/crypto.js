import {
  generateUrl,
  generateQueryString,
  formatDivisibility,
} from 'util/general';

export function generateCryptoQR(values) {
  const  {currency, payment_processor, amount} = values;

  let scheme = '';
  let address = '';
  let options = {};

  let outputItems = [];

  let destination = '';

  switch (payment_processor.unique_string_name) {
    case 'native_stellar':
    case 'native_stellar_testnet':
      const { public_address, reference, memo } = values;
      const code = currency?.code;
      scheme = 'web+stellar';
      address = 'pay';

      destination = public_address ?? reference;
      options.destination = destination;

      options.memo = memo;
      outputItems = [
        {
          label: 'Address',
          value: destination,
          copy: true,
        },
        {
          label: 'Memo',
          value: memo,
          copy: true,
        },
      ];

      if (!code.match(/XLM/)) {
        options.asset_code = code;
      }
      break;
    // case 'ETH':
    // case 'TETH':
    //   scheme = 'ethereum';
    //   address = getEthereumAddress(currency, crypto);
    //   break;
    default:
      const { to_address } = values;
      address = to_address;
      outputItems = [
        {
          label: 'Address',
          value: address,
          copy: true,
        },
      ];
  }
  if (amount)
    options.amount = formatDivisibility(amount, currency?.divisibility);

  const qrString = generateUrl(scheme, address, options);
  if (scheme) options.scheme = scheme;
  if (address) options.address = address;

  const receiveUrl = generateQueryString(options);
  return { qrString, receiveUrl, outputItems, address };
}
