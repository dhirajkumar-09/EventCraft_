import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquareText,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  RotateCcw,
  Lightbulb
} from 'lucide-react';
import { useEvent } from '../context/EventContext.jsx';

const SUGGESTED_PROMPTS = [
  'Reduce budget by 20%',
  'Make it kid-friendly with fun games & treats',
  'Add high-energy live music & DJ recommendations',
  'Suggest eco-friendly seed paper favors',
  'Include traditional folk dance & choreography'
];

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
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200/60 dark:border-slate-800 overflow-x-auto no-scrollbar flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 shrink-0 flex items-center gap-1">
            <Lightbulb className="w-3 h-3 text-amber-500" />
            Try:
          </span>
          {SUGGESTED_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              disabled={isSending}
              className="text-[11px] px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-500 hover:text-amber-700 dark:hover:text-amber-400 transition-all shrink-0 cursor-pointer disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4">
          {chatHistory.map((msg) => {
            const isUser = msg.role === 'user';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-slate-800 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5 border border-amber-200 dark:border-slate-700">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-gradient-to-r from-amber-600 to-rose-600 text-white rounded-tr-xs shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-xs border border-slate-200/60 dark:border-slate-700/60'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <span
                    className={`block text-[10px] mt-1 text-right ${
                      isUser ? 'text-amber-100/80' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isSending && (
            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 animate-pulse">
              <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-slate-800 text-amber-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 animate-spin" />
              </div>
              <span>Event planner is revising your plan and numbers...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex items-end gap-2 p-2 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 focus-within:ring-2 focus-within:ring-amber-500 focus-within:border-transparent transition-all">
            <textarea
              rows="2"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. Reduce catering budget by 15%, add a live saxophone entrance..."
              disabled={isSending}
              className="w-full bg-transparent text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none resize-none px-2 py-1"
            />
            <button
              onClick={() => handleSend()}
              disabled={!inputText.trim() || isSending}
              className="p-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 text-white shadow-sm hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 transition-all cursor-pointer shrink-0"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-slate-400 text-center mt-2">
            Tip: Press Enter to send • Plan updates automatically
          </p>
        </div>
      </div>
    </div>
  );
}
