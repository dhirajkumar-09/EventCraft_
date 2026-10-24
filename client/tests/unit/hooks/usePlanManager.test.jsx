import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePlanManager } from '../../../src/hooks/usePlanManager.js';
import * as apiService from '../../../src/services/apiService.js';
import { mockPlanFixture, mockMetaFixture } from '../../fixtures/mockPlan.js';

describe('usePlanManager Hook', () => {
  let props;

  beforeEach(() => {
    props = {
      plan: mockPlanFixture,
      setPlan: vi.fn(),
      meta: mockMetaFixture,
      setMeta: vi.fn(),
      setCheckedItems: vi.fn(),
      setActiveTab: vi.fn(),
      triggerCelebration: vi.fn(),
      chatHistory: [],
      setChatHistory: vi.fn(),
      customApiKey: 'test-key'
    };
  });

  it('manages generatePlan flow successfully', async () => {
    vi.spyOn(apiService, 'generateEventPlanApi').mockResolvedValueOnce({
      plan: mockPlanFixture,
      meta: mockMetaFixture
    });

    const { result } = renderHook(() => usePlanManager(props));

    await act(async () => {
      await result.current.generatePlan(mockMetaFixture);
    });

    expect(props.setPlan).toHaveBeenCalledWith(mockPlanFixture);
    expect(props.setMeta).toHaveBeenCalledWith(mockMetaFixture);
    expect(props.setCheckedItems).toHaveBeenCalledWith({});
    expect(props.setActiveTab).toHaveBeenCalledWith('overview');
    expect(props.triggerCelebration).toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('handles error in generatePlan gracefully', async () => {
    vi.spyOn(apiService, 'generateEventPlanApi').mockRejectedValueOnce(
      new Error('API Timeout')
    );

    const { result } = renderHook(() => usePlanManager(props));

    await act(async () => {
      await result.current.generatePlan(mockMetaFixture);
    });

    expect(result.current.error).toBe('API Timeout');
    expect(result.current.isLoading).toBe(false);
  });

  it('regenerates single section and triggers celebration', async () => {
    const updatedBudget = { ...mockPlanFixture.budget, totalBudget: 2000000 };
    vi.spyOn(apiService, 'regenerateSectionApi').mockResolvedValueOnce(updatedBudget);

    const { result } = renderHook(() => usePlanManager(props));

    await act(async () => {
      await result.current.regenerateSingleSection('budget');
    });

    expect(props.setPlan).toHaveBeenCalled();
    expect(props.triggerCelebration).toHaveBeenCalled();
    expect(result.current.regeneratingSection).toBeNull();
  });

  it('handles chat with planner and updates conversation history', async () => {
    vi.spyOn(apiService, 'chatWithPlannerApi').mockResolvedValueOnce({
      replyMessage: 'Plan updated with kid-friendly activities!',
      updatedPlan: { ...mockPlanFixture }
    });

    const { result } = renderHook(() => usePlanManager(props));

    await act(async () => {
      await result.current.sendChatMessage('Make it kid friendly');
    });

    expect(props.setChatHistory).toHaveBeenCalled();
    expect(props.setPlan).toHaveBeenCalled();
  });

  it('ignores empty chat message', async () => {
    const spy = vi.spyOn(apiService, 'chatWithPlannerApi');
    const { result } = renderHook(() => usePlanManager(props));

    await act(async () => {
      await result.current.sendChatMessage('   ');
    });

    expect(spy).not.toHaveBeenCalled();
  });
});
