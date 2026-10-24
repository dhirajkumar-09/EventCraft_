/**
 * Form Validation and Defaults Utility for EventCraft AI
 */
import { calculateDaysRemaining } from './sampleData.js';

export const INITIAL_FORM_STATE = Object.freeze({
  eventType: '',
  eventDate: '',
  city: '',
  venueType: '',
  guestCount: '',
  totalBudget: '',
  currency: 'INR',
  currencySymbol: '₹',
  cuisineDiet: '',
  themePreference: '',
  traditions: '',
  ageGroup: '',
  specialRequests: ''
});

/**
 * Validates an isolated form field value against business constraints
 * @param {string} name - Field key
 * @param {*} value - Field value
 * @returns {string} Error message or empty string
 */
export function validateFormField(name, value) {
  switch (name) {
    case 'eventType':
      return !value ? 'Please select an event type' : '';
    case 'eventDate': {
      if (!value) return 'Event date is required';
      const days = calculateDaysRemaining(value);
      if (days !== null && days < 0) return 'Event date cannot be in the past';
      return '';
    }
    case 'city':
      if (!value || !value.trim()) return 'City or region is required';
      if (value.trim().length < 2) return 'City name must be at least 2 characters';
      return '';
    case 'venueType':
      return !value ? 'Please choose a venue type' : '';
    case 'guestCount': {
      if (!value && value !== 0) return 'Guest count is required';
      const count = Number(value);
      if (isNaN(count) || count < 5) return 'Guest count must be at least 5';
      if (count > 50000) return 'Guest count cannot exceed 50,000';
      return '';
    }
    case 'totalBudget': {
      if (!value && value !== 0) return 'Total budget is required';
      const budget = Number(value);
      if (isNaN(budget) || budget < 1000) return 'Minimum realistic celebration budget is 1,000';
      if (budget > 1000000000) return 'Budget cannot exceed 1,000,000,000';
      return '';
    }
    case 'cuisineDiet':
      return !value ? 'Please select a cuisine & diet preference' : '';
    default:
      return '';
  }
}

/**
 * Validates all required form fields for completeness
 * @param {Object} data - Form data
 * @returns {Record<string, string>} Map of field errors
 */
export function validateAllFields(data) {
  const errors = {};
  const requiredFields = [
    'eventType',
    'eventDate',
    'city',
    'venueType',
    'guestCount',
    'totalBudget',
    'cuisineDiet'
  ];

  requiredFields.forEach((field) => {
    const error = validateFormField(field, data[field]);
    if (error) errors[field] = error;
  });

  return errors;
}
