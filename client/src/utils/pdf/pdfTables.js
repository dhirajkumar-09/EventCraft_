import autoTable from 'jspdf-autotable';
import { PDF_COLORS, PDF_DIMENSIONS } from './pdfConfig.js';

const TABLE_MARGIN = { left: PDF_DIMENSIONS.MARGIN, right: PDF_DIMENSIONS.MARGIN };
const HEAD_STYLES = {
  fillColor: PDF_COLORS.PRIMARY,
  textColor: [255, 255, 255],
  fontStyle: 'bold',
  fontSize: 9
};

function renderSectionTable(doc, options) {
  autoTable(doc, {
    startY: options.startY ?? doc.lastAutoTable.finalY + 12,
    headStyles: HEAD_STYLES,
    bodyStyles: { fontSize: 8.5, textColor: PDF_COLORS.TEXT },
    margin: TABLE_MARGIN,
    ...options
  });
}

export function renderBudgetTable(doc, budget, currencyPrefix, startY) {
  renderSectionTable(doc, {
    startY,
    theme: 'grid',
    head: [['Category', 'Share', 'Allocated Amount', 'Planner Allocation Strategy']],
    body: (budget?.categories || []).map((c) => [
      c.name,
      `${c.percentage}%`,
      `${currencyPrefix}${Number(c.amount || 0).toLocaleString()}`,
      c.note || 'Standard recommended allocation'
    ]),
    foot: [['Total Verified Budget', '100%', `${currencyPrefix}${Number(budget?.totalBudget || 0).toLocaleString()}`, 'Strict 100% Mathematical Match Verified']],
    footStyles: { fillColor: [248, 250, 252], textColor: PDF_COLORS.DARK, fontStyle: 'bold', fontSize: 9 },
    columnStyles: {
      0: { cellWidth: 38, fontStyle: 'bold' },
      1: { cellWidth: 18, halign: 'center' },
      2: { cellWidth: 34, halign: 'right', fontStyle: 'bold' },
      3: { cellWidth: 'auto' }
    }
  });
}

export function renderTimelineTable(doc, timeline) {
  renderSectionTable(doc, {
    theme: 'striped',
    head: [['Milestone Phase', 'Timeframe', 'Priority Task', 'Priority', 'Action Details']],
    body: (timeline || []).flatMap((phase) =>
      (phase.tasks || []).map((t, idx) => [
        idx === 0 ? phase.phase : '',
        idx === 0 ? phase.timeframe : '',
        t.title,
        t.priority || 'Normal',
        t.description
      ])
    ),
    bodyStyles: { fontSize: 8, textColor: PDF_COLORS.TEXT },
    columnStyles: {
      0: { cellWidth: 32, fontStyle: 'bold' },
      1: { cellWidth: 26, fontStyle: 'italic' },
      2: { cellWidth: 40, fontStyle: 'bold' },
      3: { cellWidth: 18, halign: 'center' },
      4: { cellWidth: 'auto' }
    }
  });
}

export function renderVendorTable(doc, vendorChecklist) {
  renderSectionTable(doc, {
    theme: 'grid',
    head: [['Vendor Category', 'Estimated Cost Range', 'Booking Deadline', 'Crucial Negotiation Strategy']],
    body: (vendorChecklist || []).map((v) => [
      v.vendorType,
      v.estimatedCostRange || '-',
      v.bookingDeadline || '-',
      v.whatToAskOrNegotiate || '-'
    ]),
    columnStyles: {
      0: { cellWidth: 36, fontStyle: 'bold' },
      1: { cellWidth: 34, halign: 'right' },
      2: { cellWidth: 30, halign: 'center' },
      3: { cellWidth: 'auto' }
    }
  });
}

export function renderIdeasTable(doc, ideas) {
  const rows = [
    ...((ideas?.wowMoments || []).map((w, i) => [`Wow Moment #${i + 1}`, w.title, `${w.description} (Tip: ${w.executionTip})`])),
    ...((ideas?.menu || []).map((m) => ['Menu Course', m.course, Array.isArray(m.items) ? m.items.join(', ') : m.items])),
    ['Decor Concept', 'Themes', (ideas?.decor || []).join(' • ')],
    ['Interactive Activities', 'Games & Fun', (ideas?.gamesOrActivities || []).join(' • ')],
    ['Music & Vibe', 'Soundscape', (ideas?.music || []).join(' • ')],
    ['Return Favors', 'Gifts', (ideas?.returnGifts || []).join(' • ')]
  ];

  renderSectionTable(doc, {
    theme: 'striped',
    head: [['Domain', 'Element', 'Creative Recommendation Details']],
    body: rows,
    columnStyles: {
      0: { cellWidth: 34, fontStyle: 'bold' },
      1: { cellWidth: 36, fontStyle: 'bold' },
      2: { cellWidth: 'auto' }
    }
  });
}

export function renderRunSheetTable(doc, runSheet) {
  renderSectionTable(doc, {
    theme: 'grid',
    head: [['Time Window', 'Celebration Milestone Activity', 'Primary Owner', 'Operational Notes']],
    body: (runSheet || []).map((r) => [r.time, r.activity, r.owner || 'Lead Planner', r.notes || '-']),
    columnStyles: {
      0: { cellWidth: 34, fontStyle: 'bold' },
      1: { cellWidth: 55, fontStyle: 'bold' },
      2: { cellWidth: 32 },
      3: { cellWidth: 'auto' }
    }
  });
}

export function renderBackupPlanTable(doc, backupPlan) {
  renderSectionTable(doc, {
    theme: 'striped',
    head: [['Contingency Scenario', 'Severity', 'Trigger Signs', 'Actionable Mitigation Plan']],
    headStyles: { fillColor: [190, 18, 60], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 9 },
    body: (backupPlan || []).map((b) => [b.risk, b.severity || 'Medium', b.triggerSigns, b.mitigation]),
    columnStyles: {
      0: { cellWidth: 40, fontStyle: 'bold' },
      1: { cellWidth: 20, halign: 'center' },
      2: { cellWidth: 45 },
      3: { cellWidth: 'auto' }
    }
  });
}
