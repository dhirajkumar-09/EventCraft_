import React from 'react';
import { Sparkles, RotateCw } from 'lucide-react';
import { useEventForm } from '../hooks/useEventForm.js';
import FormPresetsBar from './form/FormPresetsBar.jsx';
import EventBasicDetails from './form/EventBasicDetails.jsx';
import EventLocationBudget from './form/EventLocationBudget.jsx';
import EventPreferences from './form/EventPreferences.jsx';

/**
 * Event Planning User Input Form
 * Collects celebration parameters, executes inline validation, and triggers AI planning
 */
export default function EventForm({ presetData, onClearPreset }) {
  const {
    formData,
    errors,
    touched,
    daysRemaining,
    isLoading,
    handleChange,
    handleBlur,
    handleCurrencyChange,
    handleApplyPreset,
    handleClearForm,
    handleSubmit
  } = useEventForm(presetData, onClearPreset);

  const isFormPristine = !formData.eventType && !formData.city && !formData.totalBudget;

  return (
    <div className="card-glass rounded-3xl p-6 sm:p-8 lg:p-10 mb-10 border border-amber-200/70 dark:border-slate-800 shadow-xl relative overflow-hidden">
      {/* Decorative Top Accent Glow */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-rose-500 to-amber-600" />

      {/* Preset Pills Bar */}
      <FormPresetsBar
        onApplyPreset={handleApplyPreset}
        onClearForm={handleClearForm}
        isFormPristine={isFormPristine}
      />

      {/* Form Form Fields */}
      <form onSubmit={handleSubmit} className="mt-8 space-y-6" noValidate>
        {/* Step 1: Basic Event Details */}
        <EventBasicDetails
          formData={formData}
          errors={errors}
          touched={touched}
          daysRemaining={daysRemaining}
          onChange={handleChange}
          onBlur={handleBlur}
        />

        {/* Step 2: Location, Venue & Budget */}
        <EventLocationBudget
          formData={formData}
          errors={errors}
          touched={touched}
          onChange={handleChange}
          onBlur={handleBlur}
          onCurrencyChange={handleCurrencyChange}
        />

        {/* Step 3: Catering & Custom Preferences */}
        <EventPreferences
          formData={formData}
          errors={errors}
          touched={touched}
          onChange={handleChange}
          onBlur={handleBlur}
        />

        {/* Submit Button */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-amber-200/60 dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            All 7 sections & 100% budget math are validated before generating.
          </p>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-extrabold text-sm text-white bg-gradient-to-r from-amber-600 via-rose-600 to-amber-700 hover:from-amber-700 hover:to-rose-700 shadow-md hover:shadow-lg disabled:opacity-60 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <>
                <RotateCw className="w-4 h-4 animate-spin" />
                <span>Crafting Master Plan...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Master Event Plan</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
