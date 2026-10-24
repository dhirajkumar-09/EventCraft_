import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { EventProvider } from '../../../src/context/EventContext.jsx';
import { useEvent } from '../../../src/context/useEvent.js';
import * as apiService from '../../../src/services/apiService.js';
import { STORAGE_KEYS } from '../../../src/config/constants.js';

function TestConsumer() {
  const {
    checkedItems,
    toggleCheckItem,
    resetProgress,
    saveCustomApiKey,
    customApiKey,
    triggerCelebration,
    toggleTheme,
    themeMode
  } = useEvent();

  return (
    <div>
      <span data-testid="theme">{themeMode}</span>
      <span data-testid="apiKey">{customApiKey}</span>
      <span data-testid="checked">{JSON.stringify(checkedItems)}</span>

      <button onClick={() => toggleCheckItem('item-1')}>Toggle Item 1</button>
      <button onClick={resetProgress}>Reset All</button>
      <button onClick={() => saveCustomApiKey('  AIzaNewKey999  ')}>Save Key</button>
      <button onClick={() => saveCustomApiKey('')}>Clear Key</button>
      <button onClick={triggerCelebration}>Celebrate</button>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}

describe('EventContext Provider Unit Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('manages check items, reset, and custom API key persistence', async () => {
    vi.spyOn(apiService, 'fetchServerStatusApi').mockRejectedValue(new Error('Network down'));
    vi.spyOn(console, 'warn').mockImplementation(() => {});

    render(
      <EventProvider>
        <TestConsumer />
      </EventProvider>
    );

    // Initial checked state
    expect(screen.getByTestId('checked').textContent).toBe('{}');

    // Toggle item 1
    fireEvent.click(screen.getByText('Toggle Item 1'));
    expect(screen.getByTestId('checked').textContent).toContain('"item-1":true');

    // Toggle item 1 off
    fireEvent.click(screen.getByText('Toggle Item 1'));
    expect(screen.getByTestId('checked').textContent).toContain('"item-1":false');

    // Reset items
    fireEvent.click(screen.getByText('Reset All'));
    expect(screen.getByTestId('checked').textContent).toBe('{}');

    // Save API key with trimming
    fireEvent.click(screen.getByText('Save Key'));
    expect(screen.getByTestId('apiKey').textContent).toBe('AIzaNewKey999');
    expect(localStorage.getItem(STORAGE_KEYS.API_KEY)).toBe('AIzaNewKey999');

    // Clear API key (tests the else branch that removes from localStorage)
    fireEvent.click(screen.getByText('Clear Key'));
    expect(screen.getByTestId('apiKey').textContent).toBe('');
    expect(localStorage.getItem(STORAGE_KEYS.API_KEY)).toBeNull();

    // Trigger celebration
    expect(() => {
      fireEvent.click(screen.getByText('Celebrate'));
    }).not.toThrow();

    // Toggle theme
    fireEvent.click(screen.getByText('Toggle Theme'));
  });
});
