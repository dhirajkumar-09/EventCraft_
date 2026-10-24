import React from 'react';
import {
  RotateCw,
  AlertTriangle,
  CheckCircle2,
  BellRing
} from 'lucide-react';
import { useEvent } from '../../context/useEvent.js';

export default function BackupPlanTab() {
  const { plan, regenerateSingleSection, regeneratingSection } = useEvent();

  if (!plan?.backupPlan) return null;

  const { backupPlan } = plan;
  const isRegenerating = regeneratingSection === 'backupPlan';

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Section Header with Regenerate */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-amber-200/50 dark:border-slate-800">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
            Section 7 of 7
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>Contingency & Emergency Risk Protocols</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Top 3 celebration risks, trigger indicators, and concrete mitigation plans.
          </p>
        </div>

        <button
          onClick={() => regenerateSingleSection('backupPlan')}
          disabled={isRegenerating}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-slate-700 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-slate-700 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin text-amber-600' : ''}`} />
          <span>{isRegenerating ? 'Assessing Risks...' : 'Regenerate Backup Plan'}</span>
        </button>
      </div>

      {/* Top 3 Risks Cards */}
      <div className="space-y-5">
        {(backupPlan || []).map((riskItem, idx) => {
          const isHigh = riskItem.severity === 'High';

          return (
            <div
              key={riskItem.id || idx}
              className={`p-6 rounded-2xl border transition-all ${
                isHigh
                  ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-300/80 dark:border-rose-900/60'
                  : 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-300/80 dark:border-amber-900/60'
              }`}
            >
              {/* Risk Title & Severity */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-xl ${
                      isHigh
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300'
                    }`}
                  >
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Risk Scenario 0{idx + 1}
                    </span>
                    <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                      {riskItem.risk}
                    </h4>
                  </div>
                </div>

                <span
                  className={`text-xs font-black px-3 py-1 rounded-full border ${
                    isHigh
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300 dark:border-rose-800'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                  }`}
                >
                  {riskItem.severity} Severity
                </span>
              </div>

              {/* Warning Trigger Signs */}
              <div className="p-3.5 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 mb-3.5">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 mb-1">
                  <BellRing className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>Early Trigger Indicators</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {riskItem.triggerSigns}
                </p>
              </div>

              {/* Mitigation Strategy */}
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-emerald-300/80 dark:border-emerald-900/60 shadow-xs">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 mb-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Actionable Mitigation Protocol</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                  {riskItem.mitigation}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
