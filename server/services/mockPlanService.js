/**
 * High-Fidelity Intelligent Fallback Generator
 * Generates rich, culturally sensitive, locally nuanced event plans
 * matching the exact JSON schema and strict budget math.
 */

import { validateAndNormalizeBudget } from '../utils/budgetValidator.js';
import { getPaletteForEventType } from '../data/colorPalettes.js';
import {
  getMockVendors,
  getMockPersonalizedIdeas,
  getMockRunSheet,
  getMockBackupPlan
} from '../data/mockTemplates.js';
import { generateAdaptiveTimeline } from './timelineGenerator.js';

export { generateAdaptiveTimeline };

/**
 * Computes an end-to-end master event plan deterministically with strict budget math
 * @param {Object} input - Event parameters
 * @returns {Object} Structured event plan conforming to eventPlanJsonSchema
 */
export function generateMockEventPlan(input) {
  const {
    eventType = 'Wedding',
    eventDate,
    city = 'Mumbai',
    venueType = 'banquet',
    guestCount = 150,
    totalBudget = 1000000,
    currency = 'INR',
    currencySymbol = '₹',
    cuisineDiet = 'mixed',
    themePreference = 'Royal Elegance',
    traditions = 'Traditional Indian with modern fusion',
    ageGroup = 'All ages (families, kids & elders)',
    specialRequests = ''
  } = input;

  const numericBudget = Math.max(1000, Math.round(Number(totalBudget) || 1000000));
  const guests = Math.max(10, Math.round(Number(guestCount) || 100));

  let daysRemaining = 60;
  if (eventDate) {
    const target = new Date(eventDate);
    const today = new Date();
    const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
    if (!isNaN(diff) && diff > 0) daysRemaining = diff;
  }

  const cityLower = (city || '').toLowerCase();
  const isMumbai = cityLower.includes('mumbai') || cityLower.includes('bombay');
  const isJaipur = cityLower.includes('jaipur') || cityLower.includes('rajasthan');

  const palette = getPaletteForEventType(eventType);

  let themeTitle = `${themePreference || 'Celebratory'} Soirée`;
  if (eventType.toLowerCase().includes('wedding')) {
    themeTitle = isJaipur
      ? 'Royal Rajputana Heritage Vivah'
      : isMumbai
      ? 'Coastal Luxe Bollywood Glamour'
      : 'Eternal Blooms & Golden Twilight';
  } else if (eventType.toLowerCase().includes('birthday')) {
    themeTitle = 'Gilded Jubilee & Carnival of Lights';
  } else if (eventType.toLowerCase().includes('baby')) {
    themeTitle = 'Pastel Clouds & Starlight Blessing';
  }

  const rawCategories = [
    {
      category: 'Venue & Infrastructure',
      amount: Math.round(numericBudget * 0.24),
      percentage: 24,
      note: `${venueType.toUpperCase()} venue rental in prime ${city}, including security and AC generator backup`
    },
    {
      category: 'Catering & Beverages',
      amount: Math.round(numericBudget * 0.28),
      percentage: 28,
      note: `Full multi-course ${cuisineDiet} buffet with live specialty counters for ~${guests} guests (~${currencySymbol}${Math.round((numericBudget * 0.28) / guests)}/guest)`
    },
    {
      category: 'Decor, Florals & Lighting',
      amount: Math.round(numericBudget * 0.14),
      percentage: 14,
      note: `Themed entrance arch, stage backdrop, fairy light canopies and fresh seasonal floral arrangements`
    },
    {
      category: 'Photography & Videography',
      amount: Math.round(numericBudget * 0.10),
      percentage: 10,
      note: `2 Candid photographers + 1 traditional cinematic videographer + teaser reel within 48h`
    },
    {
      category: 'Entertainment & Music',
      amount: Math.round(numericBudget * 0.06),
      percentage: 6,
      note: `Professional live DJ/Emcee, sound console, wireless mics, and ambient uplighting`
    },
    {
      category: 'Attire, Hair & Makeup',
      amount: Math.round(numericBudget * 0.04),
      percentage: 4,
      note: `Stylist, professional makeup artist, and coordinating celebratory wardrobe`
    },
    {
      category: 'Invitations & Digital Stationery',
      amount: Math.round(numericBudget * 0.02),
      percentage: 2,
      note: `Animated WhatsApp digital invites, personalized RSVP portal, and printed welcome board`
    },
    {
      category: 'Guest Transport & Logistics',
      amount: Math.round(numericBudget * 0.02),
      percentage: 2,
      note: `Designated concierge, airport/station transfer support, and valet parking coordination`
    },
    {
      category: 'Emergency Contingency (10%)',
      amount: Math.round(numericBudget * 0.10),
      percentage: 10,
      note: `Vital 10% reserve for last-minute guest additions, overtime charges, or weather adaptions`
    }
  ];

  const budgetResult = validateAndNormalizeBudget(rawCategories, numericBudget, currency, currencySymbol);
  const timeline = generateAdaptiveTimeline(daysRemaining, eventType);
  const vendorChecklist = getMockVendors(numericBudget, currencySymbol, daysRemaining, cuisineDiet);
  const personalizedIdeas = getMockPersonalizedIdeas(eventType, cuisineDiet, isJaipur, isMumbai, specialRequests);
  const runSheet = getMockRunSheet();
  const backupPlan = getMockBackupPlan();

  return {
    overview: {
      summary: `A magnificent, culturally rich ${eventType} celebration in ${city} for ${guests} guests across ${ageGroup}. Balanced with exquisite ${venueType} aesthetics honoring ${traditions}, bespoke ${cuisineDiet} catering, and rigorous financial optimization adhering strictly to your ${currencySymbol}${numericBudget.toLocaleString()} budget.`,
      suggestedTheme: themeTitle,
      oneLineVibe: `Exquisite ${city} hospitality uniting joyous family traditions with contemporary elegance.`,
      colorPalette: palette,
      keyHighlights: [
        `Curated multi-course ${cuisineDiet} culinary experience with live counter stations`,
        `Thematic immersion with ${themePreference || 'celebration'} decor and bespoke lighting`,
        `Strict adherence to budget with guaranteed 10% safety contingency reserve`,
        `Dedicated emergency contingency and vendor negotiation protocols`
      ]
    },
    budget: {
      totalBudget: budgetResult.totalBudget,
      currency: budgetResult.currency,
      currencySymbol: budgetResult.currencySymbol,
      categories: budgetResult.categories,
      moneySavingTips: [
        `Book your ${venueType} during weekday/Sunday afternoon slots or negotiate complimentary basic sound & AC generator inclusions to save up to 15%.`,
        `Choose seasonal, locally grown regional florals (marigold, tuberose, jasmine) over imported blooms for a 35% reduction in decor expenditures.`,
        `Opt for customized digital invitations and interactive RSVP microsite rather than heavy printed boxed cards to save significant print & courier costs.`
      ]
    },
    timeline,
    vendorChecklist,
    personalizedIdeas,
    runSheet,
    backupPlan
  };
}
