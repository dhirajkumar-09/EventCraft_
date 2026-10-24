import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot } from 'lucide-react';
import { useEvent } from '../context/useEvent.js';
import SuggestedPromptsBar from './chat/SuggestedPromptsBar.jsx';
import ChatMessageItem from './chat/ChatMessageItem.jsx';

/**
 * "Ask the Planner" Conversational Assistant Drawer
 * Context-aware event adjustments in natural language
 */
export default function ChatPlannerModal() {
  const { isChatOpen, setIsChatOpen, chatHistory, sendChatMessage } = useEvent();
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom of chat
  useEffect(() => {
    if (isChatOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, isChatOpen]);

  if (!isChatOpen) return null;

  const handleSend = async (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim() || isSending) return;

    setInputText('');
    setIsSending(true);
    await sendChatMessage(text);
    setIsSending(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs transition-opacity animate-fade-in"
      onClick={() => setIsChatOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Ask the Planner Chat"
    >
      <div
        className="w-full max-w-lg h-full bg-white dark:bg-slate-900 shadow-2xl flex flex-col border-l border-amber-200 dark:border-slate-800 animate-slide-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Chat Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-amber-200/60 dark:border-slate-800 flex items-center justify-between bg-amber-50/50 dark:bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 to-rose-600 flex items-center justify-center text-white shadow-sm">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>Ask the Planner</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Online
                </span>
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Context-aware edits & real-time plan modifications
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsChatOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close Chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Suggested Prompts Pills */}
        <SuggestedPromptsBar onSelectPrompt={handleSend} isSending={isSending} />

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {(chatHistory || []).map((msg) => (
            <ChatMessageItem key={msg.id} message={msg} />
          ))}

          {isSending && (
            <div className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-400 animate-pulse p-2">
              <Bot className="w-4 h-4" />
              <span>Planner is thinking and recalibrating your plan...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Field */}
        <div className="p-4 border-t border-amber-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/80">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="e.g. Reduce budget by 20%, make it kid-friendly..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isSending}
              className="flex-1 input-glass rounded-xl px-4 py-3 text-xs sm:text-sm border-slate-300 dark:border-slate-700 focus:outline-hidden"
            />

            <button
              onClick={() => handleSend()}
              disabled={!inputText.trim() || isSending}
              className="p-3 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 text-white shadow-sm disabled:opacity-50 transition-all cursor-pointer"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
