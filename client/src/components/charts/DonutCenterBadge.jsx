import React from 'react';
import { formatCurrency } from '../../utils/currencyFormatter.js';

export default function DonutCenterBadge({ activeCategory, totalBudget, currencySymbol }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 pointer-events-none">
      {activeCategory ? (
        <>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {activeCategory.name}
          </span>
          <span className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
            {Math.round(activeCategory.percentage || activeCategory.fraction * 100)}%
          </span>
          <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
            {formatCurrency(activeCategory.amount, currencySymbol)}
          </span>
        </>
      ) : (
        <>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Total Budget
          </span>
          <span className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
            {formatCurrency(totalBudget, currencySymbol)}
          </span>
          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            100% Balanced
          </span>
        </>
      )}
    </div>
  );
}
