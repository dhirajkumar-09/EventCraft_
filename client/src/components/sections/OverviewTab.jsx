import React, { useState } from 'react';
import { Sparkles, RotateCw, Copy, Check, Heart, Compass, BookmarkCheck, FileDown } from 'lucide-react';
import { useEvent } from '../../context/EventContext.jsx';
import Card3D from '../Card3D.jsx';
import { exportStructuredPdf } from '../../utils/exportPdf.js';

export default function OverviewTab() {
  const { plan, meta, regenerateSingleSection, regeneratingSection } = useEvent();
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

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => exportStructuredPdf(plan, meta)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 text-white shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            title="Download full structured celebration plan as PDF"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Download Structured PDF</span>
          </button>

          <button
            onClick={() => regenerateSingleSection('overview')}
            disabled={isRegenerating}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-slate-700 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-slate-700 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer shadow-xs"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin text-amber-600' : ''}`} />
            <span>{isRegenerating ? 'Regenerating Overview...' : 'Regenerate Overview'}</span>
          </button>
        </div>
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
              "{overview.oneLineVibe}"
            </p>
          </div>

          <p className="mt-4 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
            {overview.summary}
          </p>
        </div>
      </Card3D>

      {/* Color Palette Swatches */}
      {overview.colorPalette && overview.colorPalette.length > 0 && (
        <div className="card-glass rounded-2xl p-6 border border-amber-200/60 dark:border-slate-800">
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
            <Compass className="w-4 h-4 text-amber-600" />
            <span>Harmonious Color Palette</span>
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {overview.colorPalette.map((color, idx) => (
              <div
                key={idx}
                onClick={() => copyToClipboard(color.hex)}
                className="group relative p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 hover:shadow-md transition-all cursor-pointer text-center"
              >
                <div
                  className="w-full h-14 rounded-lg shadow-inner mb-2 border border-black/5"
                  style={{ backgroundColor: color.hex }}
                />
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                  {color.name}
                </div>
                <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1 mt-0.5">
                  <span>{color.hex}</span>
                  {copiedHex === color.hex ? (
                    <Check className="w-3 h-3 text-emerald-500" />
                  ) : (
                    <Copy className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Highlights */}
      {overview.keyHighlights && overview.keyHighlights.length > 0 && (
        <div className="card-glass rounded-2xl p-6 border border-amber-200/60 dark:border-slate-800">
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
            <BookmarkCheck className="w-4 h-4 text-emerald-600" />
            <span>Key Event Signatures</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {overview.keyHighlights.map((highlight, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50/50 dark:bg-slate-800/50 border border-amber-200/50 dark:border-slate-700/60"
              >
                <span className="w-6 h-6 rounded-lg bg-amber-200 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200">
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
