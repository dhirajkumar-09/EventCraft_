import React from 'react';
import {
  Sparkles,
  PieChart,
  Calendar,
  CheckSquare,
  Lightbulb,
  Clock,
  ShieldAlert
} from 'lucide-react';
import { useEvent } from '../context/EventContext.jsx';

export const TABS = [
  { id: 'overview', label: 'Overview', icon: Sparkles, badge: 'Theme & Vibe' },
  { id: 'budget', label: 'Budget', icon: PieChart, badge: 'Donut & Math' },
  { id: 'timeline', label: 'Timeline', icon: Calendar, badge: 'Countdown' },
  { id: 'vendorChecklist', label: 'Vendor Checklist', icon: CheckSquare, badge: 'Negotiations' },
  { id: 'personalizedIdeas', label: 'Personalized Ideas', icon: Lightbulb, badge: '3 Wow Moments' },
  { id: 'runSheet', label: 'Run Sheet', icon: Clock, badge: 'Hour by Hour' },
  { id: 'backupPlan', label: 'Backup Plan', icon: ShieldAlert, badge: 'Top 3 Risks' }
];

export default function TabsNav() {
  const { activeTab, setActiveTab } = useEvent();

  return (
    <div className="w-full mb-8 overflow-x-auto no-scrollbar pb-2">
      <nav
        className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 min-w-max"
        role="tablist"
        aria-label="Event Plan Sections"
      >
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-white dark:bg-slate-900 text-amber-700 dark:text-amber-400 shadow-md shadow-amber-500/10 border border-amber-200 dark:border-amber-600/40 scale-[1.02]'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-amber-600 dark:text-amber-400' : 'opacity-70'}`} />
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                  isActive
                    ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                    : 'bg-slate-200/80 dark:bg-slate-700/80 text-slate-500 dark:text-slate-400'
                }`}
              >
                {tab.badge}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
