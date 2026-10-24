import React from 'react';
import { AlertCircle, HelpCircle, Heart, Palette, Users, Utensils } from 'lucide-react';
import { CUISINE_DIETS } from '../../config/constants.js';

const TEXT_PREFERENCE_FIELDS = [
  {
    id: 'traditions',
    label: 'Cultural / Religious Traditions',
    placeholder: 'e.g. North Indian Vivah with Baraat & Sangeet, Punjabi Anand Karaj...',
    Icon: Heart
  },
  {
    id: 'ageGroup',
    label: 'Primary Age Group',
    placeholder: 'e.g. Multi-generational, Young Professionals, Kids & Families...',
    Icon: Users
  }
];

export default function EventPreferences({
  formData,
  errors,
  touched,
  onChange,
  onBlur
}) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Cuisine & Diet */}
        <div>
          <label
            htmlFor="cuisineDiet"
            className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2"
          >
            Cuisine & Diet <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <select
              id="cuisineDiet"
              name="cuisineDiet"
              value={formData.cuisineDiet || ''}
              onChange={onChange}
              onBlur={onBlur}
              className={`input-glass w-full rounded-xl px-4 py-3 text-sm focus:outline-hidden bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 ${
                touched.cuisineDiet && errors.cuisineDiet
                  ? 'border-rose-500 dark:border-rose-500'
                  : 'border-slate-300 dark:border-slate-700'
              }`}
              aria-invalid={Boolean(touched.cuisineDiet && errors.cuisineDiet)}
            >
              <option value="" className="bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400">
                Select catering style...
              </option>
              {CUISINE_DIETS.map((diet) => (
                <option key={diet.value} value={diet.value} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                  {diet.label}
                </option>
              ))}
            </select>
            <Utensils className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
          </div>
          {touched.cuisineDiet && errors.cuisineDiet && (
            <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {errors.cuisineDiet}
            </p>
          )}
        </div>

        {/* Theme or Style Preference */}
        <div>
          <label
            htmlFor="themePreference"
            className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2"
          >
            Theme / Style Preference{' '}
            <span className="text-slate-400 font-normal lowercase">(optional)</span>
          </label>
          <div className="relative">
            <input
              id="themePreference"
              name="themePreference"
              type="text"
              placeholder="e.g. Royal Marigold & Mirrorwork, Pastel Boho, Retro Bollywood..."
              value={formData.themePreference || ''}
              onChange={onChange}
              onBlur={onBlur}
              className="input-glass w-full rounded-xl px-4 py-3 text-sm border-slate-300 dark:border-slate-700 focus:outline-hidden bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
            />
            <Palette className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Cultural Traditions & Age Group */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {TEXT_PREFERENCE_FIELDS.map(({ id, label, placeholder, Icon }) => (
          <div key={id}>
            <label
              htmlFor={id}
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2"
            >
              {label}{' '}
              <span className="text-slate-400 font-normal lowercase">(optional)</span>
            </label>
            <div className="relative">
              <input
                id={id}
                name={id}
                type="text"
                placeholder={placeholder}
                value={formData[id] || ''}
                onChange={onChange}
                onBlur={onBlur}
                className="input-glass w-full rounded-xl px-4 py-3 text-sm border-slate-300 dark:border-slate-700 focus:outline-hidden bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
              />
              <Icon className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
            </div>
          </div>
        ))}
      </div>

      {/* Special Requests */}
      <div>
        <label
          htmlFor="specialRequests"
          className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2"
        >
          Special Requests / Specific Requirements{' '}
          <span className="text-slate-400 font-normal lowercase">(optional)</span>
        </label>
        <div className="relative">
          <textarea
            id="specialRequests"
            name="specialRequests"
            rows="2"
            placeholder="e.g. Authentic live jalebi counter, drone entry shot, wheelchair accessible ramps, eco-friendly favors..."
            value={formData.specialRequests || ''}
            onChange={onChange}
            onBlur={onBlur}
            className="input-glass w-full rounded-xl px-4 py-3 text-sm border-slate-300 dark:border-slate-700 focus:outline-hidden resize-none bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
          />
          <HelpCircle className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
