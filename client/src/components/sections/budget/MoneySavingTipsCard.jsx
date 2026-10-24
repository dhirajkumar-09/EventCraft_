import React from 'react';
import { TrendingDown } from 'lucide-react';

export default function MoneySavingTipsCard({ tips = [] }) {
  if (!tips || tips.length === 0) return null;

  return (
    <div className="card-glass rounded-2xl p-6 border border-emerald-200/80 dark:border-emerald-950/60 shadow-sm">
      <h4 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
        <TrendingDown className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        <span>3 Strategic Money-Saving Tips (Insider Planner Hacks)</span>
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tips.map((tip, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-emerald-50/50 dark:bg-slate-800/50 border border-emerald-200/50 dark:border-slate-700/60 flex flex-col justify-between"
          >
            <div className="flex items-center gap-2 mb-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs uppercase tracking-wider">
              <span className="w-5 h-5 rounded-full bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200 flex items-center justify-center text-[10px]">
                {idx + 1}
              </span>
              <span>Pro Tip {idx + 1}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {tip}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
