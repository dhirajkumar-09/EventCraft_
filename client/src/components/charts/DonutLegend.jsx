import React from 'react';
import { formatCurrency } from '../../utils/currencyFormatter.js';

export default function DonutLegend({ segments, hoveredIndex, onHover, onLeave, currencySymbol }) {
  return (
    <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
      {segments.map((cat, idx) => {
        const isHovered = hoveredIndex === idx;
        const isContingency = cat.name.toLowerCase().includes('contingency');

        return (
          <div
            key={cat.id || idx}
            onMouseEnter={() => onHover(idx)}
            onMouseLeave={onLeave}
            className={`flex items-center justify-between p-2 rounded-xl transition-all cursor-pointer ${
              isHovered
                ? 'bg-amber-100/70 dark:bg-slate-700/80 shadow-xs'
                : 'hover:bg-amber-50 dark:hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-2.5 truncate">
              <span
                className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                style={{ backgroundColor: cat.color }}
              />
              <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                {cat.name}
                {isContingency && (
                  <span className="ml-1 text-[10px] text-amber-700 dark:text-amber-400 font-bold">
                    (10%)
                  </span>
                )}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="font-bold text-slate-900 dark:text-white">
                {formatCurrency(cat.amount, currencySymbol)}
              </span>
              <span className="text-[11px] font-semibold text-slate-400 w-8 text-right">
                {Math.round(cat.percentage || cat.fraction * 100)}%
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
