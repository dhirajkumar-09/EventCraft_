import React from 'react';
import { Sparkles, RotateCcw } from 'lucide-react';
import { SAMPLE_PRESETS } from '../../utils/sampleData.js';

export default function FormPresetsBar({ onApplyPreset, onClearForm, isFormPristine }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-amber-200/60 dark:border-slate-800">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Instant Demo Presets
          </span>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Try 1-click curated Indian celebrations or enter your own below
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {SAMPLE_PRESETS.map((preset) => (
          <button
            key={preset.name}
            type="button"
            onClick={() => onApplyPreset(preset)}
            className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-slate-800 border border-amber-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-amber-400 hover:text-amber-700 dark:hover:text-amber-300 hover:shadow-xs transition-all cursor-pointer"
          >
            {preset.badge}
          </button>
        ))}

        {!isFormPristine && (
          <button
            type="button"
            onClick={onClearForm}
            className="px-3 py-1.5 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors flex items-center gap-1 cursor-pointer"
            title="Clear all fields"
          >
            <RotateCcw className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
