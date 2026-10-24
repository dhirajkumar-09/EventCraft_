import React from 'react';
import {
  RotateCw,
  MessageSquare,
  DollarSign,
  CalendarClock,
  CheckCircle2
} from 'lucide-react';
import { useEvent } from '../../context/useEvent.js';

export default function VendorChecklistTab() {
  const {
    plan,
    checkedItems,
    toggleCheckItem,
    regenerateSingleSection,
    regeneratingSection
  } = useEvent();

  if (!plan?.vendorChecklist) return null;

  const { vendorChecklist } = plan;
  const isRegenerating = regeneratingSection === 'vendorChecklist';

  const completedCount = (vendorChecklist || []).filter((v) => checkedItems[v.id]).length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Section Header with Regenerate */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-amber-200/50 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
              Section 4 of 7
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {completedCount} / {vendorChecklist.length} booked
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2 mt-0.5">
            <span>Vendor Checklist & Negotiation Playbook</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Questions to ask, negotiation levers, local market rates, and booking deadlines.
          </p>
        </div>

        <button
          onClick={() => regenerateSingleSection('vendorChecklist')}
          disabled={isRegenerating}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-slate-700 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-slate-700 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin text-amber-600' : ''}`} />
          <span>{isRegenerating ? 'Updating Vendors...' : 'Regenerate Vendors'}</span>
        </button>
      </div>

      {/* Vendor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(vendorChecklist || []).map((vendor) => {
          const isChecked = Boolean(checkedItems[vendor.id]);

          return (
            <div
              key={vendor.id}
              onClick={() => toggleCheckItem(vendor.id)}
              className={`group p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                isChecked
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 opacity-80'
                  : 'card-glass border-amber-200/60 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-500 shadow-sm'
              }`}
            >
              <div>
                {/* Header: Checkbox + Vendor Type */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300 cursor-pointer shrink-0 mt-0.5"
                      aria-label={`Mark ${vendor.vendorType} booked`}
                    />
                    <h4
                      className={`text-sm sm:text-base font-black text-slate-900 dark:text-white transition-all ${
                        isChecked ? 'line-through text-slate-400 dark:text-slate-500' : ''
                      }`}
                    >
                      {vendor.vendorType}
                    </h4>
                  </div>

                  {isChecked ? (
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Booked
                    </span>
                  ) : (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-300 shrink-0">
                      Pending
                    </span>
                  )}
                </div>

                {/* What to ask / negotiate */}
                <div className="p-3 rounded-xl bg-amber-50/50 dark:bg-slate-800/60 border border-amber-200/40 dark:border-slate-700/60 mb-4">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 mb-1">
                    <MessageSquare className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                    <span>What to Ask & Negotiate</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {vendor.whatToAskOrNegotiate}
                  </p>
                </div>
              </div>

              {/* Footer: Estimated Price & Booking Deadline */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-1 text-slate-900 dark:text-white font-bold">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{vendor.estimatedCostRange}</span>
                </div>

                <div className="flex items-center gap-1 text-amber-700 dark:text-amber-400">
                  <CalendarClock className="w-3.5 h-3.5" />
                  <span>Lock by {vendor.bookingDeadline}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
