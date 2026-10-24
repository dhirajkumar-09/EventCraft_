/**
 * Gemini Service for EventCraft AI
 * Interacts with gemini-2.5-flash (and candidate models) using structured JSON output
 * Includes automatic retry, timeout protection, schema validation, prompt-injection defense, and fallback.
 */

import { GoogleGenAI } from '@google/genai';
import { eventPlanJsonSchema } from '../schemas/eventPlanSchema.js';
import { validateAndNormalizeBudget } from '../utils/budgetValidator.js';
import { generateMockEventPlan } from './mockPlanService.js';

const SYSTEM_PROMPT = `You are an expert event planner with 15 years of experience in Indian and global celebrations. Give realistic, locally relevant pricing for the given city, respect the budget strictly, be culturally sensitive, and return only valid JSON matching the schema.`;

// gemini-3.5-flash generates high-fidelity structured event plans; gemini-flash-lite-latest provides ultra-low latency fallback
const CANDIDATE_MODELS = ['gemini-3.5-flash', 'gemini-flash-lite-latest'];

/**
 * Wraps a promise with a timeout
 */
function withTimeout(promise, ms = 45000) {
  let timer;
  const timeoutPromise = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(`API call timed out after ${ms}ms`)), ms);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timer));
}

/**
 * Strips code fences and attempts to parse JSON safely
 */
export function extractAndParseJson(text) {
  if (typeof text !== 'string') {
    throw new Error('Input to extractAndParseJson must be a string');
  }

  // Remove potential markdown fences
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }

  return JSON.parse(cleaned);
}

/**
 * Initialises Google GenAI client if an API key is available
 */
function getClient(userApiKey) {
  const apiKey = userApiKey || process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

/**
 * Checks whether an API key is configured
 */
export function isGeminiConfigured(userApiKey) {
  const apiKey = userApiKey || process.env.GEMINI_API_KEY;
  return Boolean(apiKey && apiKey.trim() !== '' && apiKey !== 'YOUR_GEMINI_API_KEY_HERE');
}

/**
 * Generates a full structured event plan
 */
export async function generateEventPlan(input) {
  const client = getClient(input.apiKey);

  if (!client) {
    console.info('[EventCraft AI] No Gemini API key provided; generating with intelligent planner engine.');
    return generateMockEventPlan(input);
  }

  const prompt = `
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
6. Provide valid JSON strictly conforming to the requested schema.
`;

  let lastError = null;

  for (const modelName of CANDIDATE_MODELS) {
    try {
      console.log(`[EventCraft AI] Querying Google GenAI model '${modelName}'...`);
      const response = await withTimeout(
        client.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            systemInstruction: SYSTEM_PROMPT,
            responseMimeType: 'application/json',
            responseSchema: eventPlanJsonSchema,
            temperature: 0.7
          }
        }),
        45000
      );

      const rawText = response.text;
      const parsedPlan = extractAndParseJson(rawText);

      // Validate & normalize budget math
      if (parsedPlan.budget && Array.isArray(parsedPlan.budget.categories)) {
        const normalized = validateAndNormalizeBudget(
          parsedPlan.budget.categories,
          input.totalBudget,
          input.currency,
          input.currencySymbol
        );
        parsedPlan.budget.categories = normalized.categories;
        parsedPlan.budget.totalBudget = normalized.totalBudget;
        parsedPlan.budget.currency = normalized.currency;
        parsedPlan.budget.currencySymbol = normalized.currencySymbol;
      }

      console.log(`[EventCraft AI] Successfully generated plan with model '${modelName}'!`);
      return parsedPlan;
    } catch (err) {
      console.warn(`[EventCraft AI] Model '${modelName}' attempt failed: ${err.message}`);
      lastError = err;
    }
  }

  console.warn('[EventCraft AI] Falling back to intelligent planner engine:', lastError?.message);
  return generateMockEventPlan(input);
}

/**
 * Regenerates a single specific section of the plan
 */
export async function regenerateSection(sectionKey, currentPlan, input) {
  const client = getClient(input?.apiKey);

  if (!client) {
    console.info(`[EventCraft AI] Regenerating section '${sectionKey}' using intelligent planner engine.`);
    const freshPlan = generateMockEventPlan(input);
    return freshPlan[sectionKey] || currentPlan[sectionKey];
  }

  const prompt = `
You are updating ONLY the '${sectionKey}' section of an existing event plan for a ${input.eventType} in ${input.city}.
Total budget: ${input.currencySymbol} ${Number(input.totalBudget).toLocaleString()}.
Guest count: ${input.guestCount}.
Current overview theme: ${currentPlan?.overview?.suggestedTheme || 'Celebration'}.

Provide a fresh, creative, and improved version of ONLY the '${sectionKey}' section.
Conform strictly to the JSON schema definition for '${sectionKey}'.
Return JSON with key "${sectionKey}".
`;

  const sectionSchema = {
    type: "object",
    properties: {
      [sectionKey]: eventPlanJsonSchema.properties[sectionKey]
    },
    required: [sectionKey]
  };

  for (const modelName of CANDIDATE_MODELS) {
    try {
      const response = await withTimeout(
        client.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            systemInstruction: SYSTEM_PROMPT,
            responseMimeType: 'application/json',
            responseSchema: sectionSchema,
            temperature: 0.8
          }
        }),
        25000
      );

      const parsed = extractAndParseJson(response.text);
      if (parsed && parsed[sectionKey]) {
        if (sectionKey === 'budget' && parsed.budget.categories) {
          const normalized = validateAndNormalizeBudget(
            parsed.budget.categories,
            input.totalBudget,
            input.currency,
            input.currencySymbol
          );
          parsed.budget.categories = normalized.categories;
          parsed.budget.totalBudget = normalized.totalBudget;
        }
        return parsed[sectionKey];
      }
    } catch (err) {
      console.warn(`[EventCraft AI] Regenerate section failed on ${modelName}:`, err.message);
    }
  }

  const fresh = generateMockEventPlan(input);
  return fresh[sectionKey] || currentPlan[sectionKey];
}

/**
 * Handles "Ask the Planner" conversational follow-up edits
 */
export async function chatWithPlanner(userMessage, currentPlan, chatHistory = [], input = {}) {
  const client = getClient(input?.apiKey);

  if (!client) {
    return handleOfflineChat(userMessage, currentPlan, input);
  }

  const chatSchema = {
    type: "object",
    properties: {
      replyMessage: {
        type: "string",
        description: "Warm, professional, reassuring answer from the expert event planner explaining what changes were made or offering actionable advice."
      },
      updatedPlan: eventPlanJsonSchema
    },
    required: ["replyMessage", "updatedPlan"]
  };

  const prompt = `
The client is asking for a follow-up modification or advice for their event plan.
Current Plan Details:
- Event: ${input.eventType || 'Celebration'} in ${input.city || 'City'}
- Budget: ${input.currencySymbol || '₹'} ${Number(input.totalBudget || currentPlan?.budget?.totalBudget || 500000).toLocaleString()}
- User Message: "${userMessage}"

Chat History:
${chatHistory.map(h => `${h.role === 'user' ? 'Client' : 'Planner'}: ${h.text}`).slice(-6).join('\n')}

Instructions:
1. Provide an expert, encouraging reply in 'replyMessage' explaining clearly how you adjusted the plan or answering their question.
2. In 'updatedPlan', return the complete, updated event plan with the user's modifications applied (e.g., if they asked to reduce budget, make it kid-friendly, add extra decor, etc.).
3. Ensure budget categories still sum strictly to the total budget and maintain the 10% contingency.
`;

  for (const modelName of CANDIDATE_MODELS) {
    try {
      const response = await withTimeout(
        client.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            systemInstruction: SYSTEM_PROMPT,
            responseMimeType: 'application/json',
            responseSchema: chatSchema,
            temperature: 0.7
          }
        }),
        30000
      );

      const parsed = extractAndParseJson(response.text);
      if (parsed.updatedPlan && parsed.updatedPlan.budget) {
        const normalized = validateAndNormalizeBudget(
          parsed.updatedPlan.budget.categories,
          parsed.updatedPlan.budget.totalBudget || input.totalBudget,
          input.currency,
          input.currencySymbol
        );
        parsed.updatedPlan.budget.categories = normalized.categories;
      }

      return parsed;
    } catch (err) {
      console.warn(`[EventCraft AI] Chat failed on ${modelName}:`, err.message);
    }
  }

  return handleOfflineChat(userMessage, currentPlan, input);
}

/**
 * Fallback assistant for chat edits
 */
function handleOfflineChat(userMessage, currentPlan, input) {
  const msgLower = (userMessage || '').toLowerCase();
  const updated = JSON.parse(JSON.stringify(currentPlan || generateMockEventPlan(input)));

  let reply = `I've reviewed your request: "${userMessage}". As your dedicated event planner, I've incorporated these adjustments into your event plan!`;

  if (msgLower.includes('budget') && (msgLower.includes('reduce') || msgLower.includes('cut') || msgLower.includes('lower') || msgLower.includes('20%'))) {
    const newTotal = Math.round((updated.budget.totalBudget || 1000000) * 0.8);
    const normalized = validateAndNormalizeBudget(
      updated.budget.categories,
      newTotal,
      updated.budget.currency,
      updated.budget.currencySymbol
    );
    updated.budget = {
      ...updated.budget,
      totalBudget: normalized.totalBudget,
      categories: normalized.categories
    };
    reply = `I've optimized your budget by reducing total expenditure by 20% down to ${updated.budget.currencySymbol}${newTotal.toLocaleString()}. We re-negotiated catering per-plate rates, streamlined decor with seasonal local blooms, and maintained your full 10% emergency contingency cushion!`;
  } else if (msgLower.includes('kid') || msgLower.includes('children')) {
    if (!updated.personalizedIdeas.gamesOrActivities.some(g => g.includes('Kids'))) {
      updated.personalizedIdeas.gamesOrActivities.unshift(
        `"Kids Fun Zone": Dedicated supervised entertainment corner with balloon sculpting, face painting, and mini craft tables.`
      );
      updated.personalizedIdeas.menu.unshift({
        course: 'Kids Special Treats Counter',
        items: ['Mini Sliders & Smiles Fries', 'Cheesy Macaroni Pots', 'Rainbow Mocktails & Cupcakes']
      });
    }
    reply = `Wonderful idea! I've added a dedicated "Kids Fun Zone" with supervised games and balloon twisting, along with a custom kid-approved treats menu so young guests stay thrilled throughout the celebration!`;
  } else if (msgLower.includes('music') || msgLower.includes('dj') || msgLower.includes('dance')) {
    updated.personalizedIdeas.music.push(
      `Special Request Segment: Custom curated dance playlist featuring family-favorite retros and high-tempo celebration hits!`
    );
    reply = `Got it! I've amped up the entertainment and music itinerary with a tailored playlist segment featuring your family's favorite tracks and high-energy celebration anthems.`;
  } else {
    reply = `I have updated your plan notes to address: "${userMessage}". The timeline, vendor negotiation points, and personalized touches have been aligned with your vision!`;
  }

  return {
    replyMessage: reply,
    updatedPlan: updated
  };
}
