import React, { useState } from 'react';

const PALETTE = [
  '#b45309', // amber-700
  '#e11d48', // rose-600
  '#0d9488', // teal-600
  '#7c3aed', // violet-600
  '#d97706', // amber-600
  '#2563eb', // blue-600
  '#059669', // emerald-600
  '#c026d3', // fuchsia-600
  '#475569'  // slate-600 (contingency)
];

export default function DonutChart({ categories = [], totalBudget = 0, currencySymbol = '₹' }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const total = Number(totalBudget) || 1;
  const size = 260;
  const strokeWidth = 38;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Compute strokeDasharray and strokeDashoffset for each segment
  let accumulatedAngle = 0;
  const segments = categories.map((cat, idx) => {
    const fraction = total > 0 ? (Number(cat.amount) || 0) / total : 0;
    const strokeDasharray = `${fraction * circumference} ${circumference}`;
    const strokeDashoffset = -accumulatedAngle * circumference;
    accumulatedAngle += fraction;
    const color = PALETTE[idx % PALETTE.length];

    return {
      ...cat,
      color,
      strokeDasharray,
      strokeDashoffset,
      fraction
    };
  });

  const activeCategory = hoveredIndex !== null ? segments[hoveredIndex] : null;

  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-6 p-4 rounded-2xl bg-amber-50/50 dark:bg-slate-800/40 border border-amber-200/60 dark:border-slate-700/60">
      {/* SVG Donut Visualizer */}
      <div className="relative flex items-center justify-center shrink-0">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90 transition-transform duration-500"
          aria-label="Budget Allocation Donut Chart"
          role="img"
        >
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-amber-100 dark:text-slate-700"
          />

          {/* Slices */}
          {segments.map((seg, idx) => {
            const isHovered = hoveredIndex === idx;
            return (
              <circle
                key={idx}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke={seg.color}
                strokeWidth={isHovered ? strokeWidth + 6 : strokeWidth}
                strokeDasharray={seg.strokeDasharray}
                strokeDashoffset={seg.strokeDashoffset}
                className="transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                aria-label={`${seg.category}: ${seg.percentage}%`}
              />
            );
          })}
        </svg>

        {/* Center Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-4">
          {activeCategory ? (
            <>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate max-w-[140px]">
                {activeCategory.category}
              </span>
              <span className="text-lg font-black text-slate-900 dark:text-white">
                {currencySymbol}{Number(activeCategory.amount).toLocaleString()}
              </span>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                {activeCategory.percentage}% of total
              </span>
            </>
          ) : (
            <>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Total Budget
              </span>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                {currencySymbol}{Number(totalBudget).toLocaleString()}
              </span>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                100% Balanced
              </span>
            </>
          )}
        </div>
      </div>

      {/* Interactive Legend Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full">
        {segments.map((seg, idx) => {
          const isHovered = hoveredIndex === idx;
          return (
            <div
              key={idx}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                isHovered
                  ? 'bg-white dark:bg-slate-700 shadow-md border-amber-400 dark:border-amber-500 scale-[1.02]'
                  : 'bg-white/70 dark:bg-slate-800/60 border-slate-200/70 dark:border-slate-700/60 hover:bg-white dark:hover:bg-slate-700'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className="w-3.5 h-3.5 rounded-md shrink-0 shadow-xs"
                  style={{ backgroundColor: seg.color }}
                />
                <div className="truncate">
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {seg.category}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {seg.percentage}%
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0 font-bold text-xs text-slate-900 dark:text-white pl-2">
                {currencySymbol}{Number(seg.amount).toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
