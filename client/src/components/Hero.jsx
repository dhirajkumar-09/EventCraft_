import React from 'react';
import { Sparkles, Calendar, DollarSign, ShieldCheck, HeartHandshake, Zap } from 'lucide-react';
import { SAMPLE_PRESETS } from '../utils/sampleData.js';
import Hero3DStage from './Hero3DStage.jsx';

export default function Hero({ onSelectPreset, onScrollToForm }) {
  return (
    <div className="relative overflow-hidden pt-6 pb-10 sm:pt-10 sm:pb-14">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-amber-200/30 via-rose-100/20 to-transparent dark:from-amber-600/10 dark:via-purple-900/10 dark:to-transparent pointer-events-none blur-3xl -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Festive Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300/80 dark:border-amber-700/60 shadow-xs mb-4 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span>GenAI Celebration Architect • Interactive 3D • Gemini 2.5 Flash</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15] mb-3">
          Organize Unforgettable Celebrations with{' '}
          <span className="festive-gradient-text">AI Precision</span>
        </h1>

        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-600 dark:text-slate-300 font-normal leading-relaxed mb-4">
          From opulent Indian weddings and milestone birthdays to vibrant community galas. 
          Generate realistic, city-specific budgets, countdown timelines, and 3 unique "wow moments".
        </p>

        {/* Interactive 3D Celebration Stage */}
        <Hero3DStage />

        {/* Value Prop Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-8">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-xs">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span>100% Strict Budget Math</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-xs">
            <Calendar className="w-4 h-4 text-amber-600" />
            <span>Adaptive T-Day Milestones</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-rose-600" />
            <span>Top 3 Risk Backup Plans</span>
          </div>
        </div>

        {/* Quick-Start Presets Pill Bar */}
        <div className="p-4 rounded-2xl bg-white/90 dark:bg-slate-800/90 border border-amber-200 dark:border-slate-700 shadow-lg shadow-amber-500/5 max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              Instant Try: 1-Click Sample Presets
            </span>
            <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
              Pre-filled & tested
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {SAMPLE_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => onSelectPreset(preset.data)}
                className="flex flex-col items-start p-2.5 rounded-xl border border-amber-100 dark:border-slate-700 bg-amber-50/60 dark:bg-slate-900/60 hover:bg-amber-100/80 dark:hover:bg-slate-800 hover:border-amber-400 dark:hover:border-amber-500 transition-all text-left group"
              >
                <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors truncate w-full">
                  {preset.name.split('(')[0]}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate w-full mt-0.5">
                  {preset.data.city} • {preset.data.currencySymbol}{Number(preset.data.totalBudget).toLocaleString()}
                </span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
