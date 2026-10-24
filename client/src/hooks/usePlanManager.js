import { useState } from 'react';
import {
  generateEventPlanApi,
  regenerateSectionApi,
  chatWithPlannerApi
} from '../services/apiService.js';

/**
 * Custom hook to encapsulate plan generation, section regeneration, and planner chat actions
 */
export function usePlanManager({
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
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [regeneratingSection, setRegeneratingSection] = useState(null);
  const [error, setError] = useState(null);

  const generatePlan = async (formData) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateEventPlanApi(formData, customApiKey);
      setPlan(result.plan);
      setMeta(result.meta || formData);
      setCheckedItems({});
      setActiveTab('overview');
      triggerCelebration();

      setChatHistory([
        {
          id: 'msg-welcome',
          role: 'assistant',
          text: `Namaste! I am your EventCraft AI planner. I've designed a comprehensive plan for your ${formData.eventType} in ${formData.city}. You can explore the 7 tabs above or ask me for any custom adjustments right here!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      setError(err.message || 'An error occurred while generating your plan.');
    } finally {
      setIsLoading(false);
    }
  };

  const regenerateSingleSection = async (sectionKey) => {
    if (!plan) return;
    setRegeneratingSection(sectionKey);
    try {
      const updatedSection = await regenerateSectionApi(sectionKey, plan, meta, customApiKey);
      setPlan((prev) => ({ ...prev, [sectionKey]: updatedSection }));
      triggerCelebration();
    } catch (err) {
      if (typeof window !== 'undefined' && typeof window.alert === 'function') {
        window.alert(`Could not regenerate section: ${err.message}`);
      }
      setError(`Could not regenerate section: ${err.message}`);
    } finally {
      setRegeneratingSection(null);
    }
  };

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
      const result = await chatWithPlannerApi(userText, plan, chatHistory, meta, customApiKey);
      const botMsg = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        text: result.replyMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatHistory((prev) => [...prev, botMsg]);
      if (result.updatedPlan) setPlan(result.updatedPlan);
    } catch (err) {
      const errorMsg = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        text: `I ran into an issue updating your plan: ${err.message}. Please try again.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatHistory((prev) => [...prev, errorMsg]);
    }
  };

  return {
    isLoading,
    regeneratingSection,
    error,
    setError,
    generatePlan,
    regenerateSingleSection,
    sendChatMessage
  };
}
