import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EventForm from '../../../src/components/EventForm.jsx';
import BudgetCurrencyInput from '../../../src/components/form/BudgetCurrencyInput.jsx';
import FormPresetsBar from '../../../src/components/form/FormPresetsBar.jsx';
import { EventContext } from '../../../src/context/useEvent.js';
import { SAMPLE_PRESETS } from '../../../src/utils/sampleData.js';

describe('Form Components', () => {
  describe('FormPresetsBar', () => {
    it('renders preset buttons and triggers onApplyPreset', () => {
      const onApply = vi.fn();
      render(
        <FormPresetsBar
          onApplyPreset={onApply}
          onClearForm={vi.fn()}
          isFormPristine={true}
        />
      );

      expect(screen.getByText('Instant Demo Presets')).toBeInTheDocument();
      const firstPreset = SAMPLE_PRESETS[0];
      const btn = screen.getByText(firstPreset.badge);
      expect(btn).toBeInTheDocument();

      fireEvent.click(btn);
      expect(onApply).toHaveBeenCalledWith(firstPreset);
    });
  });

  describe('BudgetCurrencyInput', () => {
    it('renders currency selector and total budget input with error state', () => {
      const onChange = vi.fn();
      const onCurrencyChange = vi.fn();

      render(
        <BudgetCurrencyInput
          formData={{ currency: 'INR', totalBudget: '' }}
          errors={{ totalBudget: 'Total budget is required' }}
          touched={{ totalBudget: true }}
          onChange={onChange}
          onBlur={vi.fn()}
          onCurrencyChange={onCurrencyChange}
        />
      );

      expect(screen.getByLabelText('Currency')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('e.g. 1500000')).toBeInTheDocument();
      expect(screen.getByText('Total budget is required')).toBeInTheDocument();

      fireEvent.change(screen.getByLabelText('Currency'), { target: { value: 'USD' } });
      expect(onCurrencyChange).toHaveBeenCalledWith('USD', '$');
    });
  });

  describe('EventForm', () => {
    it('renders full planner intake form and resets inputs', () => {
      const mockGeneratePlan = vi.fn();
      render(
        <EventContext.Provider value={{ generatePlan: mockGeneratePlan, isGenerating: false }}>
          <EventForm />
        </EventContext.Provider>
      );

      expect(screen.getByText('Instant Demo Presets')).toBeInTheDocument();
      expect(screen.getByText('Generate Master Event Plan')).toBeInTheDocument();

      // Click a preset button to fill form
      const weddingPresetBtn = screen.getByText(SAMPLE_PRESETS[0].badge);
      fireEvent.click(weddingPresetBtn);

      expect(screen.getByDisplayValue('Jaipur')).toBeInTheDocument();

      // Clear button appears when not pristine
      const clearBtn = screen.getByTitle('Clear all fields');
      expect(clearBtn).toBeInTheDocument();
      fireEvent.click(clearBtn);

      expect(screen.getByPlaceholderText('e.g. 250')).toHaveValue(null);
    });
  });
});
