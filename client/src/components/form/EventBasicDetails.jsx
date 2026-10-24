import React from 'react';
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import { EVENT_TYPES } from '../../config/constants.js';

export default function EventBasicDetails({
  formData,
  errors,
  touched,
  daysRemaining,
  onChange,
  onBlur
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* Event Type */}
      <div>
        <label
          htmlFor="eventType"
          className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2"
        >
          Event Type <span className="text-rose-500">*</span>
        </label>
        <select
          id="eventType"
          name="eventType"
          value={formData.eventType || ''}
          onChange={onChange}
          onBlur={onBlur}
          className={`input-glass w-full rounded-xl px-4 py-3 text-sm focus:outline-hidden bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 ${
            touched.eventType && errors.eventType
              ? 'border-rose-500 dark:border-rose-500'
              : 'border-slate-300 dark:border-slate-700'
          }`}
          aria-invalid={Boolean(touched.eventType && errors.eventType)}
        >
          <option
            value=""
            className="bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400"
          >
            Choose event type (e.g. Wedding, Birthday)...
          </option>
          {EVENT_TYPES.map((type) => (
            <option
              key={type}
              value={type}
              className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
            >
              {type}
            </option>
          ))}
        </select>
        {touched.eventType && errors.eventType && (
          <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {errors.eventType}
          </p>
        )}
      </div>

      {/* Event Date with Live Days Counter */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label
            htmlFor="eventDate"
            className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
          >
            Target Event Date <span className="text-rose-500">*</span>
          </label>
          {daysRemaining !== null && (
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                daysRemaining > 0
                  ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300'
                  : daysRemaining === 0
                    ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-300'
              }`}
            >
              <Clock className="w-3 h-3" />
              {daysRemaining > 0
                ? `${daysRemaining} days remaining`
                : daysRemaining === 0
                  ? 'Today is the day!'
                  : 'Date is in the past'}
            </span>
          )}
        </div>
        <div className="relative">
          <input
            id="eventDate"
            name="eventDate"
            type="date"
            value={formData.eventDate || ''}
            onChange={onChange}
            onBlur={onBlur}
            className={`input-glass w-full rounded-xl px-4 py-3 text-sm focus:outline-hidden bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 ${
              touched.eventDate && errors.eventDate
                ? 'border-rose-500 dark:border-rose-500'
                : 'border-slate-300 dark:border-slate-700'
            }`}
            aria-invalid={Boolean(touched.eventDate && errors.eventDate)}
          />
          <Calendar className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
        </div>
        {touched.eventDate && errors.eventDate && (
          <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {errors.eventDate}
          </p>
        )}
      </div>
    </div>
  );
}
