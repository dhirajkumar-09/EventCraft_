import { describe, it, expect } from 'vitest';
import { formatCurrency, parseCurrencyNumber } from '../../../src/utils/currencyFormatter.js';

describe('currencyFormatter Utility', () => {
  describe('formatCurrency', () => {
    it('formats a standard numeric amount with INR symbol by default', () => {
      const result = formatCurrency(1500000);
      expect(result).toMatch(/^₹\s*15[,.]00[,.]000$/);
    });

    it('formats an amount with a custom currency symbol ($)', () => {
      const result = formatCurrency(25000, '$');
      expect(result).toMatch(/^\$\s*25[,.]000$/);
    });

    it('handles numeric zero correctly', () => {
      const result = formatCurrency(0, '€');
      expect(result).toBe('€ 0');
    });

    it('handles string numbers cleanly', () => {
      const result = formatCurrency('500000', '£');
      expect(result).toMatch(/^£\s*5[,.]00[,.]000$/);
    });

    it('returns 0 with symbol when given invalid non-numeric input', () => {
      const result = formatCurrency('invalid', '₹');
      expect(result).toBe('₹ 0');
    });
  });

  describe('parseCurrencyNumber', () => {
    it('returns the same number if input is already a number', () => {
      expect(parseCurrencyNumber(5000)).toBe(5000);
    });

    it('parses formatted currency strings into raw numeric values', () => {
      expect(parseCurrencyNumber('₹ 1,500,000')).toBe(1500000);
      expect(parseCurrencyNumber('$ 25,450.50')).toBe(25450.5);
    });

    it('returns 0 for empty or falsy inputs', () => {
      expect(parseCurrencyNumber('')).toBe(0);
      expect(parseCurrencyNumber(null)).toBe(0);
      expect(parseCurrencyNumber(undefined)).toBe(0);
    });

    it('returns 0 when given non-numeric characters', () => {
      expect(parseCurrencyNumber('abc')).toBe(0);
    });
  });
});
