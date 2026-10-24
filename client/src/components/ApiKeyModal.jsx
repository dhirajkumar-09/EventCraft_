import React, { useState } from 'react';
import { Key, X, Check, ShieldCheck } from 'lucide-react';
import { useEvent } from '../context/useEvent.js';

export default function ApiKeyModal({ isOpen, onClose }) {
  const { customApiKey, saveCustomApiKey, serverStatus } = useEvent();
  const [keyInput, setKeyInput] = useState(customApiKey || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    saveCustomApiKey(keyInput);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleClear = () => {
    setKeyInput('');
    saveCustomApiKey('');
  };

  const isServerConfigured = Boolean(serverStatus?.apiKeyConfigured);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Google Gemini API Key Setup"
    >
      <div
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-amber-200 dark:border-slate-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-amber-200/60 dark:border-slate-800 flex items-center justify-between bg-amber-50/50 dark:bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-rose-600 flex items-center justify-center text-white shadow-sm">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Google Gemini API Setup
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Model: gemini-2.5-flash (Structured JSON)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Server status banner */}
          <div className={`p-3.5 rounded-2xl border flex items-start gap-3 ${
            isServerConfigured
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
              : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
          }`}>
            <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-bold">
                {isServerConfigured
                  ? 'Backend Server Key Configured (.env)'
                  : 'Backend running in Intelligent Planner Mode'}
              </p>
              <p className="text-[11px] opacity-80 mt-0.5">
                {isServerConfigured
                  ? 'Your backend has GEMINI_API_KEY loaded and is ready to query gemini-2.5-flash.'
                  : 'You can test with our rich planner generator, or optionally provide your personal Gemini API key below.'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Custom Gemini API Key (Optional Override)
              </label>
              <input
                type="password"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-amber-500 focus:outline-none text-xs font-mono"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Keys are never stored in public repositories or sent anywhere except via the secure server proxy.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              {customApiKey && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-xs text-rose-600 hover:text-rose-700 font-semibold"
                >
                  Clear Key
                </button>
              )}

              <div className="flex gap-2 ml-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-sm flex items-center gap-1.5"
                >
                  {savedSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Saved!</span>
                    </>
                  ) : (
                    <span>Save Key</span>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
