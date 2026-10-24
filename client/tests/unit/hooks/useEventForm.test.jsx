import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { useEventForm } from '../../../src/hooks/useEventForm.js';
import { EventContext } from '../../../src/context/useEvent.js';

describe('useEventForm Hook', () => {
  const mockGeneratePlan = vi.fn();
  const wrapper = ({ children }) => (
    <EventContext.Provider value={{ generatePlan: mockGeneratePlan, isGenerating: false }}>
      {children}
    </EventContext.Provider>
  );

  it('initializes with empty form data and no errors', () => {
    const { result } = renderHook(() => useEventForm(), { wrapper });
    expect(result.current.formData.eventType).toBe('');
    expect(result.current.errors).toEqual({});
    expect(result.current.touched).toEqual({});
  });

  it('updates form fields and runs live validation on handleChange', () => {
    const { result } = renderHook(() => useEventForm(), { wrapper });

    act(() => {
      result.current.handleChange('city', 'Jaipur');
    });

    expect(result.current.formData.city).toBe('Jaipur');
    expect(result.current.errors.city).toBe('');
  });

  it('marks fields touched and validates on handleBlur', () => {
    const { result } = renderHook(() => useEventForm(), { wrapper });

    act(() => {
      result.current.handleBlur('city');
    });

    expect(result.current.touched.city).toBe(true);
    expect(result.current.errors.city).toBe('City or region is required');
  });

  it('populates fields when a preset is applied via handleApplyPreset', () => {
    const preset = {
      eventType: 'Wedding',
      eventDate: '2030-10-15',
      city: 'Udaipur',
      guestCount: 200,
      totalBudget: 1000000,
      venueType: 'palace',
      cuisineDiet: 'veg'
    };

    const { result } = renderHook(() => useEventForm(), { wrapper });

    act(() => {
      result.current.handleApplyPreset(preset);
    });

    expect(result.current.formData.city).toBe('Udaipur');
    expect(result.current.formData.eventType).toBe('Wedding');
  });

  it('prevents submission and highlights errors if required fields are missing', () => {
    const { result } = renderHook(() => useEventForm(), { wrapper });

    act(() => {
      result.current.handleSubmit();
    });

    expect(mockGeneratePlan).not.toHaveBeenCalled();
    expect(Object.keys(result.current.errors).length).toBeGreaterThan(0);
  });

  it('calls generatePlan when all fields are valid on submit', () => {
    const validData = {
      eventType: 'Wedding',
      eventDate: '2030-11-20',
      city: 'Jaipur',
      venueType: 'palace',
      guestCount: 200,
      totalBudget: 1500000,
      cuisineDiet: 'veg'
    };

    const { result } = renderHook(() => useEventForm(), { wrapper });

    act(() => {
      result.current.handleApplyPreset(validData);
    });

    act(() => {
      result.current.handleSubmit({ preventDefault: vi.fn() });
    });

    expect(mockGeneratePlan).toHaveBeenCalledWith(
      expect.objectContaining({
        eventType: 'Wedding',
        city: 'Jaipur'
      })
    );
  });

  it('resets form back to empty initial state on handleReset', () => {
    const preset = { eventType: 'Wedding', city: 'Jaipur' };
    const { result } = renderHook(() => useEventForm(preset), { wrapper });

    act(() => {
      result.current.handleReset();
    });

    expect(result.current.formData.city).toBe('');
    expect(result.current.formData.eventType).toBe('');
    expect(result.current.errors).toEqual({});
  });

  it('handles synthetic event objects with target.name and target.value in handleChange and handleBlur', () => {
    const { result } = renderHook(() => useEventForm(), { wrapper });

    act(() => {
      result.current.handleChange({ target: { name: 'city', value: 'Bangalore' } });
    });
    expect(result.current.formData.city).toBe('Bangalore');

    act(() => {
      result.current.handleBlur({ target: { name: 'city' } });
    });
    expect(result.current.touched.city).toBe(true);

    act(() => {
      result.current.handleCurrencyChange('USD', '$');
    });
    expect(result.current.formData.currency).toBe('USD');
    expect(result.current.formData.currencySymbol).toBe('$');
  });
});
