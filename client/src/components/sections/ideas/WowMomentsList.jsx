import React from 'react';
import { Sparkles } from 'lucide-react';
import Card3D from '../../Card3D.jsx';

export default function WowMomentsList({ wowMoments = [] }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-rose-600 dark:text-rose-400">
        <Sparkles className="w-4 h-4 animate-pulse" />
        <span>3 Unique &quot;Wow Moments&quot; (Unforgettable Highlights)</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {wowMoments.map((wow, idx) => (
          <Card3D key={wow.title || idx} depth={25} maxTilt={10}>
            <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-b from-amber-500/10 via-rose-500/5 to-purple-500/10 dark:from-amber-950/40 dark:via-rose-950/20 dark:to-purple-950/30 border border-amber-300/80 dark:border-rose-900/50 shadow-md flex flex-col justify-between h-full">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-400/10 rounded-full blur-xl pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-600 to-rose-600 text-white flex items-center justify-center font-black text-xs shadow-sm">
                    0{idx + 1}
                  </span>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                    Wow Factor
                  </span>
                </div>

                <h4 className="text-base font-extrabold text-slate-900 dark:text-white mb-2 leading-snug">
                  {wow.title}
                </h4>

                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  {wow.description}
                </p>
              </div>

              {/* Execution Tip */}
              <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-amber-200/80 dark:border-slate-800 mt-2">
                <span className="block text-[10px] font-black uppercase tracking-wider text-amber-800 dark:text-amber-400 mb-0.5">
                  💡 Planner Execution Tip
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-300 italic">
                  {wow.executionTip}
                </p>
              </div>
            </div>
          </Card3D>
        ))}
      </div>
    </div>
  );
}
