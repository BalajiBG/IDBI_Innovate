/**
 * Formats a number in Indian currency format: ₹X,XX,XXX
 */
export function formatINR(amount) {
  if (amount === null || amount === undefined) return '₹0';
  const num = Math.round(Math.abs(amount));
  const formatted = num.toLocaleString('en-IN');
  return `${amount < 0 ? '-' : ''}₹${formatted}`;
}

/**
 * Formats large amounts in lakhs/crores for readability
 */
export function formatINRShort(amount) {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} L`;
  return formatINR(amount);
}
