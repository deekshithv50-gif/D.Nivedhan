/**
 * Currency and Price Formatting Utilities for Indian Rupees (INR - ₹)
 */

export const formatRupees = (amount: number): string => {
  return `₹${Number(amount || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const formatRupeesCompact = (amount: number): string => {
  return `₹${Math.round(amount || 0).toLocaleString('en-IN')}`;
};
