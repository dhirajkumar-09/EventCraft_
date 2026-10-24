import React, { useState } from 'react';
import { Sparkles, RotateCw, Copy, Check, Compass, BookmarkCheck } from 'lucide-react';
import { useEvent } from '../../context/useEvent.js';
import Card3D from '../Card3D.jsx';

/**
 * Section 1: Executive Overview & Aesthetic Vision
 */
export default function OverviewTab() {
  const { plan, regenerateSingleSection, regeneratingSection } = useEvent();
  const [copiedHex, setCopiedHex] = useState(null);

  if (!plan?.overview) return null;

  const { overview } = plan;
  const isRegenerating = regeneratingSection === 'overview';

  const copyToClipboard = (hex) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Section Header with Regenerate Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-amber-200/50 dark:border-slate-800">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
            Section 1 of 7
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>Executive Overview & Aesthetic Vision</span>
          </h3>
        </div>

        <button
          onClick={() => regenerateSingleSection('overview')}
          disabled={isRegenerating}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-slate-700 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-slate-700 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <RotateCw
            className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin text-amber-600' : ''}`}
          />
          <span>{isRegenerating ? 'Regenerating Overview...' : 'Regenerate Overview'}</span>
        </button>
      </div>

      {/* Suggested Theme Showcase Card with 3D Depth */}
      <Card3D depth={20} maxTilt={6}>
        <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-amber-500/10 via-rose-500/10 to-purple-600/10 dark:from-amber-950/40 dark:via-rose-950/30 dark:to-purple-950/40 border border-amber-200 dark:border-slate-700 shadow-md">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300 mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Curated Theme & Concept</span>
          </div>

          <h4 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
            {overview.suggestedTheme}
          </h4>

          <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-amber-200/60 dark:border-slate-800 backdrop-blur-sm">
            <p className="text-sm sm:text-base font-semibold italic text-amber-900 dark:text-amber-200">
              &quot;{overview.oneLineVibe}&quot;
            </p>
          </div>

          <div className="mt-5">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              <span>Architectural Summary</span>
            </h5>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {overview.summary}
            </p>
          </div>
        </div>
      </Card3D>

      {/* 5-Swatch Color Palette with Copy-to-Clipboard */}
      <div className="card-glass rounded-2xl p-6 border border-amber-200/60 dark:border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <span>Harmonious 5-Color Celebration Palette</span>
          </h4>
          <span className="text-[11px] text-slate-400">Click swatch to copy HEX code</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {(overview.colorPalette || []).map((swatch, idx) => {
            const hex = typeof swatch === 'string' ? swatch : swatch?.hex;
            const name = typeof swatch === 'string' ? `Color ${idx + 1}` : swatch?.name;
            return (
              <button
                key={hex || idx}
                onClick={() => copyToClipboard(hex)}
                className="group p-3 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white/70 dark:bg-slate-800/70 hover:shadow-md transition-all text-left cursor-pointer"
              >
                <div
                  className="w-full h-14 rounded-lg shadow-inner mb-2.5 transition-transform group-hover:scale-105 relative flex items-center justify-center"
                  style={{ backgroundColor: hex }}
                >
                  {copiedHex === hex && (
                    <span className="p-1.5 rounded-full bg-black/60 text-white backdrop-blur-xs">
                      <Check className="w-4 h-4" />
                    </span>
                  )}
                </div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                  {name}
                </p>
                <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <span>{hex}</span>
                  <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Key Highlights */}
      {overview.keyHighlights && overview.keyHighlights.length > 0 && (
        <div className="card-glass rounded-2xl p-6 border border-amber-200/60 dark:border-slate-800">
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
            <BookmarkCheck className="w-4 h-4 text-emerald-600" />
            <span>Signature Celebration Pillars</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {overview.keyHighlights.map((highlight, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50/50 dark:bg-slate-800/50 border border-amber-200/50 dark:border-slate-700/60"
              >
                <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-200 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-snug">
                  {highlight}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
