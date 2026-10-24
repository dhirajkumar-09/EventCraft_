import React from 'react';
import { Sun, Moon, Key, Share2, Sparkles } from 'lucide-react';
import { useEvent } from '../context/EventContext.jsx';
import EventCraftLogo from './EventCraftLogo.jsx';

export default function Navbar({ onOpenExport, onOpenApiKey }) {
  const { themeMode, toggleTheme, plan, serverStatus, customApiKey } = useEvent();

  const isGeminiLive = Boolean(serverStatus?.apiKeyConfigured || customApiKey);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border-b border-amber-200/60 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand with Bespoke EventCraft AI Logo */}
        <div className="flex items-center gap-3">
          <EventCraftLogo size={42} />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-xl tracking-tight text-slate-900 dark:text-white">
                EventCraft<span className="text-amber-600 dark:text-amber-400"> AI</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wide uppercase bg-gradient-to-r from-amber-100 to-rose-100 dark:from-amber-950/60 dark:to-rose-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700/70 shadow-xs">
                Gemini 2.5 Flash
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 hidden md:block">
              Celebration Architect & Event Planner
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Engine Status Pill */}
          <button
            onClick={onOpenApiKey}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
            title="Configure Google Gemini API Key"
          >
            <span className={`w-2 h-2 rounded-full ${isGeminiLive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <span className="hidden sm:inline">{isGeminiLive ? 'Gemini AI Active' : 'API Key'}</span>
            <Key className="w-3.5 h-3.5 opacity-60 ml-0.5" />
          </button>

          {/* Unified Export & Share action (contains PDF and WhatsApp) */}
          {plan && (
            <button
              onClick={onOpenExport}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-amber-600 via-rose-600 to-purple-600 hover:from-amber-700 hover:via-rose-700 hover:to-purple-700 text-white shadow-md shadow-amber-600/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              title="Export Master PDF or Share via WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Export & Share</span>
            </button>
          )}

          {/* Day / Night Theme Switcher */}
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${themeMode === 'dark' ? 'Day (Light)' : 'Night (Dark)'} mode`}
            title={`Switch to ${themeMode === 'dark' ? 'Day (Light)' : 'Night (Dark)'} mode`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-700 transition-all hover:scale-[1.03] active:scale-[0.97] cursor-pointer shadow-xs"
          >
            {themeMode === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span>Day</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-indigo-600" />
                <span>Night</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
