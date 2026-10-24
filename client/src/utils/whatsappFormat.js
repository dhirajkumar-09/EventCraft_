/**
 * Formats EventCraft AI plan for WhatsApp sharing
 */

/**
 * Builds opening header lines for the WhatsApp message
 * @param {Object} overview
 * @param {Object} meta
 * @param {string} symbol
 * @param {string} total
 * @returns {Array<string>}
 */
function formatHeaderLines(overview, meta, symbol, total) {
  return [
    `✨ *EVENT PLAN: ${overview?.suggestedTheme || 'Celebration'}* ✨`,
    `🎉 *Type:* ${meta.eventType || 'Special Event'} | 📍 *City:* ${meta.city || 'City'}`,
    `📅 *Vibe:* _${overview?.oneLineVibe || 'Unforgettable celebration'}_`,
    '',
    `💰 *TOTAL BUDGET:* ${symbol} ${total}`,
    '──────────────'
  ];
}

/**
 * Builds key budget categories lines
 * @param {Array<Object>} categories
 * @param {string} symbol
 * @returns {Array<string>}
 */
function formatBudgetCategories(categories, symbol) {
  if (!Array.isArray(categories) || categories.length === 0) return [];
  const lines = categories.slice(0, 6).map((cat) => {
    const name = cat.name || cat.category;
    const amount = Number(cat.amount).toLocaleString();
    return `• *${name}:* ${symbol}${amount} (${cat.percentage}%)`;
  });

  if (categories.length > 6) {
    lines.push(`• _+${categories.length - 6} other categories including 10% contingency buffer_`);
  }
  return lines;
}

/**
 * Formats top wow moments
 * @param {Array<Object>} [wowMoments]
 * @returns {Array<string>}
 */
function formatWowMoments(wowMoments) {
  if (!Array.isArray(wowMoments) || wowMoments.length === 0) return [];
  return wowMoments.map((w, i) => `${i + 1}. *${w.title}* - ${w.description.slice(0, 100)}...`);
}

/**
 * Formats primary contingency risk
 * @param {Array<Object>} [backupPlan]
 * @returns {Array<string>}
 */
function formatBackupRisk(backupPlan) {
  if (!Array.isArray(backupPlan) || !backupPlan[0]) return [];
  return [
    `• *Risk:* ${backupPlan[0].risk}`,
    `• *Mitigation:* ${backupPlan[0].mitigation.slice(0, 120)}...`
  ];
}

/**
 * Converts master plan into high-impact WhatsApp markdown format
 * @param {Object} plan - Complete structured event plan
 * @param {Object} [meta={}] - Event parameters
 * @returns {string} Formatted WhatsApp message string
 */
export function generateWhatsAppSummary(plan, meta = {}) {
  if (!plan) return '';

  const { overview, budget, personalizedIdeas, backupPlan } = plan;
  const symbol = budget?.currencySymbol || '₹';
  const total = Number(budget?.totalBudget || 0).toLocaleString();

  const lines = [
    ...formatHeaderLines(overview, meta, symbol, total),
    ...formatBudgetCategories(budget?.categories, symbol),
    '',
    '🌟 *TOP WOW MOMENTS:*',
    ...formatWowMoments(personalizedIdeas?.wowMoments),
    '',
    '🛡️ *KEY BACKUP PLAN:*',
    ...formatBackupRisk(backupPlan),
    '',
    '🪄 *Organized with EventCraft AI* (Powered by Google Gemini)'
  ];

  return lines.join('\n');
}

/**
 * Opens WhatsApp web / mobile intent with encoded message
 * @param {string} text - Message content
 */
export function openWhatsAppShare(text) {
  const encoded = encodeURIComponent(text);
  const url = `https://api.whatsapp.com/send?text=${encoded}`;
  window.open(url, '_blank');
}
