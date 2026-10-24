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

export { INITIAL_FORM_STATE, validateAllFields, validateFormField };

/**
 * Manages form state, live validation, and submission for the Event Planner
 * @param {Object} [selectedPreset] - Preset to seed form
 * @returns {Object} Form state handlers and error maps
 */
export function useEventForm(selectedPreset) {
  const { generatePlan, isGenerating } = useEvent();
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [prevPreset, setPrevPreset] = useState(selectedPreset);

  // Sync state during render when a new preset is selected
  if (selectedPreset !== prevPreset) {
    setPrevPreset(selectedPreset);
    if (selectedPreset) {
      setFormData({
        ...INITIAL_FORM_STATE,
        ...selectedPreset,
        eventDate: selectedPreset.eventDate || '',
        specialRequests: selectedPreset.specialRequests || ''
      });
      setErrors({});
      setTouched({});
    }
  }

  const handleChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    const error = validateFormField(field, value);
    setErrors((prev) => ({ ...prev, [field]: error }));
  }, []);

  const handleBlur = useCallback((field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({
      ...prev,
      [field]: validateFormField(field, formData[field])
    }));
  }, [formData]);

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

  const handleReset = useCallback(() => {
    setFormData(INITIAL_FORM_STATE);
    setErrors({});
    setTouched({});
  }, []);

  return {
    formData,
    errors,
    touched,
    isGenerating,
    handleChange,
    handleBlur,
    handleSubmit,
    handleReset
  };
}
