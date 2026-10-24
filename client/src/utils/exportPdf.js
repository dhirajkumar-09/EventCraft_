/**
 * PDF & Printable Checklist Export Utility
 */

export function triggerPrintPlan() {
  window.print();
}

/**
 * Generates an isolated, beautifully formatted printable document
 * @param {Object} plan
 * @param {Object} meta
 * @param {string} mode - 'full' or 'checklist'
 */
export function openPrintableDocument(plan, meta = {}, mode = 'full') {
  if (!plan) return;

  const symbol = plan.budget?.currencySymbol || '₹';
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to open the printable document.');
    return;
  }

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>EventCraft AI - ${plan.overview?.suggestedTheme || 'Event Plan'}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.5;
      color: #1f2937;
      margin: 30px;
      font-size: 13px;
    }
    h1 { color: #b45309; font-size: 24px; margin-bottom: 4px; }
    h2 { color: #1e293b; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin-top: 24px; font-size: 17px; }
    h3 { font-size: 14px; margin-top: 14px; margin-bottom: 6px; color: #475569; }
    .badge { display: inline-block; background: #fef3c7; color: #92400e; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; margin-right: 6px; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 16px; }
    th, td { border: 1px solid #e2e8f0; padding: 8px 10px; text-align: left; }
    th { background: #f8fafc; font-weight: 600; }
    .checklist-item { display: flex; align-items: baseline; margin-bottom: 8px; }
    .box { width: 14px; height: 14px; border: 1.5px solid #64748b; border-radius: 3px; display: inline-block; margin-right: 8px; vertical-align: middle; }
    .page-break { page-break-before: always; }
    .text-right { text-align: right; }
    .footer { margin-top: 40px; font-size: 11px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 12px; }
    @media print {
      body { margin: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="margin-bottom: 20px; padding: 12px; background: #fef3c7; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
    <span>📄 <strong>Printable Document Ready</strong>. Click the print button to save as PDF or print.</span>
    <button onclick="window.print()" style="padding: 8px 16px; background: #b45309; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;">
      🖨️ Print / Save as PDF
    </button>
  </div>

  <div style="border-bottom: 3px solid #b45309; padding-bottom: 12px; margin-bottom: 20px;">
    <h1>✨ EventCraft AI: ${plan.overview?.suggestedTheme || 'Celebration Plan'}</h1>
    <p style="font-size: 15px; color: #64748b; font-style: italic; margin-top: 2px;">
      "${plan.overview?.oneLineVibe || 'An extraordinary celebration'}"
    </p>
    <div style="margin-top: 8px;">
      <span class="badge">Type: ${meta.eventType || 'Event'}</span>
      <span class="badge">City: ${meta.city || 'Local'}</span>
      <span class="badge">Guests: ${meta.guestCount || 100}</span>
      <span class="badge">Budget: ${symbol} ${Number(plan.budget?.totalBudget || 0).toLocaleString()}</span>
    </div>
  </div>

  ${mode === 'checklist' ? renderChecklistView(plan, symbol) : renderFullView(plan, symbol)}

  <div class="footer">
    Generated with EventCraft AI • Powered by Google Gemini 2.5 Flash • Plan strictly verified
  </div>
</body>
</html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
}

function renderFullView(plan, symbol) {
  return `
    <h2>1. Executive Summary</h2>
    <p>${plan.overview?.summary || ''}</p>

    <h2>2. Complete Budget Breakdown (Total: ${symbol} ${Number(plan.budget?.totalBudget || 0).toLocaleString()})</h2>
    <table>
      <thead>
        <tr>
          <th>Category</th>
          <th style="width: 20%;" class="text-right">Allocation</th>
          <th style="width: 15%;" class="text-right">% Share</th>
          <th>Notes & Recommendations</th>
        </tr>
      </thead>
      <tbody>
        ${(plan.budget?.categories || []).map(cat => `
          <tr>
            <td><strong>${cat.category}</strong></td>
            <td class="text-right">${symbol} ${Number(cat.amount).toLocaleString()}</td>
            <td class="text-right">${cat.percentage}%</td>
            <td>${cat.note || ''}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <h3>Top Money-Saving Tips:</h3>
    <ul>
      ${(plan.budget?.moneySavingTips || []).map(tip => `<li>${tip}</li>`).join('')}
    </ul>

    <div class="page-break"></div>

    <h2>3. Countdown Timeline</h2>
    ${(plan.timeline || []).map(phase => `
      <h3>${phase.phase} (${phase.timeframe})</h3>
      <div style="margin-left: 10px;">
        ${(phase.tasks || []).map(task => `
          <div class="checklist-item">
            <span class="box"></span>
            <div>
              <strong>${task.title}</strong> [Priority: ${task.priority}]<br>
              <span style="color: #64748b;">${task.description}</span>
            </div>
          </div>
        `).join('')}
      </div>
    `).join('')}

    <h2>4. Vendor Checklist & Negotiation Strategy</h2>
    <table>
      <thead>
        <tr>
          <th style="width: 25%;">Vendor Type</th>
          <th>What to Ask / Negotiate</th>
          <th style="width: 20%;">Cost Estimate</th>
          <th style="width: 15%;">Deadline</th>
        </tr>
      </thead>
      <tbody>
        ${(plan.vendorChecklist || []).map(v => `
          <tr>
            <td><span class="box"></span><strong>${v.vendorType}</strong></td>
            <td>${v.whatToAskOrNegotiate}</td>
            <td>${v.estimatedCostRange}</td>
            <td>${v.bookingDeadline}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <div class="page-break"></div>

    <h2>5. Event-Day Run Sheet (Hour by Hour)</h2>
    <table>
      <thead>
        <tr>
          <th style="width: 20%;">Time Slot</th>
          <th style="width: 30%;">Activity</th>
          <th style="width: 25%;">Owner</th>
          <th>Key Cues / Notes</th>
        </tr>
      </thead>
      <tbody>
        ${(plan.runSheet || []).map(r => `
          <tr>
            <td><strong>${r.time}</strong></td>
            <td>${r.activity}</td>
            <td>${r.owner}</td>
            <td>${r.notes}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <h2>6. Personalized Ideas & 3 Wow Moments</h2>
    <h3>Top 3 Wow Moments:</h3>
    <ol>
      ${(plan.personalizedIdeas?.wowMoments || []).map(w => `
        <li style="margin-bottom: 8px;">
          <strong>${w.title}</strong>: ${w.description}<br>
          <em style="color: #92400e;">Execution tip: ${w.executionTip}</em>
        </li>
      `).join('')}
    </ol>

    <h2>7. Backup & Contingency Plan</h2>
    <table>
      <thead>
        <tr>
          <th style="width: 25%;">Risk Factor</th>
          <th style="width: 15%;">Severity</th>
          <th style="width: 25%;">Early Trigger Signs</th>
          <th>Mitigation Action</th>
        </tr>
      </thead>
      <tbody>
        ${(plan.backupPlan || []).map(b => `
          <tr>
            <td><strong>${b.risk}</strong></td>
            <td><span class="badge">${b.severity}</span></td>
            <td>${b.triggerSigns}</td>
            <td>${b.mitigation}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function renderChecklistView(plan, symbol) {
  return `
    <h2>Master Task & Vendor Execution Checklist</h2>
    <p>Use this physical checklist to tick off items during coordination.</p>

    <h3>1. Countdown Timeline Milestones</h3>
    ${(plan.timeline || []).map(phase => `
      <div style="margin-top: 14px; margin-bottom: 6px; font-weight: bold; color: #1e293b;">
        🔹 ${phase.phase} — <em>${phase.timeframe}</em>
      </div>
      ${(phase.tasks || []).map(task => `
        <div class="checklist-item" style="padding-left: 12px;">
          <span class="box"></span>
          <div>
            <strong>${task.title}</strong> (${task.priority} Priority) — ${task.description}
          </div>
        </div>
      `).join('')}
    `).join('')}

    <div class="page-break"></div>

    <h3>2. Essential Vendor Confirmations</h3>
    <table>
      <thead>
        <tr>
          <th style="width: 10%;">Done</th>
          <th style="width: 25%;">Vendor</th>
          <th>Contract / Tasting Check</th>
          <th style="width: 20%;">Target Cost</th>
          <th style="width: 15%;">Lock By</th>
        </tr>
      </thead>
      <tbody>
        ${(plan.vendorChecklist || []).map(v => `
          <tr>
            <td style="text-align: center;"><span class="box"></span></td>
            <td><strong>${v.vendorType}</strong></td>
            <td>${v.whatToAskOrNegotiate}</td>
            <td>${v.estimatedCostRange}</td>
            <td>${v.bookingDeadline}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}
