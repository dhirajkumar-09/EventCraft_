import React, { useState } from 'react';
import {
  X,
  Share2,
  Printer,
  FileDown,
  Copy,
  Check,
  CheckSquare,
  MessageCircle,
  ExternalLink
} from 'lucide-react';
import { useEvent } from '../context/EventContext.jsx';
import { generateWhatsAppSummary, openWhatsAppShare } from '../utils/whatsappFormat.js';
import { openPrintableDocument, triggerPrintPlan } from '../utils/exportPdf.js';

export default function ExportModal({ isOpen, onClose }) {
  const { plan, meta } = useEvent();
  const [copied, setCopied] = useState(false);
  const [activeExportMode, setActiveExportMode] = useState('whatsapp');

  if (!isOpen || !plan) return null;

  const whatsappText = generateWhatsAppSummary(plan, meta);

  const handleCopy = () => {
    navigator.clipboard.writeText(whatsappText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Export and Share Event Plan"
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-amber-200 dark:border-slate-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-amber-200/60 dark:border-slate-800 flex items-center justify-between bg-amber-50/50 dark:bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-rose-600 flex items-center justify-center text-white shadow-sm">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                Export & Share Celebration Dossier
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                PDF download, printable vendor checklist, and WhatsApp summary
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
          <button
            onClick={() => setActiveExportMode('whatsapp')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeExportMode === 'whatsapp'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp Summary</span>
          </button>

          <button
            onClick={() => setActiveExportMode('pdf')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeExportMode === 'pdf'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <FileDown className="w-4 h-4" />
            <span>Full Plan PDF</span>
          </button>

          <button
            onClick={() => setActiveExportMode('checklist')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeExportMode === 'checklist'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>Printable Checklist</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {activeExportMode === 'whatsapp' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Formatted WhatsApp Message Preview
                </span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy Text'}</span>
                </button>
              </div>

              <textarea
                readOnly
                rows="8"
                value={whatsappText}
                className="w-full p-4 rounded-2xl border bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 font-mono text-xs border-slate-200 dark:border-slate-700 focus:outline-none resize-none"
              />

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => openWhatsAppShare(whatsappText)}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-black text-xs text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send Directly via WhatsApp</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </button>
              </div>
            </div>
          )}

          {activeExportMode === 'pdf' && (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-slate-800 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-sm">
                <FileDown className="w-7 h-7" />
              </div>
              <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                Export Complete Executive Plan as PDF
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                Generates a clean, formatted document with executive overview, budget breakdown table, timeline countdown, vendor contacts, run sheet, and contingency mitigations.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => {
                    openPrintableDocument(plan, meta, 'full');
                    onClose();
                  }}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-black text-xs text-white bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 shadow-lg shadow-amber-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Printer className="w-4 h-4" />
                  <span>Open Print / Save PDF View</span>
                </button>
              </div>
            </div>
          )}

          {activeExportMode === 'checklist' && (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-slate-800 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto shadow-sm">
                <CheckSquare className="w-7 h-7" />
              </div>
              <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                Physical Event Coordinator Checklist
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                Generates an ink-friendly, tickable physical checklist containing milestone countdown tasks and essential vendor confirmation columns for day-of coordination.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => {
                    openPrintableDocument(plan, meta, 'checklist');
                    onClose();
                  }}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-black text-xs text-white bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Printer className="w-4 h-4" />
                  <span>Open Printable Checklist View</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
