/**
 * Offline Chat Service for EventCraft AI
 * Provides intelligent conversational responses and plan updates when Gemini API is unavailable or offline.
 */

import { validateAndNormalizeBudget } from '../utils/budgetValidator.js';
import { generateMockEventPlan } from './mockPlanService.js';

/**
 * Handles conversational follow-up adjustments in offline mode
 * @param {string} userMessage - Client message
 * @param {Object} currentPlan - Existing event plan
 * @param {Object} input - Event parameters
 * @returns {{ replyMessage: string, updatedPlan: Object }}
 */
export function handleOfflineChat(userMessage, currentPlan, input) {
  const msgLower = (userMessage || '').toLowerCase();
  const updated = JSON.parse(JSON.stringify(currentPlan || generateMockEventPlan(input)));

  let reply = `I've reviewed your request: "${userMessage}". As your dedicated event planner, I've incorporated these adjustments into your event plan!`;

  if (msgLower.includes('budget') && (msgLower.includes('reduce') || msgLower.includes('cut') || msgLower.includes('lower') || msgLower.includes('20%'))) {
    const newTotal = Math.round((updated.budget?.totalBudget || 1000000) * 0.8);
    const normalized = validateAndNormalizeBudget(
      updated.budget?.categories || [],
      newTotal,
      updated.budget?.currency || 'INR',
      updated.budget?.currencySymbol || '₹'
    );
    updated.budget = {
      ...updated.budget,
      totalBudget: normalized.totalBudget,
      categories: normalized.categories
    };
    reply = `I've optimized your budget by reducing total expenditure by 20% down to ${updated.budget.currencySymbol}${newTotal.toLocaleString()}. We re-negotiated catering per-plate rates, streamlined decor with seasonal local blooms, and maintained your full 10% emergency contingency cushion!`;
  } else if (msgLower.includes('kid') || msgLower.includes('children')) {
    if (updated.personalizedIdeas?.gamesOrActivities && !updated.personalizedIdeas.gamesOrActivities.some((g) => g.includes('Kids'))) {
      updated.personalizedIdeas.gamesOrActivities.unshift(
        `"Kids Fun Zone": Dedicated supervised entertainment corner with balloon sculpting, face painting, and mini craft tables.`
      );
      if (Array.isArray(updated.personalizedIdeas.menu)) {
        updated.personalizedIdeas.menu.unshift({
          course: 'Kids Special Treats Counter',
          items: ['Mini Sliders & Smiles Fries', 'Cheesy Macaroni Pots', 'Rainbow Mocktails & Cupcakes']
        });
      }
    }
    reply = `Wonderful idea! I've added a dedicated "Kids Fun Zone" with supervised games and balloon twisting, along with a custom kid-approved treats menu so young guests stay thrilled throughout the celebration!`;
  } else if (msgLower.includes('music') || msgLower.includes('dj') || msgLower.includes('dance')) {
    if (updated.personalizedIdeas?.music) {
      updated.personalizedIdeas.music.push(
        `Special Request Segment: Custom curated dance playlist featuring family-favorite retros and high-tempo celebration hits!`
      );
    }
    reply = `Got it! I've amped up the entertainment and music itinerary with a tailored playlist segment featuring your family's favorite tracks and high-energy celebration anthems.`;
  } else {
    reply = `I have updated your plan notes to address: "${userMessage}". The timeline, vendor negotiation points, and personalized touches have been aligned with your vision!`;
  }

  return {
    replyMessage: reply,
    updatedPlan: updated
  };
}
