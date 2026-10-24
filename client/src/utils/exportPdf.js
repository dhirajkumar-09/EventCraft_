/**
 * PDF Export & Printable Checklist Utility for EventCraft AI
 * Powered by jsPDF & jspdf-autotable for pixel-perfect structured PDF generation
 */

import { jsPDF } from 'jspdf';
import { PDF_COLORS, PDF_DIMENSIONS } from './pdf/pdfConfig.js';
import { drawPdfHeader } from './pdf/pdfHeader.js';
import {
  renderBudgetTable,
  renderTimelineTable,
  renderVendorTable,
  renderIdeasTable,
  renderRunSheetTable,
  renderBackupPlanTable
} from './pdf/pdfTables.js';

/**
 * Appends page numbering and branding footer to every page in the document
 * @param {jsPDF} doc
 */
function applyPageNumbersAndFooter(doc) {
  const totalPages = doc.internal.getNumberOfPages();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = PDF_DIMENSIONS.MARGIN;

  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...PDF_COLORS.MUTED);
    doc.text(
      'EventCraft AI • GenAI Celebration Dossier • Confidential & Custom Generated',
      margin,
      pageHeight - 6
    );
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 6, { align: 'right' });
  }
}

/**
 * Directly exports and triggers file download of a beautifully formatted structured PDF document.
 * @param {Object} plan - The complete structured event plan
 * @param {Object} [meta={}] - Event metadata (eventType, city, totalBudget, etc.)
 */
export function exportStructuredPdf(plan, meta = {}) {
  if (!plan) {
    if (typeof window !== 'undefined' && typeof window.alert === 'function') {
      window.alert('No event plan available to export.');
    }
    return;
  }

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const rawSymbol = plan.budget?.currencySymbol || meta.currencySymbol || '₹';
  const currencyPrefix = rawSymbol === '₹' ? 'INR ' : `${rawSymbol} `;
  const totalBudgetStr = `${currencyPrefix}${Number(plan.budget?.totalBudget || meta.totalBudget || 0).toLocaleString()}`;

  // 1. Header & Overview
  const startY = drawPdfHeader(doc, plan, meta, totalBudgetStr);

  // 2. Section Tables
  renderBudgetTable(doc, plan.budget, currencyPrefix, startY);
  renderTimelineTable(doc, plan.timeline);
  renderVendorTable(doc, plan.vendorChecklist);
  renderIdeasTable(doc, plan.personalizedIdeas);
  renderRunSheetTable(doc, plan.runSheet);
  renderBackupPlanTable(doc, plan.backupPlan);

  // 3. Footers
  applyPageNumbersAndFooter(doc);

  // 4. File Name Sanitization & Trigger Download
  const sanitizedCity = (meta.city || 'Celebration').replace(/[^a-zA-Z0-9]/g, '_');
  const sanitizedType = (meta.eventType || 'Event').replace(/[^a-zA-Z0-9]/g, '_');
  const fileName = `EventCraft_${sanitizedType}_${sanitizedCity}_MasterPlan.pdf`;

  doc.save(fileName);
}

/**
 * Triggers the browser native print dialog
 */
export function triggerPrintPlan() {
  window.print();
}

/**
 * Legacy alias for printable document export
 * @param {Object} plan
 * @param {Object} [meta={}]
 */
export function openPrintableDocument(plan, meta = {}) {
  exportStructuredPdf(plan, meta);
}
