import { describe, it, expect } from 'vitest';
import { calculatePlanProgress } from '../../../src/utils/progressCalculator.js';
import { mockPlanFixture } from '../../fixtures/mockPlan.js';

describe('progressCalculator Utility', () => {
  it('returns zeroes when plan is null or undefined', () => {
    const result = calculatePlanProgress(null);
    expect(result).toEqual({
      totalItemsCount: 0,
      checkedItemsCount: 0,
      progressPercentage: 0
    });
  });

  it('correctly tallies total items from timeline tasks and vendor checklist', () => {
    // mockPlanFixture has 3 tasks (tk-1, tk-2, tk-3) + 2 vendors (v-1, v-2) = 5 total
    const result = calculatePlanProgress(mockPlanFixture, {});
    expect(result.totalItemsCount).toBe(5);
    expect(result.checkedItemsCount).toBe(0);
    expect(result.progressPercentage).toBe(0);
  });

  it('calculates progress percentage when some items are checked', () => {
    // 2 out of 5 items checked = 40%
    const checkedItems = {
      'tk-1': true,
      'v-1': true
    };
    const result = calculatePlanProgress(mockPlanFixture, checkedItems);
    expect(result.totalItemsCount).toBe(5);
    expect(result.checkedItemsCount).toBe(2);
    expect(result.progressPercentage).toBe(40);
  });

  it('calculates 100% when all items are checked', () => {
    const checkedItems = {
      'tk-1': true,
      'tk-2': true,
      'tk-3': true,
      'v-1': true,
      'v-2': true
    };
    const result = calculatePlanProgress(mockPlanFixture, checkedItems);
    expect(result.totalItemsCount).toBe(5);
    expect(result.checkedItemsCount).toBe(5);
    expect(result.progressPercentage).toBe(100);
  });

  it('ignores falsey values in checkedItems map', () => {
    const checkedItems = {
      'tk-1': true,
      'tk-2': false,
      'tk-3': undefined
    };
    const result = calculatePlanProgress(mockPlanFixture, checkedItems);
    expect(result.checkedItemsCount).toBe(1);
    expect(result.progressPercentage).toBe(20);
  });

  it('gracefully handles plan with missing timeline tasks or empty vendors', () => {
    const sparsePlan = {
      timeline: [{ id: 't-1' }],
      vendorChecklist: []
    };
    const result = calculatePlanProgress(sparsePlan, {});
    expect(result.totalItemsCount).toBe(0);
    expect(result.progressPercentage).toBe(0);
  });
});
