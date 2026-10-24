import React, { useState, useMemo } from 'react';
import { DONUT_PALETTE } from '../config/constants.js';
import DonutCenterBadge from './charts/DonutCenterBadge.jsx';
import DonutLegend from './charts/DonutLegend.jsx';

/**
 * Interactive SVG Donut Chart Visualizer
 * Renders proportional budget allocation rings with hover inspection
 */
export default function DonutChart({ categories = [], totalBudget = 0, currencySymbol = '₹' }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const total = Number(totalBudget) || 1;
  const size = 260;
  const strokeWidth = 38;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Pure segment calculation wrapped in useMemo
  const segments = useMemo(() => {
    return categories.map((cat, idx) => {
      const fraction = total > 0 ? (Number(cat.amount) || 0) / total : 0;
      const priorFraction = categories
        .slice(0, idx)
        .reduce((sum, item) => sum + (total > 0 ? (Number(item.amount) || 0) / total : 0), 0);
      const strokeDasharray = `${fraction * circumference} ${circumference}`;
      const strokeDashoffset = -priorFraction * circumference;
      const color = DONUT_PALETTE[idx % DONUT_PALETTE.length];

      return {
        ...cat,
        color,
        strokeDasharray,
        strokeDashoffset,
        fraction
      };
    });
  }, [categories, total, circumference]);

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
            className="text-amber-100/60 dark:text-slate-700/40"
          />

          {/* Interactive Segments */}
          {segments.map((seg, idx) => {
            const isHovered = hoveredIndex === idx;
            return (
              <circle
                key={seg.id || idx}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke={seg.color}
                strokeWidth={isHovered ? strokeWidth + 6 : strokeWidth}
                strokeDasharray={seg.strokeDasharray}
                strokeDashoffset={seg.strokeDashoffset}
                strokeLinecap="butt"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="transition-all duration-300 cursor-pointer"
                style={{ opacity: hoveredIndex !== null && !isHovered ? 0.45 : 1 }}
              />
            );
          })}
        </svg>

        {/* Center Hover Label */}
        <DonutCenterBadge
          activeCategory={activeCategory}
          totalBudget={totalBudget}
          currencySymbol={currencySymbol}
        />
      </div>

      {/* Legend & Breakdown Table */}
      <DonutLegend
        segments={segments}
        hoveredIndex={hoveredIndex}
        onHover={setHoveredIndex}
        onLeave={() => setHoveredIndex(null)}
        currencySymbol={currencySymbol}
      />
    </div>
  );
}
