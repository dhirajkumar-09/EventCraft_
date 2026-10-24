import React from 'react';
import { Lightbulb } from 'lucide-react';

const SUGGESTED_PROMPTS = Object.freeze([
  'Reduce budget by 20%',
  'Make it kid-friendly with fun games & treats',
  'Add high-energy live music & DJ recommendations',
  'Suggest eco-friendly seed paper favors',
  'Include traditional folk dance & choreography'
]);

export default function SuggestedPromptsBar({ onSelectPrompt, isSending }) {
  return (
    <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200/60 dark:border-slate-800 overflow-x-auto no-scrollbar flex items-center gap-2">
      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 shrink-0 flex items-center gap-1">
        <Lightbulb className="w-3 h-3 text-amber-500" />
        Try:
      </span>
      {SUGGESTED_PROMPTS.map((prompt) => (
        <button
          key={prompt}
          onClick={() => onSelectPrompt(prompt)}
          disabled={isSending}
          className="px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-amber-400 hover:text-amber-800 dark:hover:text-amber-300 disabled:opacity-50 transition-all cursor-pointer"
        >
          {prompt}
        </button>
      ))}
    </div>
  );
}
