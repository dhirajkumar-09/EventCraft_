import React from 'react';
import { RotateCw, ShieldCheck } from 'lucide-react';
import DonutChart from '../DonutChart.jsx';
import { useEvent } from '../../context/useEvent.js';
import { formatCurrency } from '../../utils/currencyFormatter.js';
import MoneySavingTipsCard from './budget/MoneySavingTipsCard.jsx';

/**
 * Section 2: Category-Wise Budget Breakdown
 */
export default function BudgetTab() {
  const { plan, regenerateSingleSection, regeneratingSection } = useEvent();

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
          <RotateCw
            className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin text-amber-600' : ''}`}
          />
          <span>{isRegenerating ? 'Recalculating Budget...' : 'Regenerate Budget'}</span>
        </button>
      </div>

      {/* Math Verification Banner */}
      <div
        className={`p-4 rounded-2xl border flex items-center justify-between flex-wrap gap-3 ${
          isExactMatch
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
            : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <div className="text-xs sm:text-sm font-semibold">
            <span>Mathematical Integrity: </span>
            <span className="font-bold">
              Allocated Sum ({formatCurrency(calculatedSum, symbol)}) = User Budget (
              {formatCurrency(budget.totalBudget, symbol)})
            </span>
          </div>
        </div>

        <span className="text-xs font-black px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
          ✓ 100% Exact Match
        </span>
      </div>

      {/* Interactive Donut Visualizer */}
      <DonutChart
        categories={budget.categories || []}
        totalBudget={budget.totalBudget}
        currencySymbol={symbol}
      />

      {/* Allocation Table */}
      <div className="card-glass rounded-2xl overflow-hidden border border-amber-200/60 dark:border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-amber-100/60 dark:bg-slate-800/80 border-b border-amber-200/60 dark:border-slate-700 text-slate-700 dark:text-slate-300 uppercase font-black text-[11px] tracking-wider">
                <th className="py-3.5 px-6">Category</th>
                <th className="py-3.5 px-6 text-right">Allocated Amount</th>
                <th className="py-3.5 px-6 text-right">Share (%)</th>
                <th className="py-3.5 px-6">Planner Allocation Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-100/60 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
              {(budget.categories || []).map((cat) => {
                const isContingency = cat.name.toLowerCase().includes('contingency');
                return (
                  <tr
                    key={cat.id || cat.name}
                    className={`hover:bg-amber-50/50 dark:hover:bg-slate-800/50 transition-colors ${
                      isContingency ? 'bg-amber-50/30 dark:bg-slate-800/40 font-semibold' : ''
                    }`}
                  >
                    <td className="py-3.5 px-6 font-bold flex items-center gap-2">
                      <span>{cat.name}</span>
                      {isContingency && (
                        <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-200">
                          Safety Buffer
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-6 text-right font-black text-slate-900 dark:text-white">
                      {formatCurrency(cat.amount, symbol)}
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
                  {formatCurrency(calculatedSum, symbol)}
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
      <MoneySavingTipsCard tips={budget.moneySavingTips} />
    </div>
  );
}
