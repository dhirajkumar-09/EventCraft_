import { describe, it, expect } from 'vitest';
import {
  validateFormField,
  validateAllFields,
  INITIAL_FORM_STATE
} from '../../../src/utils/formValidator.js';

describe('formValidator Utility', () => {
  it('provides complete frozen INITIAL_FORM_STATE with empty defaults', () => {
    expect(INITIAL_FORM_STATE.eventType).toBe('');
    expect(INITIAL_FORM_STATE.city).toBe('');
    expect(INITIAL_FORM_STATE.currency).toBe('INR');
    expect(INITIAL_FORM_STATE.currencySymbol).toBe('₹');
    expect(Object.isFrozen(INITIAL_FORM_STATE)).toBe(true);
  });

  describe('validateFormField', () => {
    it('validates eventType', () => {
      expect(validateFormField('eventType', '')).toBe('Please select an event type');
      expect(validateFormField('eventType', 'Wedding')).toBe('');
    });

    it('validates eventDate', () => {
      expect(validateFormField('eventDate', '')).toBe('Event date is required');
      expect(validateFormField('eventDate', '2020-01-01')).toBe('Event date cannot be in the past');
      expect(validateFormField('eventDate', '2030-01-01')).toBe('');
    });

    it('validates city', () => {
      expect(validateFormField('city', '')).toBe('City or region is required');
      expect(validateFormField('city', ' ')).toBe('City or region is required');
      expect(validateFormField('city', 'A')).toBe('City name must be at least 2 characters');
      expect(validateFormField('city', 'Jaipur')).toBe('');
    });

    it('validates venueType', () => {
      expect(validateFormField('venueType', '')).toBe('Please choose a venue type');
      expect(validateFormField('venueType', 'palace')).toBe('');
    });

    it('validates guestCount', () => {
      expect(validateFormField('guestCount', '')).toBe('Guest count is required');
      expect(validateFormField('guestCount', 2)).toBe('Guest count must be at least 5');
      expect(validateFormField('guestCount', 60000)).toBe('Guest count cannot exceed 50,000');
      expect(validateFormField('guestCount', 250)).toBe('');
    });

    it('validates totalBudget', () => {
      expect(validateFormField('totalBudget', '')).toBe('Total budget is required');
      expect(validateFormField('totalBudget', 500)).toBe('Minimum realistic celebration budget is 1,000');
      expect(validateFormField('totalBudget', 2000000000)).toBe('Budget cannot exceed 1,000,000,000');
      expect(validateFormField('totalBudget', 500000)).toBe('');
    });

    it('validates cuisineDiet', () => {
      expect(validateFormField('cuisineDiet', '')).toBe('Please select a cuisine & diet preference');
      expect(validateFormField('cuisineDiet', 'veg')).toBe('');
    });

    it('returns empty string for optional or unknown fields', () => {
      expect(validateFormField('themePreference', '')).toBe('');
      expect(validateFormField('specialRequests', 'Any')).toBe('');
      expect(validateFormField('unknownField', 'Value')).toBe('');
    });
  });

  describe('validateAllFields', () => {
    it('returns errors for all missing mandatory fields', () => {
      const errors = validateAllFields({});
      expect(Object.keys(errors)).toContain('eventType');
      expect(Object.keys(errors)).toContain('eventDate');
      expect(Object.keys(errors)).toContain('city');
      expect(Object.keys(errors)).toContain('venueType');
      expect(Object.keys(errors)).toContain('guestCount');
      expect(Object.keys(errors)).toContain('totalBudget');
      expect(Object.keys(errors)).toContain('cuisineDiet');
    });

    it('returns empty object when all fields are valid', () => {
      const validData = {
        eventType: 'Wedding',
        eventDate: '2030-10-15',
        city: 'Jaipur',
        venueType: 'palace',
        guestCount: 200,
        totalBudget: 1500000,
        cuisineDiet: 'veg'
      };
      const errors = validateAllFields(validData);
      expect(Object.keys(errors).length).toBe(0);
    });
  });
});
