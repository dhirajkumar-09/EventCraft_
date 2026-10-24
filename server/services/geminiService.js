/**
 * Gemini Service for EventCraft AI
 * Interacts with Google GenAI models using structured JSON schemas.
 * Includes timeout protection, schema enforcement, retry across candidate models, and smart fallback.
 */

import { GoogleGenAI } from '@google/genai';
import { GEMINI_CONFIG } from '../config/constants.js';
import {
  SYSTEM_PROMPT,
  buildMasterPlanPrompt,
  buildRegenerateSectionPrompt,
  buildChatPlannerPrompt
} from '../prompts/eventPlanPrompts.js';
import { eventPlanJsonSchema } from '../schemas/eventPlanSchema.js';
import { validateAndNormalizeBudget } from '../utils/budgetValidator.js';
import { generateMockEventPlan } from './mockPlanService.js';
import { handleOfflineChat } from './offlineChatService.js';

/**
 * Wraps a promise with a timeout rejection
 * @template T
 * @param {Promise<T>} promise - Target async operation
 * @param {number} [ms=45000] - Timeout in milliseconds
 * @returns {Promise<T>}
 */
function withTimeout(promise, ms = GEMINI_CONFIG.TIMEOUTS.PLAN_GENERATION_MS) {
  let timer;
  const timeoutPromise = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(`API call timed out after ${ms}ms`)), ms);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timer));
}

/**
 * Strips markdown code fences and parses JSON safely
 * @param {string} text - Raw model output text
 * @returns {Object} Parsed JSON object
 */
export function extractAndParseJson(text) {
  if (typeof text !== 'string') {
    throw new Error('Input to extractAndParseJson must be a string');
  }

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
 * @param {string} [userApiKey] - Optional runtime user API key
 * @returns {GoogleGenAI|null} Initialized client or null
 */
function getClient(userApiKey) {
  const apiKey = userApiKey || process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

/**
 * Checks whether a valid Gemini API key is configured
 * @param {string} [userApiKey] - Optional runtime user API key
 * @returns {boolean} True if API key is present and non-empty
 */
export function isGeminiConfigured(userApiKey) {
  const apiKey = userApiKey || process.env.GEMINI_API_KEY;
  return Boolean(apiKey && apiKey.trim() !== '' && apiKey !== 'YOUR_GEMINI_API_KEY_HERE');
}

/**
 * Normalizes the budget of a parsed event plan
 * @param {Object} plan - Parsed plan object
 * @param {Object} input - Input parameters with budget amounts
 */
function normalizePlanBudget(plan, input) {
  if (plan?.budget?.categories && Array.isArray(plan.budget.categories)) {
    const normalized = validateAndNormalizeBudget(
      plan.budget.categories,
      input.totalBudget,
      input.currency,
      input.currencySymbol
    );
    plan.budget.categories = normalized.categories;
    plan.budget.totalBudget = normalized.totalBudget;
    plan.budget.currency = normalized.currency;
    plan.budget.currencySymbol = normalized.currencySymbol;
  }
}

/**
 * Generates an end-to-end structured event plan
 * @param {Object} input - Validated celebration parameters
 * @returns {Promise<Object>} Full structured event plan
 */
export async function generateEventPlan(input) {
  const client = getClient(input.apiKey);

  if (!client) {
    console.info('[EventCraft AI] No Gemini API key provided; generating with intelligent planner engine.');
    return generateMockEventPlan(input);
  }

  const prompt = buildMasterPlanPrompt(input);
  let lastError = null;

  for (const modelName of GEMINI_CONFIG.CANDIDATE_MODELS) {
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
            temperature: GEMINI_CONFIG.TEMPERATURE
          }
        }),
        GEMINI_CONFIG.TIMEOUTS.PLAN_GENERATION_MS
      );

      const parsedPlan = extractAndParseJson(response.text);
      normalizePlanBudget(parsedPlan, input);

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
 * Regenerates an isolated section of an existing event plan
 * @param {string} sectionKey - Section identifier (e.g., 'budget', 'timeline')
 * @param {Object} currentPlan - Existing event plan
 * @param {Object} input - Validated celebration parameters
 * @returns {Promise<Object>} Updated section data
 */
export async function regenerateSection(sectionKey, currentPlan, input) {
  const client = getClient(input?.apiKey);

  if (!client) {
    console.info(`[EventCraft AI] Regenerating section '${sectionKey}' using intelligent planner engine.`);
    const freshPlan = generateMockEventPlan(input);
    return freshPlan[sectionKey] || currentPlan[sectionKey];
  }

  const prompt = buildRegenerateSectionPrompt(sectionKey, currentPlan, input);
  const sectionSchema = {
    type: 'object',
    properties: {
      [sectionKey]: eventPlanJsonSchema.properties[sectionKey]
    },
    required: [sectionKey]
  };

  for (const modelName of GEMINI_CONFIG.CANDIDATE_MODELS) {
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
        GEMINI_CONFIG.TIMEOUTS.SECTION_REGEN_MS
      );

      const parsed = extractAndParseJson(response.text);
      if (parsed?.[sectionKey]) {
        if (sectionKey === 'budget' && parsed.budget?.categories) {
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
 * Handles conversational follow-up questions and real-time plan modifications
 * @param {string} userMessage - User's instruction or request
 * @param {Object} currentPlan - Existing event plan
 * @param {Array<{role: string, text: string}>} [chatHistory=[]] - Previous conversation
 * @param {Object} [input={}] - Celebration parameters
 * @returns {Promise<{replyMessage: string, updatedPlan: Object}>}
 */
export async function chatWithPlanner(userMessage, currentPlan, chatHistory = [], input = {}) {
  const client = getClient(input?.apiKey);

  if (!client) {
    return handleOfflineChat(userMessage, currentPlan, input);
  }

  const chatSchema = {
    type: 'object',
    properties: {
      replyMessage: {
        type: 'string',
        description: 'Warm, professional, reassuring answer explaining changes made or offering actionable advice.'
      },
      updatedPlan: eventPlanJsonSchema
    },
    required: ['replyMessage', 'updatedPlan']
  };

  const prompt = buildChatPlannerPrompt(userMessage, currentPlan, chatHistory, input);

  for (const modelName of GEMINI_CONFIG.CANDIDATE_MODELS) {
    try {
      const response = await withTimeout(
        client.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            systemInstruction: SYSTEM_PROMPT,
            responseMimeType: 'application/json',
            responseSchema: chatSchema,
            temperature: GEMINI_CONFIG.TEMPERATURE
          }
        }),
        GEMINI_CONFIG.TIMEOUTS.CHAT_RESPONSE_MS
      );

      const parsed = extractAndParseJson(response.text);
      if (parsed.updatedPlan?.budget?.categories) {
        normalizePlanBudget(parsed.updatedPlan, input);
      }

      return parsed;
    } catch (err) {
      console.warn(`[EventCraft AI] Chat failed on ${modelName}:`, err.message);
    }
  }

  return handleOfflineChat(userMessage, currentPlan, input);
}
