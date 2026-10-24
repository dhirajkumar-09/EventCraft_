import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';

const EventContext = createContext();

const STORAGE_KEYS = {
  THEME: 'eventcraft_theme',
  PLAN: 'eventcraft_current_plan',
  META: 'eventcraft_plan_meta',
  CHECKED: 'eventcraft_checked_items',
  CHAT: 'eventcraft_chat_history',
  API_KEY: 'eventcraft_custom_api_key'
};

const LOADING_QUOTES = [
  "Curating authentic local catering options...",
  "Balancing venue aesthetics with your budget...",
  "Composing your hour-by-hour celebration run sheet...",
  "Crafting unforgettable wow moments and surprises...",
  "Securing backup plans and emergency buffers...",
  "Polishing your custom celebration itinerary..."
];

export function EventProvider({ children }) {
  // Theme state (respects saved preference or system preference)
  const [themeMode, setThemeMode] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    if (saved === 'dark' || saved === 'light') return saved;
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  // Plan & Meta state
  const [plan, setPlan] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PLAN);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [meta, setMeta] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.META);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Checked items for tasks & vendors
  const [checkedItems, setCheckedItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CHECKED);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Chat conversation
  const [chatHistory, setChatHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CHAT);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Optional custom API key
  const [customApiKey, setCustomApiKey] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.API_KEY) || '';
  });

  // UI state
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingQuoteIndex, setLoadingQuoteIndex] = useState(0);
  const [regeneratingSection, setRegeneratingSection] = useState(null);
  const [error, setError] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [serverStatus, setServerStatus] = useState(null);

  // Sync theme with document element and body
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (themeMode === 'dark') {
      root.classList.add('dark');
      body.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
    localStorage.setItem(STORAGE_KEYS.THEME, themeMode);
  }, [themeMode]);

  // Sync plan to localStorage
  useEffect(() => {
    if (plan) {
      localStorage.setItem(STORAGE_KEYS.PLAN, JSON.stringify(plan));
    }
  }, [plan]);

  // Sync meta to localStorage
  useEffect(() => {
    if (meta) {
      localStorage.setItem(STORAGE_KEYS.META, JSON.stringify(meta));
    }
  }, [meta]);

  // Sync checked items to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CHECKED, JSON.stringify(checkedItems));
  }, [checkedItems]);

  // Sync chat history
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CHAT, JSON.stringify(chatHistory));
  }, [chatHistory]);

  // Rotate loading quotes
  useEffect(() => {
    let interval;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingQuoteIndex((prev) => (prev + 1) % LOADING_QUOTES.length);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  // Fetch server status on mount
  useEffect(() => {
    async function checkStatus() {
      try {
        const res = await fetch('/api/status');
        if (res.ok) {
          const data = await res.json();
          setServerStatus(data);
        }
      } catch (err) {
        console.warn('Backend status check failed:', err);
      }
    }
    checkStatus();
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const triggerCelebration = useCallback(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#BE123C', '#F59E0B', '#10B981', '#EC4899']
      });
    } catch {
      // ignore if canvas-confetti unsupported
    }
  }, []);

  // Compute progress percentage from tickable tasks & vendors
  const { totalItemsCount, checkedItemsCount, progressPercentage } = useMemo(() => {
    if (!plan) return { totalItemsCount: 0, checkedItemsCount: 0, progressPercentage: 0 };

    let total = 0;
    let checked = 0;

    // Timeline tasks
    if (Array.isArray(plan.timeline)) {
      plan.timeline.forEach((phase) => {
        if (Array.isArray(phase.tasks)) {
          phase.tasks.forEach((task) => {
            total++;
            if (checkedItems[task.id]) checked++;
          });
        }
      });
    }

    // Vendor checklist
    if (Array.isArray(plan.vendorChecklist)) {
      plan.vendorChecklist.forEach((v) => {
        total++;
        if (checkedItems[v.id]) checked++;
      });
    }

    const pct = total > 0 ? Math.round((checked / total) * 100) : 0;
    return {
      totalItemsCount: total,
      checkedItemsCount: checked,
      progressPercentage: pct
    };
  }, [plan, checkedItems]);

  const toggleCheckItem = useCallback((id) => {
    setCheckedItems((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      return next;
    });
  }, []);

  const resetProgress = useCallback(() => {
    setCheckedItems({});
  }, []);

  const saveCustomApiKey = useCallback((key) => {
    const cleaned = (key || '').trim();
    setCustomApiKey(cleaned);
    if (cleaned) {
      localStorage.setItem(STORAGE_KEYS.API_KEY, cleaned);
    } else {
      localStorage.removeItem(STORAGE_KEYS.API_KEY);
    }
  }, []);

  // Generate Plan Handler
  const generatePlan = async (formData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/plan/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          apiKey: customApiKey || undefined
        })
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to generate event plan. Please check inputs.');
      }

      setPlan(result.plan);
      setMeta(result.meta || formData);
      setCheckedItems({}); // fresh start
      setActiveTab('overview');
      triggerCelebration();

      // Seed initial welcoming message in chat
      setChatHistory([
        {
          id: 'msg-welcome',
          role: 'assistant',
          text: `Namaste! I am your EventCraft AI planner. I've designed a comprehensive plan for your ${formData.eventType} in ${formData.city}. You can explore the 7 tabs above or ask me for any custom adjustments (e.g. "reduce budget by 20%", "suggest more kid-friendly games", or "recommend outdoor floral decor") right here!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      console.error('Plan generation error:', err);
      setError(err.message || 'An error occurred while generating your plan.');
    } finally {
      setIsLoading(false);
    }
  };

  // Regenerate single section
  const regenerateSingleSection = async (sectionKey) => {
    if (!plan) return;
    setRegeneratingSection(sectionKey);
    try {
      const response = await fetch('/api/plan/regenerate-section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section: sectionKey,
          currentPlan: plan,
          apiKey: customApiKey || undefined,
          ...meta
        })
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || `Failed to regenerate ${sectionKey}`);
      }

      setPlan((prev) => ({
        ...prev,
        [sectionKey]: result.data
      }));
      triggerCelebration();
    } catch (err) {
      console.error(`Regenerate section error (${sectionKey}):`, err);
      alert(`Could not regenerate section: ${err.message}`);
    } finally {
      setRegeneratingSection(null);
    }
  };

  // Chat with planner
  const sendChatMessage = async (userText) => {
    if (!userText.trim()) return;

    const userMsg = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory((prev) => [...prev, userMsg]);

    try {
      const response = await fetch('/api/plan/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          currentPlan: plan,
          chatHistory: chatHistory.slice(-8),
          apiKey: customApiKey || undefined,
          ...meta
        })
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to process chat message');
      }

      const botMsg = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        text: result.replyMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatHistory((prev) => [...prev, botMsg]);

      if (result.updatedPlan) {
        setPlan(result.updatedPlan);
      }
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        text: `I ran into an issue updating your plan: ${err.message}. Please try again or rephrase your request.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatHistory((prev) => [...prev, errorMsg]);
    }
  };

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
        generatePlan,
        regenerateSingleSection,
        chatHistory,
        sendChatMessage,
        isChatOpen,
        setIsChatOpen,
        customApiKey,
        saveCustomApiKey,
        serverStatus,
        triggerCelebration
      }}
    >
      {children}
    </EventContext.Provider>
  );
}

export function useEvent() {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvent must be used within an EventProvider');
  }
  return context;
}
