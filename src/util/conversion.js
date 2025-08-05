// Basic conversion utilities

/**
 * Converts a value based on a rate
 * @param {number} value - The value to convert
 * @param {number} rate - The conversion rate
 * @param {number} divisibility - The divisibility of the currency
 * @returns {number} - The converted value
 */
export function convert(value, rate, divisibility = 2) {
  if (!value || !rate) return 0;
  return value * rate;
}

/**
 * Formats a converted value
 * @param {number} value - The value to format
 * @param {string} symbol - The currency symbol
 * @param {number} divisibility - The divisibility of the currency
 * @returns {string} - The formatted value
 */
export function formatConversion(value, symbol = '$', divisibility = 2) {
  if (!value) return `${symbol}0`;
  return `${symbol}${value.toFixed(divisibility)}`;
}

export default {
  convert,
  formatConversion
}; 