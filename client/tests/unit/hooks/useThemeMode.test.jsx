import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useThemeMode } from '../../../src/hooks/useThemeMode.js';
import { STORAGE_KEYS } from '../../../src/config/constants.js';

describe('useThemeMode Hook', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    document.body.classList.remove('dark');
  });

  it('defaults to light mode when no preference stored', () => {
    const { result } = renderHook(() => useThemeMode());
    expect(result.current.themeMode).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('initializes to dark if stored in localStorage', () => {
    localStorage.setItem(STORAGE_KEYS.THEME, 'dark');
    const { result } = renderHook(() => useThemeMode());
    expect(result.current.themeMode).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(document.documentElement.style.colorScheme).toBe('dark');
  });

  it('toggles theme mode between light and dark', () => {
    const { result } = renderHook(() => useThemeMode());

    act(() => {
      result.current.toggleTheme();
    });
    expect(result.current.themeMode).toBe('dark');
    expect(localStorage.getItem(STORAGE_KEYS.THEME)).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    act(() => {
      result.current.toggleTheme();
    });
    expect(result.current.themeMode).toBe('light');
    expect(localStorage.getItem(STORAGE_KEYS.THEME)).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('respects system prefers-color-scheme dark if no storage entry exists', () => {
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query.includes('dark'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn()
    }));

    const { result } = renderHook(() => useThemeMode());
    expect(result.current.themeMode).toBe('dark');
  });
});
