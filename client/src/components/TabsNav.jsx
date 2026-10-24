import React from 'react';
import { useEvent } from '../context/useEvent.js';
import { NAVIGATION_TABS } from '../config/tabs.js';

export { NAVIGATION_TABS };

/**
 * 7-Section Navigation Bar
 * Allows seamless switching between plan perspectives
 */
export default function TabsNav() {
  const { activeTab, setActiveTab } = useEvent();

  return (
    <nav
      className="w-full mb-8 overflow-x-auto no-scrollbar py-2"
      aria-label="Event Plan Sections"
    >
      <div className="flex items-center gap-2 min-w-max px-1">
        {NAVIGATION_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-amber-600 to-rose-600 text-white shadow-md shadow-amber-600/20 scale-[1.02]'
                  : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-amber-50/60 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
              }`}
              aria-selected={isActive}
              role="tab"
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-amber-500'}`} />
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-amber-100/60 text-amber-900 dark:bg-slate-700 dark:text-slate-300'
                }`}
              >
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
