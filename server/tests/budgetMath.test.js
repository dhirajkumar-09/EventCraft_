import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateAndNormalizeBudget,
  generateDefaultBudgetBreakdown,
  STANDARD_CATEGORIES
} from '../utils/budgetValidator.js';

test('Budget Math - Total strictly equals sum of all categories', () => {
  const total = 1500000;
  const result = generateDefaultBudgetBreakdown(total, 'INR', '₹');

  const calculatedSum = result.categories.reduce((sum, cat) => sum + cat.amount, 0);

  assert.equal(result.isBalanced, true);
  assert.equal(calculatedSum, total, `Expected sum to be ${total}, but got ${calculatedSum}`);
  assert.equal(result.totalBudget, total);
});

test('Budget Math - Normalizes unaligned categories to exact total', () => {
  const targetTotal = 500000;
  // Raw categories that sum to 450,000 (missing 50,000)
  const rawCategories = [
    { category: 'Venue', amount: 150000, percentage: 30 },
    { category: 'Catering', amount: 150000, percentage: 30 },
    { category: 'Decor', amount: 100000, percentage: 20 },
    { category: 'Contingency (10%)', amount: 50000, percentage: 10 }
  ];

  const result = validateAndNormalizeBudget(rawCategories, targetTotal, 'INR', '₹');
  const sum = result.categories.reduce((acc, c) => acc + c.amount, 0);

  assert.equal(sum, targetTotal, `Normalized sum must equal ${targetTotal}`);
  assert.equal(result.isBalanced, true);
});

test('Budget Math - Automatically injects 10% contingency if missing', () => {
  const targetTotal = 800000;
  const rawWithoutContingency = [
    { category: 'Venue', amount: 400000, percentage: 50 },
    { category: 'Catering', amount: 400000, percentage: 50 }
  ];

  const result = validateAndNormalizeBudget(rawWithoutContingency, targetTotal, 'INR', '₹');
  const hasContingency = result.categories.some(c => 
    c.category.toLowerCase().includes('contingency') ||
    c.category.toLowerCase().includes('emergency')
  );

  assert.equal(hasContingency, true, 'Result must include a 10% contingency category');
  const sum = result.categories.reduce((acc, c) => acc + c.amount, 0);
  assert.equal(sum, targetTotal);
});

test('Budget Math - Handles small odd amounts without decimal rounding drift', () => {
  const targetTotal = 77777; // Prime/odd number
  const result = generateDefaultBudgetBreakdown(targetTotal, 'USD', '$');
  const sum = result.categories.reduce((acc, c) => acc + c.amount, 0);

  assert.equal(sum, targetTotal, `Odd budget sum must strictly match ${targetTotal}`);
  assert.equal(result.isBalanced, true);
});

test('Budget Math - Standard categories are 9 items including 10% contingency', () => {
  assert.equal(STANDARD_CATEGORIES.length, 9);
  const contingency = STANDARD_CATEGORIES.find(c => c.key === 'contingency');
  assert.ok(contingency);
  assert.equal(contingency.defaultPct, 10);
});
