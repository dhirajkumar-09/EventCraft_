import React from 'react';
import { RotateCw, Music, Gift, Gamepad2, Flower2 } from 'lucide-react';
import { useEvent } from '../../context/useEvent.js';
import WowMomentsList from './ideas/WowMomentsList.jsx';
import MenuCourseList from './ideas/MenuCourseList.jsx';

/**
 * Section 5: Personalized Ideas & 3 Unique Wow Moments
 */
export default function PersonalizedIdeasTab() {
  const { plan, meta, regenerateSingleSection, regeneratingSection } = useEvent();

  if (!plan?.personalizedIdeas) return null;

  const { personalizedIdeas } = plan;
  const isRegenerating = regeneratingSection === 'personalizedIdeas';

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Section Header with Regenerate */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-amber-200/50 dark:border-slate-800">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
            Section 5 of 7
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>Personalized Experiences & 3 Wow Moments</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Tailored specifically for {meta?.guestCount || 100} guests in{' '}
            {meta?.city || 'your city'} ({meta?.cuisineDiet || 'curated'} diet).
          </p>
        </div>

        <button
          onClick={() => regenerateSingleSection('personalizedIdeas')}
          disabled={isRegenerating}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-slate-700 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-slate-700 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <RotateCw
            className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin text-amber-600' : ''}`}
          />
          <span>{isRegenerating ? 'Generating Fresh Ideas...' : 'Regenerate Ideas'}</span>
        </button>
      </div>

      {/* 3 UNIQUE WOW MOMENTS HERO FEATURE */}
      <WowMomentsList wowMoments={personalizedIdeas.wowMoments} />

      {/* CURATED MENU SECTION */}
      <MenuCourseList menu={personalizedIdeas.menu} cuisineDiet={meta?.cuisineDiet} />

      {/* DECOR & ACTIVITIES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Decor Concepts */}
        <div className="card-glass rounded-2xl p-6 border border-amber-200/60 dark:border-slate-800">
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
            <Flower2 className="w-4 h-4 text-rose-500" />
            <span>Themed Decor Concepts</span>
          </h4>
          <div className="space-y-3">
            {(personalizedIdeas.decor || []).map((idea, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 leading-relaxed flex items-start gap-2.5"
              >
                <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p>{idea}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Games & Activities */}
        <div className="card-glass rounded-2xl p-6 border border-amber-200/60 dark:border-slate-800">
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
            <Gamepad2 className="w-4 h-4 text-purple-600" />
            <span>Interactive Games & Traditions</span>
          </h4>
          <div className="space-y-3">
            {(personalizedIdeas.gamesOrActivities || []).map((game, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 leading-relaxed flex items-start gap-2.5"
              >
                <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p>{game}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MUSIC & RETURN GIFTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Music Playlist Cues */}
        <div className="card-glass rounded-2xl p-6 border border-amber-200/60 dark:border-slate-800">
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
            <Music className="w-4 h-4 text-teal-600" />
            <span>Music Cues & Soundscapes</span>
          </h4>
          <div className="space-y-3">
            {(personalizedIdeas.music || []).map((m, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-teal-50/30 dark:bg-slate-800/60 border border-teal-200/50 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 leading-relaxed flex items-start gap-2.5"
              >
                <span className="text-teal-600 font-black">🎵</span>
                <p>{m}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Return Gifts / Favors */}
        <div className="card-glass rounded-2xl p-6 border border-amber-200/60 dark:border-slate-800">
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
            <Gift className="w-4 h-4 text-amber-600" />
            <span>Memorable Return Favors & Gifts</span>
          </h4>
          <div className="space-y-3">
            {(personalizedIdeas.returnGifts || []).map((gift, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-amber-50/30 dark:bg-slate-800/60 border border-amber-200/50 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 leading-relaxed flex items-start gap-2.5"
              >
                <span className="text-amber-600 font-black">🎁</span>
                <p>{gift}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
