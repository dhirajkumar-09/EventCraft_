import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const PRIORITY_BADGES = {
  High: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 border-rose-300 dark:border-rose-800',
  Medium:
    'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-300 dark:border-amber-800',
  Low: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700'
};

export default function TimelinePhaseCard({ phase, checkedItems, onToggleCheckItem }) {
  const totalTasks = phase.tasks?.length || 0;
  const completedTasks = (phase.tasks || []).filter((task) => checkedItems[task.id]).length;
  const isPhaseDone = totalTasks > 0 && totalTasks === completedTasks;

  return (
    <div className="relative">
      {/* Milestone Indicator Node */}
      <span
        className={`absolute -left-[35px] sm:-left-[43px] top-1.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
          isPhaseDone
            ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs'
            : completedTasks > 0
              ? 'bg-amber-500 border-amber-500 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 border-amber-400 dark:border-slate-600'
        }`}
      >
        {isPhaseDone ? (
          <CheckCircle2 className="w-3.5 h-3.5" />
        ) : (
          <span className="w-2 h-2 rounded-full bg-amber-500" />
        )}
      </span>

      {/* Phase Card */}
      <div className="card-glass rounded-2xl p-5 border border-amber-200/60 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-amber-100 dark:border-slate-800">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-400">
              {phase.timeframe}
            </span>
            <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
              {phase.phase}
            </h4>
          </div>

          <span
            className={`text-xs px-2.5 py-1 rounded-full font-bold self-start sm:self-auto ${
              isPhaseDone
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                : 'bg-amber-100/70 text-amber-900 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            {completedTasks}/{totalTasks} Done
          </span>
        </div>

        {/* Task Items */}
        <div className="space-y-2.5">
          {(phase.tasks || []).map((task) => {
            const isChecked = Boolean(checkedItems[task.id]);

            return (
              <label
                key={task.id}
                className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                  isChecked
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/60 opacity-80'
                    : 'bg-white/60 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700/60 hover:bg-amber-50/40 dark:hover:bg-slate-800'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => onToggleCheckItem(task.id)}
                  className="mt-0.5 w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300 dark:border-slate-600 cursor-pointer"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-xs sm:text-sm font-bold ${
                        isChecked
                          ? 'line-through text-slate-400 dark:text-slate-500'
                          : 'text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {task.title}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                        PRIORITY_BADGES[task.priority] || PRIORITY_BADGES.Low
                      }`}
                    >
                      {task.priority || 'Normal'}
                    </span>
                  </div>

                  <p
                    className={`text-xs mt-0.5 ${
                      isChecked
                        ? 'text-slate-400 dark:text-slate-600'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {task.description}
                  </p>
                </div>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}
