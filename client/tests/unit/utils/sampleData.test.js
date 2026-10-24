import { describe, it, expect } from 'vitest';
import {
  SAMPLE_PRESETS,
  getFutureDate,
  calculateDaysRemaining
} from '../../../src/utils/sampleData.js';

describe('sampleData Utility', () => {
  it('exports exactly 4 curated celebration presets', () => {
    expect(SAMPLE_PRESETS).toHaveLength(4);
    expect(SAMPLE_PRESETS[0].name).toContain('Royal Heritage Wedding');
    expect(SAMPLE_PRESETS[1].name).toContain('1st Birthday Extravaganza');
    expect(SAMPLE_PRESETS[2].name).toContain('Silver 25th Anniversary');
    expect(SAMPLE_PRESETS[3].name).toContain('Diwali Community Gala');
  });

  describe('getFutureDate', () => {
    it('returns a formatted YYYY-MM-DD date in the future', () => {
      const future = getFutureDate(30);
      expect(future).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      const target = new Date(future);
      const now = new Date();
      expect(target.getTime()).toBeGreaterThan(now.getTime());
    });

    it('defaults to 60 days ahead when called with no arguments', () => {
      const future = getFutureDate();
      expect(future).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe('calculateDaysRemaining', () => {
    it('returns null if dateString is empty or null', () => {
      expect(calculateDaysRemaining('')).toBeNull();
      expect(calculateDaysRemaining(null)).toBeNull();
    });

    it('returns positive days for future dates', () => {
      const futureDate = getFutureDate(10);
      const days = calculateDaysRemaining(futureDate);
      expect(days).toBeGreaterThanOrEqual(9);
      expect(days).toBeLessThanOrEqual(11);
    });

    it('returns negative days for past dates', () => {
      const pastDate = '2020-01-01';
      const days = calculateDaysRemaining(pastDate);
      expect(days).toBeLessThan(0);
    });

    it('returns 0 for today', () => {
      const today = new Date().toISOString().split('T')[0];
      const days = calculateDaysRemaining(today);
      expect(days).toBe(0);
    });
  });
});
