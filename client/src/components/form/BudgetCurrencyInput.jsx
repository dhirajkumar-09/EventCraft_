import React from 'react';
import { AlertCircle, DollarSign } from 'lucide-react';
import { CURRENCIES } from '../../config/constants.js';

/**
 * Budget and Currency compound input field
 */
export default function BudgetCurrencyInput({
  formData,
  errors,
  touched,
  onChange,
  onBlur,
  onCurrencyChange
}) {
  const hasError = Boolean(touched.totalBudget && errors.totalBudget);

  return (
    <div>
      <label
        htmlFor="totalBudget"
        className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2"
      >
        Total Budget <span className="text-rose-500">*</span>
      </label>
      <div className="flex rounded-xl overflow-hidden shadow-xs">
        <select
          value={formData.currency}
          onChange={(e) => {
            const selected = CURRENCIES.find((c) => c.code === e.target.value);
            if (selected) {
              onCurrencyChange(selected.code, selected.symbol);
            }
          }}
          aria-label="Currency"
          className="px-2.5 py-3 text-xs font-bold bg-amber-100 dark:bg-slate-800 text-amber-900 dark:text-amber-300 border-r border-amber-200 dark:border-slate-700 focus:outline-hidden cursor-pointer"
        >
          {CURRENCIES.map((curr) => (
            <option key={curr.code} value={curr.code}>
              {curr.code} ({curr.symbol})
            </option>
          ))}
        </select>

        <div className="relative flex-1">
          <input
            id="totalBudget"
            name="totalBudget"
            type="number"
            min="1000"
            step="5000"
            placeholder="e.g. 1500000"
            value={formData.totalBudget}
            onChange={onChange}
            onBlur={onBlur}
            className={`input-glass w-full rounded-r-xl px-4 py-3 text-sm focus:outline-hidden ${
              hasError
                ? 'border-rose-500 dark:border-rose-500'
                : 'border-slate-300 dark:border-slate-700'
            }`}
            aria-invalid={hasError}
          />
          <DollarSign className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
        </div>
      </div>
      {hasError && (
        <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {errors.totalBudget}
        </p>
      )}
    </div>
  );
}
