import React, { useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  STORAGE_KEYS,
  LOADING_QUOTES,
  CONFETTI_COLORS,
  QUOTE_ROTATION_INTERVAL_MS
} from '../config/constants.js';
import { calculatePlanProgress } from '../utils/progressCalculator.js';
import { fetchServerStatusApi } from '../services/apiService.js';
import { usePersistentState } from '../hooks/usePersistentState.js';
import { useThemeMode } from '../hooks/useThemeMode.js';
import { usePlanManager } from '../hooks/usePlanManager.js';
import { EventContext } from './useEvent.js';

export function EventProvider({ children }) {
  const { themeMode, toggleTheme } = useThemeMode();

  // Persistent state
  const [plan, setPlan] = usePersistentState(STORAGE_KEYS.PLAN, null);
  const [meta, setMeta] = usePersistentState(STORAGE_KEYS.META, null);
  const [checkedItems, setCheckedItems] = usePersistentState(STORAGE_KEYS.CHECKED, {});
  const [chatHistory, setChatHistory] = usePersistentState(STORAGE_KEYS.CHAT, []);
  const [customApiKey, setCustomApiKey] = useState(() => localStorage.getItem(STORAGE_KEYS.API_KEY) || '');

  // UI state
  const [activeTab, setActiveTab] = useState('overview');
  const [loadingQuoteIndex, setLoadingQuoteIndex] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [serverStatus, setServerStatus] = useState(null);

  const triggerCelebration = useCallback(() => {
    try {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 }, colors: [...CONFETTI_COLORS] });
    } catch {
      // Graceful fallback if canvas confetti fails
    }
  }, []);

  const {
    isLoading,
    regeneratingSection,
    error,
    setError,
    generatePlan,
    regenerateSingleSection,
    sendChatMessage
  } = usePlanManager({
    plan,
    setPlan,
    meta,
    setMeta,
    setCheckedItems,
    setActiveTab,
    triggerCelebration,
    chatHistory,
    setChatHistory,
    customApiKey
  });

  // Rotate loading quotes
  useEffect(() => {
    if (!isLoading) return;
    const intervalId = setInterval(() => {
      setLoadingQuoteIndex((prev) => (prev + 1) % LOADING_QUOTES.length);
    }, QUOTE_ROTATION_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, [isLoading]);

  // Check backend server status on mount
  useEffect(() => {
    fetchServerStatusApi()
      .then(setServerStatus)
      .catch((err) => console.warn('Backend status check failed:', err.message));
  }, []);

  const { totalItemsCount, checkedItemsCount, progressPercentage } = useMemo(() => {
    return calculatePlanProgress(plan, checkedItems);
  }, [plan, checkedItems]);

  const toggleCheckItem = useCallback((id) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  }, [setCheckedItems]);

  const resetProgress = useCallback(() => {
    setCheckedItems({});
  }, [setCheckedItems]);

  const saveCustomApiKey = useCallback((key) => {
    const cleaned = (key || '').trim();
    setCustomApiKey(cleaned);
    if (cleaned) {
      localStorage.setItem(STORAGE_KEYS.API_KEY, cleaned);
    } else {
      localStorage.removeItem(STORAGE_KEYS.API_KEY);
    }
  }, []);

  return (
    <EventContext.Provider
      value={{
        themeMode,
        toggleTheme,
        plan,
        meta,
        setPlan,
        checkedItems,
        toggleCheckItem,
        resetProgress,
        totalItemsCount,
        checkedItemsCount,
        progressPercentage,
        activeTab,
        setActiveTab,
        isLoading,
        currentLoadingQuote: LOADING_QUOTES[loadingQuoteIndex],
        regeneratingSection,
        error,
        setError,
        isChatOpen,
        setIsChatOpen,
        serverStatus,
        generatePlan,
        regenerateSingleSection,
        sendChatMessage,
        triggerCelebration,
        customApiKey,
        saveCustomApiKey
      }}
    >
      {children}
    </EventContext.Provider>
  );
}
