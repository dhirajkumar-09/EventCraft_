import React from 'react';
import { Clock, RotateCw, UserCheck, StickyNote } from 'lucide-react';
import { useEvent } from '../../context/useEvent.js';

export default function RunSheetTab() {
  const { plan, regenerateSingleSection, regeneratingSection } = useEvent();

  if (!plan?.runSheet) return null;

  const { runSheet } = plan;
  const isRegenerating = regeneratingSection === 'runSheet';

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Section Header with Regenerate */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-amber-200/50 dark:border-slate-800">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
            Section 6 of 7
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>Event-Day Master Run Sheet</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Hour-by-hour execution schedule with designated team owners and operational cues.
          </p>
        </div>

        <button
          onClick={() => regenerateSingleSection('runSheet')}
          disabled={isRegenerating}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-slate-700 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-slate-700 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <RotateCw
            className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin text-amber-600' : ''}`}
          />
          <span>{isRegenerating ? 'Re-sequencing Schedule...' : 'Regenerate Run Sheet'}</span>
        </button>
      </div>

      {/* Hour-by-Hour Timeline List */}
      <div className="space-y-4">
        {(runSheet || []).map((slot, idx) => (
          <div
            key={slot.id || idx}
            className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-white/80 dark:bg-slate-800/80 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            {/* Time Slot Badge & Activity */}
            <div className="flex items-start gap-4">
              <div className="shrink-0 px-3 py-2 rounded-xl bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-300 font-black text-xs flex items-center gap-1.5 whitespace-nowrap">
                <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>{slot.time}</span>
              </div>

              <div>
                <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                  {slot.activity}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                  <StickyNote className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{slot.notes}</span>
                </p>
              </div>
            </div>

            {/* Designated Owner Badge */}
            <div className="shrink-0 flex items-center gap-2 self-start md:self-center px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-600">
              <UserCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Owner: {slot.owner}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
