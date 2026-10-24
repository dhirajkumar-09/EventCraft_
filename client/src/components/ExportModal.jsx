import React, { useState } from 'react';
import { X, Share2, MessageCircle, FileDown, CheckSquare } from 'lucide-react';
import { useEvent } from '../context/useEvent.js';
import { generateWhatsAppSummary } from '../utils/whatsappFormat.js';
import WhatsAppExportPane from './export/WhatsAppExportPane.jsx';
import PdfExportPane from './export/PdfExportPane.jsx';

/**
 * Multi-Format Celebration Export Modal
 * Provides PDF download, printable checklist, and WhatsApp formatted text
 */
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
        {/* Modal Header */}
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
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
          <button
            onClick={() => setActiveExportMode('whatsapp')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
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
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
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
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeExportMode === 'checklist'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>Printable Checklist</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6">
          {activeExportMode === 'whatsapp' ? (
            <WhatsAppExportPane whatsappText={whatsappText} onCopy={handleCopy} copied={copied} />
          ) : (
            <PdfExportPane plan={plan} meta={meta} activeExportMode={activeExportMode} />
          )}
        </div>
      </div>
    </div>
  );
}
