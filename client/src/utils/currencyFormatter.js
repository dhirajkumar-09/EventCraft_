/**
 * Currency Formatting Utility
 * Formats numbers into localized currency display strings
 */

/**
 * Formats an amount with currency symbol and thousands separators
 * @param {number|string} amount - Number to format
 * @param {string} [symbol='₹'] - Currency symbol (e.g. '₹', '$')
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount, symbol = '₹') {
  const numeric = Number(amount) || 0;
  return `${symbol} ${numeric.toLocaleString()}`;
}

/**
 * Strips formatting to extract raw numeric value
 * @param {string|number} value - Input string or number
 * @returns {number} Pure number
 */
export function parseCurrencyNumber(value) {
  if (typeof value === 'number') return value;
  if (!value) return 0;
  const cleaned = String(value).replace(/[^0-9.-]+/g, '');
  return Number(cleaned) || 0;
}
