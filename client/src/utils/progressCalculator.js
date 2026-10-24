/**
 * Progress Calculator Utility
 * Computes completion percentage across timeline tasks and vendor checklist items
 */

/**
 * Calculates progress metrics based on active plan and user checked items
 * @param {Object|null} plan - Active event plan
 * @param {Object} checkedItems - Map of checked item IDs
 * @returns {{ totalItemsCount: number, checkedItemsCount: number, progressPercentage: number }}
 */
export function calculatePlanProgress(plan, checkedItems = {}) {
  if (!plan) {
    return { totalItemsCount: 0, checkedItemsCount: 0, progressPercentage: 0 };
  }

  let total = 0;
  let checked = 0;

  // Timeline tasks
  if (Array.isArray(plan.timeline)) {
    plan.timeline.forEach((phase) => {
      if (Array.isArray(phase.tasks)) {
        phase.tasks.forEach((task) => {
          total++;
          if (checkedItems[task.id]) checked++;
        });
      }
    });
  }

  // Vendor checklist
  if (Array.isArray(plan.vendorChecklist)) {
    plan.vendorChecklist.forEach((vendor) => {
      total++;
      if (checkedItems[vendor.id]) checked++;
    });
  }

  const percentage = total > 0 ? Math.round((checked / total) * 100) : 0;

  return {
    totalItemsCount: total,
    checkedItemsCount: checked,
    progressPercentage: percentage
  };
}
