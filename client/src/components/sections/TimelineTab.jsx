import React from 'react';
import { RotateCw } from 'lucide-react';
import { useEvent } from '../../context/useEvent.js';
import TimelinePhaseCard from './timeline/TimelinePhaseCard.jsx';

/**
 * Section 3: Adaptive Countdown Timeline
 */
export default function TimelineTab() {
  const {
    plan,
    checkedItems,
    toggleCheckItem,
    regenerateSingleSection,
    regeneratingSection
  } = useEvent();

  if (!plan?.timeline) return null;

  const { timeline } = plan;
  const isRegenerating = regeneratingSection === 'timeline';

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Section Header with Regenerate */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-amber-200/50 dark:border-slate-800">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
            Section 3 of 7
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>Adaptive Countdown Timeline</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Tick off completed milestones to update your overall celebration progress.
          </p>
        </div>

        <button
          onClick={() => regenerateSingleSection('timeline')}
          disabled={isRegenerating}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-slate-700 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-slate-700 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin text-amber-600' : ''}`} />
          <span>{isRegenerating ? 'Recalibrating Milestones...' : 'Regenerate Timeline'}</span>
        </button>
      </div>

      {/* Timeline Milestones Phases */}
      <div className="relative border-l-2 border-amber-300/80 dark:border-slate-700 ml-4 sm:ml-6 space-y-8 pl-6 sm:pl-8">
        {(timeline || []).map((phase, pIdx) => (
          <TimelinePhaseCard
            key={phase.id || phase.phase || pIdx}
            phase={phase}
            checkedItems={checkedItems}
            onToggleCheckItem={toggleCheckItem}
          />
        ))}
      </div>
    </div>
  );
}
