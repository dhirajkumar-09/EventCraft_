import React, { useState, useRef } from 'react';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import EventForm from './components/EventForm.jsx';
import ProgressTracker from './components/ProgressTracker.jsx';
import TabsNav from './components/TabsNav.jsx';
import LoadingSkeleton from './components/LoadingSkeleton.jsx';
import ChatPlannerModal from './components/ChatPlannerModal.jsx';
import ExportModal from './components/ExportModal.jsx';
import ApiKeyModal from './components/ApiKeyModal.jsx';
import TabContentRenderer from './components/TabContentRenderer.jsx';
import ErrorBoundary from './components/common/ErrorBoundary.jsx';
import { useEvent } from './context/useEvent.js';
import { MessageSquareText, AlertOctagon, Sparkles } from 'lucide-react';

/**
 * EventCraft AI - Celebration Planner Root Component
 */
export default function App() {
  const {
    plan,
    activeTab,
    isLoading,
    error,
    setError,
    setIsChatOpen
  } = useEvent();

  const [selectedPreset, setSelectedPreset] = useState(null);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isApiKeyOpen, setIsApiKeyOpen] = useState(false);

  const formRef = useRef(null);
  const planSectionRef = useRef(null);

  const handleSelectPreset = (presetData) => {
    setSelectedPreset(presetData);
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToForm = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">
        {/* Top Navbar */}
        <Navbar
          onOpenExport={() => setIsExportOpen(true)}
          onOpenApiKey={() => setIsApiKeyOpen(true)}
        />

        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
          {/* Hero Section */}
          <Hero
            onSelectPreset={handleSelectPreset}
            onScrollToForm={handleScrollToForm}
          />

          {/* User Input Form */}
          <div ref={formRef}>
            <EventForm
              presetData={selectedPreset}
              onClearPreset={() => setSelectedPreset(null)}
            />
          </div>

          {/* Error Notification & Dismiss State */}
          {error && (
            <div className="card-glass rounded-2xl p-5 mb-8 border border-rose-300 dark:border-rose-900 bg-rose-50/80 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <AlertOctagon className="w-6 h-6 text-rose-600 shrink-0" />
                <div>
                  <h4 className="font-extrabold text-sm">Generation Error</h4>
                  <p className="text-xs opacity-90 mt-0.5">{error}</p>
                </div>
              </div>
              <button
                onClick={() => setError(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shrink-0 self-end sm:self-auto cursor-pointer"
              >
                Dismiss & Retry
              </button>
            </div>
          )}

          {/* Loading Skeletons */}
          {isLoading && <LoadingSkeleton />}

          {/* AI-Generated Output (Rendered in 7 Tabs) */}
          {!isLoading && plan && (
            <div ref={planSectionRef} className="space-y-6 pt-4">
              <ProgressTracker />
              <TabsNav />
              <div className="card-glass rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl shadow-amber-500/5 min-h-[500px]">
                <TabContentRenderer activeTab={activeTab} />
              </div>
            </div>
          )}
        </main>

        {/* Floating "Ask the Planner" Action Button */}
        {plan && (
          <aside aria-label="Planner chat assistant">
            <button
              onClick={() => setIsChatOpen(true)}
              className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 sm:px-5 py-3 rounded-full font-black text-xs sm:text-sm text-white bg-gradient-to-r from-amber-600 via-rose-600 to-purple-600 hover:from-amber-700 hover:via-rose-700 hover:to-purple-700 shadow-2xl shadow-amber-600/40 hover:scale-105 active:scale-95 transition-all cursor-pointer group"
              aria-label="Ask the AI Planner for edits"
            >
              <div className="relative">
                <MessageSquareText className="w-5 h-5" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white absolute -top-0.5 -right-0.5 animate-ping" />
              </div>
              <span className="hidden sm:inline">Ask the Planner</span>
              <span className="sm:hidden">Planner</span>
            </button>
          </aside>
        )}

        {/* Modals & Drawers */}
        <ChatPlannerModal />
        <ExportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
        />
        <ApiKeyModal
          isOpen={isApiKeyOpen}
          onClose={() => setIsApiKeyOpen(false)}
        />

        {/* Celebratory Footer */}
        <footer className="w-full border-t border-amber-200/60 dark:border-slate-800 py-8 mt-16 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xs text-center text-xs text-slate-500 dark:text-slate-400 no-print">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-800 dark:text-slate-200">
                EventCraft AI
              </span>
              <span>•</span>
              <span>Powered by Google Gemini AI</span>
            </div>
            <div className="flex items-center gap-1 text-[11px]">
              <span>Crafted for joyous celebrations, weddings, and community galas</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-500 inline" />
            </div>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
}
