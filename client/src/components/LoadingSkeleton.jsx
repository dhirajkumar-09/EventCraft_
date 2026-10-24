import React from 'react';
import { Sparkles } from 'lucide-react';
import { useEvent } from '../context/useEvent.js';

export default function LoadingSkeleton() {
  const { currentLoadingQuote } = useEvent();

  return (
    <div className="space-y-8 animate-fade-in py-6">
      {/* Dynamic Celebration AI Status Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-purple-600/10 dark:from-amber-950/40 dark:via-rose-950/30 dark:to-purple-950/40 border border-amber-300/80 dark:border-slate-700 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-600 text-white shadow-lg shadow-amber-600/30 mb-3 animate-spin">
          <Sparkles className="w-6 h-6" />
        </div>
        <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
          EventCraft AI is Designing Your Celebration
        </h3>
        <p className="text-xs sm:text-sm font-semibold text-amber-700 dark:text-amber-300 mt-1 min-h-[24px] animate-pulse">
          ✨ {currentLoadingQuote}
        </p>
      </div>

      {/* Tabs Skeleton */}
      <div className="flex gap-2 overflow-hidden pb-2">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div
            key={i}
            className="h-10 w-32 rounded-xl bg-slate-200 dark:bg-slate-800 animate-shimmer shrink-0"
          />
        ))}
      </div>

      {/* Hero Overview Skeleton Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
        <div className="h-4 w-40 bg-slate-200 dark:bg-slate-700 rounded-md animate-shimmer" />
        <div className="h-8 w-3/4 bg-slate-200 dark:bg-slate-700 rounded-lg animate-shimmer" />
        <div className="h-16 w-full bg-slate-100 dark:bg-slate-800 rounded-xl animate-shimmer" />
      </div>

      {/* 2-Column Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
          <div className="h-5 w-32 bg-slate-200 dark:bg-slate-700 rounded-md animate-shimmer" />
          <div className="h-28 w-full bg-slate-100 dark:bg-slate-800 rounded-xl animate-shimmer" />
        </div>
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
          <div className="h-5 w-32 bg-slate-200 dark:bg-slate-700 rounded-md animate-shimmer" />
          <div className="h-28 w-full bg-slate-100 dark:bg-slate-800 rounded-xl animate-shimmer" />
        </div>
      </div>
    </div>
  );
}
