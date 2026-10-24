import React from 'react';
import { AlertCircle, MapPin, Users } from 'lucide-react';
import { VENUE_TYPES } from '../../config/constants.js';
import BudgetCurrencyInput from './BudgetCurrencyInput.jsx';

/**
 * Event Location, Venue, Guest Count and Budget inputs
 */
export default function EventLocationBudget({
  formData,
  errors,
  touched,
  onChange,
  onBlur,
  onCurrencyChange
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* City */}
      <div>
        <label
          htmlFor="city"
          className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2"
        >
          City / Region <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <input
            id="city"
            name="city"
            type="text"
            placeholder="e.g. Jaipur, Delhi, Mumbai, Udaipur..."
            value={formData.city || ''}
            onChange={onChange}
            onBlur={onBlur}
            className={`input-glass w-full rounded-xl px-4 py-3 text-sm focus:outline-hidden bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 ${
              touched.city && errors.city
                ? 'border-rose-500 dark:border-rose-500'
                : 'border-slate-300 dark:border-slate-700'
            }`}
            aria-invalid={Boolean(touched.city && errors.city)}
          />
          <MapPin className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
        </div>
        {touched.city && errors.city && (
          <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {errors.city}
          </p>
        )}
      </div>

      {/* Venue Type */}
      <div>
        <label
          htmlFor="venueType"
          className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2"
        >
          Venue Type <span className="text-rose-500">*</span>
        </label>
        <select
          id="venueType"
          name="venueType"
          value={formData.venueType || ''}
          onChange={onChange}
          onBlur={onBlur}
          className={`input-glass w-full rounded-xl px-4 py-3 text-sm focus:outline-hidden bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 ${
            touched.venueType && errors.venueType
              ? 'border-rose-500 dark:border-rose-500'
              : 'border-slate-300 dark:border-slate-700'
          }`}
          aria-invalid={Boolean(touched.venueType && errors.venueType)}
        >
          <option value="" className="bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400">
            Choose venue setting...
          </option>
          {VENUE_TYPES.map((venue) => (
            <option key={venue.value} value={venue.value} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
              {venue.label}
            </option>
          ))}
        </select>
        {touched.venueType && errors.venueType && (
          <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {errors.venueType}
          </p>
        )}
      </div>

      {/* Guest Count */}
      <div>
        <label
          htmlFor="guestCount"
          className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2"
        >
          Guest Count <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <input
            id="guestCount"
            name="guestCount"
            type="number"
            min="5"
            max="50000"
            placeholder="e.g. 250"
            value={formData.guestCount ?? ''}
            onChange={onChange}
            onBlur={onBlur}
            className={`input-glass w-full rounded-xl px-4 py-3 text-sm focus:outline-hidden bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 ${
              touched.guestCount && errors.guestCount
                ? 'border-rose-500 dark:border-rose-500'
                : 'border-slate-300 dark:border-slate-700'
            }`}
            aria-invalid={Boolean(touched.guestCount && errors.guestCount)}
          />
          <Users className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
        </div>
        {touched.guestCount && errors.guestCount && (
          <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {errors.guestCount}
          </p>
        )}
      </div>

      {/* Total Budget + Currency */}
      <BudgetCurrencyInput
        formData={formData}
        errors={errors}
        touched={touched}
        onChange={onChange}
        onBlur={onBlur}
        onCurrencyChange={onCurrencyChange}
      />
    </div>
  );
}
