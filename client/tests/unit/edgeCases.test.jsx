import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import EventForm from '../../src/components/EventForm.jsx';
import { EventContext } from '../../src/context/useEvent.js';
import * as apiService from '../../src/services/apiService.js';
import { usePlanManager } from '../../src/hooks/usePlanManager.js';
import { renderHook, act } from '@testing-library/react';
import { mockPlanFixture, mockMetaFixture } from '../fixtures/mockPlan.js';

describe('Client Edge Cases & Error States', () => {
  it('disables submit button and shows loading spinner when isGenerating is true', () => {
    render(
      <EventContext.Provider value={{ generatePlan: vi.fn(), isGenerating: true }}>
        <EventForm />
      </EventContext.Provider>
    );

    const submitBtn = screen.getByRole('button', { name: /Crafting Master Plan/i });
    expect(submitBtn).toBeDisabled();
  });

  it('handles backend 500 server error and displays friendly error state in usePlanManager', async () => {
    vi.spyOn(apiService, 'generateEventPlanApi').mockRejectedValueOnce(
      new Error('Internal Server Error (500)')
    );

    const props = {
      plan: null,
      setPlan: vi.fn(),
      meta: null,
      setMeta: vi.fn(),
      setCheckedItems: vi.fn(),
      setActiveTab: vi.fn(),
      triggerCelebration: vi.fn(),
      chatHistory: [],
      setChatHistory: vi.fn(),
      customApiKey: ''
    };

    const { result } = renderHook(() => usePlanManager(props));

    await act(async () => {
      await result.current.generatePlan(mockMetaFixture);
    });

    expect(result.current.error).toBe('Internal Server Error (500)');
    expect(result.current.isLoading).toBe(false);
  });

  it('alerts and handles errors in regenerateSingleSection gracefully', async () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    vi.spyOn(apiService, 'regenerateSectionApi').mockRejectedValueOnce(
      new Error('Rate limit exceeded')
    );

    const props = {
      plan: mockPlanFixture,
      setPlan: vi.fn(),
      meta: mockMetaFixture,
      setMeta: vi.fn(),
      setCheckedItems: vi.fn(),
      setActiveTab: vi.fn(),
      triggerCelebration: vi.fn(),
      chatHistory: [],
      setChatHistory: vi.fn(),
      customApiKey: ''
    };

    const { result } = renderHook(() => usePlanManager(props));

    await act(async () => {
      await result.current.regenerateSingleSection('budget');
    });

    expect(alertMock).toHaveBeenCalledWith('Could not regenerate section: Rate limit exceeded');
    expect(result.current.regeneratingSection).toBeNull();

    alertMock.mockRestore();
  });

  it('records error assistant message in chat when chatWithPlannerApi fails', async () => {
    vi.spyOn(apiService, 'chatWithPlannerApi').mockRejectedValueOnce(
      new Error('Connection timed out')
    );

    const setChatHistoryMock = vi.fn();
    const props = {
      plan: mockPlanFixture,
      setPlan: vi.fn(),
      meta: mockMetaFixture,
      setMeta: vi.fn(),
      setCheckedItems: vi.fn(),
      setActiveTab: vi.fn(),
      triggerCelebration: vi.fn(),
      chatHistory: [],
      setChatHistory: setChatHistoryMock,
      customApiKey: ''
    };

    const { result } = renderHook(() => usePlanManager(props));

    await act(async () => {
      await result.current.sendChatMessage('Make budget lower');
    });

    // Should call setChatHistory with error message
    expect(setChatHistoryMock).toHaveBeenCalledTimes(2); // First user message, then error message
  });
});
