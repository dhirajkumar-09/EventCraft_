/**
 * System and User Prompts for Google Gemini Event Planner
 */

export const SYSTEM_PROMPT = `You are an expert event planner with 15 years of experience in Indian and global celebrations. Give realistic, locally relevant pricing for the given city, respect the budget strictly, be culturally sensitive, and return only valid JSON matching the schema.`;

/**
 * Builds prompt for full event plan generation
 * @param {Object} input - Validated celebration parameters
 * @returns {string} Formatted prompt string
 */
export function buildMasterPlanPrompt(input) {
  return `
Create an extraordinary, end-to-end celebration and event plan for:
- Event Type: ${input.eventType}
- Target Date: ${input.eventDate || 'Upcoming in 60 days'}
- City: ${input.city}
- Venue Type: ${input.venueType}
- Guest Count: ${input.guestCount}
- Total Budget: ${input.currencySymbol} ${Number(input.totalBudget).toLocaleString()} (${input.currency})
- Cuisine & Dietary: ${input.cuisineDiet}
- Theme / Style Preference: ${input.themePreference || 'Sophisticated and joyful'}
- Cultural / Religious Traditions: ${input.traditions || 'Contemporary celebration with heritage roots'}
- Age Group: ${input.ageGroup || 'Multi-generational'}
- Special Requests: ${input.specialRequests || 'None'}

STRICT REQUIREMENTS:
1. The budget category amounts MUST strictly sum to ${input.totalBudget}.
2. Ensure realistic local pricing for ${input.city}.
3. Include standard categories: venue, catering, decor, photography, entertainment, attire, invitations, transport, and 10% contingency.
4. Adapt the timeline milestones specifically to the days remaining until ${input.eventDate || 'the event'}.
5. Give exactly 3 unique, unforgettable 'wow moments' and top 3 realistic celebration risks with mitigations.
6. Provide an hour-by-hour run sheet with at least 6 hourly time slots.
7. Provide valid JSON strictly conforming to the requested schema.
`;
}

/**
 * Builds prompt for regenerating an isolated section
 * @param {string} sectionKey - Section identifier
 * @param {Object} currentPlan - Existing plan state
 * @param {Object} input - Event parameters
 * @returns {string} Formatted prompt string
 */
export function buildRegenerateSectionPrompt(sectionKey, currentPlan, input) {
  return `
You are updating ONLY the '${sectionKey}' section of an existing event plan for a ${input.eventType} in ${input.city}.
Total budget: ${input.currencySymbol} ${Number(input.totalBudget).toLocaleString()}.
Guest count: ${input.guestCount}.
Current overview theme: ${currentPlan?.overview?.suggestedTheme || 'Celebration'}.

Provide a fresh, creative, and improved version of ONLY the '${sectionKey}' section.
Conform strictly to the JSON schema definition for '${sectionKey}'.
Return JSON with key "${sectionKey}".
`;
}

/**
 * Builds prompt for follow-up conversational edits
 * @param {string} userMessage - Client request
 * @param {Object} currentPlan - Existing plan state
 * @param {Array} chatHistory - Previous message history
 * @param {Object} input - Event parameters
 * @returns {string} Formatted prompt string
 */
export function buildChatPlannerPrompt(userMessage, currentPlan, chatHistory = [], input = {}) {
  const formattedHistory = chatHistory
    .map((h) => `${h.role === 'user' ? 'Client' : 'Planner'}: ${h.text}`)
    .slice(-6)
    .join('\n');

  return `
The client is asking for a follow-up modification or advice for their event plan.
Current Plan Details:
- Event: ${input.eventType || 'Celebration'} in ${input.city || 'City'}
- Budget: ${input.currencySymbol || '₹'} ${Number(input.totalBudget || currentPlan?.budget?.totalBudget || 500000).toLocaleString()}
- User Message: "${userMessage}"

Chat History:
${formattedHistory}

Instructions:
1. Provide an expert, encouraging reply in 'replyMessage' explaining clearly how you adjusted the plan or answering their question.
2. In 'updatedPlan', return the complete, updated event plan with the user's modifications applied (e.g., if they asked to reduce budget, make it kid-friendly, add extra decor, etc.).
3. Ensure budget categories still sum strictly to the total budget and maintain the 10% contingency.
`;
}
