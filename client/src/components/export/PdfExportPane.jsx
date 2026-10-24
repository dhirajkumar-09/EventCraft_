import React from 'react';
import { FileDown, Printer, CheckSquare } from 'lucide-react';
import { exportStructuredPdf, triggerPrintPlan } from '../../utils/exportPdf.js';

export default function PdfExportPane({ plan, meta, activeExportMode }) {
  if (activeExportMode === 'checklist') {
    return (
      <div className="space-y-4 text-center py-6">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 flex items-center justify-center">
          <CheckSquare className="w-8 h-8" />
        </div>
        <h4 className="text-base font-bold text-slate-900 dark:text-white">
          Printable Physical Vendor & Task Checklist
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Generates an ink-friendly document with checkboxes, vendor negotiation prompts, and deadlines.
        </p>

        <div className="pt-2 flex justify-center gap-3">
          <button
            onClick={() => triggerPrintPlan()}
            className="px-6 py-3 rounded-xl text-xs font-extrabold bg-purple-600 hover:bg-purple-700 text-white shadow-md flex items-center gap-2 cursor-pointer transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Open Print Dialog</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 text-center py-6">
      <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center">
        <FileDown className="w-8 h-8" />
      </div>
      <h4 className="text-base font-bold text-slate-900 dark:text-white">
        Download Complete Master Event Plan (PDF)
      </h4>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
        Structured multi-page document featuring all 7 sections, exact budget math, countdown milestones, and backup protocols.
      </p>

      <div className="pt-2 flex justify-center gap-3">
        <button
          onClick={() => exportStructuredPdf(plan, meta)}
          className="px-6 py-3 rounded-xl text-xs font-extrabold bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 text-white shadow-md flex items-center gap-2 cursor-pointer transition-all"
        >
          <FileDown className="w-4 h-4" />
          <span>Download Master PDF</span>
        </button>

        <button
          onClick={() => triggerPrintPlan()}
          className="px-4 py-3 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer transition-all"
        >
          <Printer className="w-4 h-4" />
          <span>Print</span>
        </button>
      </div>
    </div>
  );
}
