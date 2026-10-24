/**
 * Budget Math Validator & Normalizer
 * Ensures all category allocations sum strictly to the total budget,
 * ensures contingency is accounted for (~10%),
 * and calculates exact percentages without rounding drift.
 */

export const STANDARD_CATEGORIES = [
  { key: 'venue', name: 'Venue & Infrastructure', defaultPct: 22 },
  { key: 'catering', name: 'Catering & Beverages', defaultPct: 28 },
  { key: 'decor', name: 'Decor, Florals & Lighting', defaultPct: 15 },
  { key: 'photography', name: 'Photography & Videography', defaultPct: 10 },
  { key: 'entertainment', name: 'Entertainment & Music', defaultPct: 7 },
  { key: 'attire', name: 'Attire, Hair & Makeup', defaultPct: 4 },
  { key: 'invitations', name: 'Invitations & Digital Stationery', defaultPct: 2 },
  { key: 'transport', name: 'Guest Transport & Logistics', defaultPct: 2 },
  { key: 'contingency', name: 'Emergency Contingency (10%)', defaultPct: 10 },
];

/**
 * Normalizes and validates the budget breakdown.
 * @param {Array<{ category: string, amount: number, percentage?: number, note?: string }>} categories
 * @param {number} totalBudget
 * @param {string} currency
 * @param {string} currencySymbol
 * @returns {{ categories: Array, totalBudget: number, isBalanced: boolean, totalSum: number }}
 */
export function validateAndNormalizeBudget(categories, totalBudget, currency = 'INR', currencySymbol = '₹') {
  const numericBudget = Math.max(0, Math.round(Number(totalBudget) || 0));

  if (!Array.isArray(categories) || categories.length === 0 || numericBudget <= 0) {
    // Generate default distribution if missing
    return generateDefaultBudgetBreakdown(numericBudget, currency, currencySymbol);
  }

  // Ensure 10% contingency exists or is preserved
  let processed = categories.map((cat, idx) => {
    const rawAmount = Math.max(0, Math.round(Number(cat.amount) || 0));
    return {
      category: String(cat.category || `Category ${idx + 1}`).trim(),
      amount: rawAmount,
      percentage: Number(cat.percentage) || 0,
      note: cat.note ? String(cat.note).trim() : ''
    };
  });

  // Check if contingency exists
  const hasContingency = processed.some(c => 
    c.category.toLowerCase().includes('contingency') || 
    c.category.toLowerCase().includes('emergency')
  );

  if (!hasContingency) {
    const contingencyAmt = Math.round(numericBudget * 0.10);
    processed.push({
      category: 'Emergency Contingency (10%)',
      amount: contingencyAmt,
      percentage: 10,
      note: 'Buffer reserved for unexpected guest surge, extra hours, or last-minute supplies'
    });
  }

  // Calculate current sum
  let currentSum = processed.reduce((acc, c) => acc + c.amount, 0);

  if (currentSum === 0) {
    return generateDefaultBudgetBreakdown(numericBudget, currency, currencySymbol);
  }

  // Scale proportionally to match numericBudget exactly
  let remainingBudget = numericBudget;
  const normalized = processed.map((c, index) => {
    if (index === processed.length - 1) {
      // Last item absorbs any rounding difference to ensure exact equality
      const amount = Math.max(0, remainingBudget);
      const percentage = numericBudget > 0 ? Number(((amount / numericBudget) * 100).toFixed(1)) : 0;
      return {
        ...c,
        amount,
        percentage
      };
    }

    const scaledAmount = Math.round((c.amount / currentSum) * numericBudget);
    remainingBudget -= scaledAmount;
    const percentage = numericBudget > 0 ? Number(((scaledAmount / numericBudget) * 100).toFixed(1)) : 0;

    return {
      ...c,
      amount: scaledAmount,
      percentage
    };
  });

  // Verify exact match
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
 */
export function generateDefaultBudgetBreakdown(totalBudget, currency = 'INR', currencySymbol = '₹') {
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
