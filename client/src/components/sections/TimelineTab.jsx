import React from 'react';
import {
  Calendar,
  RotateCw,
  CheckCircle2,
  Clock,
  AlertCircle,
  Flag
} from 'lucide-react';
import { useEvent } from '../../context/EventContext.jsx';

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

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 border-rose-300 dark:border-rose-800';
      case 'Medium':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-300 dark:border-amber-800';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700';
    }
  };

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
        {(timeline || []).map((phase, pIdx) => {
          const totalTasks = phase.tasks?.length || 0;
          const completedTasks = (phase.tasks || []).filter((t) => checkedItems[t.id]).length;
          const isPhaseDone = totalTasks > 0 && totalTasks === completedTasks;

          return (
            <div key={pIdx} className="relative">
              {/* Timeline Node Dot */}
              <div
                className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all ${
                  isPhaseDone
                    ? 'bg-emerald-500 border-white text-white shadow-md'
                    : 'bg-white dark:bg-slate-900 border-amber-500 text-amber-600 dark:text-amber-400 shadow-sm'
                }`}
              >
                {isPhaseDone ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <span className="text-xs font-black">{pIdx + 1}</span>
                )}
              </div>

              {/* Phase Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-0.5 rounded-lg text-xs font-extrabold bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300/80 dark:border-amber-800">
                    {phase.phase}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    ({phase.timeframe})
                  </span>
                </div>

                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  {completedTasks} / {totalTasks} done
                </span>
              </div>

              {/* Task Cards */}
              <div className="grid grid-cols-1 gap-2.5">
                {(phase.tasks || []).map((task) => {
                  const isChecked = Boolean(checkedItems[task.id]);

                  return (
                    <div
                      key={task.id}
                      onClick={() => toggleCheckItem(task.id)}
                      className={`group p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                        isChecked
                          ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300/70 dark:border-emerald-800 opacity-80'
                          : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80 hover:border-amber-400 dark:hover:border-amber-500 shadow-xs'
                      }`}
                    >
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}} // handled by parent click
                        className="w-4 h-4 mt-0.5 rounded text-amber-600 focus:ring-amber-500 border-slate-300 cursor-pointer shrink-0"
                        aria-label={`Toggle task: ${task.title}`}
                      />

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                          <h4
                            className={`text-xs sm:text-sm font-bold text-slate-900 dark:text-white transition-all ${
                              isChecked ? 'line-through text-slate-400 dark:text-slate-500' : ''
                            }`}
                          >
                            {task.title}
                          </h4>

                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getPriorityBadgeClass(
                              task.priority
                            )}`}
                          >
                            {task.priority} Priority
                          </span>
                        </div>

                        <p
                          className={`text-xs text-slate-600 dark:text-slate-400 leading-relaxed ${
                            isChecked ? 'line-through opacity-70' : ''
                          }`}
                        >
                          {task.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
