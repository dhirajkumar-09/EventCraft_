/**
 * Budget Math Validator & Normalizer
 * Ensures all category allocations sum strictly to the total budget,
 * ensures contingency is accounted for (~10%),
 * and calculates exact percentages without rounding drift.
 */

export const STANDARD_CATEGORIES = Object.freeze([
  { key: 'venue', name: 'Venue & Infrastructure', defaultPct: 22 },
  { key: 'catering', name: 'Catering & Beverages', defaultPct: 28 },
  { key: 'decor', name: 'Decor, Florals & Lighting', defaultPct: 15 },
  { key: 'photography', name: 'Photography & Videography', defaultPct: 10 },
  { key: 'entertainment', name: 'Entertainment & Music', defaultPct: 7 },
  { key: 'attire', name: 'Attire, Hair & Makeup', defaultPct: 4 },
  { key: 'invitations', name: 'Invitations & Digital Stationery', defaultPct: 2 },
  { key: 'transport', name: 'Guest Transport & Logistics', defaultPct: 2 },
  { key: 'contingency', name: 'Emergency Contingency (10%)', defaultPct: 10 }
]);

/**
 * Checks for contingency allocation and appends 10% emergency buffer if missing
 * @param {Array<Object>} categories
 * @param {number} numericBudget
 * @returns {Array<Object>}
 */
function ensureContingencyAllocation(categories, numericBudget) {
  const hasContingency = categories.some((c) => {
    const name = (c.category || '').toLowerCase();
    return name.includes('contingency') || name.includes('emergency');
  });

  if (hasContingency) {
    return categories;
  }

  const contingencyAmount = Math.round(numericBudget * 0.1);
  return [
    ...categories,
    {
      category: 'Emergency Contingency (10%)',
      amount: contingencyAmount,
      percentage: 10,
      note: 'Buffer reserved for unexpected guest surge, extra hours, or last-minute supplies'
    }
  ];
}

/**
 * Scales category amounts proportionally to match target budget exactly
 * @param {Array<Object>} categories
 * @param {number} numericBudget
 * @param {number} currentSum
 * @returns {Array<Object>}
 */
function scaleAllocationsToTotal(categories, numericBudget, currentSum) {
  let remainingBudget = numericBudget;

  return categories.map((cat, index) => {
    if (index === categories.length - 1) {
      const amount = Math.max(0, remainingBudget);
      const percentage =
        numericBudget > 0 ? Number(((amount / numericBudget) * 100).toFixed(1)) : 0;
      return { ...cat, amount, percentage };
    }

    const scaledAmount = Math.round((cat.amount / currentSum) * numericBudget);
    remainingBudget -= scaledAmount;
    const percentage =
      numericBudget > 0 ? Number(((scaledAmount / numericBudget) * 100).toFixed(1)) : 0;

    return { ...cat, amount: scaledAmount, percentage };
  });
}

/**
 * Normalizes and validates the budget breakdown.
 * @param {Array<{ category: string, amount: number, percentage?: number, note?: string }>} categories
 * @param {number} totalBudget
 * @param {string} [currency='INR']
 * @param {string} [currencySymbol='₹']
 * @returns {{ categories: Array, totalBudget: number, isBalanced: boolean, totalSum: number }}
 */
export function validateAndNormalizeBudget(
  categories,
  totalBudget,
  currency = 'INR',
  currencySymbol = '₹'
) {
  const numericBudget = Math.max(0, Math.round(Number(totalBudget) || 0));

  if (!Array.isArray(categories) || categories.length === 0 || numericBudget <= 0) {
    return generateDefaultBudgetBreakdown(numericBudget, currency, currencySymbol);
  }

  const sanitized = categories.map((cat, idx) => ({
    category: String(cat.category || `Category ${idx + 1}`).trim(),
    amount: Math.max(0, Math.round(Number(cat.amount) || 0)),
    percentage: Number(cat.percentage) || 0,
    note: cat.note ? String(cat.note).trim() : ''
  }));

  const withContingency = ensureContingencyAllocation(sanitized, numericBudget);
  const currentSum = withContingency.reduce((acc, c) => acc + c.amount, 0);

  if (currentSum === 0) {
    return generateDefaultBudgetBreakdown(numericBudget, currency, currencySymbol);
  }

  const normalized = scaleAllocationsToTotal(withContingency, numericBudget, currentSum);
  const finalSum = normalized.reduce((acc, c) => acc + c.amount, 0);

  return {
    totalBudget: numericBudget,
    currency,
    currencySymbol,
    categories: normalized,
    isBalanced: finalSum === numericBudget,
    totalSum: finalSum
  };
}

/**
 * Fallback generator for standard 9-category breakdown strictly matching totalBudget
 * @param {number} totalBudget
 * @param {string} [currency='INR']
 * @param {string} [currencySymbol='₹']
 * @returns {{ categories: Array, totalBudget: number, isBalanced: boolean, totalSum: number }}
 */
export function generateDefaultBudgetBreakdown(
  totalBudget,
  currency = 'INR',
  currencySymbol = '₹'
) {
  const numericBudget = Math.max(0, Math.round(Number(totalBudget) || 0));
  let remainingBudget = numericBudget;

  const categories = STANDARD_CATEGORIES.map((cat, idx) => {
    if (idx === STANDARD_CATEGORIES.length - 1) {
      const amount = Math.max(0, remainingBudget);
      return {
        category: cat.name,
        amount,
        percentage: Number(((amount / (numericBudget || 1)) * 100).toFixed(1)),
        note: 'Reserved 10% safety cushion for overtime, transport extras, or weather changes'
      };
    }

    const amount = Math.round(numericBudget * (cat.defaultPct / 100));
    remainingBudget -= amount;
    return {
      category: cat.name,
      amount,
      percentage: cat.defaultPct,
      note: `Recommended standard allocation of ${cat.defaultPct}%`
    };
  });

  return {
    totalBudget: numericBudget,
    currency,
    currencySymbol,
    categories,
    isBalanced: true,
    totalSum: numericBudget
  };
}
