/**
 * Formats EventCraft AI plan for WhatsApp sharing
 */

export function generateWhatsAppSummary(plan, meta = {}) {
  if (!plan) return '';

  const { overview, budget, personalizedIdeas, backupPlan } = plan;
  const symbol = budget?.currencySymbol || '₹';
  const total = Number(budget?.totalBudget || 0).toLocaleString();

  const lines = [
    `✨ *EVENT PLAN: ${overview?.suggestedTheme || 'Celebration'}* ✨`,
    `🎉 *Type:* ${meta.eventType || 'Special Event'} | 📍 *City:* ${meta.city || 'City'}`,
    `📅 *Vibe:* _${overview?.oneLineVibe || 'Unforgettable celebration'}_`,
    ``,
    `💰 *TOTAL BUDGET:* ${symbol} ${total}`,
    `──────────────`,
  ];

  if (budget?.categories) {
    budget.categories.slice(0, 6).forEach(cat => {
      lines.push(`• *${cat.name || cat.category}:* ${symbol}${Number(cat.amount).toLocaleString()} (${cat.percentage}%)`);
    });
    if (budget.categories.length > 6) {
      lines.push(`• _+${budget.categories.length - 6} other categories including 10% contingency buffer_`);
    }
  }

  lines.push(``);
  lines.push(`🌟 *TOP WOW MOMENTS:*`);
  if (personalizedIdeas?.wowMoments) {
    personalizedIdeas.wowMoments.forEach((w, i) => {
      lines.push(`${i + 1}. *${w.title}* - ${w.description.slice(0, 100)}...`);
    });
  }

  lines.push(``);
  lines.push(`🛡️ *KEY BACKUP PLAN:*`);
  if (backupPlan && backupPlan[0]) {
    lines.push(`• *Risk:* ${backupPlan[0].risk}`);
    lines.push(`• *Mitigation:* ${backupPlan[0].mitigation.slice(0, 120)}...`);
  }

  lines.push(``);
  lines.push(`🪄 *Organized with EventCraft AI* (Powered by Google Gemini)`);

  return lines.join('\n');
}

export function openWhatsAppShare(text) {
  const encoded = encodeURIComponent(text);
  const url = `https://api.whatsapp.com/send?text=${encoded}`;
  window.open(url, '_blank');
}
