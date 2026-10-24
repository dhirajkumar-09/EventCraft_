/**
 * Server Configuration Constants for EventCraft AI
 */

export const VALID_SECTIONS = Object.freeze([
  'overview',
  'budget',
  'timeline',
  'vendorChecklist',
  'personalizedIdeas',
  'runSheet',
  'backupPlan'
]);

export const BUDGET_CONSTRAINTS = Object.freeze({
  CONTINGENCY_PERCENT: 0.1,
  MIN_BUDGET: 1000,
  MAX_BUDGET: 1000000000,
  MIN_GUESTS: 5,
  MAX_GUESTS: 50000
});

export const GEMINI_CONFIG = Object.freeze({
  CANDIDATE_MODELS: Object.freeze(['gemini-2.5-flash', 'gemini-flash-lite-latest']),
  TIMEOUTS: Object.freeze({
    PLAN_GENERATION_MS: 45000,
    SECTION_REGEN_MS: 25000,
    CHAT_RESPONSE_MS: 30000
  }),
  TEMPERATURE: 0.7
});

export const STANDARD_BUDGET_CATEGORIES = Object.freeze([
  { name: 'Venue & Spaces', defaultShare: 0.25 },
  { name: 'Catering & Dining', defaultShare: 0.3 },
  { name: 'Decor & Florals', defaultShare: 0.12 },
  { name: 'Photography & Cinematography', defaultShare: 0.08 },
  { name: 'Entertainment & Music', defaultShare: 0.06 },
  { name: 'Attire & Styling', defaultShare: 0.04 },
  { name: 'Invitations & Stationary', defaultShare: 0.02 },
  { name: 'Transport & Logistics', defaultShare: 0.03 },
  { name: 'Contingency Reserve (10%)', defaultShare: 0.1 }
]);
