import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePersistentState } from '../../../src/hooks/usePersistentState.js';

describe('usePersistentState Hook', () => {
  const TEST_KEY = 'test_persistent_key';

  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes with default value when localStorage is empty', () => {
    const { result } = renderHook(() => usePersistentState(TEST_KEY, { count: 1 }));
    expect(result.current[0]).toEqual({ count: 1 });
  });

  it('initializes with stored value from localStorage when available', () => {
    localStorage.setItem(TEST_KEY, JSON.stringify({ count: 42 }));
    const { result } = renderHook(() => usePersistentState(TEST_KEY, { count: 1 }));
    expect(result.current[0]).toEqual({ count: 42 });
  });

  it('updates state and persists to localStorage on setState', () => {
    const { result } = renderHook(() => usePersistentState(TEST_KEY, 'initial'));

    act(() => {
      result.current[1]('updated');
    });

    expect(result.current[0]).toBe('updated');
    expect(JSON.parse(localStorage.getItem(TEST_KEY))).toBe('updated');
  });

  it('removes item from localStorage when set to null or undefined', () => {
    localStorage.setItem(TEST_KEY, JSON.stringify('something'));
    const { result } = renderHook(() => usePersistentState(TEST_KEY, 'something'));

    act(() => {
      result.current[1](null);
    });

    expect(result.current[0]).toBeNull();
    expect(localStorage.getItem(TEST_KEY)).toBeNull();
  });

  it('handles invalid stored JSON gracefully without crashing', () => {
    localStorage.setItem(TEST_KEY, 'invalid-json{{');
    const { result } = renderHook(() => usePersistentState(TEST_KEY, 'fallback'));
    expect(result.current[0]).toBe('fallback');
  });
});
