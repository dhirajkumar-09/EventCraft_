import { useState, useEffect } from 'react';

/**
 * Custom hook for state synced with window.localStorage
 * @template T
 * @param {string} key - localStorage key
 * @param {T} initialValue - Default fallback value
 * @returns {[T, React.Dispatch<React.SetStateAction<T>>]}
 */
export function usePersistentState(key, initialValue) {
  const [state, setState] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      if (state === null || state === undefined) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(state));
      }
    } catch {
      // Storage unavailable or quota exceeded
    }
  }, [key, state]);

  return [state, setState];
}

/**
 * Safely removes a list of keys from window.localStorage
 * @param {Array<string>} keys - Array of localStorage keys to remove
 */
export function removeStorageItems(keys) {
  try {
    keys.forEach((key) => localStorage.removeItem(key));
  } catch {
    // Graceful fallback if storage unavailable
  }
}
