import React from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { openWhatsAppShare } from '../../utils/whatsappFormat.js';

export default function WhatsAppExportPane({ whatsappText, onCopy, copied }) {
  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60 flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300">
            Formatted WhatsApp Text
          </h4>
          <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">
            Pre-formatted with emojis, budget summary, and wow moments
          </p>
        </div>

        <button
          onClick={() => openWhatsAppShare(whatsappText)}
          className="px-4 py-2 rounded-xl text-xs font-extrabold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <span>Open in WhatsApp</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="relative">
        <textarea
          readOnly
          value={whatsappText}
          rows="10"
          className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-hidden resize-none leading-relaxed"
        />

        <button
          onClick={onCopy}
          className="absolute top-3 right-3 px-3 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600 flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Text</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
