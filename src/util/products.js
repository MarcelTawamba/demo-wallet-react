import { formatAmountString, displayFormatDivisibility } from 'util/general';

/**
 * Formats the variants of a product into a readable string
 * @param {Array} variants - Array of product variants
 * @param {Object} options - Formatting options
 * @returns {String} Formatted variants string
 */
export function formatVariantsString(variants, options = {}) {
  if (!variants || !variants.length) return '';
  
  // Default options
  const { separator = ', ', valueOnly = false } = options;
  
  return variants
    .map(variant => {
      if (valueOnly) {
        return variant.value || '';
      }
      return variant.name ? `${variant.name}: ${variant.value}` : variant.value || '';
    })
    .filter(Boolean)
    .join(separator);
}

/**
 * Formats an array of prices into a readable string
 * @param {Array} prices - Array of price objects
 * @returns {String} Formatted prices string
 */
export function formatPricesString(prices = []) {
  if (!prices || !prices.length) return '';
  
  let valueString = '';
  for (const [key, value] of Object.entries(prices)) {
    if (value?.amount && value?.currency) {
      valueString += `${value.currency.symbol || ''}${displayFormatDivisibility(value.amount, value.currency.divisibility)}, `;
    } 
  }
  return valueString.substring(0, valueString.length - 2);
}

/**
 * Formats product price based on currency and variants
 * @param {Object} product - Product object
 * @param {Object} currency - Currency object
 * @returns {String} Formatted price
 */
export function formatProductPrice(product, currency) {
  if (!product) return '';
  
  const price = product.price || 0;
  const symbol = currency?.symbol || '';
  
  return `${symbol}${parseFloat(price).toFixed(2)}`;
}

/**
 * Checks if a product is in stock
 * @param {Object} product - Product object
 * @returns {Boolean} True if product is in stock
 */
export function isProductInStock(product) {
  if (!product) return false;
  
  // If no inventory management or unlimited stock
  if (product.stock === null || product.stock === undefined) return true;
  
  return product.stock > 0;
}

/**
 * Gets the total price of items in a cart
 * @param {Array} items - Cart items
 * @returns {Number} Total price
 */
export function getCartTotal(items) {
  if (!items || !items.length) return 0;
  
  return items.reduce((total, item) => {
    const price = parseFloat(item.price || 0);
    const quantity = parseInt(item.quantity || 1, 10);
    return total + (price * quantity);
  }, 0);
}

/**
 * Calculates the discounted price
 * @param {Number} price - Original price
 * @param {Number} discount - Discount amount or percentage
 * @param {Boolean} isPercentage - If true, discount is a percentage
 * @returns {Number} Discounted price
 */
export function calculateDiscountedPrice(price, discount, isPercentage = true) {
  if (!price || !discount) return price;
  
  const priceValue = parseFloat(price);
  const discountValue = parseFloat(discount);
  
  if (isPercentage) {
    return priceValue - (priceValue * (discountValue / 100));
  }
  
  return priceValue - discountValue;
}

// Create a named object before exporting
const productUtils = {
  formatVariantsString,
  formatProductPrice,
  isProductInStock,
  getCartTotal,
  calculateDiscountedPrice,
  formatPricesString,
};

export default productUtils;
