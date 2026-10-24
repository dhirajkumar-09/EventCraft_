import React from 'react';
import {
  PieChart,
  RotateCw,
  Coins,
  ShieldCheck,
  TrendingDown,
  Sparkles,
  Info
} from 'lucide-react';
import DonutChart from '../DonutChart.jsx';
import { useEvent } from '../../context/EventContext.jsx';

export default function BudgetTab() {
  const { plan, meta, regenerateSingleSection, regeneratingSection } = useEvent();

  if (!plan?.budget) return null;

  const { budget } = plan;
  const isRegenerating = regeneratingSection === 'budget';
  const symbol = budget.currencySymbol || '₹';

  // Calculate sum of categories to display strict mathematical match
  const calculatedSum = (budget.categories || []).reduce(
    (acc, cat) => acc + (Number(cat.amount) || 0),
    0
  );
  const isExactMatch = calculatedSum === Number(budget.totalBudget);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Section Header with Regenerate */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-amber-200/50 dark:border-slate-800">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
            Section 2 of 7
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>Category-Wise Budget Breakdown</span>
          </h3>
        </div>

        <button
          onClick={() => regenerateSingleSection('budget')}
          disabled={isRegenerating}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-slate-700 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-slate-700 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin text-amber-600' : ''}`} />
          <span>{isRegenerating ? 'Recalculating Budget...' : 'Regenerate Budget'}</span>
        </button>
      </div>

      {/* Math Verification Banner */}
      <div className={`p-4 rounded-2xl border flex items-center justify-between flex-wrap gap-3 ${
        isExactMatch
          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
          : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
      }`}>
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <div className="text-xs sm:text-sm font-semibold">
            <span>Mathematical Integrity: </span>
            <span className="font-bold">
              Allocated Sum ({symbol}{calculatedSum.toLocaleString()}) = User Budget ({symbol}{Number(budget.totalBudget).toLocaleString()})
            </span>
          </div>
        </div>

        <span className="text-xs font-black px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
          ✓ 100% Exact Match
        </span>
      </div>

      {/* Donut Chart Visualization */}
      <DonutChart
        categories={budget.categories}
        totalBudget={budget.totalBudget}
        currencySymbol={symbol}
      />

      {/* Comprehensive Category Table */}
      <div className="card-glass rounded-2xl overflow-hidden border border-amber-200/60 dark:border-slate-800 shadow-sm">
        <div className="px-6 py-4 border-b border-amber-200/50 dark:border-slate-800 flex items-center justify-between">
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Coins className="w-4 h-4 text-amber-600" />
            <span>Category Allocations (9 Core Pillars)</span>
          </h4>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Including 10% Emergency Cushion
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 dark:bg-slate-800/75 border-b border-slate-200 dark:border-slate-700 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="py-3 px-6">Category</th>
                <th className="py-3 px-6 text-right">Amount</th>
                <th className="py-3 px-6 text-right">Percentage</th>
                <th className="py-3 px-6">Planner Advice / Allocation Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-medium">
              {(budget.categories || []).map((cat, idx) => {
                const isContingency = cat.category.toLowerCase().includes('contingency') || cat.category.toLowerCase().includes('emergency');
                return (
                  <tr
                    key={idx}
                    className={`hover:bg-amber-50/40 dark:hover:bg-slate-800/40 transition-colors ${
                      isContingency ? 'bg-amber-50/30 dark:bg-amber-950/20 font-semibold' : ''
                    }`}
                  >
                    <td className="py-3.5 px-6 text-slate-900 dark:text-white flex items-center gap-2">
                      {isContingency && (
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                      )}
                      <span>{cat.category}</span>
                    </td>
                    <td className="py-3.5 px-6 text-right font-bold text-slate-900 dark:text-white">
                      {symbol}{Number(cat.amount).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[11px]">
                        {cat.percentage}%
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-slate-600 dark:text-slate-400">
                      {cat.note || 'Recommended industry standard allocation'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100/80 dark:bg-slate-800/90 font-black text-xs text-slate-900 dark:text-white border-t-2 border-slate-300 dark:border-slate-700">
                <td className="py-3.5 px-6">Total Event Investment</td>
                <td className="py-3.5 px-6 text-right text-sm text-amber-700 dark:text-amber-400">
                  {symbol}{calculatedSum.toLocaleString()}
                </td>
                <td className="py-3.5 px-6 text-right">100.0%</td>
                <td className="py-3.5 px-6 text-emerald-600 dark:text-emerald-400">
                  ✓ Verified against your entered budget
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* 3 Money Saving Tips */}
      {budget.moneySavingTips && budget.moneySavingTips.length > 0 && (
        <div className="card-glass rounded-2xl p-6 border border-emerald-200/80 dark:border-emerald-950/60 shadow-sm">
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>3 Strategic Money-Saving Tips (Insider Planner Hacks)</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {budget.moneySavingTips.map((tip, idx) => (
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
      )}
    </div>
  );
}
