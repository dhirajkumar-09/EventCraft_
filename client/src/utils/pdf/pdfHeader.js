import { PDF_COLORS, PDF_DIMENSIONS, hexToRgb } from './pdfConfig.js';

/**
 * Draws top branding and aesthetic header on the cover page
 */
export function drawPdfHeader(doc, plan, meta, totalBudgetStr) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = PDF_DIMENSIONS.MARGIN;
  const contentWidth = pageWidth - margin * 2;

  // Top Decorative Gradient Bars
  doc.setFillColor(...PDF_COLORS.PRIMARY);
  doc.rect(0, 0, pageWidth, PDF_DIMENSIONS.HEADER_HEIGHT, 'F');
  doc.setFillColor(...PDF_COLORS.SECONDARY);
  doc.rect(0, PDF_DIMENSIONS.HEADER_HEIGHT, pageWidth, PDF_DIMENSIONS.ACCENT_HEIGHT, 'F');

  let currentY = 18;

  // Brand Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(...PDF_COLORS.PRIMARY);
  doc.text('EventCraft AI', margin, currentY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...PDF_COLORS.MUTED);
  doc.text('GenAI Celebration & Event Dossier • Gemini 3.5 Flash', margin, currentY + 5);

  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  doc.setFontSize(9);
  doc.text(`Generated: ${dateStr}`, pageWidth - margin, currentY, { align: 'right' });
  doc.text('Strict Budget Verified ✓', pageWidth - margin, currentY + 5, { align: 'right' });

  currentY += 14;

  // Theme Hero Card
  doc.setFillColor(...PDF_COLORS.LIGHT_BG);
  doc.setDrawColor(...PDF_COLORS.BORDER);
  doc.roundedRect(margin, currentY, contentWidth, 34, 4, 4, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...PDF_COLORS.DARK);
  const themeTitle = plan.overview?.suggestedTheme || 'Celebration Plan';
  doc.text(themeTitle, margin + 5, currentY + 8);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(10);
  doc.setTextColor(...PDF_COLORS.PRIMARY);
  const vibeText = `"${plan.overview?.oneLineVibe || 'An extraordinary celebration'}"`;
  doc.text(vibeText, margin + 5, currentY + 14);

  // Key Specs Badges
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  const specs = [
    `Event: ${meta.eventType || 'Celebration'}`,
    `Location: ${meta.city || 'City'}`,
    `Guests: ~${meta.guestCount || 100}`,
    `Budget: ${totalBudgetStr}`,
    `Cuisine: ${meta.cuisineDiet || 'Mixed'}`
  ];
  doc.text(specs.join('   •   '), margin + 5, currentY + 24);

  currentY += 42;

  // Executive Summary
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...PDF_COLORS.PRIMARY);
  doc.text('EXECUTIVE OVERVIEW', margin, currentY);
  currentY += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(...PDF_COLORS.TEXT);
  const summaryLines = doc.splitTextToSize(plan.overview?.summary || '', contentWidth);
  doc.text(summaryLines, margin, currentY);
  currentY += summaryLines.length * 4.8 + 6;

  // Color Palette Swatches
  if (plan.overview?.colorPalette && plan.overview.colorPalette.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...PDF_COLORS.MUTED);
    doc.text('SIGNATURE PALETTE:', margin, currentY);

    let swatchX = margin + 38;
    plan.overview.colorPalette.forEach((swatch) => {
      const rgb = hexToRgb(swatch.hex);
      doc.setFillColor(rgb[0], rgb[1], rgb[2]);
      doc.roundedRect(swatchX, currentY - 3.5, 6, 4.5, 1, 1, 'F');

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...PDF_COLORS.TEXT);
      doc.text(swatch.name, swatchX + 8, currentY);

      swatchX += doc.getTextWidth(swatch.name) + 16;
    });

    currentY += 8;
  }

  return currentY;
}
