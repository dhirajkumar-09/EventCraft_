/**
 * Custom Hook for Event Planning Form State and User Interactions
 */
import { useCallback, useState } from 'react';
import { useEvent } from '../context/useEvent.js';
import {
  INITIAL_FORM_STATE,
  validateAllFields,
  validateFormField
} from '../utils/formValidator.js';
import { calculateDaysRemaining } from '../utils/sampleData.js';

export { INITIAL_FORM_STATE, validateAllFields, validateFormField };

/**
 * Manages form state, live validation, and submission for the Event Planner
 * @param {Object} [selectedPreset] - Preset to seed form
 * @param {Function} [onClearPreset] - Callback to clear selected preset in parent
 * @returns {Object} Form state handlers and error maps
 */
export function useEventForm(selectedPreset, onClearPreset) {
  const { generatePlan, isGenerating } = useEvent();
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [prevPreset, setPrevPreset] = useState(selectedPreset);

  // Sync state during render when a new preset prop is passed
  if (selectedPreset !== prevPreset) {
    setPrevPreset(selectedPreset);
    if (selectedPreset) {
      const data = selectedPreset.data || selectedPreset;
      setFormData({
        ...INITIAL_FORM_STATE,
        ...data,
        eventDate: data.eventDate || '',
        specialRequests: data.specialRequests || ''
      });
      setErrors({});
      setTouched({});
    }
  }

  const handleChange = useCallback((eOrField, directValue) => {
    let field;
    let value;
    if (eOrField && eOrField.target) {
      field = eOrField.target.name;
      value = eOrField.target.value;
    } else {
      field = eOrField;
      value = directValue;
    }

    setFormData((prev) => ({ ...prev, [field]: value }));
    const error = validateFormField(field, value);
    setErrors((prev) => ({ ...prev, [field]: error }));
  }, []);

  const handleBlur = useCallback((eOrField) => {
    const field = eOrField?.target ? eOrField.target.name : eOrField;
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({
      ...prev,
      [field]: validateFormField(field, formData[field])
    }));
  }, [formData]);

  const handleCurrencyChange = useCallback((currency, currencySymbol) => {
    setFormData((prev) => ({ ...prev, currency, currencySymbol }));
  }, []);

  const handleApplyPreset = useCallback((preset) => {
    const data = preset?.data || preset || {};
    setFormData({
      ...INITIAL_FORM_STATE,
      ...data,
      eventDate: data.eventDate || '',
      specialRequests: data.specialRequests || ''
    });
    setErrors({});
    setTouched({});
  }, []);

  const handleReset = useCallback(() => {
    setFormData(INITIAL_FORM_STATE);
    setErrors({});
    setTouched({});
    if (typeof onClearPreset === 'function') {
      onClearPreset();
    }
  }, [onClearPreset]);

  const handleSubmit = useCallback((e) => {
    if (e?.preventDefault) e.preventDefault();

    const allTouched = Object.keys(INITIAL_FORM_STATE).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
    );
    setTouched(allTouched);

    const validationErrors = validateAllFields(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      const firstErrorKey = Object.keys(validationErrors)[0];
      const el = document.querySelector(`[name="${firstErrorKey}"]`);
      if (el) el.focus();
      return;
    }

    generatePlan(formData);
  }, [formData, generatePlan]);

  const daysRemaining = calculateDaysRemaining(formData.eventDate);

  return {
    formData,
    errors,
    touched,
    daysRemaining,
    isLoading: Boolean(isGenerating),
    isGenerating: Boolean(isGenerating),
    handleChange,
    handleBlur,
    handleCurrencyChange,
    handleApplyPreset,
    handleClearForm: handleReset,
    handleSubmit,
    handleReset
  };
}
