import React, { useEffect } from 'react';
import { CheckCircle2, RotateCcw, Trophy, MessageSquareText } from 'lucide-react';
import { useEvent } from '../context/useEvent.js';

export default function ProgressTracker() {
  const {
    progressPercentage,
    checkedItemsCount,
    totalItemsCount,
    resetProgress,
    setIsChatOpen,
    triggerCelebration
  } = useEvent();

  // If 100% completed, trigger confetti burst!
  useEffect(() => {
    if (progressPercentage === 100 && totalItemsCount > 0) {
      triggerCelebration();
    }
  }, [progressPercentage, totalItemsCount, triggerCelebration]);

  if (totalItemsCount === 0) return null;

  return (
    <div className="card-glass rounded-2xl p-4 sm:p-5 shadow-lg border border-amber-200/80 dark:border-slate-800 mb-8 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div
            className={`p-2 rounded-xl ${
              progressPercentage === 100
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
            }`}
          >
            {progressPercentage === 100 ? (
              <Trophy className="w-5 h-5 animate-bounce" />
            ) : (
              <CheckCircle2 className="w-5 h-5" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                Planning Progress Tracker
              </h3>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-slate-800 text-amber-800 dark:text-amber-300">
                {progressPercentage}%
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {checkedItemsCount} of {totalItemsCount} timeline milestones & vendors locked in
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {checkedItemsCount > 0 && (
            <button
              onClick={resetProgress}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              title="Reset all checked items"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}

          <button
            onClick={() => setIsChatOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-100/80 hover:bg-amber-200/80 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 transition-colors"
          >
            <MessageSquareText className="w-3.5 h-3.5" />
            <span>Ask Planner for Edits</span>
          </button>
        </div>
      </div>

      {/* Progress Bar Track */}
      <div className="w-full bg-slate-200 dark:bg-slate-800 h-3 rounded-full overflow-hidden relative">
        <div
          className={`h-full transition-all duration-500 ease-out rounded-full ${
            progressPercentage === 100
              ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
              : 'bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600'
          }`}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {progressPercentage === 100 && (
        <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-2.5 text-center">
          🎉 Incredible! All preparation tasks & vendor bookings are complete. You're ready to
          celebrate!
        </p>
      )}
    </div>
  );
}
